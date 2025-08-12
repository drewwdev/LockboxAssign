import TileButton, { type Tile } from "./TileButton";

export default function Section({
  title,
  tiles,
  topPadding = true,
}: {
  title?: string;
  tiles: Tile[];
  topPadding?: boolean;
}) {
  return (
    <section
      className={`mx-auto max-w-[1150px] px-4 ${topPadding ? "pt-6" : ""}`}>
      {title ? (
        <div className="text-gray-600 text-[12px] font-semibold tracking-[0.15em] mb-3">
          {title}
        </div>
      ) : null}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
        {tiles.map((t) => (
          <TileButton key={t.label} tile={t} />
        ))}
      </div>
    </section>
  );
}
