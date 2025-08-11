namespace LockboxAssign.Api.Models;

public class Lockbox
{
    public Guid Id { get; set; }
    public string Label { get; set; } = default!;

    public Assignment? Assignment { get; set; }
}
