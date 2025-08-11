namespace LockboxAssign.Api.Models;

public class Assignment
{
    public Guid Id { get; set; }

    public Guid LockboxId { get; set; }
    public Lockbox Lockbox { get; set; } = default!;

    public Guid? EquipmentId { get; set; }
    public Equipment? Equipment { get; set; }

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
