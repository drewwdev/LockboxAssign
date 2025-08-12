import type { EquipmentListItemDto, LockboxRowDto } from "./types";

export async function getLockboxes(): Promise<LockboxRowDto[]> {
  const res = await fetch("/api/lockboxes");
  if (!res.ok) throw new Error("Failed to load lockboxes");
  return res.json();
}

export async function getEquipment(): Promise<EquipmentListItemDto[]> {
  const res = await fetch("/api/equipment");
  if (!res.ok) throw new Error("Failed to load equipment");
  return res.json();
}

export async function saveAssignments(
  changes: { lockboxId: string; equipmentId: string | null }[]
) {
  const res = await fetch("/api/assignments/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ changes }),
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json() as Promise<{ saved: number; updatedAt: string }>;
}
