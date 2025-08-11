namespace LockboxAssign.Api.Contracts;

public record LockboxRowDto(
    Guid Id,
    string Label,
    AssignedEquipmentDto? AssignedEquipment
);

public record AssignedEquipmentDto(
    Guid Id,
    string UnitNumber,
    string Status,
    string? ParkingSpot
);

public record EquipmentListItemDto(
    Guid Id,
    string UnitNumber,
    string Status,
    string? ParkingSpot
);

public record SaveAssignmentsRequest(List<SaveChangeRow> Changes);
public record SaveChangeRow(Guid LockboxId, Guid? EquipmentId);
public record SaveAssignmentsResponse(int Saved, DateTimeOffset UpdatedAt);
