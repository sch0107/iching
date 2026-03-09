import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n.js";

// The 6 signs in order: 大安, 留连, 速喜, 赤口, 小吉, 空亡
const SIGNS = [
  {
    hans:{ name:"大安", keywords:"平安·顺遂", desc:"万事皆安，求谋遂意，出行吉利，病者安康，失物可寻，诸事大吉。" },
    hant:{ name:"大安", keywords:"平安·順遂", desc:"萬事皆安，求謀遂意，出行吉利，病者安康，失物可尋，諸事大吉。" },
    en:  { name:"Great Peace",   keywords:"Safety · Harmony",    desc:"All matters are secure and auspicious. Plans succeed, travel is safe, the ill recover, and lost items are found." },
    color:"#c8a84b", fortune:5,
  },
  {
    hans:{ name:"留连", keywords:"迁延·阻滞", desc:"事多缠绕，进退两难，失物难寻，问病忧心，宜守候时机，不可强求。" },
    hant:{ name:"留連", keywords:"遷延·阻滯", desc:"事多纏繞，進退兩難，失物難尋，問病憂心，宜守候時機，不可強求。" },
    en:  { name:"Lingering",     keywords:"Delay · Obstruction", desc:"Matters are entangled and unresolved. Hard to advance or retreat. Lost items are hard to find. Wait patiently." },
    color:"#8ab4d4", fortune:2,
  },
  {
    hans:{ name:"速喜", keywords:"喜庆·吉祥", desc:"喜讯将至，贵人相助，谋事可成，求财有望，诸事顺遂，吉星高照。" },
    hant:{ name:"速喜", keywords:"喜慶·吉祥", desc:"喜訊將至，貴人相助，謀事可成，求財有望，諸事順遂，吉星高照。" },
    en:  { name:"Quick Joy",     keywords:"Celebration · Fortune",desc:"Good news arrives quickly. Helpful people appear. Plans succeed and wealth is attainable. All matters are auspicious." },
    color:"#e8c84b", fortune:4,
  },
  {
    hans:{ name:"赤口", keywords:"口舌·争讼", desc:"口舌是非多，争执诉讼起，慎言谨行事，避免冲突，宜守不宜动。" },
    hant:{ name:"赤口", keywords:"口舌·爭訟", desc:"口舌是非多，爭執訴訟起，慎言謹行事，避免衝突，宜守不宜動。" },
    en:  { name:"Red Mouth",     keywords:"Discord · Dispute",   desc:"Arguments and disputes arise. Legal trouble is possible. Speak carefully, avoid conflict. Better to stay still than act." },
    color:"#c85a3c", fortune:1,
  },
  {
    hans:{ name:"小吉", keywords:"小吉·平顺", desc:"诸事小吉，略有阻碍，谋事可成，宜从小处着手，稳步推进，终有所得。" },
    hant:{ name:"小吉", keywords:"小吉·平順", desc:"諸事小吉，略有阻礙，謀事可成，宜從小處著手，穩步推進，終有所得。" },
    en:  { name:"Small Fortune", keywords:"Mild Good · Steady",  desc:"Moderately auspicious. Minor obstacles exist but plans can succeed. Start small and proceed steadily. Gains will come." },
    color:"#8ac87a", fortune:3,
  },
  {
    hans:{ name:"空亡", keywords:"落空·虚耗", desc:"诸事落空，心愿难成，失物难寻，问病不利，宜静待时机，切勿轻举妄动。" },
    hant:{ name:"空亡", keywords:"落空·虛耗", desc:"諸事落空，心願難成，失物難尋，問病不利，宜靜待時機，切勿輕舉妄動。" },
    en:  { name:"Void",          keywords:"Emptiness · Loss",    desc:"Matters come to nothing. Lost items cannot be recovered. Illness faces difficulty. Wait quietly — do not act rashly." },
    color:"#7890a8", fortune:1,
  },
];

const BRANCH_NAMES = [
  { hans:"子", hant:"子", en:"Zi"    },
  { hans:"丑", hant:"丑", en:"Chou"  },
  { hans:"寅", hant:"寅", en:"Yin"   },
  { hans:"卯", hant:"卯", en:"Mao"   },
  { hans:"辰", hant:"辰", en:"Chen"  },
  { hans:"巳", hant:"巳", en:"Si"    },
  { hans:"午", hant:"午", en:"Wu"    },
  { hans:"未", hant:"未", en:"Wei"   },
  { hans:"申", hant:"申", en:"Shen"  },
  { hans:"酉", hant:"酉", en:"You"   },
  { hans:"戌", hant:"戌", en:"Xu"    },
  { hans:"亥", hant:"亥", en:"Hai"   },
];

function getHourBranch(hour) {
  // 子: 23:00-01:00=1, 丑: 01:00-03:00=2, ... 亥: 21:00-23:00=12
  return hour === 23 ? 1 : Math.floor(hour / 2) + 1;
}

function calculate() {
  const now    = new Date();
  const month  = now.getMonth() + 1;       // 1–12
  const day    = now.getDate();             // 1–31
  const branch = getHourBranch(now.getHours()); // 1–12
  // Formula: start at 大安, count forward by (month-1), then (day-1), then (branch-1)
  const index  = ((month - 1) + (day - 1) + (branch - 1)) % 6;
  return { month, day, branch, index };
}

