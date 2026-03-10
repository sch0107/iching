import { useState } from "react";
import { useTranslation } from "react-i18next";

const GOLD = "rgba(200,168,75,";

// 大六壬神课计算
// Simplified implementation for demonstration
function calculateDa6(birthYear, birthMonth, birthDay, birthHour) {
  // 计算八字柱（简化版）
  const yearPillar = birthYear;
  const monthPillar = birthMonth;
  const dayPillar = birthDay;
  const hourPillar = birthHour;

  // 简化计算神课 - 使用出生数据推算六神之一
  // 真正的大六壬计算更为复杂，此处使用简化版
  const combined = (yearPillar + monthPillar + dayPillar + hourPillar) % 6;

  return {
    pillars: { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar },
    signIndex: combined,
  };
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

      const reading = calculateDa6(year, month, day, hour);
      setResult(reading);
      setDivining(false);
    }, 800);
  };

  const reset = () => {
    setResult(null);
    setCopied(false);
    setQuestion("");
  };

  const buildSummary = () => {
    if (!result) return "";
    const lang = t("langLabel") === "简" ? "zh-CN" : "zh-TW";
    let out = t("d6.summaryHeader") + "\n";
    out += t("d6.summaryTime") + new Date().toLocaleString(lang) + "\n";
    if (question) out += t("d6.summaryQ") + question + "\n";
    out += "\n" + t("d6.summaryPillars") +
      `${result.pillars.year}年${result.pillars.month}月${result.pillars.day}日 ${result.pillars.hour}时\n`;
    out += "\n" + t("d6.summarySign") + t(`xlr.signs.${result.signIndex}.name`) + "\n";
    out += "\n" + t("d6.resultSign") + "：";
    out += t(`xlr.signs.${result.signIndex}.desc`);
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
    display: "flex", flexDirection: "column", gap: 12,
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
                    placeholder="如1990"
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
                    placeholder="1-12"
                    type="number"
                    min="1"
                    max="12"
                    style={fieldStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.dayLabel")}
                  </div>
                  <input
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    placeholder="1-31"
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
                  <input
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    placeholder="子(1)-亥(12)"
                    type="number"
                    min="1"
                    max="12"
                    style={fieldStyle}
                  />
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
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f5e09a", letterSpacing: 2, marginBottom: 12 }}>
              {result.pillars.year}年{result.pillars.month}月{result.pillars.day}日 {result.pillars.hour}时
            </div>
            <div style={{ fontSize: 13, color: GOLD + "0.65)", marginTop: 8 }}>
              八字（生辰八字）
            </div>
          </div>

          {/* Sign result */}
          <div style={{
            padding: "28px", background: "rgba(200,168,75,0.03)",
            border: "1px solid rgba(200,168,75,0.2)", borderRadius: 8,
            width: "100%", maxWidth: 400
          }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: "#c8a84b", marginBottom: 12 }}>
              {t("d6.resultSign")}
            </div>

            {/* Sign display with color and keywords */}
            <div style={{
              background: GOLD + "0.08)", padding: "20px", borderRadius: 6,
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
                  {t(`xlr.signs.${result.signIndex}.name`)}
                </div>
                <div style={{ fontSize: 10, color: GOLD + "0.6)", letterSpacing: 2 }}>
                  {t(`xlr.signs.${result.signIndex}.keywords`)}
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
