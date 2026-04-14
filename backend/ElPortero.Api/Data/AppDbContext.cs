using ElPortero.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ElPortero.Api.Data;

public sealed class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<StaffUser> StaffUsers => Set<StaffUser>();
  public DbSet<WeeklyMenu> WeeklyMenus => Set<WeeklyMenu>();
  public DbSet<WeeklyMenuItem> WeeklyMenuItems => Set<WeeklyMenuItem>();
  public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<StaffUser>(e =>
    {
      e.HasIndex(x => x.Username).IsUnique();
      e.Property(x => x.Username).HasMaxLength(64).IsRequired();
      e.Property(x => x.PasswordHash).HasMaxLength(255).IsRequired();
      e.Property(x => x.Role).HasMaxLength(32).IsRequired();
    });

    modelBuilder.Entity<WeeklyMenu>(e =>
    {
      e.HasIndex(x => x.WeekStartDate);
      e.HasIndex(x => x.EffectiveWeekStartDate).IsUnique();
      e.Property(x => x.Title).HasMaxLength(120);
      e.HasMany(x => x.Items)
        .WithOne(i => i.WeeklyMenu!)
        .HasForeignKey(i => i.WeeklyMenuId)
        .OnDelete(DeleteBehavior.Cascade);
    });

    modelBuilder.Entity<WeeklyMenuItem>(e =>
    {
      e.Property(x => x.Name).HasMaxLength(120).IsRequired();
      e.Property(x => x.Description).HasMaxLength(400);
      e.Property(x => x.Price).HasMaxLength(32);
      e.Property(x => x.DietaryTags).HasMaxLength(64);
      e.HasIndex(x => new { x.WeeklyMenuId, x.Position });
    });

    modelBuilder.Entity<MediaAsset>(e =>
    {
      e.HasIndex(x => x.ObjectKey).IsUnique();
      e.Property(x => x.ObjectKey).HasMaxLength(512).IsRequired();
      e.Property(x => x.OriginalFileName).HasMaxLength(255).IsRequired();
      e.Property(x => x.ContentType).HasMaxLength(128).IsRequired();
      e.Property(x => x.PublicUrl).HasMaxLength(1024);
      e.Property(x => x.CreatedByUsername).HasMaxLength(64).IsRequired();
    });
  }
}

