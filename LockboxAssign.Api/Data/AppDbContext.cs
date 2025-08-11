using LockboxAssign.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LockboxAssign.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<Lockbox> Lockboxes => Set<Lockbox>();
    public DbSet<Assignment> Assignments => Set<Assignment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Equipment>(e =>
        {
            e.HasIndex(x => x.UnitNumber).IsUnique();
            e.Property(x => x.UnitNumber).IsRequired();
            e.Property(x => x.Status).HasMaxLength(20);
            e.HasOne(x => x.Assignment)
             .WithOne(a => a.Equipment)
             .HasForeignKey<Assignment>(a => a.EquipmentId)
             .IsRequired(false);
        });

        b.Entity<Lockbox>(l =>
        {
            l.HasIndex(x => x.Label).IsUnique();
            l.Property(x => x.Label).IsRequired();
            l.HasOne(x => x.Assignment)
             .WithOne(a => a.Lockbox)
             .HasForeignKey<Assignment>(a => a.LockboxId)
             .IsRequired();
        });

        b.Entity<Assignment>(a =>
        {
            a.HasIndex(x => x.LockboxId).IsUnique();
            a.HasIndex(x => x.EquipmentId).IsUnique().HasFilter("\"EquipmentId\" IS NOT NULL");
            a.Property(x => x.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}
