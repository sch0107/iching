import { useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n.js";
import FunModeToggle from "../components/FunModeToggle.jsx";
import ScreenshotButton from "../components/ScreenshotButton.jsx";

export default function CoinToss() {
  const { t }  = useTranslation();
  const lang   = i18n.language;
  const resultAreaRef = useRef(null);

  const [question,    setQuestion]    = useState("");
  const [result,      setResult]      = useState(null);   // null | "yang" | "yin"
  const [history,     setHistory]     = useState([]);     // array of results
  const [mode,        setMode]        = useState("single"); // "single" | "multiple" | "continuous"
  const [throwCount,  setThrowCount]  = useState(3);
  const [isFlipping,  setIsFlipping]  = useState(false);
  const [flipKey,     setFlipKey]     = useState(0);
  const [copied,      setCopied]      = useState(false);
  const [funMode,     setFunMode]     = useState(false);
  const [tossProgress,setTossProgress]= useState({ current: 0, total: 0 });

  const toss = () => {
    if (isFlipping) return;
    const r = funMode ? "yang" : (Math.random() < 0.5 ? "yang" : "yin");
    setResult(r);
    setFlipKey(k => k + 1);
    setIsFlipping(true);
    setCopied(false);
    setTimeout(() => setIsFlipping(false), 1550);
  };

  const tossMultiple = () => {
    if (isFlipping) return;
    const count = throwCount;
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(funMode ? "yang" : (Math.random() < 0.5 ? "yang" : "yin"));
    }
    setHistory(results);
    setResult(results[0]);
    setFlipKey(k => k + 1);
    setIsFlipping(true);
    setCopied(false);
    setTossProgress({ current: count, total: count });
    setTimeout(() => setIsFlipping(false), 1550);
  };

  const tossContinuous = () => {
    if (isFlipping) return;
    const r = funMode ? "yang" : (Math.random() < 0.5 ? "yang" : "yin");
    const newHistory = [...history, r];
    setHistory(newHistory);
    setResult(r);
    setFlipKey(k => k + 1);
    setIsFlipping(true);
    setCopied(false);
    setTimeout(() => setIsFlipping(false), 1550);
  };

  const handleToss = () => {
    if (mode === "multiple") {
      tossMultiple();
    } else if (mode === "continuous") {
      tossContinuous();
    } else {
      toss();
    }
  };

  const reset = () => {
    setResult(null);
    setHistory([]);
    setIsFlipping(false);
    setCopied(false);
  };

  const buildSummary = () => {
    let out = t("coin.summaryHeader") + "\n";
    out += t("coin.summaryTime") + new Date().toLocaleString(
      lang==="en" ? undefined : lang==="zh-Hant" ? "zh-TW" : "zh-CN"
    ) + "\n";
    if (question) out += t("coin.summaryQ") + question + "\n";
    out += "\n";

    if (mode === "continuous" && history.length > 0) {
      out += t("coin.historyTitle") + " (" + history.length + "):" + "\n";
      history.forEach((r, i) => {
        const name = r === "yang" ? t("coin.yangName") : t("coin.yinName");
        out += t("coin.tossNum", { num: i + 1 }) + ": " + name + "\n";
      });
      out += "\n";
    } else if (mode === "multiple" && history.length > 0) {
      out += t("coin.historyTitle") + " (" + history.length + "):" + "\n";
      const yangCount = history.filter(r => r === "yang").length;
      const yinCount = history.filter(r => r === "yin").length;
      history.forEach((r, i) => {
        const name = r === "yang" ? t("coin.yangName") : t("coin.yinName");
        out += t("coin.tossNum", { num: i + 1 }) + ": " + name + "\n";
      });
      out += "---\n";
      out += t("coin.yangName") + ": " + yangCount + " | " + t("coin.yinName") + ": " + yinCount + "\n";
      out += "\n";
    }

    if (result !== null) {
      const name = result === "yang" ? t("coin.yangName") : t("coin.yinName");
      const msg  = result === "yang" ? t("coin.yangMsg")  : t("coin.yinMsg");
      out += t("coin.summaryResult") + name + "\n";
      out += t("coin.summaryMsg") + msg + "\n";
    }
    out += "\n---\n" + t("coin.footer");
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const done = result !== null && !isFlipping;
  const isYang = result === "yang";

  const coinFaceStyle = (isFront) => ({
    position: "absolute", inset: 0, borderRadius: "50%",
    backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    transform: isFront ? "none" : "rotateY(180deg)",
    background: isFront
      ? "radial-gradient(circle at 38% 35%, #f5e09a, #c8a84b 55%, #9a6828)"
      : "radial-gradient(circle at 38% 35%, #b8d4e8, #5a8aaa 55%, #2a5070)",
    boxShadow: isFront
      ? "inset 0 2px 8px rgba(255,240,160,0.4), inset 0 -3px 8px rgba(100,60,0,0.3), 0 4px 20px rgba(200,168,75,0.4)"
      : "inset 0 2px 8px rgba(160,200,240,0.4), inset 0 -3px 8px rgba(20,60,100,0.3), 0 4px 20px rgba(100,160,200,0.3)",
  });

  const btnStyle = (active) => ({
    display:"flex", alignItems:"center", gap:8, cursor:"pointer",
    background: active ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.07)",
    border: `1px solid ${active ? "rgba(200,168,75,0.6)" : "rgba(200,168,75,0.3)"}`,
    color: active ? "#f5e09a" : "#d4b86a", padding:"11px 24px",
    fontSize:13, letterSpacing:3, fontFamily:"inherit", transition:"all 0.2s",
  });

  const modeBtnStyle = (active) => ({
    padding: "8px 16px",
    fontSize: 12,
    letterSpacing: 2,
    background: active ? "rgba(200,168,75,0.2)" : "transparent",
    border: `1px solid ${active ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.25)"}`,
    color: active ? "#f5e09a" : "rgba(200,168,75,0.6)",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
  });

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center",
      padding:"40px 20px 80px", minHeight:"calc(100vh - 48px)"}}>

      {/* Title */}
      <div style={{textAlign:"center", marginBottom:36, animation:"fi 0.5s ease"}}>
        <div style={{fontSize:10, letterSpacing:8, color:"#c8a84b", opacity:0.6, marginBottom:10}}>
          {t("coin.subtitle")}
        </div>
        <h1 style={{margin:0, fontSize:32, fontWeight:900, letterSpacing:10,
          background:"linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
          {t("coin.title")}
        </h1>
        <div style={{width:80, height:1,
          background:"linear-gradient(90deg,transparent,#c8a84b,transparent)", margin:"12px auto 0"}}/>
      </div>

      {/* Fun mode toggle and mode selector */}
      {!done && (
        <div style={{display:"flex", flexDirection:"column", gap:16, alignItems:"center", marginBottom:20, animation:"fi 0.5s ease"}}>
          <FunModeToggle enabled={funMode} onChange={setFunMode} />
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
            <div style={{fontSize:10, letterSpacing:4, color:"rgba(200,168,75,0.5)"}}>
              {t("coin.modeLabel")}
            </div>
            <div style={{display:"flex", gap:8}}>
              <button onClick={() => setMode("single")} style={modeBtnStyle(mode === "single")}>
                {t("coin.modeSingle")}
              </button>
              <button onClick={() => setMode("multiple")} style={modeBtnStyle(mode === "multiple")}>
                {t("coin.modeMultiple")}
              </button>
              <button onClick={() => setMode("continuous")} style={modeBtnStyle(mode === "continuous")}>
                {t("coin.modeContinuous")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Throw count input for multiple mode */}
      {mode === "multiple" && !done && (
        <div style={{width:"100%", maxWidth:320, marginBottom:24, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:4, color:"rgba(200,168,75,0.55)", marginBottom:8}}>
            {t("coin.throwCountLabel")}
          </div>
          <input type="number" min="2" max="100" value={throwCount}
            onChange={e => setThrowCount(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
            style={{width:"100%", background:"rgba(200,168,75,0.04)",
              border:"1px solid rgba(200,168,75,0.2)", color:"#e8d5a0",
              padding:"10px 16px", fontSize:14, fontFamily:"inherit",
              transition:"border 0.2s"}}
          />
        </div>
      )}

      {/* Question input */}
      {!done && (
        <div style={{width:"100%", maxWidth:420, marginBottom:36, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:5, color:"rgba(200,168,75,0.55)", marginBottom:10}}>
            {t("coin.questionLabel")}
          </div>
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder={t("coin.questionPlaceholder")} rows={2}
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
            {t("coin.questionDisplay")}
          </div>
          <div style={{fontSize:14, color:"#e8d5a0", lineHeight:1.9}}>{question}</div>
        </div>
      )}

      {/* Coin */}
      <div ref={resultAreaRef} style={{perspective:500, marginBottom:40}}>
        <div
          key={flipKey}
          style={{
            width:140, height:140, position:"relative",
            transformStyle:"preserve-3d",
            animation: isFlipping
              ? `${isYang ? "coinFlipYang" : "coinFlipYin"} 1.55s cubic-bezier(0.4,0,0.2,1) forwards`
              : "none",
            transform: !isFlipping && result !== null
              ? (isYang ? "rotateY(0deg)" : "rotateY(180deg)")
              : "rotateY(0deg)",
          }}
        >
          {/* Front face — Yang */}
          <div style={coinFaceStyle(true)}>
            <div style={{fontSize:44, lineHeight:1}}>☀</div>
            <div style={{fontSize:10, letterSpacing:3, marginTop:6, color:"rgba(100,60,0,0.7)"}}>
              {t("coin.yangName")}
            </div>
          </div>
          {/* Back face — Yin */}
          <div style={coinFaceStyle(false)}>
            <div style={{fontSize:44, lineHeight:1}}>☽</div>
            <div style={{fontSize:10, letterSpacing:3, marginTop:6, color:"rgba(160,200,240,0.8)"}}>
              {t("coin.yinName")}
            </div>
          </div>
        </div>
      </div>

      {/* Toss button */}
      {!done && (
        <button className="cast-btn" onClick={handleToss} disabled={isFlipping} style={{
          background:"none", border:"1px solid #c8a84b", color:"#f5e09a",
          padding:"14px 44px", fontSize:17, letterSpacing:6,
          cursor: isFlipping ? "not-allowed" : "pointer",
          fontFamily:"inherit", opacity: isFlipping ? 0.6 : 1,
          boxShadow:"0 0 24px rgba(200,168,75,0.15)", transition:"all 0.2s"}}>
          {isFlipping
            ? (mode === "multiple"
              ? t("coin.tossAllTossing", { current: tossProgress.current, count: tossProgress.total })
              : t("coin.tossing"))
            : (mode === "multiple"
              ? t("coin.tossAll", { count: throwCount })
              : t("coin.button"))}
        </button>
      )}

      {/* Result */}
      {done && (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center",
          gap:16, animation:"fi 0.6s ease", width:"100%", maxWidth:440}}>

          {/* Single result display */}
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:28, fontWeight:700, letterSpacing:4,
              color: isYang ? "#f5e09a" : "#8ab4d4", marginBottom:6}}>
              {isYang ? t("coin.yangSub") : t("coin.yinSub")}
            </div>
            <div style={{fontSize:13, color:"rgba(200,168,75,0.65)", lineHeight:1.9,
              maxWidth:360, textAlign:"center", letterSpacing:1}}>
              {isYang ? t("coin.yangMsg") : t("coin.yinMsg")}
            </div>
          </div>

          {/* History for multiple mode */}
          {mode === "multiple" && history.length > 0 && (
            <div style={{width:"100%", maxWidth:380, marginTop:12,
              background:"rgba(200,168,75,0.04)", borderRadius:8,
              border:"1px solid rgba(200,168,75,0.15)", padding:"16px"}}>
              <div style={{fontSize:11, letterSpacing:3, color:"rgba(200,168,75,0.6)", marginBottom:12}}>
                {t("coin.historyTitle")} ({history.length})
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center"}}>
                {history.map((r, i) => (
                  <div key={i} style={{
                    padding:"6px 12px", borderRadius:20,
                    background: r === "yang" ? "rgba(245,224,154,0.15)" : "rgba(138,180,212,0.15)",
                    border: r === "yang" ? "1px solid rgba(245,224,154,0.3)" : "1px solid rgba(138,180,212,0.3)",
                    color: r === "yang" ? "#f5e09a" : "#8ab4d4",
                    fontSize:12, letterSpacing:1
                  }}>
                    <span style={{opacity:0.5, marginRight:4}}>{i + 1}.</span>
                    {r === "yang" ? t("coin.yangName") : t("coin.yinName")}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History for continuous mode */}
          {mode === "continuous" && history.length > 1 && (
            <div style={{width:"100%", maxWidth:380, marginTop:12,
              background:"rgba(200,168,75,0.04)", borderRadius:8,
              border:"1px solid rgba(200,168,75,0.15)", padding:"16px", maxHeight:200, overflow:"auto"}}>
              <div style={{fontSize:11, letterSpacing:3, color:"rgba(200,168,75,0.6)", marginBottom:12}}>
                {t("coin.historyTitle")} ({history.length})
              </div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(60px,1fr))", gap:6}}>
                {history.slice().reverse().map((r, i) => {
                  const actualIndex = history.length - 1 - i;
                  return (
                    <div key={actualIndex} style={{
                      padding:"6px", borderRadius:8, textAlign:"center",
                      background: r === "yang" ? "rgba(245,224,154,0.15)" : "rgba(138,180,212,0.15)",
                      border: r === "yang" ? "1px solid rgba(245,224,154,0.3)" : "1px solid rgba(138,180,212,0.3)",
                      color: r === "yang" ? "#f5e09a" : "#8ab4d4",
                      fontSize:12
                    }}>
                      <div style={{fontSize:10, opacity:0.5, marginBottom:2}}>{actualIndex + 1}</div>
                      <div>{r === "yang" ? t("coin.yangName") : t("coin.yinName")}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{display:"flex", gap:12, marginTop:8, flexWrap:"wrap", justifyContent:"center"}}>
            <button className="action-btn" onClick={handleCopy} style={btnStyle(copied)}>
              <span>{copied ? "✓" : "⎘"}</span>
              <span>{copied ? t("coin.copied") : t("coin.copy")}</span>
            </button>
            <button className="action-btn" onClick={handleToss} style={btnStyle(false)}>
              <span>↺</span>
              <span>{t("coin.again")}</span>
            </button>
            <ScreenshotButton target={resultAreaRef} filename="coin" />
          </div>

          <button className="reset-btn" onClick={reset} style={{
            background:"none", border:"none",
            color:"rgba(200,168,75,0.35)", fontSize:11, letterSpacing:5,
            cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s"}}>
            {t("coin.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
