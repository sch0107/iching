import { useState } from "react";
import { useTranslation } from "react-i18next";

// Non-translatable sign metadata (color, fortune stars)
const SIGNS_META = [
  { color:"#c8a84b", fortune:5 },  // 大安
  { color:"#8ab4d4", fortune:2 },  // 留连
  { color:"#e8c84b", fortune:4 },  // 速喜
  { color:"#c85a3c", fortune:1 },  // 赤口
  { color:"#8ac87a", fortune:3 },  // 小吉
  { color:"#7890a8", fortune:1 },  // 空亡
];

function getHourBranch(hour) {
  // 子: 23:00-01:00=1, 丑: 01:00-03:00=2, ... 亥: 21:00-23:00=12
  return hour === 23 ? 1 : Math.floor(hour / 2) + 1;
}

function calculate(useUtc8) {
  let now = new Date();
  if (useUtc8) {
    const utc8Offset  = 8 * 60;
    const localOffset = now.getTimezoneOffset();
    now = new Date(now.getTime() + (utc8Offset + localOffset) * 60000);
  }
  const month  = now.getMonth() + 1;
  const day    = now.getDate();
  const branch = getHourBranch(now.getHours());
  const index  = ((month - 1) + (day - 1) + (branch - 1)) % 6;
  return { month, day, branch, index };
}

