// ==================== Calculation utilities for Tarot ====================

/**
 * Fisher-Yates shuffle returning a new array
 * @param {Array} arr - The array to shuffle
 * @returns {Array} A new shuffled array
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw cards from the deck
 * @param {number} count - Number of cards to draw
 * @param {boolean} allowReversed - Whether to allow reversed cards
 * @param {boolean} funMode - Whether to use good cards only
 * @param {Array} allCards - All cards in the deck
 * @param {Array} goodCards - Good cards for fun mode
 * @returns {Array} Drawn cards with reversed flag
 */
export function drawCards(count, allowReversed, funMode, allCards, goodCards) {
  const pool = funMode ? goodCards : allCards;
  return shuffle(pool).slice(0, count).map(card => ({
    ...card,
    reversed: allowReversed && Math.random() < 0.5,
  }));
}
