export default function ConfirmModal({
  open,
  title = "Confirm changes",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
}: {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="px-5 py-4 text-sm text-gray-700">
            {message ?? "Are you sure you want to apply these changes?"}
          </div>
          <div className="px-5 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              onClick={onCancel}
              disabled={busy}>
              {cancelLabel}
            </button>
            <button
              className="px-4 py-2 rounded-md text-white bg-[#FF6A13] hover:opacity-90 disabled:opacity-50"
              onClick={onConfirm}
              disabled={busy}>
              {busy ? "Saving…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
