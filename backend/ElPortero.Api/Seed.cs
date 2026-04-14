using BCrypt.Net;
using ElPortero.Api.Data;
using ElPortero.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ElPortero.Api;

public static class Seed
{
  public static async Task EnsureAdminUserAsync(AppDbContext db, IConfiguration config)
  {
    if (await db.StaffUsers.AnyAsync()) return;

    var username = config["Admin:Username"] ?? "admin";
    var password = config["Admin:Password"] ?? "admin";

    var user = new StaffUser
    {
      Username = username,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
      Role = "admin",
      CreatedAtUtc = DateTimeOffset.UtcNow,
    };

    db.StaffUsers.Add(user);
    await db.SaveChangesAsync();
  }
}

