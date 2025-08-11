namespace LockboxAssign.Api.Models;

public class Equipment
{
    public Guid Id { get; set; }
    public string UnitNumber { get; set; } = default!;
    public string Status { get; set; } = "Available";
    public string? ParkingSpot { get; set; }

    public Assignment? Assignment { get; set; }
}
