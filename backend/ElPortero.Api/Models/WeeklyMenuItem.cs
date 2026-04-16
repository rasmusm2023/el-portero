namespace ElPortero.Api.Models;

public sealed class WeeklyMenuItem
{
  public int Id { get; set; }

  public int WeeklyMenuId { get; set; }
  public WeeklyMenu? WeeklyMenu { get; set; }

  public int Position { get; set; } = 1;

  public string Name { get; set; } = "";
  public string Description { get; set; } = "";
  public string Price { get; set; } = "";
  public string DietaryTags { get; set; } = "";
}

