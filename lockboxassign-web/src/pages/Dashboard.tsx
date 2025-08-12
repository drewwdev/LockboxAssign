import HeaderBar from "../components/HeaderBar";
import Section from "../components/Section";
import type { Tile } from "../components/TileButton";
import { COLORS } from "../ui/colors";

const ENABLED_ROUTE = "/lockbox-assign";

const PRIMARY_TILES: Tile[] = [
  { label: "Propane", color: "#29A351" },
  { label: "Return", color: "#1CA6A6" },
  { label: "U-Box", color: "#FF6A13" },
  { label: "Sales", color: "#17A34A" },
  { label: "Dispatch", color: "#2F80ED" },
  { label: "Moving Help", color: "#FF8A33" },
];

const MGMT_TILES: Tile[] = [
  { label: "Messenger", color: "#00AEEF" },
  { label: "Product Receiving", color: "#26A69A" },
  { label: "Equipment Inventory", color: "#F2994A" },
  { label: "Storage Walk-Thru", color: "#EB5757" },
  { label: "Cycle Count", color: "#27AE60" },
  { label: "Repair", color: "#2D9CDB" },
  { label: "Facility Walk-Thru", color: "#F2C94C" },
  { label: "Installation Videos", color: "#6C63FF" },
  { label: "Transfer", color: "#2F80ED" },
  { label: "Upload Media", color: "#BDBDBD" },
  { label: "Orders", color: "#27AE60" },
  { label: "To-Do", color: "#2D9CDB" },
  { label: "Lockbox Assign", to: ENABLED_ROUTE, color: "#FF6A13" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen" style={{ background: COLORS.pageBg }}>
      <HeaderBar />
      <Section tiles={PRIMARY_TILES} />
      <Section title="MANAGEMENT" tiles={MGMT_TILES} />
      <div className="h-10" />
    </div>
  );
}
