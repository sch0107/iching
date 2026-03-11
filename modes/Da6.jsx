import { useState } from "react";
import { useTranslation } from "react-i18next";

const GOLD = "rgba(200,168,75,";

// 天干地支系统
const HEAVENLY_STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EARTHLY_BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

// 六神元神
const GODS = ["青龙","朱雀","勾陈","腾蛇","白虎","玄武","太常"];

// 六神吉凶值
const GODS_FORTUNE = {
  "青龙": 5, "朱雀": 4, "勾陈": 1, "腾蛇": 3, "白虎": 1, "玄武": 3, "太常": 4
};

// 六亲
const RELATIVES = ["父母","兄弟","子孙","妻财","官鬼"];

// 计算天干地支
function calculateStemBranch(year, month, day, hour) {
  // 年柱天干（简化：按年份数取干）
  const yearStemIndex = year % 10;
  const yearStem = HEAVENLY_STEMS[yearStemIndex];

  // 月柱地支（简化：月份数-1 对应地支）
  const monthBranch = EARTHLY_BRANCHES[(month - 1) % 12];

  // 日柱地支（简化：日期数-1 对应地支）
  const dayBranch = EARTHLY_BRANCHES[(day - 1) % 12];

  // 时柱地支（按输入）
  const hourBranch = EARTHLY_BRANCHES[(hour - 1) % 12];

  // 时柱天干（简化：按天干轮转）
  const hourStemIndex = (year * 12 + month + day + hour) % 10;
  const hourStem = HEAVENLY_STEMS[hourStemIndex];

  return {
    year: { stem: yearStem, branch: year % 12 },
    month: { stem: HEAVENLY_STEMS[(year * 12 + month) % 10], branch: monthBranch },
    day: { stem: HEAVENLY_STEMS[(year * 12 + month + day) % 10], branch: dayBranch },
    hour: { stem: hourStem, branch: hourBranch }
  };
}

