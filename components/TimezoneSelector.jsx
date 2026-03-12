import { useTranslation } from "react-i18next";

export default function TimezoneSelector({ useUtc8, onChange }) {
  const { t } = useTranslation();

  const btnStyle = (active) => ({
    cursor:"pointer", padding:"3px 10px", fontSize:10, letterSpacing:1,
    fontFamily:"inherit", transition:"all 0.2s",
    background: active ? "rgba(200,168,75,0.18)" : "none",
    border: `1px solid ${active ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.2)"}`,
    color: active ? "#f5e09a" : "rgba(200,168,75,0.45)",
  });

  return (
    <div style={{display:"flex", alignItems:"center", gap:8}}>
      <span>{t("timezone.label")}：</span>
      <button style={btnStyle(useUtc8)}  onClick={() => onChange(true)}>
        {t("timezone.utc8")}
      </button>
      <button style={btnStyle(!useUtc8)} onClick={() => onChange(false)}>
        {t("timezone.local")}
      </button>
    </div>
  );
}