function signLang(sign, lang) {
  return sign[lang === "en" ? "en" : lang === "zh-Hant" ? "hant" : "hans"];
}
function branchName(branch, lang) {
  const b = BRANCH_NAMES[branch - 1];
  return b[lang === "en" ? "en" : "hans"];
}

export default function XiaoLiuRen() {
  const { t }  = useTranslation();
  const lang   = i18n.language;

  const [question, setQuestion] = useState("");
  const [reading,  setReading]  = useState(null); // null | {month,day,branch,index}
  const [copied,   setCopied]   = useState(false);
  const [divining, setDivining] = useState(false);

  const divine = () => {
    setDivining(true);
    setCopied(false);
    setTimeout(() => {
      setReading(calculate());
      setDivining(false);
    }, 800);
  };

  const reset = () => { setReading(null); setCopied(false); };

  const buildSummary = () => {
    if (!reading) return "";
    const sign = signLang(SIGNS[reading.index], lang);
    let out = t("xlr.summaryHeader") + "\n";
    out += t("xlr.summaryTime") + new Date().toLocaleString(
      lang==="en" ? undefined : lang==="zh-Hant" ? "zh-TW" : "zh-CN"
    ) + "\n";
    if (question) out += t("xlr.summaryQ") + question + "\n";
    out += "\n" + t("xlr.summarySign") + sign.name + "（" + sign.keywords + "）\n";
    out += t("xlr.summaryDesc") + sign.desc + "\n";
    out += "\n---\n" + t("xlr.footer");
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const btnStyle = (active) => ({
    display:"flex", alignItems:"center", gap:8, cursor:"pointer",
    background: active ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.07)",
    border: `1px solid ${active ? "rgba(200,168,75,0.6)" : "rgba(200,168,75,0.3)"}`,
    color: active ? "#f5e09a" : "#d4b86a", padding:"11px 24px",
    fontSize:13, letterSpacing:3, fontFamily:"inherit", transition:"all 0.2s",
  });

  const done = reading !== null;
  const resultSign = done ? SIGNS[reading.index] : null;
  const resultData = done ? signLang(resultSign, lang) : null;

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
          {t("xlr.timeUsed")}：{t("xlr.monthLabel")}{reading.month} · {t("xlr.dayLabel")}{reading.day} · {branchName(reading.branch, lang)}{lang !== "en" ? t("xlr.hourLabel") : ""}
        </div>
      )}

      {/* Six signs row */}
      {done && (
        <div className="sign-row" style={{display:"flex", gap:10, marginBottom:32,
          justifyContent:"center", animation:"fi 0.5s ease", flexWrap:"wrap", maxWidth:640}}>
          {SIGNS.map((sign, i) => {
            const d       = signLang(sign, lang);
            const isResult= i === reading.index;
            return (
              <div key={i} className="sign-card" style={{
                flex:"1 1 80px", minWidth:88, padding:"14px 10px",
                border: `1px solid ${isResult ? sign.color : "rgba(200,168,75,0.12)"}`,
                background: isResult ? `${sign.color}18` : "rgba(200,168,75,0.02)",
                textAlign:"center", transition:"all 0.3s",
                boxShadow: isResult ? `0 0 16px ${sign.color}33` : "none",
                position:"relative",
              }}>
                {isResult && (
                  <div style={{position:"absolute", top:-8, left:"50%", transform:"translateX(-50%)",
                    fontSize:9, letterSpacing:2, color:sign.color, background:"#150f05",
                    padding:"0 6px", whiteSpace:"nowrap"}}>
                    ▼ {t("xlr.resultMark")}
                  </div>
                )}
                <div style={{fontSize: isResult ? 20 : 16, fontWeight:700,
                  color: isResult ? sign.color : "rgba(200,168,75,0.4)", marginBottom:4}}>
                  {d.name}
                </div>
                <div style={{display:"flex", justifyContent:"center", gap:2}}>
                  {Array.from({length:5}).map((_,s) => (
                    <span key={s} style={{fontSize:6,
                      color: s < sign.fortune ? sign.color : "rgba(200,168,75,0.15)"}}>●</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Result detail */}
      {done && resultSign && (
        <div style={{maxWidth:500, width:"100%", animation:"fi 0.6s ease",
          border:`1px solid ${resultSign.color}44`,
          background:`${resultSign.color}0a`, padding:"24px 28px", marginBottom:24}}>
          <div style={{fontSize:10, letterSpacing:5, color:resultSign.color, marginBottom:16}}>
            {t("xlr.resultTitle")}
          </div>
          <div style={{display:"flex", alignItems:"baseline", gap:16, marginBottom:12}}>
            <span style={{fontSize:32, fontWeight:900, color:resultSign.color}}>
              {resultData.name}
            </span>
            <span style={{fontSize:11, color:"rgba(200,168,75,0.5)", letterSpacing:2}}>
              {resultData.keywords}
            </span>
          </div>
          <div style={{width:"100%", height:1, background:`${resultSign.color}30`, marginBottom:16}}/>
          <div style={{fontSize:13, color:"rgba(200,168,75,0.75)", lineHeight:2.2, letterSpacing:1}}>
            {resultData.desc}
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
