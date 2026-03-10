import { useState } from "react";
import { useTranslation } from "react-i18next";

// Earlier Heaven (先天八卦) trigram numbers → binary key (top→bottom)
// 1=乾, 2=兑, 3=离, 4=震, 5=巽, 6=坎, 7=艮, 8=坤
const EARLIER_HEAVEN = {
  1:"111", 2:"011", 3:"101", 4:"001",
  5:"110", 6:"010", 7:"100", 8:"000",
};

// Reverse trigram key to get the line values (bottom-up) portion of hexagram key
function triToHexPart(triKey) {
  return triKey.split("").reverse().join("");
}

function getHourBranch(hour) {
  return hour === 23 ? 1 : Math.floor(hour / 2) + 1;
}

// HEXAGRAM_DB: num lookup only (text comes from locale)
const HEXAGRAM_DB = {
  "111111":1,  "000000":2,  "100010":3,  "010001":4,
  "111010":5,  "010111":6,  "010000":7,  "000010":8,
  "111011":9,  "110111":10, "111000":11, "000111":12,
  "101111":13, "111101":14, "001000":15, "000100":16,
  "100110":17, "011001":18, "110000":19, "000011":20,
  "100101":21, "101001":22, "000001":23, "100000":24,
  "100111":25, "111001":26, "100001":27, "011110":28,
  "010010":29, "101101":30, "001110":31, "011100":32,
  "001111":33, "111100":34, "000101":35, "101000":36,
  "101011":37, "110101":38, "001010":39, "010100":40,
  "110001":41, "100011":42, "111110":43, "011111":44,
  "000110":45, "011000":46, "010110":47, "011010":48,
  "101110":49, "011101":50, "100100":51, "001001":52,
  "001011":53, "110100":54, "101100":55, "001101":56,
  "011011":57, "110110":58, "010011":59, "110010":60,
  "110011":61, "001100":62, "101010":63, "010101":64,
};

function getHexKey(arr) {
  const key = arr.join("");
  return HEXAGRAM_DB[key] ? key : "unknown";
}

// Good hexagrams for fun mode (favorable outcomes)
const GOOD_HEXAGRAMS = [1, 11, 14, 43, 52, 58, 11, 42, 5, 8, 10, 25, 17, 3, 44, 22];

function drawFunModeHex() {
  const targetNum = GOOD_HEXAGRAMS[Math.floor(Math.random() * GOOD_HEXAGRAMS.length)];
  return Object.keys(HEXAGRAM_DB).find(k => HEXAGRAM_DB[k] === targetNum) || "111111";
}

function calculate(useUtc8, funMode) {
  let now = new Date();
  if (useUtc8) {
    const utc8Offset  = 8 * 60;
    const localOffset = now.getTimezoneOffset();
    now = new Date(now.getTime() + (utc8Offset + localOffset) * 60000);
  }
  const year   = now.getFullYear() % 100;
  const month  = now.getMonth() + 1;
  const day    = now.getDate();
  const hour   = getHourBranch(now.getHours()); // 1-12

  const upperNum = ((year + month + day) % 8)           || 8;
  const lowerNum = ((year + month + day + hour) % 8)    || 8;
  const lineNum  = ((year + month + day + hour) % 6)    || 6;

  const upperTriKey = EARLIER_HEAVEN[upperNum];
  const lowerTriKey = EARLIER_HEAVEN[lowerNum];

  let hexArr, hexKey, derivedArr, derivedKey, bodyTriKey, useTriKey, lineNumForDisplay;

  if (funMode) {
    // Use pre-selected good hexagram
    const goodHexKey = drawFunModeHex();
    hexArr = goodHexKey.split("").map(Number);
    hexKey = goodHexKey;
    // Still compute derived by flipping a random line
    lineNumForDisplay = Math.floor(Math.random() * 6) + 1;
    derivedArr = [...hexArr];
    derivedArr[lineNumForDisplay - 1] = 1 - derivedArr[lineNumForDisplay - 1];
    derivedKey = getHexKey(derivedArr);
    // For fun mode, determine body/use based on line position
    bodyTriKey = lineNumForDisplay <= 3 ? upperTriKey : lowerTriKey;
    useTriKey = lineNumForDisplay <= 3 ? lowerTriKey : upperTriKey;
  } else {
    // Normal calculation
    lineNumForDisplay = lineNum;
    // Hexagram key: lower lines 0-2 then upper lines 3-5 (each reversed from trigram key)
    hexArr = triToHexPart(lowerTriKey).split("").map(Number)
      .concat(triToHexPart(upperTriKey).split("").map(Number));
    hexKey = getHexKey(hexArr);

    // Derived hexagram: flip the moving line (lineNum is 1-based, index 0-based)
    derivedArr = [...hexArr];
    derivedArr[lineNum - 1] = 1 - derivedArr[lineNum - 1];
    derivedKey = getHexKey(derivedArr);

    // Body (体) and Use (用) trigrams
    // Moving line in lower (1-3) → upper is body; in upper (4-6) → lower is body
    bodyTriKey = lineNum <= 3 ? upperTriKey : lowerTriKey;
    useTriKey = lineNum <= 3 ? lowerTriKey : upperTriKey;
  }

  return {
    year, month, day, hour,
    upperNum, lowerNum,
    upperTriKey, lowerTriKey,
    bodyTriKey, useTriKey,
    hexArr, hexKey,
    derivedArr, derivedKey,
    lineNum: lineNumForDisplay,
  };
}

