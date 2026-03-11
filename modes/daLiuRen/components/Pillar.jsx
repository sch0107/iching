import { GOLD } from '../data.js';

export function Pillar({ label, stem, branch }) {
  return (
    <div style={{ padding: "0 10px" }}>
      <div style={{ fontSize: 10, color: "rgba(200,168,75,0.4)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        display: "flex", gap: 8, alignItems: "center",
        padding: "8px 12px", background: "rgba(200,168,75,0.03)",
        border: "1px solid rgba(200,168,75,0.15)", borderRadius: 4
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#f5e09a", minWidth: 32 }}>
            {stem}
          </div>
          <div style={{ fontSize: 13, color: GOLD + "0.6)", textAlign: "center", minWidth: 24 }}>
            {branch}
          </div>
        </div>
      </div>
    </div>
  );
}
