import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TAROT_CARDS, shuffle } from "./tarotData.js";

const GOLD = "rgba(200,168,75,";

// Good cards for fun mode (mostly positive meanings)
const GOOD_CARDS = [0, 1, 3, 4, 5, 6, 7, 8, 10, 11, 14, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 33, 34, 35, 36, 37, 38, 39, 44, 46, 49, 50, 52, 54, 58, 59, 62, 63, 64, 68, 69, 72, 73, 74, 75, 76, 77];

function drawCards(count, allowReversed, funMode) {
  const pool = funMode ? GOOD_CARDS.map(id => TAROT_CARDS.find(c => c.id === id)).filter(Boolean) : TAROT_CARDS;
  return shuffle(pool).slice(0, count).map(card => ({
    ...card,
    reversed: allowReversed && Math.random() < 0.5,
  }));
}

function CardLabel({ card, t }) {
  if (card.arcana === "major") {
    return <span style={{ fontSize: 11, opacity: 0.65 }}>{t("tarot.majorArcana")}</span>;
  }
  const suit = t(`tarot.suits.${card.suit}`);
  const rank = t(`tarot.ranks.${card.rank}`);
  return (
    <span style={{ fontSize: 11, opacity: 0.65 }}>
      {t("tarot.minorArcana")} · {rank} {suit}
    </span>
  );
}

function CardDisplay({ card, position, t }) {
  const name    = t(`tarot.cards.${card.id}.name`);
  const kwKey   = card.reversed ? "reversedKw" : "uprightKw";
  const meaning = card.reversed
    ? t(`tarot.cards.${card.id}.reversed`)
    : t(`tarot.cards.${card.id}.upright`);
  const kw = t(`tarot.cards.${card.id}.${kwKey}`);

  return (
    <div style={{
      background: `rgba(255,255,255,0.03)`,
      border: `1px solid ${GOLD}0.2)`,
      borderRadius: 6,
      padding: "18px 22px",
      flex: 1,
      minWidth: 220,
      maxWidth: 340,
      animation: "fi 0.5s ease both",
    }}>
      {position && (
        <div style={{ fontSize: 11, letterSpacing: 3, color: GOLD + "0.5)", marginBottom: 10 }}>
          {position}
        </div>
      )}
      <CardLabel card={card} t={t} />
      <div style={{
        fontSize: 20, fontWeight: "bold", marginTop: 4, marginBottom: 6,
        color: "#f5e09a", letterSpacing: 1,
        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      }}>
        {name}
        {card.reversed && (
          <span style={{
            fontSize: 10, letterSpacing: 2, padding: "2px 7px",
            border: `1px solid ${GOLD}0.45)`, color: GOLD + "0.7)",
            verticalAlign: "middle",
          }}>
            {t("tarot.reversedBadge")}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: GOLD + "0.6)", marginBottom: 10, lineHeight: 1.6 }}>
        {kw}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: "#e8d5a0", opacity: 0.9 }}>
        {meaning}
      </div>
    </div>
  );
}

export default function Tarot() {
  const { t } = useTranslation();
  const [spread,      setSpread]      = useState("single"); // "single" | "three" | "five" | "celtic"
  const [allowRev,    setAllowRev]    = useState(false);
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
      setCards(drawCards(count, allowRev, funMode));
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
            <span style={{ fontSize: 11, letterSpacing: 2, color: GOLD + "0.6)" }}>
              {t("tarot.funMode.label")}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setFunMode(false)}
                style={{
                  background: !funMode ? GOLD + "0.18)" : "none",
                  border: `1px solid ${!funMode ? GOLD + "0.5)" : GOLD + "0.3)"}`,
                  color: !funMode ? "#f5e09a" : GOLD + "0.5)",
                  padding: "6px 14px", fontSize: 11, letterSpacing: 2,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", borderRadius: 4,
                }}
              >
                OFF
              </button>
              <button
                onClick={() => setFunMode(true)}
                style={{
                  background: funMode ? GOLD + "0.18)" : "none",
                  border: `1px solid ${funMode ? GOLD + "0.5)" : GOLD + "0.3)"}`,
                  color: funMode ? "#f5e09a" : GOLD + "0.5)",
                  padding: "6px 14px", fontSize: 11, letterSpacing: 2,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", borderRadius: 4,
                }}
              >
                ON
              </button>
            </div>
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
          <div className="hex-row" style={{
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
