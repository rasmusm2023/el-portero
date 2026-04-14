namespace ElPortero.Api;

public sealed class R2Options
{
  /// <summary>
  /// Example: https://&lt;accountid&gt;.r2.cloudflarestorage.com
  /// </summary>
  public string Endpoint { get; set; } = "";

  public string Bucket { get; set; } = "";

  public string AccessKeyId { get; set; } = "";

  public string SecretAccessKey { get; set; } = "";

  /// <summary>
  /// Optional public URL prefix for reading objects (e.g. https://media.example.com).
  /// If empty, uploads still work, but the API won't guess a public URL.
  /// </summary>
  public string? PublicBaseUrl { get; set; }

  public int PresignExpiresSeconds { get; set; } = 900;

  public long MaxUploadBytes { get; set; } = 8 * 1024 * 1024;
}
