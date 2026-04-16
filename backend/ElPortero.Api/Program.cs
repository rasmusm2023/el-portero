using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using ElPortero.Api;
using ElPortero.Api.Data;
using ElPortero.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var env = builder.Environment;

builder.Services.AddDbContext<AppDbContext>(options =>
{
  var cs = builder.Configuration.GetConnectionString("Sqlite") ?? "Data Source=elportero.db";
  options.UseSqlite(cs);
});

builder.Services.Configure<AuthOptions>(builder.Configuration.GetSection("Auth"));
builder.Services.Configure<R2Options>(builder.Configuration.GetSection("R2"));
builder.Services.AddSingleton<R2StorageService>();

builder.Services.AddCors(options =>
{
  options.AddPolicy("frontend", p =>
  {
    // Development: allow any localhost / 127.0.0.1 origin so Next on 3000, 3001, etc. always works.
    if (env.IsDevelopment())
    {
      p.SetIsOriginAllowed(static origin =>
      {
        if (string.IsNullOrEmpty(origin)) return false;
        if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;
        if (uri.Scheme is not ("http" or "https")) return false;
        return uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
               || uri.Host == "127.0.0.1";
      })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
      return;
    }

    var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();
    if (origins.Length == 0)
    {
      origins = new[]
      {
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      };
    }

    p.WithOrigins(origins)
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
  });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = false,
      ValidateAudience = false,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = AuthToken.CreateSigningKey(builder.Configuration),
      ClockSkew = TimeSpan.FromSeconds(15),
    };
    options.Events = new JwtBearerEvents
    {
      OnMessageReceived = ctx =>
      {
        // Admin UI uses HttpOnly cookie
        ctx.Token = ctx.Request.Cookies[AuthToken.CookieName];
        return Task.CompletedTask;
      }
    };
  });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("frontend");

// Ensure DB exists (simple dev-friendly setup; production should use migrations)
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  await db.Database.EnsureCreatedAsync();
  try
  {
    await SchemaPatch.EnsureWeeklyMenuEffectiveWeekColumnAsync(db);
    await SchemaPatch.EnsureWeeklyMenuIndexesAsync(db);
  }
  catch
  {
    // If patching fails (unexpected DB state), continue booting — endpoints will surface errors if needed.
  }
  await Seed.EnsureAdminUserAsync(db, builder.Configuration);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { ok = true }));

// ---- Auth ----
app.MapPost("/api/auth/login", async Task<Results<Ok<AuthResponse>, UnauthorizedHttpResult, BadRequest<string>>> (
  LoginRequest req,
  AppDbContext db,
  HttpContext http,
  IConfiguration config) =>
{
  if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
  {
    return TypedResults.BadRequest("Username and password are required.");
  }

  var user = await db.StaffUsers.SingleOrDefaultAsync(u => u.Username == req.Username);
  if (user is null) return TypedResults.Unauthorized();

  if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
  {
    return TypedResults.Unauthorized();
  }

  var token = AuthToken.CreateJwt(config, user);

  http.Response.Cookies.Append(
    AuthToken.CookieName,
    token,
    new CookieOptions
    {
      HttpOnly = true,
      Secure = false, // set true behind HTTPS
      SameSite = SameSiteMode.Lax,
      Expires = DateTimeOffset.UtcNow.AddDays(7),
      Path = "/",
    });

  return TypedResults.Ok(new AuthResponse(user.Username, token));
})
.WithTags("Auth");

app.MapPost("/api/auth/logout", (HttpContext http) =>
{
  http.Response.Cookies.Delete(AuthToken.CookieName, new CookieOptions { Path = "/" });
  return Results.Ok(new { ok = true });
})
.WithTags("Auth");

// ---- Weekly menu (public) ----
app.MapGet("/api/weekly-menu/current", async (AppDbContext db) =>
{
  var menu = await LunchMenuService.GetLiveMenuAsync(db, DateTimeOffset.UtcNow);
  return menu is null ? Results.NotFound() : Results.Ok(WeeklyMenuDto.From(menu));
})
.WithTags("WeeklyMenu");

// ---- Admin ----
var admin = app.MapGroup("/api/admin")
  .RequireAuthorization();

