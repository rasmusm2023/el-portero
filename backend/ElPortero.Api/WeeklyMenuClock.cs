namespace ElPortero.Api;

public static class WeeklyMenuClock
{
  public static DateOnly GetWeekStartMadrid(DateTimeOffset utcNow)
  {
    // Windows TZ id
    TimeZoneInfo tz;
    try
    {
      tz = TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time"); // Europe/Madrid
    }
    catch
    {
      // Linux TZ id fallback
      tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Madrid");
    }

    var local = TimeZoneInfo.ConvertTime(utcNow, tz).Date;
    var dayOfWeek = (int)local.DayOfWeek; // Sunday=0
    var mondayIndex = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
    var monday = local.AddDays(-mondayIndex);
    return DateOnly.FromDateTime(monday);
  }
}