export default function XiaoLiuRen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [question, setQuestion] = useState("");
  const [reading,  setReading]  = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [divining, setDivining] = useState(false);
  const [useUtc8,  setUseUtc8]  = useState(true);

  const divine = () => {
    setDivining(true);
    setCopied(false);
    setTimeout(() => {
      setReading(calculate(useUtc8));
      setDivining(false);
    }, 800);
  };

  const reset = () => { setReading(null); setCopied(false); };

  const buildSummary = () => {
    if (!reading) return "";
    const name     = t(`xlr.signs.${reading.index}.name`);
    const keywords = t(`xlr.signs.${reading.index}.keywords`);
    const desc     = t(`xlr.signs.${reading.index}.desc`);
    const locale   = lang === "en" ? undefined : lang === "zh-Hant" ? "zh-TW" : "zh-CN";
    let out = t("xlr.summaryHeader") + "\n";
    out += t("xlr.summaryTime") + new Date().toLocaleString(locale) + "\n";
    if (question) out += t("xlr.summaryQ") + question + "\n";
    out += "\n" + t("xlr.summarySign") + name + "（" + keywords + "）\n";
    out += t("xlr.summaryDesc") + desc + "\n";
    out += "\n---\n" + t("xlr.footer");
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const tzBtnStyle = (active) => ({
    cursor:"pointer", padding:"3px 10px", fontSize:10, letterSpacing:1,
    fontFamily:"inherit", transition:"all 0.2s",
    background: active ? "rgba(200,168,75,0.18)" : "none",
    border: `1px solid ${active ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.2)"}`,
    color: active ? "#f5e09a" : "rgba(200,168,75,0.45)",
  });

  const btnStyle = (active) => ({
    display:"flex", alignItems:"center", gap:8, cursor:"pointer",
    background: active ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.07)",
    border: `1px solid ${active ? "rgba(200,168,75,0.6)" : "rgba(200,168,75,0.3)"}`,
    color: active ? "#f5e09a" : "#d4b86a", padding:"11px 24px",
    fontSize:13, letterSpacing:3, fontFamily:"inherit", transition:"all 0.2s",
  });

  const done = reading !== null;
  const resultMeta = done ? SIGNS_META[reading.index] : null;

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center",
      padding:"40px 20px 80px", minHeight:"calc(100vh - 48px)"}}>

      {/* Title */}
      <div style={{textAlign:"center", marginBottom:36}}>
        <div style={{fontSize:10, letterSpacing:8, color:"#c8a84b", opacity:0.6, marginBottom:10}}>
          {t("xlr.subtitle")}
        </div>
        <h1 style={{margin:0, fontSize:36, fontWeight:900, letterSpacing:12,
          background:"linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
          {t("xlr.title")}
        </h1>
        <div style={{width:80, height:1,
          background:"linear-gradient(90deg,transparent,#c8a84b,transparent)", margin:"12px auto 0"}}/>
      </div>

      {/* Timezone selector */}
      {!done && (
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:24,
          fontSize:10, color:"rgba(200,168,75,0.5)", letterSpacing:2}}>
          <span>{t("xlr.tzLabel")}：</span>
          <button style={tzBtnStyle(useUtc8)}  onClick={() => setUseUtc8(true)}>
            {t("xlr.tzUtc8")}
          </button>
          <button style={tzBtnStyle(!useUtc8)} onClick={() => setUseUtc8(false)}>
            {t("xlr.tzLocal")}
          </button>
        </div>
      )}

      {/* Question input */}
      {!done && (
        <div style={{width:"100%", maxWidth:460, marginBottom:36, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:5, color:"rgba(200,168,75,0.55)", marginBottom:10}}>
            {t("xlr.questionLabel")}
          </div>
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder={t("xlr.questionPlaceholder")} rows={2}
            style={{width:"100%", background:"rgba(200,168,75,0.04)",
              border:"1px solid rgba(200,168,75,0.2)", color:"#e8d5a0",
              padding:"12px 16px", fontSize:14, lineHeight:1.9,
              fontFamily:"inherit", resize:"vertical", transition:"border 0.2s"}}
          />
        </div>
      )}

      {/* Question display after divination */}
      {done && question && (
        <div style={{marginBottom:24, maxWidth:500, width:"100%",
          borderLeft:"2px solid rgba(200,168,75,0.35)", paddingLeft:16, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:4, color:"rgba(200,168,75,0.5)", marginBottom:4}}>
            {t("xlr.questionDisplay")}
          </div>
          <div style={{fontSize:14, color:"#e8d5a0", lineHeight:1.9}}>{question}</div>
        </div>
      )}

      {/* Divine button */}
      {!done && (
        <button className="cast-btn" onClick={divine} disabled={divining} style={{
          background:"none", border:"1px solid #c8a84b", color:"#f5e09a",
          padding:"14px 44px", fontSize:17, letterSpacing:6,
          cursor: divining ? "not-allowed" : "pointer", fontFamily:"inherit",
          opacity: divining ? 0.6 : 1,
          boxShadow:"0 0 24px rgba(200,168,75,0.15)", transition:"all 0.2s"}}>
          {divining ? t("xlr.divining") : t("xlr.button")}
        </button>
      )}

      {/* Time used */}
      {done && (
        <div style={{marginBottom:28, fontSize:11, color:"rgba(200,168,75,0.45)",
          letterSpacing:3, animation:"fi 0.4s ease", textAlign:"center"}}>
          {t("xlr.timeUsed")}：{t("xlr.monthLabel")}{reading.month} · {t("xlr.dayLabel")}{reading.day} · {t(`branches.${reading.branch - 1}`)}{lang !== "en" ? t("xlr.hourLabel") : ""}
        </div>
      )}

      {/* Six signs row */}
      {done && (
        <div className="sign-row" style={{display:"flex", gap:10, marginBottom:32,
          justifyContent:"center", animation:"fi 0.5s ease", flexWrap:"wrap", maxWidth:640}}>
          {SIGNS_META.map((meta, i) => {
            const isResult = i === reading.index;
            return (
              <div key={i} className="sign-card" style={{
                flex:"1 1 80px", minWidth:88, padding:"14px 10px",
                border: `1px solid ${isResult ? meta.color : "rgba(200,168,75,0.12)"}`,
                background: isResult ? `${meta.color}18` : "rgba(200,168,75,0.02)",
                textAlign:"center", transition:"all 0.3s",
                boxShadow: isResult ? `0 0 16px ${meta.color}33` : "none",
                position:"relative",
              }}>
                {isResult && (
                  <div style={{position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)",
                    fontSize:9, letterSpacing:2, color:meta.color, background:"#150f05",
                    padding:"0 6px", whiteSpace:"nowrap"}}>
                    ▼ {t("xlr.resultMark")}
                  </div>
                )}
                <div style={{fontSize: isResult ? 20 : 16, fontWeight:700,
                  color: isResult ? meta.color : "rgba(200,168,75,0.4)", marginBottom:4}}>
                  {t(`xlr.signs.${i}.name`)}
                </div>
                <div style={{display:"flex", justifyContent:"center", gap:2}}>
                  {Array.from({length:5}).map((_,s) => (
                    <span key={s} style={{fontSize:6,
                      color: s < meta.fortune ? meta.color : "rgba(200,168,75,0.15)"}}>●</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Result detail */}
      {done && resultMeta && (
        <div style={{maxWidth:500, width:"100%", animation:"fi 0.6s ease",
          border:`1px solid ${resultMeta.color}44`,
          background:`${resultMeta.color}0a`, padding:"24px 28px", marginBottom:24}}>
          <div style={{fontSize:10, letterSpacing:5, color:resultMeta.color, marginBottom:16}}>
            {t("xlr.resultTitle")}
          </div>
          <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:12}}>
            <span style={{fontSize:32, fontWeight:900, color:resultMeta.color}}>
              {t(`xlr.signs.${reading.index}.name`)}
            </span>
            <span style={{fontSize:11, color:"rgba(200,168,75,0.5)", letterSpacing:2}}>
              {t(`xlr.signs.${reading.index}.keywords`)}
            </span>
          </div>
          <div style={{width:"100%", height:1, background:`${resultMeta.color}30`, marginBottom:16}}/>
          <div style={{fontSize:13, color:"rgba(200,168,75,0.75)", lineHeight:2.2, letterSpacing:1}}>
            {t(`xlr.signs.${reading.index}.desc`)}
          </div>
        </div>
      )}

      {/* Actions */}
      {done && (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center",
          gap:12, animation:"fi 0.7s ease"}}>
          <div style={{display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center"}}>
            <button className="action-btn" onClick={handleCopy} style={btnStyle(copied)}>
              <span>{copied ? "✓" : "⎘"}</span>
              <span>{copied ? t("xlr.copied") : t("xlr.copy")}</span>
            </button>
            <button className="action-btn" onClick={divine} style={btnStyle(false)}>
              <span>↺</span>
              <span>{t("xlr.again")}</span>
            </button>
          </div>
          <button className="reset-btn" onClick={reset} style={{
            background:"none", border:"none",
            color:"rgba(200,168,75,0.35)", fontSize:11, letterSpacing:5,
            cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s"}}>
            {t("xlr.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
