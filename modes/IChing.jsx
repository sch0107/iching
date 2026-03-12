import { useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import FunModeToggle from "../components/FunModeToggle.jsx";
import ScreenshotButton from "../components/ScreenshotButton.jsx";

// Only num is non-translatable; name/title/judgment come from locales
const HEXAGRAM_DB = {
  "111111":{ num:1  }, "000000":{ num:2  }, "100010":{ num:3  }, "010001":{ num:4  },
  "111010":{ num:5  }, "010111":{ num:6  }, "010000":{ num:7  }, "000010":{ num:8  },
  "111011":{ num:9  }, "110111":{ num:10 }, "111000":{ num:11 }, "000111":{ num:12 },
  "101111":{ num:13 }, "111101":{ num:14 }, "001000":{ num:15 }, "000100":{ num:16 },
  "100110":{ num:17 }, "011001":{ num:18 }, "110000":{ num:19 }, "000011":{ num:20 },
  "100101":{ num:21 }, "101001":{ num:22 }, "000001":{ num:23 }, "100000":{ num:24 },
  "100111":{ num:25 }, "111001":{ num:26 }, "100001":{ num:27 }, "011110":{ num:28 },
  "010010":{ num:29 }, "101101":{ num:30 }, "001110":{ num:31 }, "011100":{ num:32 },
  "001111":{ num:33 }, "111100":{ num:34 }, "000101":{ num:35 }, "101000":{ num:36 },
  "101011":{ num:37 }, "110101":{ num:38 }, "001010":{ num:39 }, "010100":{ num:40 },
  "110001":{ num:41 }, "100011":{ num:42 }, "111110":{ num:43 }, "011111":{ num:44 },
  "000110":{ num:45 }, "011000":{ num:46 }, "010110":{ num:47 }, "011010":{ num:48 },
  "101110":{ num:49 }, "011101":{ num:50 }, "100100":{ num:51 }, "001001":{ num:52 },
  "001011":{ num:53 }, "110100":{ num:54 }, "101100":{ num:55 }, "001101":{ num:56 },
  "011011":{ num:57 }, "110110":{ num:58 }, "010011":{ num:59 }, "110010":{ num:60 },
  "110011":{ num:61 }, "001100":{ num:62 }, "101010":{ num:63 }, "010101":{ num:64 },
};

function castLine() { return [0,1,2].reduce(a => a + (Math.random()<0.5?2:3), 0); }
function lineVal(v) { return (v===7||v===9) ? 1 : 0; }

// Good hexagrams for fun mode (favorable outcomes)
const GOOD_HEXAGRAMS = [1, 11, 14, 43, 52, 58, 11, 42, 5, 8, 10, 25, 17, 3, 44, 22];

function drawFunModeHex() {
  const targetNum = GOOD_HEXAGRAMS[Math.floor(Math.random() * GOOD_HEXAGRAMS.length)];
  const targetKey = Object.keys(HEXAGRAM_DB).find(k => HEXAGRAM_DB[k].num === targetNum);
  return targetKey || "111111";
}

function getHex(arr) {
  const key   = arr.join("");
  const entry = HEXAGRAM_DB[key];
  return { num: entry ? entry.num : "?", key: entry ? key : "unknown" };
}

function upperTriKey(vals) { return [vals[5],vals[4],vals[3]].join(""); }
function lowerTriKey(vals)  { return [vals[2],vals[1],vals[0]].join(""); }

function triStr(key, lang, t) {
  const name   = t(`trigrams.${key}.name`);
  const nature = t(`trigrams.${key}.nature`);
  return lang === "en" ? name : `${name} ${nature}`;
}

function buildSummary(question, lines, lang, t) {
  const vals    = lines.map(lineVal);
  const changed = lines.map(v => v===9?0:v===6?1:lineVal(v));
  const pEntry  = getHex(vals);
  const hasChg  = lines.some(v=>v===6||v===9);
  const rEntry  = hasChg ? getHex(changed) : null;

  const hexStr = (entry) => {
    const name  = t(`hexagrams.${entry.key}.name`);
    const title = t(`hexagrams.${entry.key}.title`);
    return lang === "en"
      ? `${name} (${t("card.hexNum",{num:entry.num})} · ${title})`
      : `${title}（${t("card.hexNum",{num:entry.num})} · ${name}）`;
  };
  const yao    = v => lineVal(v)===1 ? "━━━━━" : "━━ ━━";
  const block  = ls => [...ls].reverse().map(v => "  "+yao(v)).join("\n");

  const locale = lang==="en" ? undefined : lang==="zh-Hant" ? "zh-TW" : "zh-CN";
  let out = t("summary.header") + "\n";
  out += t("summary.time") + new Date().toLocaleString(locale) + "\n";
  if (question) out += t("summary.question") + question + "\n";
  out += "\n" + t("summary.primary") + hexStr(pEntry) + "\n";
  out += block(lines) + "\n" + t("summary.judgment") + t(`hexagrams.${pEntry.key}.judgment`) + "\n";
  if (hasChg && rEntry) {
    const chgs = lines.map((v,i) => (v===6||v===9)
      ? `  ${t(`line.${i}`)}${t("changing.lineSuffix")}：${v===9?t("summary.yangChg"):t("summary.yinChg")}`
      : null).filter(Boolean);
    out += "\n" + t("summary.changing") + "\n" + chgs.join("\n") + "\n";
    out += "\n" + t("summary.derived") + hexStr(rEntry) + "\n";
    out += block(changed.map(v=>v===1?7:8)) + "\n" + t("summary.judgment") + t(`hexagrams.${rEntry.key}.judgment`) + "\n";
  }
  out += "\n---\n" + t("summary.footer");
  return out;
}

function LineDraw({ v, idx, showMark, isResult }) {
  const val      = lineVal(v);
  const changing = v===6||v===9;
  const color    = changing?(v===9?"#e8a04b":"#8ab4d4"):(isResult?"rgba(200,168,75,0.55)":"#e8d5a0");
  const glow     = changing?`0 0 10px ${v===9?"rgba(232,160,75,0.7)":"rgba(138,180,212,0.7)"}`:"none";
  const { t }    = useTranslation();
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
      <span style={{fontSize:9,color:"rgba(200,168,75,0.4)",width:18,textAlign:"right"}}>
        {t(`line.${5-idx}`)}
      </span>
      {val===1
        ? <div style={{width:80,height:8,background:color,boxShadow:glow,borderRadius:1}}/>
        : <div style={{width:80,display:"flex",gap:6}}>
            <div style={{flex:1,height:8,background:color,boxShadow:glow,borderRadius:1}}/>
            <div style={{flex:1,height:8,background:color,boxShadow:glow,borderRadius:1}}/>
          </div>
      }
      <span style={{width:16,fontSize:12,textAlign:"center",color:v===9?"#e8a04b":"#8ab4d4"}}>
        {showMark&&changing?(v===9?"○":"✕"):""}
      </span>
    </div>
  );
}

