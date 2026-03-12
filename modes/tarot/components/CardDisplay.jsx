import React from "react";

const GOLD = "rgba(200,168,75,";

/**
 * Card label component - shows arcana or suit/rank info
 */
export function CardLabel({ card, t }) {
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

/**
 * Card display component - shows a single tarot card with its meaning
 */
export function CardDisplay({ card, position, t }) {
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
