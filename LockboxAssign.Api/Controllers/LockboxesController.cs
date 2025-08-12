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
        .Select(lb => new
        {
            lb.Id,
            lb.Label,
            Equip = db.Assignments
                .Where(a => a.LockboxId == lb.Id)
                .Select(a => a.Equipment)
                .FirstOrDefault()
        })
        .ToListAsync();

    var dtos = rows
        .OrderBy(x => x.Label)
        .Select(x => new LockboxRowDto
        {
            Id = x.Id,
            Label = x.Label,
            AssignedEquipment = x.Equip == null ? null : new AssignedEquipmentDto
            {
                Id = x.Equip.Id,
                UnitNumber = x.Equip.UnitNumber,
                Status = x.Equip.Status,
                ParkingSpot = x.Equip.ParkingSpot
            }
        })
        .ToList();

    return Ok(dtos);
}
}
