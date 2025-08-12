import { COLORS } from "../ui/colors";

export default function HeaderBar() {
  return (
    <header className="w-full shadow">
      <div className="w-full" style={{ background: COLORS.orange }}>
        <div className="mx-auto max-w-[1150px] px-4 py-3 flex items-center justify-between">
          <div className="h-6" />
          <div className="text-white text-[13px] tracking-wide">
            Mobile Console
          </div>
          <div className="flex items-center gap-3 text-white text-[13px]">
            <button className="rounded px-3 py-1/2 bg-white/10 hover:bg-white/20 transition">
              Scan
            </button>
          </div>
        </div>
      </div>
      <div className="w-full" style={{ background: COLORS.grayBar }}>
        <div className="mx-auto max-w-[1150px] px-4 py-3 flex items-center justify-between text-[13px] text-gray-700">
          <div className="font-semibold">Mobile Dashboard</div>
          <div>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