// 计算六神
function calculateGods(stemBranch) {
  // 甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉、甲戌、乙亥
  // 按天干地支组合确定六神
  const stemIndex = HEAVENLY_STEMS.indexOf(stem.stem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(stem.branch);

  // 六神计算规则（简化版传统大六壬）
  const godIndex = (stemIndex + branchIndex) % 6;
  return GODS[godIndex];
}

// 计算六亲（简化版）
function calculateRelatives(god) {
  const godIndex = GODS.indexOf(god);
  return RELATIVES[godIndex % 4];
}

// 大六壬起课
function calculateDa6(year, month, day, hour, funMode) {
  const pillars = calculateStemBranch(year, month, day, hour);

  let signIndex;
  if (funMode) {
    // 幸运模式：吉神（青龙、朱雀、太常）
    const goodGods = ["青龙", "朱雀", "太常"];
    signIndex = goodGods.indexOf(pillars.hour.stem) % 6;
  } else {
    // 正常模式：按大六壬法起神课
    // 年月日时三数起课法
    const yearNum = year % 10;
    const monthNum = month;
    const dayNum = day;
    const hourNum = hour;

    // 综合计算神课（简化版传统大六壬）
    const combined = (yearNum + monthNum + dayNum + hourNum) % 6;
    signIndex = combined;
  }

  return {
    pillars,
    signIndex,
    signGod: GODS[signIndex],
    signFortune: GODS_FORTUNE[GODS[signIndex]]
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

function Pillar({ label, stem, branch }) {
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

export default function Da6() {
  const { t } = useTranslation();

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [divining, setDivining] = useState(false);

  // Birth data inputs
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");

  const [copied, setCopied] = useState(false);
  const [funMode, setFunMode] = useState(false);

  const divine = () => {
    if (divining) return;
    if (!birthYear || !birthMonth || !birthDay || !birthHour) return;

    setDivining(true);
    setCopied(false);

    setTimeout(() => {
      const year = parseInt(birthYear);
      const month = parseInt(birthMonth);
      const day = parseInt(birthDay);
      const hour = parseInt(birthHour);

      if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        setDivining(false);
        return;
      }

      const reading = calculateDa6(year, month, day, hour, funMode);
      setResult(reading);
      setDivining(false);
    }, 800);
  };

  const reset = () => {
    setResult(null);
    setCopied(false);
    setQuestion("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthHour("");
  };

  const buildSummary = () => {
    if (!result) return "";
    const lang = t("langLabel") === "简" ? "zh-CN" : "zh-TW";
    let out = t("d6.summaryHeader") + "\n";
    out += t("d6.summaryTime") + new Date().toLocaleString(lang) + "\n";
    if (question) out += t("d6.summaryQ") + question + "\n";
    out += "\n" + t("d6.summaryPillars") + "\n";
    out += "  " + result.pillars.year.stem + result.pillars.year.branch + "\n";
    out += "  " + result.pillars.month.stem + result.pillars.month.branch + "\n";
    out += "  " + result.pillars.day.stem + result.pillars.day.branch + "\n";
    out += "  " + result.pillars.hour.stem + result.pillars.hour.branch + "\n";
    out += "\n" + t("d6.summarySign") + result.signGod + "\n";
    out += "\n" + t("d6.resultSign") + "：\n";
    out += t(`xlr.signs.${result.signIndex}.name`) + " · " + t(`xlr.signs.${result.signIndex}.keywords`);
    out += "\n\n---\n" + t("d6.footer");
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const done = result !== null && !divining;

  const inputStyle = {
    width: "100%", maxWidth: 400, padding: "0 10px",
    display: "flex", flexDirection: "column", gap: 10,
  };

  const fieldStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(200,168,75,0.2)",
    color: "#e8d5a0", padding: "10px 14px", fontSize: 14,
    fontFamily: "inherit", transition: "border 0.2s", borderRadius: 4,
  };

  const btnStyle = (active) => ({
    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
    background: active ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.07)",
    border: `1px solid ${active ? "rgba(200,168,75,0.6)" : "rgba(200,168,75,0.3)"}`,
    color: active ? "#f5e09a" : "#d4b86a", padding: "11px 24px",
    fontSize: 13, letterSpacing: 3, fontFamily: "inherit", transition: "all 0.2s",
  });

  const fortuneColors = {
    5: "#c8a84b",  // 吉
    4: "#e8c84b",  // 偏吉
    3: "#c85a3c",  // 平
    1: "#c85a3c",  // 凶
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px 80px", minHeight: "calc(100vh - 48px)" }}>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 40, animation: "fi 0.5s ease" }}>
        <div style={{ fontSize: 10, letterSpacing: 8, color: "#c8a84b", opacity: 0.6, marginBottom: 10 }}>
          {t("d6.subtitle")}
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: 10,
          background: "linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {t("d6.title")}
        </h1>
        <div style={{ width: 100, height: 1,
          background: "linear-gradient(90deg,transparent,#c8a84b,transparent)", margin: "12px auto 0" }} />
      </div>

      {/* Input section */}
      {!done && (
        <div style={{ animation: "fi 0.5s ease", width: "100%", maxWidth: 480 }}>
          {/* Fun mode toggle */}
          <div style={{ marginBottom: 16, animation: "fi 0.5s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <span style={{ fontSize: 12, letterSpacing: 3, color: "rgba(200,168,75,0.6)" }}>
                {t("funMode.label")}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setFunMode(false)}
                  style={{
                    background: !funMode ? "rgba(200,168,75,0.18)" : "none",
                    border: `1px solid ${!funMode ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.3)"}`,
                    color: !funMode ? "#f5e09a" : "rgba(200,168,75,0.5)",
                    padding: "6px 14px", fontSize: 11, letterSpacing: 2,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", borderRadius: 4,
                  }}
                >
                  OFF
                </button>
                <button
                  onClick={() => setFunMode(true)}
                  style={{
                    background: funMode ? "rgba(200,168,75,0.18)" : "none",
                    border: `1px solid ${funMode ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.3)"}`,
                    color: funMode ? "#f5e09a" : "rgba(200,168,75,0.5)",
                    padding: "6px 14px", fontSize: 11, letterSpacing: 2,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", borderRadius: 4,
                  }}
                >
                  ON
                </button>
              </div>
            </div>
          </div>

          {/* Birth data input */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "rgba(200,168,75,0.55)", marginBottom: 12 }}>
              {t("d6.birthLabel")}
            </div>
            <div style={inputStyle}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.yearLabel")}
                  </div>
                  <input
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder={t("d6.yearPlaceholder") || "如1990"}
                    type="number"
                    min="1900"
                    max="2100"
                    style={fieldStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.monthLabel")}
                  </div>
                  <input
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    placeholder={t("d6.monthPlaceholder") || "1-12"}
                    type="number"
                    min="1"
                    max="12"
                    style={fieldStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.dayLabel")}
                  </div>
                  <input
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    placeholder={t("d6.dayPlaceholder") || "1-31"}
                    type="number"
                    min="1"
                    max="31"
                    style={fieldStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.hourLabel")}
                  </div>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(200,168,75,0.2)", color: "#e8d5a0",
                      padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
                      transition: "border 0.2s", borderRadius: 4,
                    }}
                  >
                    <option value="">--</option>
                    {EARTHLY_BRANCHES.map((branch, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}: {t(`branches.${i}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Question input */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "rgba(200,168,75,0.55)", marginBottom: 10 }}>
              {t("mhy.questionLabel")}
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("mhy.questionPlaceholder")}
              rows={2}
              style={{
                width: "100%", background: "rgba(200,168,75,0.04)",
                border: "1px solid rgba(200,168,75,0.2)", color: "#e8d5a0",
                padding: "12px 16px", fontSize: 14, lineHeight: 1.9,
                fontFamily: "inherit", resize: "vertical", transition: "border 0.2s", borderRadius: 4,
              }}
            />
          </div>

          {/* Divine button */}
          <button
            onClick={divine}
            disabled={divining || !birthYear || !birthMonth || !birthDay || !birthHour}
            style={{
              background: "none", border: "1px solid #c8a84b", color: "#f5e09a",
              padding: "14px 44px", fontSize: 17, letterSpacing: 6,
              cursor: divining ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: divining ? 0.6 : 1,
              boxShadow: "0 0 24px rgba(200,168,75,0.15)", transition: "all 0.2s",
            }}
          >
            {divining ? t("mhy.divining") : t("d6.button")}
          </button>
        </div>
      )}

      {/* Question display after divination */}
      {done && question && (
        <div style={{
          marginBottom: 24, maxWidth: 500, width: "100%",
          borderLeft: "2px solid rgba(200,168,75,0.35)", paddingLeft: 16, animation: "fi 0.5s ease"
        }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(200,168,75,0.5)", marginBottom: 4 }}>
            {t("mhy.questionDisplay")}
          </div>
          <div style={{ fontSize: 14, color: "#e8d5a0", lineHeight: 1.9 }}>{question}</div>
        </div>
      )}

      {/* Result */}
      {done && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, animation: "fi 0.6s ease", width: "100%", maxWidth: 480 }}>

          {/* Pillars display */}
          <div style={{
            textAlign: "center", padding: "24px 28px",
            background: "rgba(200,168,75,0.03)", border: "1px solid rgba(200,168,75,0.15)",
            borderRadius: 8, marginBottom: 20
          }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#c8a84b", marginBottom: 16 }}>
              {t("d6.method")}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <Pillar label={t("d6.yearLabel")} stem={result.pillars.year.stem} branch={result.pillars.year.branch} />
              <Pillar label={t("d6.monthLabel")} stem={result.pillars.month.stem} branch={result.pillars.month.branch} />
              <Pillar label={t("d6.dayLabel")} stem={result.pillars.day.stem} branch={result.pillars.day.branch} />
              <Pillar label={t("d6.hourLabel")} stem={result.pillars.hour.stem} branch={result.pillars.hour.branch} />
            </div>
          </div>

          {/* Sign result */}
          <div style={{
            padding: "28px", background: "rgba(200,168,75,0.03)",
            border: "1px solid rgba(200,168,75,0.2)", borderRadius: 8,
            width: "100%", maxWidth: 400
          }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: "#c8a84b", marginBottom: 16 }}>
              {t("d6.resultSign")}
            </div>

            {/* Sign display with color and keywords */}
            <div style={{
              background: fortuneColors[result.signFortune] || GOLD + "0.08)", padding: "20px", borderRadius: 6,
              border: "1px solid rgba(200,168,75,0.2)"
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 16
              }}>
                <div style={{
                  fontSize: 32, fontWeight: 700, color: "#f5e09a",
                  textAlign: "center", minWidth: 80
                }}>
                  {result.signGod}
                </div>
                <div style={{ fontSize: 10, color: GOLD + "0.6)", letterSpacing: 2 }}>
                  {t(`xlr.signs.${result.signIndex}.name`)}
                </div>
              </div>

              <div style={{
                borderTop: "1px solid rgba(200,168,75,0.15)",
                paddingTop: 16, fontSize: 14, color: GOLD + "0.7)", lineHeight: 1.9
              }}>
                {t(`xlr.signs.${result.signIndex}.desc`)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={handleCopy} style={btnStyle(copied)}>
              <span>{copied ? "✓" : "⎘"}</span>
              <span>{copied ? t("coin.copied") : t("coin.copy")}</span>
            </button>
            <button onClick={divine} style={btnStyle(false)}>
              <span>↺</span>
              <span>{t("mhy.again")}</span>
            </button>
          </div>

          {/* Preview summary */}
          <div style={{
            width: "100%", background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(200,168,75,0.1)", padding: "14px 18px", marginTop: 16
          }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(200,168,75,0.3)", marginBottom: 10 }}>
              {t("actions.preview")}
            </div>
            <pre style={{
              fontSize: 11, color: "rgba(200,168,75,0.55)", lineHeight: 2,
              whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "inherit", margin: 0
            }}>
              {buildSummary()}
            </pre>
          </div>

          <button onClick={reset} style={{
            marginTop: 4, background: "none", border: "none",
            color: "rgba(200,168,75,0.35)", fontSize: 11, letterSpacing: 5,
            cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s"
          }}>
            {t("mhy.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
