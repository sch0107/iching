import { useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TAROT_CARDS, getGoodCards } from "./data.js";
import { drawCards } from "./calculations/index.js";
import { CardDisplay } from "./components/index.js";
import FunModeToggle from "../../components/FunModeToggle.jsx";
import ScreenshotButton from "../../components/ScreenshotButton.jsx";

const GOLD = "rgba(200,168,75,";

export default function Tarot() {
  const { t } = useTranslation();
  const resultAreaRef = useRef(null);
  const [spread,      setSpread]      = useState("single"); // "single" | "three" | "five" | "celtic"
  const [allowRev,    setAllowRev]    = useState(true);
  const [question,    setQuestion]    = useState("");
  const [cards,       setCards]       = useState(null);
  const [drawing,     setDrawing]     = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [funMode,     setFunMode]     = useState(false);

  function handleDraw() {
    setDrawing(true);
    setCards(null);
    setTimeout(() => {
      const counts = { single: 1, three: 3, five: 5, celtic: 10 };
      const count = counts[spread] || 1;
      setCards(drawCards(count, allowRev, funMode, TAROT_CARDS, getGoodCards()));
      setDrawing(false);
    }, 600);
  }

  function handleReset() {
    setCards(null);
    setQuestion("");
    setCopied(false);
  }

  function buildSummary() {
    const lines = [t("tarot.summaryHeader")];
    lines.push(t("tarot.summaryTime") + new Date().toLocaleString());
    if (question) lines.push(t("tarot.summaryQ") + question);
    const spreadNames = { single: "Single", three: "Three", five: "Five", celtic: "Celtic" };
    lines.push(t("tarot.summarySpread") + t(`tarot.spread${spreadNames[spread]}`));
    lines.push("");
    let positions;
    if (spread === "five") {
      positions = [t("tarot.posPast"), t("tarot.posPresent"), t("tarot.posFuture"), t("tarot.posHidden"), t("tarot.posAdvice")];
    } else if (spread === "celtic") {
      positions = [
        t("tarot.posSituation"), t("tarot.posAction"),
        t("tarot.posOutcome"),
        t("tarot.posPast"), t("tarot.posPresent"),
        t("tarot.posFuture"),
        t("tarot.posHidden"), t("tarot.posAdvice"),
        t("tarot.posOutcome"), t("tarot.posOutcome"),
        t("tarot.posOutcome")
      ];
    } else {
      positions = spread === "three"
        ? [t("tarot.posPast"), t("tarot.posPresent"), t("tarot.posFuture")]
        : [t("tarot.posSingle")];
    }
    cards.forEach((card, i) => {
      lines.push(t("tarot.summaryPos") + positions[i]);
      lines.push(t("tarot.summaryCard") + t(`tarot.cards.${card.id}.name`));
      lines.push(t("tarot.summaryOrient") + (card.reversed ? t("tarot.summaryReversed") : t("tarot.summaryUpright")));
      const meaning = card.reversed
        ? t(`tarot.cards.${card.id}.reversed`)
        : t(`tarot.cards.${card.id}.upright`);
      lines.push(t("tarot.summaryMeaning") + meaning);
      if (i < cards.length - 1) lines.push("");
    });
    lines.push("");
    lines.push(t("tarot.footer"));
    return lines.join("\n");
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const positions = spread === "three"
    ? [t("tarot.posPast"), t("tarot.posPresent"), t("tarot.posFuture")]
    : [null];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 12, letterSpacing: 5, color: GOLD + "0.5)", marginBottom: 8 }}>
          {t("tarot.subtitle")}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: "normal", letterSpacing: 6, color: "#f5e09a", margin: 0 }}>
          {t("tarot.title")}
        </h1>
      </div>

      {!cards && (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Spread selector */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: GOLD + "0.5)", marginBottom: 8 }}>
              {t("tarot.spreadLabel")}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["single", "three", "five", "celtic"].map(s => {
                const label = s === "three" ? "Three" : s === "five" ? "Five" : s === "celtic" ? "Celtic" : "Single";
                return (
                  <button key={s} onClick={() => setSpread(s)} style={{
                    background: spread === s ? GOLD + "0.15)" : "none",
                    border: `1px solid ${spread === s ? GOLD + "0.5)" : GOLD + "0.2)"}`,
                    color: spread === s ? "#f5e09a" : GOLD + "0.5)",
                    padding: "6px 12px", fontSize: 12, letterSpacing: 2,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                  }}>
                    {t(`tarot.spread${label}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reversed toggle */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: GOLD + "0.5)", marginBottom: 8 }}>
              {t("tarot.reversedLabel")}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setAllowRev(v)} style={{
                  background: allowRev === v ? GOLD + "0.15)" : "none",
                  border: `1px solid ${allowRev === v ? GOLD + "0.5)" : GOLD + "0.2)"}`,
                  color: allowRev === v ? "#f5e09a" : GOLD + "0.5)",
                  padding: "6px 18px", fontSize: 12, letterSpacing: 2,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>
                  {v ? t("tarot.reversedOn") : t("tarot.reversedOff")}
                </button>
              ))}
            </div>
          </div>

          {/* Fun mode toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, gap: 12 }}>
            <FunModeToggle enabled={funMode} onChange={setFunMode} />
          </div>

          {/* Question input */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: GOLD + "0.5)", marginBottom: 8 }}>
              {t("tarot.questionLabel")}
            </div>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={t("tarot.questionPlaceholder")}
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${GOLD}0.2)`,
                color: "#e8d5a0", fontSize: 14, padding: "10px 14px",
                fontFamily: "inherit", resize: "vertical", borderRadius: 4,
              }}
            />
          </div>

          {/* Draw button */}
          <div style={{ textAlign: "center" }}>
            <button
              className="cast-btn"
              onClick={handleDraw}
              disabled={drawing}
              style={{
                background: "none",
                border: `1px solid ${GOLD}0.45)`,
                color: "#f5e09a", fontSize: 15, letterSpacing: 5,
                padding: "12px 40px", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.3s", opacity: drawing ? 0.5 : 1,
              }}
            >
              {drawing ? t("tarot.drawing") : t("tarot.button")}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {cards && (
        <div style={{ animation: "fi 0.5s ease both" }}>
          {/* Question display */}
          {question && (
            <div style={{
              textAlign: "center", marginBottom: 28,
              fontSize: 13, color: GOLD + "0.6)", lineHeight: 1.6,
            }}>
              <span style={{ opacity: 0.5 }}>{t("tarot.questionDisplay")}：</span>{question}
            </div>
          )}

          {/* Cards row */}
          <div ref={resultAreaRef} className="hex-row" style={{
            display: "flex", gap: 16, justifyContent: "center",
            flexWrap: "wrap", marginBottom: 28,
          }}>
            {cards.map((card, i) => {
              let position;
              if (spread === "five") {
                const posLabels = [t("tarot.posPast"), t("tarot.posPresent"), t("tarot.posFuture"), t("tarot.posHidden"), t("tarot.posAdvice")];
                position = posLabels[i];
              } else if (spread === "celtic") {
                const posLabels = [
                  t("tarot.posSituation"), t("tarot.posAction"),
                  t("tarot.posOutcome"),
                  t("tarot.posPast"), t("tarot.posPresent"),
                  t("tarot.posFuture"),
                  t("tarot.posHidden"), t("tarot.posAdvice"),
                  t("tarot.posOutcome"), t("tarot.posOutcome"),
                  t("tarot.posOutcome")
                ];
                position = posLabels[i];
              } else {
                position = spread === "three"
                  ? [t("tarot.posPast"), t("tarot.posPresent"), t("tarot.posFuture")][i]
                  : t("tarot.posSingle");
              }
              return <CardDisplay key={card.id} card={card} position={position} t={t} />;
            })}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="action-btn" onClick={handleDraw} style={{
              background: "none", border: `1px solid ${GOLD}0.3)`,
              color: GOLD + "0.7)", fontSize: 12, letterSpacing: 2, padding: "8px 20px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {t("tarot.again")}
            </button>
            <button className="action-btn" onClick={handleCopy} style={{
              background: "none", border: `1px solid ${GOLD}0.3)`,
              color: copied ? "#a8d8a8" : GOLD + "0.7)",
              fontSize: 12, letterSpacing: 2, padding: "8px 20px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {copied ? t("tarot.copied") : t("tarot.copy")}
            </button>
            <ScreenshotButton target={resultAreaRef} filename="tarot" />
            <button className="action-btn reset-btn" onClick={handleReset} style={{
              background: "none", border: "none",
              color: GOLD + "0.4)", fontSize: 12, letterSpacing: 2, padding: "8px 20px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {t("tarot.reset")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