// ---- Lunch menu (admin) ----
admin.MapGet("/lunch-menu", async (AppDbContext db) =>
{
  var menu = await LunchMenuService.GetOrCreateSingletonAsync(db);
  await db.Entry(menu).Collection(m => m.Items).Query().OrderBy(i => i.Position).LoadAsync();
  return Results.Ok(WeeklyMenuDto.From(menu));
})
.WithTags("AdminLunchMenu");

admin.MapPut("/lunch-menu", async Task<IResult> (UpsertLunchMenuRequest req, AppDbContext db) =>
{
  if (!DateOnly.TryParse(req.EffectiveWeekStartDate, out var effectiveMonday))
  {
    return Results.BadRequest("effectiveWeekStartDate must be YYYY-MM-DD (a Monday).");
  }

  if (!LunchMenuService.IsMondayMadrid(effectiveMonday))
  {
    return Results.BadRequest("effectiveWeekStartDate must be a Monday (Europe/Madrid week start).");
  }

  var items = (req.Items ?? new List<UpsertWeeklyMenuItemRequest>())
    .Take(10)
    .Select((it, idx) => new WeeklyMenuItem
    {
      Position = it.Position is >= 1 and <= 10 ? it.Position.Value : idx + 1,
      Name = (it.Name ?? "").Trim(),
      Description = (it.Description ?? "").Trim(),
      Price = (it.Price ?? "").Trim(),
      DietaryTags = (it.DietaryTags ?? "").Trim(),
    })
    .Where(i => !string.IsNullOrWhiteSpace(i.Name))
    .OrderBy(i => i.Position)
    .Take(5)
    .ToList();

  var menu = await LunchMenuService.GetOrCreateSingletonAsync(db);
  await db.Entry(menu).Collection(m => m.Items).LoadAsync();

  menu.EffectiveWeekStartDate = effectiveMonday;
  menu.WeekStartDate = effectiveMonday; // keep legacy field aligned for older rows/tools
  menu.Title = (req.Title ?? "").Trim();
  menu.UpdatedAtUtc = DateTimeOffset.UtcNow;

  menu.Items.Clear();
  foreach (var it in items)
  {
    menu.Items.Add(it);
  }

  await db.SaveChangesAsync();
  return Results.Ok(WeeklyMenuDto.From(menu));
})
.WithTags("AdminLunchMenu");

admin.MapPost("/lunch-menu/publish", async Task<IResult> (PublishWeeklyMenuRequest req, AppDbContext db) =>
{
  var menu = await LunchMenuService.GetOrCreateSingletonAsync(db);
  menu.IsPublished = req.IsPublished;
  menu.UpdatedAtUtc = DateTimeOffset.UtcNow;
  await db.SaveChangesAsync();
  return Results.Ok(new { ok = true, menu.EffectiveWeekStartDate, menu.IsPublished });
})
.WithTags("AdminLunchMenu");

admin.MapGet("/lunch-menu/status", async (AppDbContext db) =>
{
  var now = DateTimeOffset.UtcNow;
  var currentWeekStart = WeeklyMenuClock.GetWeekStartMadrid(now);

  var singleton = await LunchMenuService.GetOrCreateSingletonAsync(db);
  await db.Entry(singleton).Collection(m => m.Items).Query().OrderBy(i => i.Position).LoadAsync();

  var live = await LunchMenuService.GetLiveMenuAsync(db, now);

  return Results.Ok(new
  {
    nowUtc = now,
    madridWeekStart = currentWeekStart.ToString("yyyy-MM-dd"),
    draft = WeeklyMenuDto.From(singleton),
    live = live is null ? null : WeeklyMenuDto.From(live),
  });
})
.WithTags("AdminLunchMenu");

