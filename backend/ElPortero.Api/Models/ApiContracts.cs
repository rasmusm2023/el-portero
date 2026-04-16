namespace ElPortero.Api.Models;

public sealed record LoginRequest(string Username, string Password);
public sealed record AuthResponse(string Username, string Token);

public sealed record WeeklyMenuItemDto(int Position, string Name, string Description, string Price, string DietaryTags);

public sealed record WeeklyMenuDto(
  string WeekStartDate,
  string EffectiveWeekStartDate,
  string Title,
  bool IsPublished,
  DateTimeOffset UpdatedAtUtc,
  IReadOnlyList<WeeklyMenuItemDto> Items)
{
  public static WeeklyMenuDto From(WeeklyMenu menu)
  {
    return new WeeklyMenuDto(
      WeekStartDate: menu.WeekStartDate.ToString("yyyy-MM-dd"),
      EffectiveWeekStartDate: menu.EffectiveWeekStartDate.ToString("yyyy-MM-dd"),
      Title: menu.Title,
      IsPublished: menu.IsPublished,
      UpdatedAtUtc: menu.UpdatedAtUtc,
      Items: menu.Items
        .OrderBy(i => i.Position)
        .Select(i => new WeeklyMenuItemDto(i.Position, i.Name, i.Description, i.Price, i.DietaryTags))
        .ToList());
  }
}

public sealed record UpsertWeeklyMenuItemRequest(int? Position, string? Name, string? Description, string? Price, string? DietaryTags);

public sealed record UpsertWeeklyMenuRequest(string? Title, List<UpsertWeeklyMenuItemRequest>? Items);

public sealed record UpsertLunchMenuRequest(
  string EffectiveWeekStartDate,
  string? Title,
  List<UpsertWeeklyMenuItemRequest>? Items);

public sealed record PublishWeeklyMenuRequest(bool IsPublished);

public sealed record PresignMediaPutRequest(string FileName, string ContentType, long SizeBytes);

public sealed record PresignMediaPutResponse(
  string ObjectKey,
  string UploadUrl,
  IReadOnlyDictionary<string, string> RequiredHeaders,
  string? PublicUrl,
  DateTimeOffset ExpiresAtUtc);

public sealed record CompleteMediaUploadRequest(
  string ObjectKey,
  string FileName,
  string ContentType,
  long SizeBytes);

public sealed record MediaAssetDto(
  int Id,
  string ObjectKey,
  string OriginalFileName,
  string ContentType,
  long SizeBytes,
  string? PublicUrl,
  string CreatedByUsername,
  DateTimeOffset CreatedAtUtc);

