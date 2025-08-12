import { Link } from "react-router-dom";
import { COLORS } from "../ui/colors";

export interface Tile {
  label: string;
  to?: string;
  color?: string;
}

export default function TileButton({ tile }: { tile: Tile }) {
  const content = (
    <div className="aspect-square rounded-2xl border border-[#d7d2cc] bg-[#f3f2ef] p-3 shadow-sm flex flex-col items-stretch justify-between">
      <div
        className="rounded-xl h-14"
        style={{ background: tile.color || COLORS.orange }}
      />
      <div className="text-center text-[13px] font-medium text-[#2c2c2c] px-1 leading-tight">
        {tile.label}
      </div>
    </div>
  );
  return tile.to ? (
    <Link to={tile.to} className="w-full hover:opacity-90 transition">
      {content}
    </Link>
  ) : (
    <button className="opacity-60 cursor-not-allowed w-full" aria-disabled>
      {content}
    </button>
  );
}
