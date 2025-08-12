import { useEffect, useState, useMemo } from "react";
import HeaderBar from "../components/HeaderBar";
import ConfirmModal from "../components/ConfirmModal";
import { COLORS } from "../ui/colors";
import { getEquipment, getLockboxes, saveAssignments } from "../api";
import type { EquipmentListItemDto, LockboxRowDto } from "../types";
import { useNavigate } from "react-router-dom";

export default function LockboxAssignPage() {
  const nav = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRows, setPendingRows] = useState<
    { lockboxId: string; equipmentId: string | null }[] | null
  >(null);
  const [lockboxes, setLockboxes] = useState<LockboxRowDto[]>([]);
  const [equipment, setEquipment] = useState<EquipmentListItemDto[]>([]);
  const [changed, setChanged] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;

    async function load() {
      try {
        setLoading(true);
        const [lbs, eqs] = await Promise.all([getLockboxes(), getEquipment()]);
        if (aborted) return;

        const order = Array.from({ length: 16 }, (_, i) => (i + 1).toString());
        const byLabel = new Map(lbs.map((lb) => [lb.label, lb]));
        const ordered = order
          .map((l) => byLabel.get(l))
          .filter(Boolean) as typeof lbs;

        setLockboxes(ordered);
        setEquipment(eqs);
        setError(null);
      } catch (e) {
        if (!aborted) setError(e.message || "Load error");
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();
    return () => {
      aborted = true;
    };
  }, []);

  function currentSelection(lockboxId: string): string | null {
    if (lockboxId in changed) return changed[lockboxId] ?? null;
    const lb = lockboxes.find((l) => l.id === lockboxId);
    return lb?.assignedEquipment?.id ?? null;
  }

  function onSelect(lockboxId: string, equipmentIdOrNull: string | null) {
    setChanged((prev) => ({ ...prev, [lockboxId]: equipmentIdOrNull }));
  }

  function computeChanges() {
    const rows: { lockboxId: string; equipmentId: string | null }[] = [];
    for (const lb of lockboxes) {
      const before = lb.assignedEquipment?.id ?? null;
      const after = currentSelection(lb.id);
      if (before !== after) rows.push({ lockboxId: lb.id, equipmentId: after });
    }
    return rows;
  }

  function needsConfirmation(
    rows: { lockboxId: string; equipmentId: string | null }[]
  ): boolean {
    const assignedByEquip = new Map<string, string>();
    lockboxes.forEach((lb) => {
      const eid = lb.assignedEquipment?.id;
      if (eid) assignedByEquip.set(eid, lb.id);
    });

    for (const r of rows) {
      if (r.equipmentId) {
        const fromLock = assignedByEquip.get(r.equipmentId);
        if (fromLock && fromLock !== r.lockboxId) return true;
      }
      const target = lockboxes.find((lb) => lb.id === r.lockboxId);
      const targetHasOther =
        target?.assignedEquipment &&
        target.assignedEquipment.id !== r.equipmentId;
      if (targetHasOther) return true;
    }
    return false;
  }

  async function onSave() {
    const rows = computeChanges();
    if (rows.length === 0) {
      nav("/");
      return;
    }

    if (needsConfirmation(rows)) {
      setPendingRows(rows);
      setConfirmOpen(true);
      return;
    }
    actuallySave(rows);
  }

  async function actuallySave(
    rows: { lockboxId: string; equipmentId: string | null }[]
  ) {
    try {
      setSaving(true);
      await saveAssignments(rows);
      nav("/");
    } catch (e) {
      setError(e.message || "Save error");
    } finally {
      setSaving(false);
    }
  }

  const summary = useMemo(() => {
    if (!pendingRows) return null;
    const lbLabel = (id: string) =>
      lockboxes.find((l) => l.id === id)?.label ?? id;
    const eqNum = (id: string | null) =>
      id ? equipment.find((e) => e.id === id)?.unitNumber ?? id : "Unassigned";
    return (
      <ul className="list-disc pl-5 space-y-1">
        {pendingRows.map((r) => (
          <li key={r.lockboxId}>
            Lockbox <b>{lbLabel(r.lockboxId)}</b> →{" "}
            <b>{eqNum(r.equipmentId)}</b>
          </li>
        ))}
      </ul>
    );
  }, [pendingRows, lockboxes, equipment]);

  return (
    <div className="min-h-screen" style={{ background: COLORS.pageBg }}>
      <HeaderBar />
      <div className="mx-auto max-w-[900px] px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#2c2c2c]">
            Assign Lockboxes
          </h1>
          <div className="flex gap-2">
            <button
              className="rounded-md px-4 py-2 text-white disabled:opacity-50"
              style={{ background: COLORS.orange }}
              onClick={onSave}
              disabled={saving || loading}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              className="rounded-md px-4 py-2 text-white"
              style={{ background: COLORS.orange }}
              onClick={() => nav("/")}>
              Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : (
          <div className="space-y-3">
            {lockboxes.map((lb) => (
              <div
                key={lb.id}
                className="rounded-xl border border-[#d7d2cc] bg-white/70 p-3 flex items-center justify-between">
                <div className="text-sm font-medium text-[#2c2c2c] w-40">
                  {lb.label}
                </div>
                <select
                  className="flex-1 mx-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={currentSelection(lb.id) ?? ""}
                  onChange={(e) =>
                    onSelect(
                      lb.id,
                      e.target.value === "" ? null : e.target.value
                    )
                  }>
                  <option value="">— Unassigned —</option>
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.unitNumber}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-600 w-48 text-right">
                  {lockboxes.find((x) => x.id === lb.id)?.assignedEquipment
                    ?.parkingSpot ? (
                    <>
                      Spot:{" "}
                      {
                        lockboxes.find((x) => x.id === lb.id)?.assignedEquipment
                          ?.parkingSpot
                      }
                    </>
                  ) : (
                    <span className="opacity-60">No spot info</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Apply assignment changes?"
        message={
          <>
            <p className="mb-2">
              Some changes will move trucks between lockboxes or replace
              existing assignments.
            </p>
            {summary}
          </>
        }
        confirmLabel="Apply Changes"
        cancelLabel="Cancel"
        busy={saving}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingRows(null);
        }}
        onConfirm={() => {
          if (pendingRows) actuallySave(pendingRows);
        }}
      />
    </div>
  );
}
