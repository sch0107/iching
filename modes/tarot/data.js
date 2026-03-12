// ==================== Data structures for Tarot (塔罗牌) ====================

// Card data for 78 Tarot cards
// All text (names, keywords, meanings) lives in the locale files under tarot.cards.{id}.*
export const TAROT_CARDS = [
  // ── Major Arcana (0–21) ──────────────────────────────────────────────────
  { id: 0,  arcana:"major", number:0  },
  { id: 1,  arcana:"major", number:1  },
  { id: 2,  arcana:"major", number:2  },
  { id: 3,  arcana:"major", number:3  },
  { id: 4,  arcana:"major", number:4  },
  { id: 5,  arcana:"major", number:5  },
  { id: 6,  arcana:"major", number:6  },
  { id: 7,  arcana:"major", number:7  },
  { id: 8,  arcana:"major", number:8  },
  { id: 9,  arcana:"major", number:9  },
  { id: 10, arcana:"major", number:10 },
  { id: 11, arcana:"major", number:11 },
  { id: 12, arcana:"major", number:12 },
  { id: 13, arcana:"major", number:13 },
  { id: 14, arcana:"major", number:14 },
  { id: 15, arcana:"major", number:15 },
  { id: 16, arcana:"major", number:16 },
  { id: 17, arcana:"major", number:17 },
  { id: 18, arcana:"major", number:18 },
  { id: 19, arcana:"major", number:19 },
  { id: 20, arcana:"major", number:20 },
  { id: 21, arcana:"major", number:21 },
  // ── Minor Arcana — Wands (22–35) ────────────────────────────────────────
  { id: 22, arcana:"minor", suit:"wands",     rank:1  },
  { id: 23, arcana:"minor", suit:"wands",     rank:2  },
  { id: 24, arcana:"minor", suit:"wands",     rank:3  },
  { id: 25, arcana:"minor", suit:"wands",     rank:4  },
  { id: 26, arcana:"minor", suit:"wands",     rank:5  },
  { id: 27, arcana:"minor", suit:"wands",     rank:6  },
  { id: 28, arcana:"minor", suit:"wands",     rank:7  },
  { id: 29, arcana:"minor", suit:"wands",     rank:8  },
  { id: 30, arcana:"minor", suit:"wands",     rank:9  },
  { id: 31, arcana:"minor", suit:"wands",     rank:10 },
  { id: 32, arcana:"minor", suit:"wands",     rank:11 },
  { id: 33, arcana:"minor", suit:"wands",     rank:12 },
  { id: 34, arcana:"minor", suit:"wands",     rank:13 },
  { id: 35, arcana:"minor", suit:"wands",     rank:14 },
  // ── Minor Arcana — Cups (36–49) ─────────────────────────────────────────
  { id: 36, arcana:"minor", suit:"cups",      rank:1  },
  { id: 37, arcana:"minor", suit:"cups",      rank:2  },
  { id: 38, arcana:"minor", suit:"cups",      rank:3  },
  { id: 39, arcana:"minor", suit:"cups",      rank:4  },
  { id: 40, arcana:"minor", suit:"cups",      rank:5  },
  { id: 41, arcana:"minor", suit:"cups",      rank:6  },
  { id: 42, arcana:"minor", suit:"cups",      rank:7  },
  { id: 43, arcana:"minor", suit:"cups",      rank:8  },
  { id: 44, arcana:"minor", suit:"cups",      rank:9  },
  { id: 45, arcana:"minor", suit:"cups",      rank:10 },
  { id: 46, arcana:"minor", suit:"cups",      rank:11 },
  { id: 47, arcana:"minor", suit:"cups",      rank:12 },
  { id: 48, arcana:"minor", suit:"cups",      rank:13 },
  { id: 49, arcana:"minor", suit:"cups",      rank:14 },
  // ── Minor Arcana — Swords (50–63) ───────────────────────────────────────
  { id: 50, arcana:"minor", suit:"swords",    rank:1  },
  { id: 51, arcana:"minor", suit:"swords",    rank:2  },
  { id: 52, arcana:"minor", suit:"swords",    rank:3  },
  { id: 53, arcana:"minor", suit:"swords",    rank:4  },
  { id: 54, arcana:"minor", suit:"swords",    rank:5  },
  { id: 55, arcana:"minor", suit:"swords",    rank:6  },
  { id: 56, arcana:"minor", suit:"swords",    rank:7  },
  { id: 57, arcana:"minor", suit:"swords",    rank:8  },
  { id: 58, arcana:"minor", suit:"swords",    rank:9  },
  { id: 59, arcana:"minor", suit:"swords",    rank:10 },
  { id: 60, arcana:"minor", suit:"swords",    rank:11 },
  { id: 61, arcana:"minor", suit:"swords",    rank:12 },
  { id: 62, arcana:"minor", suit:"swords",    rank:13 },
  { id: 63, arcana:"minor", suit:"swords",    rank:14 },
  // ── Minor Arcana — Pentacles (64–77) ────────────────────────────────────
  { id: 64, arcana:"minor", suit:"pentacles", rank:1  },
  { id: 65, arcana:"minor", suit:"pentacles", rank:2  },
  { id: 66, arcana:"minor", suit:"pentacles", rank:3  },
  { id: 67, arcana:"minor", suit:"pentacles", rank:4  },
  { id: 68, arcana:"minor", suit:"pentacles", rank:5  },
  { id: 69, arcana:"minor", suit:"pentacles", rank:6  },
  { id: 70, arcana:"minor", suit:"pentacles", rank:7  },
  { id: 71, arcana:"minor", suit:"pentacles", rank:8  },
  { id: 72, arcana:"minor", suit:"pentacles", rank:9  },
  { id: 73, arcana:"minor", suit:"pentacles", rank:10 },
  { id: 74, arcana:"minor", suit:"pentacles", rank:11 },
  { id: 75, arcana:"minor", suit:"pentacles", rank:12 },
  { id: 76, arcana:"minor", suit:"pentacles", rank:13 },
  { id: 77, arcana:"minor", suit:"pentacles", rank:14 },
];

// Good cards for fun mode (mostly positive meanings)
export const GOOD_CARDS = [0, 1, 3, 4, 5, 6, 7, 8, 10, 11, 14, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 33, 34, 35, 36, 37, 38, 39, 44, 46, 49, 50, 52, 54, 58, 59, 62, 63, 64, 68, 69, 72, 73, 74, 75, 76, 77];

// Arcana types
export const ARCANA_TYPES = {
  MAJOR: "major",
  MINOR: "minor"
};

// Suit types for Minor Arcana
export const SUIT_TYPES = {
  WANDS: "wands",
  CUPS: "cups",
  SWORDS: "swords",
  PENTACLES: "pentacles"
};

// ==================== Helper Functions ====================

/**
 * Get card by ID
 */
export function getCardById(id) {
  return TAROT_CARDS.find(card => card.id === id);
}

/**
 * Get cards by arcana type
 */
export function getCardsByArcana(arcana) {
  return TAROT_CARDS.filter(card => card.arcana === arcana);
}

/**
 * Get cards by suit (Minor Arcana only)
 */
export function getCardsBySuit(suit) {
  return TAROT_CARDS.filter(card => card.suit === suit);
}

/**
 * Get all cards from good card pool
 */
export function getGoodCards() {
  return GOOD_CARDS.map(id => getCardById(id)).filter(Boolean);
}
