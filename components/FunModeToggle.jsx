import { useTranslation } from "react-i18next";

export default function FunModeToggle({ enabled, onChange }) {
  const { t } = useTranslation();

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
      <span style={{fontSize:12,letterSpacing:3,color:"rgba(200,168,75,0.6)"}}>
        {t("funMode.label")}
      </span>
      <button
        onClick={()=>onChange(!enabled)}
        style={{
          position:"relative",
          width:64,
          height:28,
          background:enabled?"rgba(200,168,75,0.25)":"rgba(200,168,75,0.08)",
          border:`1px solid ${enabled?"rgba(200,168,75,0.6)":"rgba(200,168,75,0.3)"}`,
          borderRadius:14,
          cursor:"pointer",
          fontFamily:"inherit",
          transition:"all 0.2s",
          padding:0,
        }}
      >
        <div
          style={{
            position:"absolute",
            top:2,
            left:enabled?"auto":2,
            right:enabled?2:"auto",
            width:22,
            height:22,
            background:enabled?"#f5e09a":"rgba(200,168,75,0.5)",
            borderRadius:11,
            transition:"all 0.2s",
            boxShadow:enabled?"0 0 8px rgba(200,168,75,0.4)":"none",
          }}
        />
      </button>
    </div>
  );
}