function LineMini({ val, color }) {
  return val === 1
    ? <div style={{width:60, height:6, background:color, borderRadius:1}}/>
    : <div style={{width:60, display:"flex", gap:4}}>
        <div style={{flex:1, height:6, background:color, borderRadius:1}}/>
        <div style={{flex:1, height:6, background:color, borderRadius:1}}/>
      </div>;
}

function HexMini({ hexArr, movingLine, accent, label, t }) {
  const hexKey = getHexKey(hexArr);
  const num    = HEXAGRAM_DB[hexArr.join("")] || "?";
  return (
    <div style={{textAlign:"center", padding:"20px 24px",
      border:`1px solid ${accent}44`, background:`${accent}08`, minWidth:160}}>
      <div style={{fontSize:9, letterSpacing:4, color:accent, marginBottom:14}}>{label}</div>
      <div style={{display:"flex", flexDirection:"column", gap:7, marginBottom:12}}>
        {[...hexArr].reverse().map((v, i) => {
          const lineIdx = hexArr.length - 1 - i; // 0-based from bottom
          const isMoving = movingLine !== undefined && lineIdx === movingLine - 1;
          const col = isMoving ? "#e8a04b" : accent + "99";
          return (
            <div key={i} style={{display:"flex", alignItems:"center", gap:8, justifyContent:"center"}}>
              {isMoving && <span style={{fontSize:8, color:"#e8a04b", width:8}}>◎</span>}
              {!isMoving && <span style={{width:8}}/>}
              <LineMini val={v} color={col}/>
            </div>
          );
        })}
      </div>
      <div style={{fontSize:22, fontWeight:700, color:accent, marginBottom:4}}>
        {t(`hexagrams.${hexKey}.name`)}
      </div>
      <div style={{fontSize:10, letterSpacing:1, color:`${accent}99`}}>
        {t("card.hexNum", {num})} · {t(`hexagrams.${hexKey}.title`)}
      </div>
      <div style={{fontSize:11, color:`${accent}80`, lineHeight:1.9, marginTop:10,
        borderTop:`1px solid ${accent}22`, paddingTop:10, maxWidth:160}}>
        {t(`hexagrams.${hexKey}.judgment`)}
      </div>
    </div>
  );
}

