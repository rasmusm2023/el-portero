namespace ElPortero.Api.Models;

public sealed class MediaAsset
{
  public int Id { get; set; }

  public string ObjectKey { get; set; } = "";

  public string OriginalFileName { get; set; } = "";

  public string ContentType { get; set; } = "";

  public long SizeBytes { get; set; }

  public string? PublicUrl { get; set; }

  public string CreatedByUsername { get; set; } = "";

  public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}
