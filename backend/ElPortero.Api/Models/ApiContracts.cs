using System.Text.Json.Serialization;

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

public sealed record LocaleTrio(
  [property: JsonPropertyName("en")] string En,
  [property: JsonPropertyName("es")] string Es,
  [property: JsonPropertyName("sv")] string Sv);

public sealed record PublicEventDto(
  string Id,
  string SortDate,
  bool FullyBooked,
  LocaleTrio WeekdayDate,
  LocaleTrio TimeDetail,
  LocaleTrio Title,
  LocaleTrio Excerpt,
  string ImageSrc,
  LocaleTrio ImageAlt,
  DateTimeOffset UpdatedAtUtc)
{
  public static PublicEventDto From(PublicEvent e)
  {
    return new PublicEventDto(
      e.Id,
      e.SortDate,
      e.FullyBooked,
      new LocaleTrio(e.WeekdayDateEn, e.WeekdayDateEs, e.WeekdayDateSv),
      new LocaleTrio(e.TimeDetailEn, e.TimeDetailEs, e.TimeDetailSv),
      new LocaleTrio(e.TitleEn, e.TitleEs, e.TitleSv),
      new LocaleTrio(e.ExcerptEn, e.ExcerptEs, e.ExcerptSv),
      e.ImageSrc,
      new LocaleTrio(e.ImageAltEn, e.ImageAltEs, e.ImageAltSv),
      e.UpdatedAtUtc);
  }
}

public sealed record UpsertPublicEventRequest(
  [property: JsonPropertyName("id")] string? Id,
  [property: JsonPropertyName("sortDate")] string? SortDate,
  [property: JsonPropertyName("fullyBooked")] bool? FullyBooked,
  [property: JsonPropertyName("weekdayDate")] LocaleTrio? WeekdayDate,
  [property: JsonPropertyName("timeDetail")] LocaleTrio? TimeDetail,
  [property: JsonPropertyName("title")] LocaleTrio? Title,
  [property: JsonPropertyName("excerpt")] LocaleTrio? Excerpt,
  [property: JsonPropertyName("imageSrc")] string? ImageSrc,
  [property: JsonPropertyName("imageAlt")] LocaleTrio? ImageAlt);

