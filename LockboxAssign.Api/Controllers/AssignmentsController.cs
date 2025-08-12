using LockboxAssign.Api.Contracts;
using LockboxAssign.Api.Data;
using LockboxAssign.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LockboxAssign.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssignmentsController(AppDbContext db) : ControllerBase
{
    [HttpPost("save")]
    public async Task<ActionResult<SaveAssignmentsResponse>> Save([FromBody] SaveAssignmentsRequest req)
    {
        var now = DateTimeOffset.UtcNow;
        var saved = 0;

        foreach (var change in req.Changes)
        {
            await using var tx = await db.Database.BeginTransactionAsync();

            var target = await db.Lockboxes
                .Include(l => l.Assignment)!.ThenInclude(a => a!.Equipment)
                .FirstOrDefaultAsync(l => l.Id == change.LockboxId);

            if (target is null) { await tx.RollbackAsync(); continue; }

            if (change.EquipmentId is null)
            {
                if (target.Assignment is not null)
                {
                    db.Assignments.Remove(target.Assignment);
                    await db.SaveChangesAsync();
                    saved++;
                }
                await tx.CommitAsync();
                continue;
            }

            var existingForEquipment = await db.Assignments
                .Include(a => a.Lockbox)
                .FirstOrDefaultAsync(a => a.EquipmentId == change.EquipmentId);

            if (existingForEquipment is not null && existingForEquipment.LockboxId != change.LockboxId)
            {
                db.Assignments.Remove(existingForEquipment);
                await db.SaveChangesAsync();
            }

            if (target.Assignment is not null && target.Assignment.EquipmentId != change.EquipmentId)
            {
                db.Assignments.Remove(target.Assignment);
                await db.SaveChangesAsync();
                target.Assignment = null;
            }

            var current = await db.Assignments.FirstOrDefaultAsync(a => a.LockboxId == change.LockboxId);
            if (current is null)
            {
                db.Assignments.Add(new Assignment
                {
                    Id = Guid.NewGuid(),
                    LockboxId = change.LockboxId,
                    EquipmentId = change.EquipmentId,
                    UpdatedAt = now
                });
            }
            else
            {
                current.EquipmentId = change.EquipmentId;
                current.UpdatedAt = now;
                db.Assignments.Update(current);
            }

            await db.SaveChangesAsync();
            await tx.CommitAsync();
            saved++;
        }

        return Ok(new SaveAssignmentsResponse
        {
            Saved = saved,
            UpdatedAt = now
        });
    }
}