export default function MeiHua() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [question, setQuestion] = useState("");
  const [result,   setResult]   = useState(null);
  const [casting,  setCasting]  = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [useUtc8,  setUseUtc8]  = useState(true);
  const [funMode,  setFunMode]   = useState(false);

  const cast = () => {
    setCasting(true); setCopied(false);
    setTimeout(() => {
      setResult(calculate(useUtc8, funMode));
      setCasting(false);
    }, 800);
  };

  const reset = () => { setResult(null); setCopied(false); };

  const triName = (key) => {
    const name   = t(`trigrams.${key}.name`);
    const nature = t(`trigrams.${key}.nature`);
    return lang === "en" ? name : `${name}（${nature}）`;
  };

  const buildSummary = () => {
    if (!result) return "";
    const locale = lang === "en" ? undefined : lang === "zh-Hant" ? "zh-TW" : "zh-CN";
    let out = t("mhy.summaryHeader") + "\n";
    out += t("mhy.summaryTime") + new Date().toLocaleString(locale) + "\n";
    if (question) out += t("mhy.summaryQ") + question + "\n";
    out += t("mhy.summaryMethod") + "\n";
    out += "\n" + t("mhy.summaryUpper") + triName(result.upperTriKey) + `（${result.upperNum}）\n`;
    out += t("mhy.summaryLower") + triName(result.lowerTriKey) + `（${result.lowerNum}）\n`;
    out += t("mhy.summaryLine") + result.lineNum + "\n";
    out += "\n" + t("mhy.summaryHex")
      + t(`hexagrams.${result.hexKey}.title`)
      + `（${t("card.hexNum", {num: HEXAGRAM_DB[result.hexArr.join("")] || "?"})}）\n`;
    out += t("summary.judgment") + t(`hexagrams.${result.hexKey}.judgment`) + "\n";
    out += "\n" + t("mhy.summaryDerived")
      + t(`hexagrams.${result.derivedKey}.title`)
      + `（${t("card.hexNum", {num: HEXAGRAM_DB[result.derivedArr.join("")] || "?"})}）\n`;
    out += t("summary.judgment") + t(`hexagrams.${result.derivedKey}.judgment`) + "\n";
    out += "\n---\n" + t("mhy.footer");
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

  const done = result !== null && !casting;

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center",
      padding:"40px 20px 80px", minHeight:"calc(100vh - 48px)"}}>

      {/* Title */}
      <div style={{textAlign:"center", marginBottom:36}}>
        <div style={{fontSize:10, letterSpacing:8, color:"#c8a84b", opacity:0.6, marginBottom:10}}>
          {t("mhy.subtitle")}
        </div>
        <h1 style={{margin:0, fontSize:36, fontWeight:900, letterSpacing:12,
          background:"linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
          {t("mhy.title")}
        </h1>
        <div style={{width:80, height:1,
          background:"linear-gradient(90deg,transparent,#c8a84b,transparent)", margin:"12px auto 0"}}/>
      </div>

      {/* Timezone selector */}
      {!done && (
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:20,
          fontSize:10, color:"rgba(200,168,75,0.5)", letterSpacing:2}}>
          <span>{t("mhy.tzLabel")}：</span>
          <button style={tzBtnStyle(useUtc8)}  onClick={() => setUseUtc8(true)}>
            {t("mhy.tzUtc8")}
          </button>
          <button style={tzBtnStyle(!useUtc8)} onClick={() => setUseUtc8(false)}>
            {t("mhy.tzLocal")}
          </button>
        </div>
      )}

      {/* Fun mode toggle */}
      {!done && (
        <div style={{marginBottom:16,animation:"fi 0.5s ease"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:12,letterSpacing:3,color:"rgba(200,168,75,0.6)"}}>
              {t("funMode.label")}
            </span>
            <button onClick={()=>setFunMode(!funMode)} style={{
              background:funMode?"rgba(200,168,75,0.2)":"none",
              border:"1px solid rgba(200,168,75,0.3)",
              color:funMode?"#f5e09a":"rgba(200,168,75,0.5)",
              padding:"6px 16px",fontSize:11,letterSpacing:2,
              cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",borderRadius:4,
            }}>
              {funMode?t("funMode.on"):t("funMode.off")}
            </button>
          </div>
        </div>
      )}

      {/* Question input */}
      {!done && (
        <div style={{width:"100%", maxWidth:460, marginBottom:36, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:5, color:"rgba(200,168,75,0.55)", marginBottom:10}}>
            {t("mhy.questionLabel")}
          </div>
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder={t("mhy.questionPlaceholder")} rows={2}
            style={{width:"100%", background:"rgba(200,168,75,0.04)",
              border:"1px solid rgba(200,168,75,0.2)", color:"#e8d5a0",
              padding:"12px 16px", fontSize:14, lineHeight:1.9,
              fontFamily:"inherit", resize:"vertical", transition:"border 0.2s"}}
          />
        </div>
      )}

      {/* Question display */}
      {done && question && (
        <div style={{marginBottom:24, maxWidth:500, width:"100%",
          borderLeft:"2px solid rgba(200,168,75,0.35)", paddingLeft:16, animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10, letterSpacing:4, color:"rgba(200,168,75,0.5)", marginBottom:4}}>
            {t("mhy.questionDisplay")}
          </div>
          <div style={{fontSize:14, color:"#e8d5a0", lineHeight:1.9}}>{question}</div>
        </div>
      )}

      {/* Cast button */}
      {!done && (
        <button className="cast-btn" onClick={cast} disabled={casting} style={{
          background:"none", border:"1px solid #c8a84b", color:"#f5e09a",
          padding:"14px 44px", fontSize:17, letterSpacing:6,
          cursor: casting ? "not-allowed" : "pointer", fontFamily:"inherit",
          opacity: casting ? 0.6 : 1,
          boxShadow:"0 0 24px rgba(200,168,75,0.15)", transition:"all 0.2s"}}>
          {casting ? t("mhy.divining") : t("mhy.button")}
        </button>
      )}

      {/* Calculation breakdown */}
      {done && result && (
        <div style={{maxWidth:520, width:"100%", marginBottom:28, animation:"fi 0.5s ease",
          border:"1px solid rgba(200,168,75,0.15)", background:"rgba(200,168,75,0.03)",
          padding:"18px 24px"}}>
          <div style={{fontSize:9, letterSpacing:5, color:"rgba(200,168,75,0.45)", marginBottom:14}}>
            {t("mhy.numbersTitle")} · {t("mhy.method")}
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px 20px",
            fontSize:11, color:"rgba(200,168,75,0.65)"}}>
            {[
              [t("mhy.yearNum"),   result.year],
              [t("mhy.monthNum"),  result.month],
              [t("mhy.dayNum"),    result.day],
              [t("mhy.hourNum"),   result.hour],
              [t("mhy.upperNum"),  `${result.upperNum} → ${triName(result.upperTriKey)}`],
              [t("mhy.lowerNum"),  `${result.lowerNum} → ${triName(result.lowerTriKey)}`],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{fontSize:9, color:"rgba(200,168,75,0.35)", marginBottom:2}}>{label}</div>
                <div style={{letterSpacing:1}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:14, paddingTop:12, borderTop:"1px solid rgba(200,168,75,0.1)",
            display:"flex", gap:24, fontSize:11, color:"rgba(200,168,75,0.65)"}}>
            <div>
              <div style={{fontSize:9, color:"rgba(200,168,75,0.35)", marginBottom:2}}>{t("mhy.movingLine")}</div>
              <div style={{color:"#e8a04b", letterSpacing:1}}>
                {t("mhy.lineLabel", {n: result.lineNum})}
              </div>
            </div>
            <div>
              <div style={{fontSize:9, color:"rgba(200,168,75,0.35)", marginBottom:2}}>{t("mhy.bodyTri")}</div>
              <div>{triName(result.bodyTriKey)}</div>
            </div>
            <div>
              <div style={{fontSize:9, color:"rgba(200,168,75,0.35)", marginBottom:2}}>{t("mhy.useTri")}</div>
              <div>{triName(result.useTriKey)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Hexagram cards */}
      {done && result && (
        <div className="hex-row" style={{display:"flex", gap:24, flexWrap:"wrap",
          justifyContent:"center", animation:"fi 0.6s ease", marginBottom:28}}>
          <div className="hex-card">
            <HexMini
              hexArr={result.hexArr}
              movingLine={result.lineNum}
              accent="#c8a84b"
              label={t("mhy.hexTitle")}
              t={t}
            />
          </div>
          <div className="hex-arrow"
            style={{display:"flex", alignItems:"center", fontSize:24, color:"rgba(200,168,75,0.4)"}}>→</div>
          <div className="hex-card">
            <HexMini
              hexArr={result.derivedArr}
              accent="#8ab4d4"
              label={t("mhy.derivedTitle")}
              t={t}
            />
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
              <span>{copied ? t("mhy.copied") : t("mhy.copy")}</span>
            </button>
            <button className="action-btn" onClick={cast} style={btnStyle(false)}>
              <span>↺</span>
              <span>{t("mhy.again")}</span>
            </button>
          </div>
          <button className="reset-btn" onClick={reset} style={{
            background:"none", border:"none",
            color:"rgba(200,168,75,0.35)", fontSize:11, letterSpacing:5,
            cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s"}}>
            {t("mhy.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
