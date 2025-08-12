namespace LockboxAssign.Api.Contracts;

public class LockboxRowDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = default!;
    public AssignedEquipmentDto? AssignedEquipment { get; set; }
}

public class AssignedEquipmentDto
{
    public Guid Id { get; set; }
    public string UnitNumber { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? ParkingSpot { get; set; }
}

public class EquipmentListItemDto
{
    public Guid Id { get; set; }
    public string UnitNumber { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? ParkingSpot { get; set; }
}

public class SaveAssignmentsRequest
{
    public List<SaveChangeRow> Changes { get; set; } = new();
}

public class SaveChangeRow
{
    public Guid LockboxId { get; set; }
    public Guid? EquipmentId { get; set; }
}

public class SaveAssignmentsResponse
{
    public int Saved { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
