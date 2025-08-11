using LockboxAssign.Api.Contracts;
using LockboxAssign.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LockboxAssign.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EquipmentListItemDto>>> Search([FromQuery] string? query, [FromQuery] string? status)
    {
        var q = db.Equipment.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
            q = q.Where(e => e.UnitNumber.ToLower().Contains(query.ToLower()));

        if (!string.IsNullOrWhiteSpace(status))
            q = q.Where(e => e.Status == status);

        var list = await q
            .OrderBy(e => e.UnitNumber)
            .Select(e => new EquipmentListItemDto(e.Id, e.UnitNumber, e.Status, e.ParkingSpot))
            .ToListAsync();

        return Ok(list);
    }
}
