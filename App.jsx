import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n.js";
import IChing from "./iching.jsx";
import CoinToss from "./CoinToss.jsx";
import XiaoLiuRen from "./XiaoLiuRen.jsx";
import MeiHua from "./MeiHua.jsx";

const LANGS = [
  { code: "zh-Hans", label: "简" },
  { code: "zh-Hant", label: "繁" },
  { code: "en",      label: "EN" },
];
const MODES = ["iching", "coin", "xlr", "mhy"];

export default function App() {
  const { t } = useTranslation();
  const lang   = i18n.language;
  const [mode, setMode] = useState("iching");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#150f05",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #261808 0%, #150f05 65%)",
      fontFamily: "'Noto Serif SC','STSong','SimSun',serif",
      color: "#e8d5a0",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes fi    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        textarea { outline:none }
        textarea:focus { border-color:rgba(200,168,75,0.5)!important }
        textarea::placeholder { color:rgba(200,168,75,0.3) }
        .cast-btn:hover   { background:rgba(200,168,75,0.1)!important; box-shadow:0 0 32px rgba(200,168,75,0.3)!important }
        .reset-btn:hover  { color:rgba(200,168,75,0.7)!important }
        .action-btn:hover { background:rgba(200,168,75,0.18)!important }
        .action-btn:active{ transform:scale(0.97) }
        .nav-btn:hover    { color:rgba(200,168,75,0.9)!important; border-color:rgba(200,168,75,0.5)!important }
        /* coin */
        @keyframes coinFlipYang { from{transform:rotateY(0)} to{transform:rotateY(1440deg)} }
        @keyframes coinFlipYin  { from{transform:rotateY(0)} to{transform:rotateY(1620deg)} }
        /* mobile */
        @media(max-width:600px){
          .hex-row  { flex-direction:column!important; align-items:center }
          .hex-arrow{ transform:rotate(90deg) }
          .hex-card { min-width:unset!important; width:100%; max-width:320px }
          .nav-bar  { padding:0 10px!important }
          .mode-tabs{ gap:4px!important }
          .mode-tab { padding:4px 8px!important; font-size:10px!important; letter-spacing:1px!important }
          .lang-tabs{ gap:4px!important }
          .lang-tab { padding:4px 7px!important; font-size:10px!important }
          .sign-row { flex-wrap:wrap!important; gap:8px!important }
          .sign-card{ min-width:80px!important; padding:10px 8px!important }
        }
      `}</style>

      {/* ── Top nav bar ── */}
      <div className="nav-bar" style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        height:48, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px",
        background:"rgba(21,15,5,0.92)", backdropFilter:"blur(8px)",
        borderBottom:"1px solid rgba(200,168,75,0.12)",
      }}>
        {/* Mode tabs */}
        <div className="mode-tabs" style={{display:"flex", gap:6}}>
          {MODES.map(m => (
            <button key={m} className="nav-btn"
              onClick={() => setMode(m)}
              style={{
                background: mode===m ? "rgba(200,168,75,0.15)" : "none",
                border: `1px solid ${mode===m ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.18)"}`,
                color: mode===m ? "#f5e09a" : "rgba(200,168,75,0.45)",
                padding: "5px 14px", fontSize:11, letterSpacing:3,
                cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
              }}>
              {t(`nav.${m}`)}
            </button>
          ))}
        </div>

        {/* Language switcher */}
        <div className="lang-tabs" style={{display:"flex", gap:6}}>
          {LANGS.map(({ code, label }) => (
            <button key={code} className="nav-btn"
              onClick={() => i18n.changeLanguage(code)}
              style={{
                background: lang===code ? "rgba(200,168,75,0.15)" : "none",
                border: `1px solid ${lang===code ? "rgba(200,168,75,0.45)" : "rgba(200,168,75,0.15)"}`,
                color: lang===code ? "#f5e09a" : "rgba(200,168,75,0.4)",
                padding:"5px 10px", fontSize:10, letterSpacing:1,
                cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content (offset for fixed nav) ── */}
      <div style={{paddingTop:48}}>
        {mode === "iching" && <IChing />}
        {mode === "coin"   && <CoinToss />}
        {mode === "xlr"    && <XiaoLiuRen />}
        {mode === "mhy"    && <MeiHua />}
      </div>
    </div>
  );
}