function HexCard({ label, lines, isResult }) {
  const { t, i18n } = useTranslation();
  const lang   = i18n.language;
  const vals   = lines.map(lineVal);
  const entry  = getHex(vals);
  const utKey  = upperTriKey(vals);
  const ltKey  = lowerTriKey(vals);
  const accent = isResult?"#8ab4d4":"#c8a84b";
  const border = isResult?"rgba(138,180,212,0.25)":"rgba(200,168,75,0.25)";
  return (
    <div style={{border:`1px solid ${border}`,background:"rgba(200,168,75,0.03)",
      padding:"28px 28px 24px",minWidth:200,textAlign:"center"}}>
      <div style={{fontSize:10,letterSpacing:5,color:accent,marginBottom:18}}>{label}</div>
      <div style={{fontSize:11,color:"rgba(200,168,75,0.45)",letterSpacing:2,marginBottom:4}}>
        {triStr(utKey, lang, t)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,margin:"8px 0"}}>
        {[...lines].reverse().map((v,i)=>
          <LineDraw key={i} v={v} idx={i} showMark={!isResult} isResult={isResult}/>
        )}
      </div>
      <div style={{fontSize:11,color:"rgba(200,168,75,0.45)",letterSpacing:2,marginTop:4,marginBottom:16}}>
        {triStr(ltKey, lang, t)}
      </div>
      <div style={{width:50,height:1,background:border,margin:"0 auto 14px"}}/>
      <div style={{fontSize:28,fontWeight:700,color:isResult?"#8ab4d4":"#f5e09a",marginBottom:4}}>
        {t(`hexagrams.${entry.key}.name`)}
      </div>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(200,168,75,0.6)",marginBottom:12}}>
        {t("card.hexNum",{num:entry.num})} · {t(`hexagrams.${entry.key}.title`)}
      </div>
      <div style={{fontSize:11,color:"rgba(200,168,75,0.5)",lineHeight:2,
        borderTop:"1px solid rgba(200,168,75,0.1)",paddingTop:12,maxWidth:180,margin:"0 auto"}}>
        {t(`hexagrams.${entry.key}.judgment`)}
      </div>
    </div>
  );
}

