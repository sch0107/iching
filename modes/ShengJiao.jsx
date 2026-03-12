import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n.js";
import FunModeToggle from "../components/FunModeToggle.jsx";

export default function ShengJiao() {
  const { t }  = useTranslation();
  const lang   = i18n.language;

  const [question,  setQuestion]  = useState("");
  const [result,    setResult]    = useState(null);   // null | "sheng" | "xiao" | "yin"
  const [isFlipping,setIsFlipping]= useState(false);
  const [flipKey,   setFlipKey]   = useState(0);
  const [copied,    setCopied]    = useState(false);
  const [funMode,   setFunMode]   = useState(false);

  const toss = () => {
    if (isFlipping) return;
    let r;
    if (funMode) {
      r = "sheng";
    } else {
      const rand = Math.random();
      // Realistic probability: sheng ~50%, xiao ~25%, yin ~25%
      if (rand < 0.5) r = "sheng";
      else if (rand < 0.75) r = "xiao";
      else r = "yin";
    }
    setResult(r);
    setFlipKey(k => k + 1);
    setIsFlipping(true);
    setCopied(false);
    setTimeout(() => setIsFlipping(false), 1550);
  };

  const reset = () => { setResult(null); setIsFlipping(false); setCopied(false); };

  const buildSummary = () => {
    const nameMap = { sheng: t("shengjiao.shengName"), xiao: t("shengjiao.xiaoName"), yin: t("shengjiao.yinName") };
    const subMap = { sheng: t("shengjiao.shengSub"), xiao: t("shengjiao.xiaoSub"), yin: t("shengjiao.yinSub") };
    const msgMap = { sheng: t("shengjiao.shengMsg"), xiao: t("shengjiao.xiaoMsg"), yin: t("shengjiao.yinMsg") };
    const name = nameMap[result];
    const sub = subMap[result];
    const msg = msgMap[result];
    let out = t("shengjiao.summaryHeader") + "\n";
    out += t("shengjiao.summaryTime") + new Date().toLocaleString(
      lang==="en" ? undefined : lang==="zh-Hant" ? "zh-TW" : "zh-CN"
    ) + "\n";
    if (question) out += t("shengjiao.summaryQ") + question + "\n";
    out += "\n" + t("shengjiao.summaryResult") + name + "（" + sub + "）\n";
    out += t("shengjiao.summaryMsg") + msg + "\n";
    out += "\n---\n" + t("shengjiao.footer");
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const done = result !== null && !isFlipping;

  const btnStyle = (active) => ({
    display:"flex", alignItems:"center", gap:8, cursor:"pointer",
    background: active ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.07)",
    border: `1px solid ${active ? "rgba(200,168,75,0.6)" : "rgba(200,168,75,0.3)"}`,
    color: active ? "#f5e09a" : "#d4b86a", padding:"11px 24px",
    fontSize:13, letterSpacing:3, fontFamily:"inherit", transition:"all 0.2s",
  });

  const isSheng = result === "sheng";
  const isXiao = result === "xiao";
  const isYin = result === "yin";

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center",
      padding:"40px 20px 80px", minHeight:"calc(100vh - 48px)"}}>

      {/* Title */}
      <div style={{textAlign:"center", marginBottom:36, animation:"fi 0.5s ease"}}>
        <div style={{fontSize:10, letterSpacing:8, color:"#c8a84b", opacity:0.6, marginBottom:10}}>
          {t("shengjiao.subtitle")}
        </div>
        <h1 style={{margin:0, fontSize:32, fontWeight:900, letterSpacing:10,
          background:"linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
          {t("shengjiao.title")}
        </h1>
        <div style={{width:80, height:1,
          background:"linear-gradient(90deg,transparent,#c8a84b,transparent)", margin:"12px auto 0"}}/>
      </div>

      {/* Fun mode toggle */}
      {!done && (
        <div style={{marginBottom:16,animation:"fi 0.5s ease"}}>
          <FunModeToggle enabled={funMode} onChange={setFunMode} />
        </div>
      )}

      {/* Question input */}
      {!done && (
        <div style={{width:"100%", maxWidth:420, marginBottom:36, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:5, color:"rgba(200,168,75,0.55)", marginBottom:10}}>
            {t("shengjiao.questionLabel")}
          </div>
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder={t("shengjiao.questionPlaceholder")} rows={2}
            style={{width:"100%", background:"rgba(200,168,75,0.04)",
              border:"1px solid rgba(200,168,75,0.2)", color:"#e8d5a0",
              padding:"12px 16px", fontSize:14, lineHeight:1.9,
              fontFamily:"inherit", resize:"vertical", transition:"border 0.2s"}}
          />
        </div>
      )}

      {/* Question display after toss */}
      {done && question && (
        <div style={{marginBottom:24, maxWidth:440, width:"100%",
          borderLeft:"2px solid rgba(200,168,75,0.35)", paddingLeft:16, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:4, color:"rgba(200,168,75,0.5)", marginBottom:4}}>
            {t("shengjiao.questionDisplay")}
          </div>
          <div style={{fontSize:14, color:"#e8d5a0", lineHeight:1.9}}>{question}</div>
        </div>
      )}

      {/* Two Moon Blocks */}
      <div style={{display:"flex", gap:32, marginBottom:40, perspective:400}}>
        {/* Block 1 */}
        <div style={{width:90, height:120, position:"relative"}}>
          <div
            key={`left-${flipKey}`}
            style={{
              width:90, height:120, position:"relative",
              animation: isFlipping ? `blockTossLeft 1.55s cubic-bezier(0.4,0,0.2,1) forwards` : "none",
            }}
          >
            {/* Crescent shape using CSS */}
            <svg viewBox="0 0 90 120" style={{width:"100%", height:"100%", filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.4))"}}>
              {/* Outer crescent shape */}
              <path d={[
                "M 45 10",
                "C 75 10, 90 35, 90 60",
                "C 90 85, 75 110, 45 110",
                "C 55 90, 55 30, 45 10",
                "Z"
              ].join(" ")}
                fill={
                  done && !isXiao
                    ? (isSheng ? "#c8a84b" : "#5a8aaa")
                    : "#8a6a3a"
                }
                stroke={done && !isXiao ? "#e8d5a0" : "#c8a84b"}
                strokeWidth="2"
              />
              {/* Inner detail */}
              <path d={[
                "M 45 20",
                "C 65 20, 75 40, 75 60",
                "C 75 80, 65 100, 45 100",
                "C 50 85, 50 35, 45 20",
                "Z"
              ].join(" ")}
                fill={
                  done
                    ? (isSheng ? "rgba(245,224,154,0.3)" : isXiao ? "rgba(138,106,58,0.2)" : "rgba(90,138,170,0.3)")
                    : "rgba(138,106,58,0.3)"
                }
              />
            </svg>
          </div>
        </div>

        {/* Block 2 */}
        <div style={{width:90, height:120, position:"relative"}}>
          <div
            key={`right-${flipKey}`}
            style={{
              width:90, height:120, position:"relative",
              animation: isFlipping ? `blockTossRight 1.55s cubic-bezier(0.4,0,0.2,1) forwards` : "none",
            }}
          >
            <svg viewBox="0 0 90 120" style={{width:"100%", height:"100%", filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.4))"}}>
              <path d={[
                "M 45 10",
                "C 75 10, 90 35, 90 60",
                "C 90 85, 75 110, 45 110",
                "C 55 90, 55 30, 45 10",
                "Z"
              ].join(" ")}
                fill={
                  done
                    ? (isSheng ? "#5a8aaa" : isXiao ? "#c8a84b" : "#5a8aaa")
                    : "#8a6a3a"
                }
                stroke={done ? (isXiao ? "#e8d5a0" : "#b8d4e8") : "#c8a84b"}
                strokeWidth="2"
              />
              <path d={[
                "M 45 20",
                "C 65 20, 75 40, 75 60",
                "C 75 80, 65 100, 45 100",
                "C 50 85, 50 35, 45 20",
                "Z"
              ].join(" ")}
                fill={
                  done
                    ? (isSheng ? "rgba(90,138,170,0.3)" : isXiao ? "rgba(245,224,154,0.3)" : "rgba(90,138,170,0.3)")
                    : "rgba(138,106,58,0.3)"
                }
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Toss button */}
      {!done && (
        <button className="cast-btn" onClick={toss} disabled={isFlipping} style={{
          background:"none", border:"1px solid #c8a84b", color:"#f5e09a",
          padding:"14px 44px", fontSize:17, letterSpacing:6,
          cursor: isFlipping ? "not-allowed" : "pointer",
          fontFamily:"inherit", opacity: isFlipping ? 0.6 : 1,
          boxShadow:"0 0 24px rgba(200,168,75,0.15)", transition:"all 0.2s"}}>
          {isFlipping ? t("shengjiao.tossing") : t("shengjiao.button")}
        </button>
      )}

      {/* Result */}
      {done && (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center",
          gap:16, animation:"fi 0.6s ease", width:"100%", maxWidth:440}}>

          <div style={{textAlign:"center"}}>
            <div style={{fontSize:28, fontWeight:700, letterSpacing:4,
              color: isSheng ? "#f5e09a" : isXiao ? "#c8a84b" : "#8ab4d4", marginBottom:6}}>
              {isSheng ? t("shengjiao.shengSub") : isXiao ? t("shengjiao.xiaoSub") : t("shengjiao.yinSub")}
            </div>
            <div style={{fontSize:13, color:"rgba(200,168,75,0.65)", lineHeight:1.9,
              maxWidth:360, textAlign:"center", letterSpacing:1}}>
              {isSheng ? t("shengjiao.shengMsg") : isXiao ? t("shengjiao.xiaoMsg") : t("shengjiao.yinMsg")}
            </div>
          </div>

          {/* Actions */}
          <div style={{display:"flex", gap:12, marginTop:8, flexWrap:"wrap", justifyContent:"center"}}>
            <button className="action-btn" onClick={handleCopy} style={btnStyle(copied)}>
              <span>{copied ? "✓" : "⎘"}</span>
              <span>{copied ? t("shengjiao.copied") : t("shengjiao.copy")}</span>
            </button>
            <button className="action-btn" onClick={toss} style={btnStyle(false)}>
              <span>↺</span>
              <span>{t("shengjiao.again")}</span>
            </button>
          </div>

          <button className="reset-btn" onClick={reset} style={{
            background:"none", border:"none",
            color:"rgba(200,168,75,0.35)", fontSize:11, letterSpacing:5,
            cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s"}}>
            {t("shengjiao.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
