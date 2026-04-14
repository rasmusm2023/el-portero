using ElPortero.Api.Data;
using ElPortero.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ElPortero.Api;

public static class LunchMenuService
{
  public static async Task<WeeklyMenu> GetOrCreateSingletonAsync(AppDbContext db, CancellationToken ct = default)
  {
    var menu = await db.WeeklyMenus
      .Include(m => m.Items)
      .OrderBy(m => m.Id)
      .FirstOrDefaultAsync(ct)
      .ConfigureAwait(false);

    if (menu is not null) return menu;

    var weekStart = WeeklyMenuClock.GetWeekStartMadrid(DateTimeOffset.UtcNow);
    menu = new WeeklyMenu
    {
      WeekStartDate = weekStart,
      EffectiveWeekStartDate = weekStart,
      Title = "",
      IsPublished = false,
      UpdatedAtUtc = DateTimeOffset.UtcNow,
    };

    db.WeeklyMenus.Add(menu);
    await db.SaveChangesAsync(ct).ConfigureAwait(false);
    return menu;
  }

  public static async Task<WeeklyMenu?> GetLiveMenuAsync(AppDbContext db, DateTimeOffset utcNow, CancellationToken ct = default)
  {
    var currentWeekStart = WeeklyMenuClock.GetWeekStartMadrid(utcNow);

    return await db.WeeklyMenus
      .Include(m => m.Items.OrderBy(i => i.Position))
      .Where(m => m.IsPublished && m.EffectiveWeekStartDate <= currentWeekStart)
      .OrderByDescending(m => m.EffectiveWeekStartDate)
      .FirstOrDefaultAsync(ct)
      .ConfigureAwait(false);
  }

  public static bool IsMondayMadrid(DateOnly candidate)
  {
    var dto = new DateTimeOffset(
      candidate.Year,
      candidate.Month,
      candidate.Day,
      12,
      0,
      0,
      TimeSpan.Zero);

    return WeeklyMenuClock.GetWeekStartMadrid(dto) == candidate;
  }
}