// ---- Media uploads (R2 / S3-compatible) ----
admin.MapPost("/media/presign-put", async Task<IResult> (
  PresignMediaPutRequest req,
  HttpContext http,
  R2StorageService r2,
  Microsoft.Extensions.Options.IOptions<R2Options> r2Options,
  CancellationToken ct) =>
{
  if (!r2.IsConfigured)
  {
    return Results.Problem(
      detail: "R2 is not configured on the server (missing R2:Endpoint/Bucket/AccessKeyId/SecretAccessKey).",
      statusCode: StatusCodes.Status503ServiceUnavailable);
  }

  if (string.IsNullOrWhiteSpace(req.FileName)) return Results.BadRequest("fileName is required.");
  if (string.IsNullOrWhiteSpace(req.ContentType)) return Results.BadRequest("contentType is required.");
  if (req.SizeBytes <= 0) return Results.BadRequest("sizeBytes must be > 0.");

  var maxBytes = r2Options.Value.MaxUploadBytes <= 0 ? 8L * 1024 * 1024 : r2Options.Value.MaxUploadBytes;
  if (req.SizeBytes > maxBytes) return Results.BadRequest($"File too large (max {maxBytes} bytes).");

  var ctLower = req.ContentType.Trim().ToLowerInvariant();
  if (!(ctLower.StartsWith("image/", StringComparison.Ordinal) || ctLower == "application/pdf"))
  {
    return Results.BadRequest("Only image/* or application/pdf uploads are allowed for now.");
  }

  var username =
    http.User.FindFirstValue(ClaimTypes.Name)
    ?? http.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
    ?? "unknown";

  var objectKey = r2.BuildObjectKey(req.FileName);
  var expiresSeconds = r2Options.Value.PresignExpiresSeconds <= 0 ? 900 : r2Options.Value.PresignExpiresSeconds;
  var expires = TimeSpan.FromSeconds(expiresSeconds);

  var (uploadUrl, headers) = await r2.CreatePresignedPutAsync(objectKey, req.ContentType.Trim(), expires, ct);

  return Results.Ok(new PresignMediaPutResponse(
    ObjectKey: objectKey,
    UploadUrl: uploadUrl,
    RequiredHeaders: headers,
    PublicUrl: r2.BuildPublicUrl(objectKey),
    ExpiresAtUtc: DateTimeOffset.UtcNow.Add(expires)));
})
.WithTags("AdminMedia");

admin.MapPost("/media/complete", async Task<IResult> (
  CompleteMediaUploadRequest req,
  HttpContext http,
  AppDbContext db,
  R2StorageService r2,
  CancellationToken ct) =>
{
  if (!r2.IsConfigured)
  {
    return Results.Problem(
      detail: "R2 is not configured on the server (missing R2:Endpoint/Bucket/AccessKeyId/SecretAccessKey).",
      statusCode: StatusCodes.Status503ServiceUnavailable);
  }

  if (string.IsNullOrWhiteSpace(req.ObjectKey)) return Results.BadRequest("objectKey is required.");
  if (string.IsNullOrWhiteSpace(req.FileName)) return Results.BadRequest("fileName is required.");
  if (string.IsNullOrWhiteSpace(req.ContentType)) return Results.BadRequest("contentType is required.");
  if (req.SizeBytes <= 0) return Results.BadRequest("sizeBytes must be > 0.");

  var username =
    http.User.FindFirstValue(ClaimTypes.Name)
    ?? http.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
    ?? "unknown";

  if (await db.MediaAssets.AnyAsync(a => a.ObjectKey == req.ObjectKey, ct))
  {
    return Results.Conflict("This upload was already recorded.");
  }

  var asset = new MediaAsset
  {
    ObjectKey = req.ObjectKey.Trim(),
    OriginalFileName = Path.GetFileName(req.FileName.Trim()),
    ContentType = req.ContentType.Trim(),
    SizeBytes = req.SizeBytes,
    PublicUrl = r2.BuildPublicUrl(req.ObjectKey.Trim()),
    CreatedByUsername = username,
    CreatedAtUtc = DateTimeOffset.UtcNow,
  };

  db.MediaAssets.Add(asset);
  await db.SaveChangesAsync(ct);

  return Results.Ok(new MediaAssetDto(
    asset.Id,
    asset.ObjectKey,
    asset.OriginalFileName,
    asset.ContentType,
    asset.SizeBytes,
    asset.PublicUrl,
    asset.CreatedByUsername,
    asset.CreatedAtUtc));
})
.WithTags("AdminMedia");

admin.MapGet("/media/recent", async (AppDbContext db) =>
{
  var rows = await db.MediaAssets
    .OrderByDescending(a => a.CreatedAtUtc)
    .Take(25)
    .Select(a => new MediaAssetDto(
      a.Id,
      a.ObjectKey,
      a.OriginalFileName,
      a.ContentType,
      a.SizeBytes,
      a.PublicUrl,
      a.CreatedByUsername,
      a.CreatedAtUtc))
    .ToListAsync();

  return Results.Ok(rows);
})
.WithTags("AdminMedia");

app.Run();

