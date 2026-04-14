namespace ElPortero.Api.Models;

public sealed class StaffUser
{
  public int Id { get; set; }
  public string Username { get; set; } = "";
  public string PasswordHash { get; set; } = "";
  public string Role { get; set; } = "admin";
  public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

