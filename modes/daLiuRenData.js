// Five Elements (五行)
export const FIVE_ELEMENTS = ['金', '木', '水', '火', '土'];

// Five Element relationships (生成/克制 cycles)
export const ELEMENT_RELATIONSHIPS = {
  金: { generates: '水', controlled_by: '火', controls: '木' },
  木: { generates: '火', controlled_by: '金', controls: '土' },
  水: { generates: '木', controlled_by: '土', controls: '火' },
  火: { generates: '土', controlled_by: '水', controls: '金' },
  土: { generates: '金', controlled_by: '木', controls: '水' }
};

// Element for each earthly branch
export const BRANCH_ELEMENTS = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水'
};

// Element for each heavenly stem
export const STEM_ELEMENTS = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水'
};

// Twelve Generals (十二将) - expanded from current 6 to 12
export const TWELVE_GENERALS = [
  {
    name: '贵人',
    nature: '贵人',
    fortune: 5,
    description: '贵人相助，诸事顺遂',
    element: '金',
    position: 0
  },
  {
    name: '螣蛇',
    nature: '螣蛇',
    fortune: 3,
    description: '变化莫测，宜谨慎',
    element: '火',
    position: 1
  },
  {
    name: '朱雀',
    nature: '朱雀',
    fortune: 4,
    description: '文书口舌，防是非',
    element: '火',
    position: 2
  },
  {
    name: '六合',
    nature: '六合',
    fortune: 4,
    description: '和合吉庆，利于婚嫁',
    element: '木',
    position: 3
  },
  {
    name: '勾陈',
    nature: '勾陈',
    fortune: 2,
    description: '迟滞拖延，宜等待',
    element: '土',
    position: 4
  },
  {
    name: '青龙',
    nature: '青龙',
    fortune: 5,
    description: '大吉之象，事事顺利',
    element: '木',
    position: 5
  },
  {
    name: '天空',
    nature: '天空',
    fortune: 2,
    description: '虚诈不实，防欺诈',
    element: '土',
    position: 6
  },
  {
    name: '白虎',
    nature: '白虎',
    fortune: 1,
    description: '凶煞之象，防意外',
    element: '金',
    position: 7
  },
  {
    name: '太常',
    nature: '太常',
    fortune: 4,
    description: '饮食宴乐，吉庆之事',
    element: '土',
    position: 8
  },
  {
    name: '玄武',
    nature: '玄武',
    fortune: 3,
    description: '阴私暗昧，防小人',
    element: '水',
    position: 9
  },
  {
    name: '太阴',
    nature: '太阴',
    fortune: 3,
    description: '阴私之事，女性吉利',
    element: '金',
    position: 10
  },
  {
    name: '天后',
    nature: '天后',
    fortune: 4,
    description: '女性吉利，贵人相助',
    element: '水',
    position: 11
  }
];

// Situation types (局)
export const SITUATIONS = {
  upper: {
    name: '上局',
    description: '阳气上升，利于进取',
    element: '火'
  },
  middle: {
    name: '中局',
    description: '阴阳平衡，事事顺遂',
    element: '土'
  },
  lower: {
    name: '下局',
    description: '阴气下沉，宜守不宜动',
    element: '水'
  }
};

// Vacancies (空亡) - for each heavenly stem
// Transmission types
export const TRANSMISSION_TYPES = {
  first: '初传',
  second: '中传',
  third: '末传'
};

// Class types
export const CLASS_TYPES = {
  first: '第一课',
  second: '第二课',
  third: '第三课',
  fourth: '第四课'
};

// Branch relationships for class calculation
export const BRANCH_RELATIONSHIPS = {
  子: { self: '子', clash: '午', combine: '丑' },
  丑: { self: '丑', clash: '未', combine: '子' },
  寅: { self: '寅', clash: '申', combine: '亥' },
  卯: { self: '卯', clash: '酉', combine: '戌' },
  辰: { self: '辰', clash: '戌', combine: '酉' },
  巳: { self: '巳', clash: '亥', combine: '申' },
  午: { self: '午', clash: '子', combine: '未' },
  未: { self: '未', clash: '丑', combine: '午' },
  申: { self: '申', clash: '寅', combine: '巳' },
  酉: { self: '酉', clash: '卯', combine: '辰' },
  戌: { self: '戌', clash: '辰', combine: '卯' },
  亥: { self: '亥', clash: '巳', combine: '寅' }
};

// Helper functions

/**
 * Get the five element for a branch
 */
export function getBranchElement(branch) {
  return BRANCH_ELEMENTS[branch] || '土';
}

/**
 * Get the five element for a stem
 */
export function getStemElement(stem) {
  return STEM_ELEMENTS[stem] || '土';
}

/**
 * Check if two elements have a generating relationship
 */
export function isGeneratingRelationship(element1, element2) {
  const rel = ELEMENT_RELATIONSHIPS[element1];
  return rel && rel.generates === element2;
}

/**
 * Check if two elements have a controlling relationship
 */
export function isControllingRelationship(element1, element2) {
  const rel = ELEMENT_RELATIONSHIPS[element1];
  return rel && rel.controls === element2;
}

/**
 * Get relationship description between two elements
 */
export function getElementRelationship(element1, element2) {
  if (element1 === element2) return '比和';

  if (isGeneratingRelationship(element1, element2)) return '生成';
  if (isGeneratingRelationship(element2, element1)) return '被生成';

  if (isControllingRelationship(element1, element2)) return '克制';
  if (isControllingRelationship(element2, element1)) return '被克制';

  return '无关系';
}

/**
 * Get vacancy information for a stem
 */
/**
 * Get general by position index
 */
export function getGeneralByPosition(position) {
  return TWELVE_GENERALS[position % 12];
}

/**
 * Calculate element balance score
 */
export function calculateBalanceScore(elementCounts) {
  // Perfect balance would be all elements having equal counts
  const counts = Object.values(elementCounts);
  const max = Math.max(...counts);
  const min = Math.min(...counts);

  if (max === 0) return 0; // No elements

  // Balance score: 1 = perfect balance, 0 = extreme imbalance
  const range = max - min;
  const normalizedRange = range / max;
  return 1 - normalizedRange;
}

/**
 * Determine if elements are balanced
 */
export function isElementsBalanced(elementCounts) {
  const score = calculateBalanceScore(elementCounts);
  return score >= 0.6; // Threshold for balanced
}

/**
 * Count occurrences of each element in an array
 */
export function countElements(elements) {
  const counts = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  elements.forEach(element => {
    if (counts.hasOwnProperty(element)) {
      counts[element]++;
    }
  });
  return counts;
}
