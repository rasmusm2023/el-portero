using System.Globalization;
using ElPortero.Api.Models;
using Microsoft.AspNetCore.Http;

namespace ElPortero.Api;

internal static class PublicEventApiHelpers
{
  public static bool TryNormalizeEventId(string? raw, [System.Diagnostics.CodeAnalysis.NotNullWhen(true)] out string? id)
  {
    id = null;
    if (string.IsNullOrWhiteSpace(raw)) return false;
    var t = raw.Trim();
    if (t.Length is < 1 or > 64) return false;
    if (t.AsSpan(0, 1)[0] is '-' or '_') return false;
    if (t[^1] is '-') return false;
    foreach (var c in t)
    {
      if (c is >= 'a' and <= 'z' or >= '0' and <= '9' or '-')
        continue;
      return false;
    }
    id = t;
    return true;
  }

  public static bool TryValidateEventPayload(
    UpsertPublicEventRequest req,
    [System.Diagnostics.CodeAnalysis.NotNullWhen(false)] out IResult? error)
  {
    if (string.IsNullOrWhiteSpace(req.SortDate)
        || !DateOnly.TryParse(req.SortDate.Trim(), CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
    {
      error = Results.BadRequest("sortDate is required and must be YYYY-MM-DD.");
      return false;
    }

    if (req.WeekdayDate is null
        || req.TimeDetail is null
        || req.Title is null
        || req.Excerpt is null
        || req.ImageAlt is null)
    {
      error = Results.BadRequest("weekdayDate, timeDetail, title, excerpt, and imageAlt are required.");
      return false;
    }

    if (string.IsNullOrWhiteSpace(req.ImageSrc))
    {
      error = Results.BadRequest("imageSrc is required.");
      return false;
    }

    if (!HasTrioContent(req.WeekdayDate) || !HasTrioContent(req.TimeDetail) || !HasTrioContent(req.Title)
        || !HasTrioContent(req.Excerpt) || !HasTrioContent(req.ImageAlt))
    {
      error = Results.BadRequest("All locale fields (en, es, sv) are required in each object.");
      return false;
    }

    error = null;
    return true;
  }

  private static bool HasTrioContent(LocaleTrio t) =>
    !string.IsNullOrWhiteSpace(t.En) && !string.IsNullOrWhiteSpace(t.Es) && !string.IsNullOrWhiteSpace(t.Sv);

  public static void ApplyBody(PublicEvent row, UpsertPublicEventRequest req, bool isNew, DateTimeOffset now)
  {
    row.SortDate = req.SortDate!.Trim();
    row.FullyBooked = req.FullyBooked ?? false;
    row.WeekdayDateEn = req.WeekdayDate!.En.Trim();
    row.WeekdayDateEs = req.WeekdayDate.Es.Trim();
    row.WeekdayDateSv = req.WeekdayDate.Sv.Trim();
    row.TimeDetailEn = req.TimeDetail!.En.Trim();
    row.TimeDetailEs = req.TimeDetail.Es.Trim();
    row.TimeDetailSv = req.TimeDetail.Sv.Trim();
    row.TitleEn = req.Title!.En.Trim();
    row.TitleEs = req.Title.Es.Trim();
    row.TitleSv = req.Title.Sv.Trim();
    row.ExcerptEn = req.Excerpt!.En.Trim();
    row.ExcerptEs = req.Excerpt.Es.Trim();
    row.ExcerptSv = req.Excerpt.Sv.Trim();
    row.ImageSrc = req.ImageSrc!.Trim();
    row.ImageAltEn = req.ImageAlt!.En.Trim();
    row.ImageAltEs = req.ImageAlt.Es.Trim();
    row.ImageAltSv = req.ImageAlt.Sv.Trim();
    row.UpdatedAtUtc = now;
    if (isNew)
    {
      row.CreatedAtUtc = now;
    }
  }
}