export default function IChing() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const resultAreaRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [lines,    setLines]    = useState(null);
  const [casting,  setCasting]  = useState(false);
  const [step,     setStep]     = useState(0);
  const [copied,   setCopied]   = useState(false);
  const [funMode,  setFunMode]  = useState(false);

  const cast = async () => {
    setCasting(true); setLines(null); setStep(0); setCopied(false);
    const r = [];
    if (funMode) {
      const key = drawFunModeHex();
      for (let i=0; i<6; i++) {
        setStep(i+1);
        await new Promise(res=>setTimeout(res,320));
        r.push(parseInt(key[i]));
        setLines([...r]);
      }
    } else {
      for (let i=0; i<6; i++) {
        setStep(i+1);
        await new Promise(res=>setTimeout(res,320));
        r.push(castLine());
        setLines([...r]);
      }
    }
    setCasting(false);
  };

  const reset = () => { setLines(null); setStep(0); setCopied(false); };
  const done         = lines?.length===6 && !casting;
  const hasChange    = lines?.some(v=>v===6||v===9);
  const changedLines = lines?.map(v=>v===9?8:v===6?7:v);
  const summary      = done ? buildSummary(question, lines, lang, t) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2500);
    });
  };
  const handleExport = () => {
    const blob = new Blob([summary],{type:"text/plain;charset=utf-8"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`${t("summary.filePrefix")}_${new Date().toISOString().slice(0,10)}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const actionBtnStyle = (active) => ({
    display:"flex",alignItems:"center",gap:8,cursor:"pointer",
    background:active?"rgba(200,168,75,0.18)":"rgba(200,168,75,0.07)",
    border:`1px solid ${active?"rgba(200,168,75,0.6)":"rgba(200,168,75,0.3)"}`,
    color:active?"#f5e09a":"#d4b86a",padding:"11px 24px",
    fontSize:13,letterSpacing:3,fontFamily:"inherit",transition:"all 0.2s",
  });

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",
      padding:"40px 20px 80px", minHeight:"calc(100vh - 48px)"}}>

      {/* Title */}
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:10,letterSpacing:8,color:"#c8a84b",opacity:0.6,marginBottom:10}}>
          {t("header.subtitle")}
        </div>
        <h1 style={{margin:0,fontSize:36,fontWeight:900,letterSpacing:12,
          background:"linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {t("header.title")}
        </h1>
        <div style={{width:100,height:1,
          background:"linear-gradient(90deg,transparent,#c8a84b,transparent)",margin:"14px auto 0"}}/>
      </div>

      {/* Result area - wrapped for screenshot */}
      <div ref={resultAreaRef} style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>

      {/* Fun mode toggle */}
      {!done && (
        <div style={{marginBottom:20,animation:"fi 0.5s ease"}}>
          <FunModeToggle enabled={funMode} onChange={setFunMode} />
        </div>
      )}

      {/* Question input */}
      {!done && (
        <div style={{width:"100%",maxWidth:480,marginBottom:32,animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10,letterSpacing:5,color:"rgba(200,168,75,0.55)",marginBottom:10}}>
            {t("question.label")}
          </div>
          <textarea value={question} onChange={e=>setQuestion(e.target.value)}
            placeholder={t("question.placeholder")} rows={3} disabled={casting}
            style={{width:"100%",background:"rgba(200,168,75,0.04)",
              border:"1px solid rgba(200,168,75,0.2)",color:"#e8d5a0",
              padding:"12px 16px",fontSize:14,lineHeight:1.9,
              fontFamily:"inherit",resize:"vertical",transition:"border 0.2s"}}
          />
        </div>
      )}

      {/* Question display after cast */}
      {done && question && (
        <div style={{marginBottom:28,maxWidth:520,width:"100%",
          borderLeft:"2px solid rgba(200,168,75,0.35)",paddingLeft:16,animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10,letterSpacing:4,color:"rgba(200,168,75,0.5)",marginBottom:6}}>
            {t("question.display")}
          </div>
          <div style={{fontSize:14,color:"#e8d5a0",lineHeight:1.9}}>{question}</div>
        </div>
      )}

      {/* Cast button */}
      {!lines && !casting && (
        <button className="cast-btn" onClick={cast} style={{
          background:"none",border:"1px solid #c8a84b",color:"#f5e09a",
          padding:"14px 44px",fontSize:17,letterSpacing:6,
          cursor:"pointer",fontFamily:"inherit",
          boxShadow:"0 0 24px rgba(200,168,75,0.15)",transition:"all 0.2s"}}>
          {t("cast.button")}
        </button>
      )}

      {casting && (
        <div style={{color:"#c8a84b",fontSize:13,letterSpacing:4,
          animation:"pulse 0.8s infinite",marginBottom:16}}>
          {t("cast.casting",{step})}
        </div>
      )}

      {/* Hexagram cards */}
      {lines && lines.length>0 && (
        <div className="hex-row" style={{display:"flex",gap:32,flexWrap:"wrap",
          justifyContent:"center",animation:"fi 0.6s ease"}}>
          <div className="hex-card"><HexCard label={t("card.primary")} lines={lines} isResult={false}/></div>
          {hasChange && lines.length===6 && <>
            <div className="hex-arrow"
              style={{display:"flex",alignItems:"center",fontSize:24,color:"rgba(200,168,75,0.4)"}}>→</div>
            <div className="hex-card"><HexCard label={t("card.derived")} lines={changedLines} isResult={true}/></div>
          </>}
        </div>
      )}

      {/* Changing lines detail */}
      {done && hasChange && (
        <div style={{marginTop:24,maxWidth:420,width:"100%",
          border:"1px solid rgba(200,168,75,0.15)",padding:"18px 24px",
          background:"rgba(200,168,75,0.03)",animation:"fi 0.7s ease"}}>
          <div style={{fontSize:10,letterSpacing:5,color:"#c8a84b",marginBottom:12}}>
            {t("changing.title")}
          </div>
          {lines.map((v,i)=>(v!==6&&v!==9)?null:(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:8,fontSize:13}}>
              <span style={{color:"#c8a84b",minWidth:36}}>
                {t(`line.${i}`)}{t("changing.lineSuffix")}
              </span>
              <span style={{fontSize:10,color:v===9?"#e8a04b":"#8ab4d4"}}>
                {v===9?t("changing.yangLine"):t("changing.yinLine")}
              </span>
              <span style={{fontSize:10,color:"rgba(200,168,75,0.45)"}}>
                {v===9?t("changing.yangChange"):t("changing.yinChange")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Copy / Export / Preview */}
      {done && (
        <div style={{marginTop:32,display:"flex",flexDirection:"column",
          alignItems:"center",gap:16,animation:"fi 0.8s ease",width:"100%",maxWidth:520}}>
          <div style={{fontSize:11,color:"rgba(200,168,75,0.4)",letterSpacing:3}}>
            {t("actions.copyHint")}
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            <button className="action-btn" onClick={handleCopy} style={actionBtnStyle(copied)}>
              <span style={{fontSize:15}}>{copied?"✓":"⎘"}</span>
              <span style={{minWidth:64}}>{copied?t("actions.copied"):t("actions.copy")}</span>
            </button>
            <button className="action-btn" onClick={handleExport} style={actionBtnStyle(false)}>
              <span style={{fontSize:15}}>↓</span>
              <span>{t("actions.export")}</span>
            </button>
            <ScreenshotButton target={resultAreaRef} filename={t("summary.filePrefix")} />
          </div>
          <div style={{width:"100%",background:"rgba(0,0,0,0.35)",
            border:"1px solid rgba(200,168,75,0.1)",padding:"14px 18px"}}>
            <div style={{fontSize:9,letterSpacing:4,color:"rgba(200,168,75,0.3)",marginBottom:10}}>
              {t("actions.preview")}
            </div>
            <pre style={{fontSize:11,color:"rgba(200,168,75,0.55)",lineHeight:2,
              whiteSpace:"pre-wrap",wordBreak:"break-all",fontFamily:"inherit",margin:0}}>
              {summary}
            </pre>
          </div>
          <button className="reset-btn" onClick={reset} style={{
            marginTop:4,background:"none",border:"none",
            color:"rgba(200,168,75,0.35)",fontSize:11,letterSpacing:5,
            cursor:"pointer",fontFamily:"inherit",transition:"color 0.2s"}}>
            {t("actions.reset")}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
