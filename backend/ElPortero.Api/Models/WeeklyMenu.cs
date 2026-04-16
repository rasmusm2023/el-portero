namespace ElPortero.Api.Models;

public sealed class WeeklyMenu
{
  public int Id { get; set; }

  // Legacy field from the first iteration (kept for SQLite compatibility on existing DBs).
  // New logic uses EffectiveWeekStartDate as the scheduling key.
  public DateOnly WeekStartDate { get; set; }

  /// <summary>
  /// The Monday (Europe/Madrid) when this lunch menu becomes visible on the website.
  /// </summary>
  public DateOnly EffectiveWeekStartDate { get; set; }

  public string Title { get; set; } = "";

  public bool IsPublished { get; set; }

  public DateTimeOffset UpdatedAtUtc { get; set; } = DateTimeOffset.UtcNow;

  public List<WeeklyMenuItem> Items { get; set; } = new();
}

