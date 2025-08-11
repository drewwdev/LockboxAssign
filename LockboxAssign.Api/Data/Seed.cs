using LockboxAssign.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LockboxAssign.Api.Data;

public static class Seed
{
    public static async Task EnsureSampleDataAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        if (!await db.Lockboxes.AnyAsync())
        {
            var lbs = Enumerable.Range(1, 16).Select(i => new Lockbox
            {
                Id = Guid.NewGuid(),
                Label = $"LB-1001-{i:00}"
            }).ToList();
            await db.Lockboxes.AddRangeAsync(lbs);
        }

        if (!await db.Equipment.AnyAsync())
        {
            string[] types = ["BX10", "BX15", "CVAN", "PICK"];
            var rnd = new Random(1);
            var eqs = Enumerable.Range(1, 18).Select(i =>
            {
                var type = types[rnd.Next(types.Length)];
                return new Equipment
                {
                    Id = Guid.NewGuid(),
                    UnitNumber = $"{type}-{rnd.Next(1000, 9999)}",
                    Status = "Available",
                    ParkingSpot = rnd.Next(2) == 0 ? $"Front B-{rnd.Next(1, 20):00}" : null
                };
            }).ToList();
            await db.Equipment.AddRangeAsync(eqs);
        }

        await db.SaveChangesAsync();

        if (!await db.Assignments.AnyAsync())
        {
            var lbs = await db.Lockboxes.OrderBy(x => x.Label).ToListAsync();
            var eqs = await db.Equipment.OrderBy(x => x.UnitNumber).ToListAsync();
            var take = (int)(lbs.Count * 0.6);
            for (int i = 0; i < take && i < eqs.Count; i++)
            {
                db.Assignments.Add(new Assignment
                {
                    Id = Guid.NewGuid(),
                    LockboxId = lbs[i].Id,
                    EquipmentId = eqs[i].Id,
                    UpdatedAt = DateTimeOffset.UtcNow
                });
            }
            await db.SaveChangesAsync();
        }
    }
}
