using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace ElPortero.Api;

public sealed class R2StorageService
{
  private readonly R2Options _options;
  private readonly IAmazonS3? _s3;

  public R2StorageService(IOptions<R2Options> options)
  {
    _options = options.Value;

    if (IsConfigured)
    {
      var creds = new BasicAWSCredentials(_options.AccessKeyId, _options.SecretAccessKey);
      var cfg = new AmazonS3Config
      {
        ServiceURL = _options.Endpoint.TrimEnd('/'),
        ForcePathStyle = true,
        AuthenticationRegion = "auto",
      };

      _s3 = new AmazonS3Client(creds, cfg);
    }
    else
    {
      _s3 = null;
    }
  }

  public bool IsConfigured =>
    !string.IsNullOrWhiteSpace(_options.Endpoint) &&
    !string.IsNullOrWhiteSpace(_options.Bucket) &&
    !string.IsNullOrWhiteSpace(_options.AccessKeyId) &&
    !string.IsNullOrWhiteSpace(_options.SecretAccessKey);

  public string BuildObjectKey(string originalFileName)
  {
    var safe = Path.GetFileName(originalFileName);
    if (string.IsNullOrWhiteSpace(safe)) safe = "upload.bin";
    safe = safe.Replace("\\", "/");
    return $"uploads/{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid():N}-{safe}";
  }

  public string? BuildPublicUrl(string objectKey)
  {
    var baseUrl = (_options.PublicBaseUrl ?? "").TrimEnd('/');
    if (string.IsNullOrWhiteSpace(baseUrl)) return null;
    return $"{baseUrl}/{objectKey}";
  }

  public Task<(string uploadUrl, Dictionary<string, string> headers)> CreatePresignedPutAsync(
    string objectKey,
    string contentType,
    TimeSpan expires,
    CancellationToken ct)
  {
    if (_s3 is null)
    {
      throw new InvalidOperationException("R2 is not configured.");
    }

    var req = new GetPreSignedUrlRequest
    {
      BucketName = _options.Bucket,
      Key = objectKey,
      Verb = HttpVerb.PUT,
      Expires = DateTime.UtcNow.Add(expires),
      ContentType = contentType,
    };

    // R2/S3 presigned PUT URLs often require the client to send the same Content-Type header.
    var url = _s3.GetPreSignedURL(req);
    var headers = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
      ["Content-Type"] = contentType,
    };

    return Task.FromResult((url, headers));
  }
}
