using System.Data;
using ElPortero.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace ElPortero.Api;

public static class SchemaPatch
{
  /// <summary>
  /// Lightweight dev-friendly migrations for SQLite when using EnsureCreated on an existing DB file.
  /// </summary>
  public static async Task EnsureWeeklyMenuEffectiveWeekColumnAsync(AppDbContext db, CancellationToken ct = default)
  {
    var conn = db.Database.GetDbConnection();
    if (conn.State != ConnectionState.Open)
    {
      await conn.OpenAsync(ct).ConfigureAwait(false);
    }

    await using var cmd = conn.CreateCommand();
    cmd.CommandText = """PRAGMA table_info("WeeklyMenus");""";

    var hasColumn = false;
    await using (var reader = await cmd.ExecuteReaderAsync(ct).ConfigureAwait(false))
    {
      while (await reader.ReadAsync(ct).ConfigureAwait(false))
      {
        // PRAGMA table_info: cid, name, type, notnull, dflt_value, pk
        var name = reader.GetString(1);
        if (string.Equals(name, "EffectiveWeekStartDate", StringComparison.Ordinal))
        {
          hasColumn = true;
          break;
        }
      }
    }

    if (hasColumn) return;

    await using var alter = conn.CreateCommand();
    alter.CommandText = """
      ALTER TABLE "WeeklyMenus"
      ADD COLUMN "EffectiveWeekStartDate" TEXT NOT NULL DEFAULT '0001-01-01';
      """;
    await alter.ExecuteNonQueryAsync(ct).ConfigureAwait(false);
  }

  public static async Task EnsureWeeklyMenuIndexesAsync(AppDbContext db, CancellationToken ct = default)
  {
    var conn = db.Database.GetDbConnection();
    if (conn.State != ConnectionState.Open)
    {
      await conn.OpenAsync(ct).ConfigureAwait(false);
    }

    // Drop legacy unique index on WeekStartDate if present (we only keep one lunch menu row now).
    await using (var cmd = conn.CreateCommand())
    {
      cmd.CommandText = """PRAGMA index_list("WeeklyMenus");""";
      await using var reader = await cmd.ExecuteReaderAsync(ct).ConfigureAwait(false);
      while (await reader.ReadAsync(ct).ConfigureAwait(false))
      {
        // columns: seq, name, unique, origin, partial
        var unique = reader.GetInt64(2) == 1;
        if (!unique) continue;
        var indexName = reader.GetString(1);
        if (string.Equals(indexName, "IX_WeeklyMenus_WeekStartDate", StringComparison.Ordinal))
        {
          await conn.CloseAsync().ConfigureAwait(false);
          await db.Database.ExecuteSqlRawAsync(
            """DROP INDEX IF EXISTS "IX_WeeklyMenus_WeekStartDate";""",
            ct).ConfigureAwait(false);
          await conn.OpenAsync(ct).ConfigureAwait(false);
          break;
        }
      }
    }

    await db.Database.ExecuteSqlRawAsync(
      """
      CREATE UNIQUE INDEX IF NOT EXISTS "IX_WeeklyMenus_EffectiveWeekStartDate"
      ON "WeeklyMenus" ("EffectiveWeekStartDate");
      """,
      ct).ConfigureAwait(false);

    await db.Database.ExecuteSqlRawAsync(
      """
      CREATE INDEX IF NOT EXISTS "IX_WeeklyMenus_WeekStartDate_NonUnique"
      ON "WeeklyMenus" ("WeekStartDate");
      """,
      ct).ConfigureAwait(false);
  }
}
