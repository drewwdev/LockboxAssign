using LockboxAssign.Api.Contracts;
using LockboxAssign.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LockboxAssign.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LockboxesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LockboxRowDto>>> GetAll()
    {
        var rows = await db.Lockboxes
            .AsNoTracking()
            .Select(lb => new LockboxRowDto(
                lb.Id,
                lb.Label,
                lb.Assignment != null && lb.Assignment.Equipment != null
                    ? new AssignedEquipmentDto(
                        lb.Assignment.Equipment.Id,
                        lb.Assignment.Equipment.UnitNumber,
                        lb.Assignment.Equipment.Status,
                        lb.Assignment.Equipment.ParkingSpot)
                    : null
            ))
            .OrderBy(r => r.Label)
            .ToListAsync();

        return Ok(rows);
    }
}
