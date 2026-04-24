namespace ElPortero.Api.Models;

public sealed class PublicEvent
{
  public string Id { get; set; } = "";
  public string SortDate { get; set; } = "";
  public bool FullyBooked { get; set; }
  public string WeekdayDateEn { get; set; } = "";
  public string WeekdayDateEs { get; set; } = "";
  public string WeekdayDateSv { get; set; } = "";
  public string TimeDetailEn { get; set; } = "";
  public string TimeDetailEs { get; set; } = "";
  public string TimeDetailSv { get; set; } = "";
  public string TitleEn { get; set; } = "";
  public string TitleEs { get; set; } = "";
  public string TitleSv { get; set; } = "";
  public string ExcerptEn { get; set; } = "";
  public string ExcerptEs { get; set; } = "";
  public string ExcerptSv { get; set; } = "";
  public string ImageSrc { get; set; } = "";
  public string ImageAltEn { get; set; } = "";
  public string ImageAltEs { get; set; } = "";
  public string ImageAltSv { get; set; } = "";
  public DateTimeOffset CreatedAtUtc { get; set; }
  public DateTimeOffset UpdatedAtUtc { get; set; }
}
