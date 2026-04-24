using System.Text.Json;
using BCrypt.Net;
using ElPortero.Api.Data;
using ElPortero.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ElPortero.Api;

public static class Seed
{
  public static async Task EnsureAdminUserAsync(AppDbContext db, IConfiguration config)
  {
    if (await db.StaffUsers.AnyAsync()) return;

    var username = config["Admin:Username"] ?? "admin";
    var password = config["Admin:Password"] ?? "admin";

    var user = new StaffUser
    {
      Username = username,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
      Role = "admin",
      CreatedAtUtc = DateTimeOffset.UtcNow,
    };

    db.StaffUsers.Add(user);
    await db.SaveChangesAsync();
  }

  public static async Task EnsurePublicEventsFromSeedFileAsync(AppDbContext db, CancellationToken ct = default)
  {
    if (await db.PublicEvents.AnyAsync(ct)) return;

    var path = Path.Combine(AppContext.BaseDirectory, "SeedData", "publicEvents.seed.json");
    if (!File.Exists(path)) return;

    var json = await File.ReadAllTextAsync(path, ct);
    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var rows = JsonSerializer.Deserialize<List<PublicEventSeedFileRow>>(json, options);
    if (rows is null) return;

    var now = DateTimeOffset.UtcNow;
    foreach (var r in rows)
    {
      if (string.IsNullOrWhiteSpace(r.Id) || r.WeekdayDate is null || r.TimeDetail is null
          || r.Title is null || r.Excerpt is null || r.ImageAlt is null) continue;
      var id = r.Id.Trim();
      if (id.Length is < 1 or > 64) continue;

      db.PublicEvents.Add(new PublicEvent
      {
        Id = id,
        SortDate = (r.SortDate ?? "").Trim(),
        FullyBooked = r.FullyBooked,
        WeekdayDateEn = (r.WeekdayDate.En ?? "").Trim(),
        WeekdayDateEs = (r.WeekdayDate.Es ?? "").Trim(),
        WeekdayDateSv = (r.WeekdayDate.Sv ?? "").Trim(),
        TimeDetailEn = (r.TimeDetail.En ?? "").Trim(),
        TimeDetailEs = (r.TimeDetail.Es ?? "").Trim(),
        TimeDetailSv = (r.TimeDetail.Sv ?? "").Trim(),
        TitleEn = (r.Title.En ?? "").Trim(),
        TitleEs = (r.Title.Es ?? "").Trim(),
        TitleSv = (r.Title.Sv ?? "").Trim(),
        ExcerptEn = (r.Excerpt.En ?? "").Trim(),
        ExcerptEs = (r.Excerpt.Es ?? "").Trim(),
        ExcerptSv = (r.Excerpt.Sv ?? "").Trim(),
        ImageSrc = (r.ImageSrc ?? "").Trim(),
        ImageAltEn = (r.ImageAlt.En ?? "").Trim(),
        ImageAltEs = (r.ImageAlt.Es ?? "").Trim(),
        ImageAltSv = (r.ImageAlt.Sv ?? "").Trim(),
        CreatedAtUtc = now,
        UpdatedAtUtc = now,
      });
    }

    if (db.ChangeTracker.Entries<PublicEvent>().Any())
    {
      await db.SaveChangesAsync(ct);
    }
  }

  private sealed class PublicEventSeedFileRow
  {
    public string Id { get; set; } = "";
    public string SortDate { get; set; } = "";
    public bool FullyBooked { get; set; }
    public PublicEventSeedTrio? WeekdayDate { get; set; }
    public PublicEventSeedTrio? TimeDetail { get; set; }
    public PublicEventSeedTrio? Title { get; set; }
    public PublicEventSeedTrio? Excerpt { get; set; }
    public string ImageSrc { get; set; } = "";
    public PublicEventSeedTrio? ImageAlt { get; set; }
  }

  private sealed class PublicEventSeedTrio
  {
    public string En { get; set; } = "";
    public string Es { get; set; } = "";
    public string Sv { get; set; } = "";
  }
}

