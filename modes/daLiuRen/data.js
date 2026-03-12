// ==================== Data structures for Da Liu Ren (大六壬) ====================

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

// ==================== Helper Functions ====================

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

// ==================== Divine Spirit System (神煞体系) ====================

// 天乙贵人 (天乙贵人)
export const TIAN_YI_GUI_REN = {
  // 甲戊庚 → 丑未, 乙己 → 子申, 丙丁 → 亥酉, 壬癸 → 巳卯, 辛 → 寅午
  branches: {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '壬': ['巳', '卯'], '癸': ['巳', '卯'],
    '辛': ['寅', '午']
  },
  fortune: 5, // 大吉
  description: '天乙贵人，逢凶化吉，遇难成祥'
};

// 月德 (月德)
export const YUE_DE = {
  // 正月→戌, 二月→申, 三月→午, 四月→寅, 五月→子, 六月→戌
  // 七月→申, 八月→午, 九月→寅, 十月→子, 十一月→戌, 十二月→申
  monthToBranch: {
    1: '戌', 2: '申', 3: '午', 4: '寅', 5: '子', 6: '戌',
    7: '申', 8: '午', 9: '寅', 10: '子', 11: '戌', 12: '申'
  },
  fortune: 4, // 吉
  description: '月德临身，多吉少凶'
};

// 月合 (月合)
export const YUE_HE = {
  // 正月→丑, 二月→子, 三月→亥, 四月→戌, 五月→酉, 六月→申
  // 七月→未, 八月→午, 九月→巳, 十月→辰, 十一月→卯, 十二月→寅
  monthToBranch: {
    1: '丑', 2: '子', 3: '亥', 4: '戌', 5: '酉', 6: '申',
    7: '未', 8: '午', 9: '巳', 10: '辰', 11: '卯', 12: '寅'
  },
  fortune: 4, // 吉
  description: '月合相生，贵人相助'
};

// 三奇 (三奇)
export const SAN_QI = {
  // 乙丙丁为天上三奇, 甲戊庚为地上三奇
  heavenly: ['乙', '丙', '丁'],
  earthly: ['甲', '戊', '庚'],
  fortune: 5, // 大吉
  description: '三奇临身，万事顺遂'
};

// 六仪 (六仪)
export const LIU_YI = {
  // 甲戊庚丙壬为六仪
  stems: ['甲', '戊', '庚', '丙', '壬'],
  fortune: 3, // 中吉
  description: '六仪临身，中平之象'
};

// 神煞 (Other Divine Spirits)
export const SHEN_SHA = {
  // 驿马 (驿马)
  YI_MA: {
    // 寅午戌马在申, 巳酉丑马在亥, 申子辰马在寅, 亥卯未马在巳
    branches: {
      '寅': '申', '午': '申', '戌': '申',
      '巳': '亥', '酉': '亥', '丑': '亥',
      '申': '寅', '子': '寅', '辰': '寅',
      '亥': '巳', '卯': '巳', '未': '巳'
    },
    fortune: 3, // 中吉
    description: '驿马发动，多有变动'
  },

  // 桃花煞 (桃花煞)
  TAO_HUA: {
    // 寅午戌见卯, 巳酉丑见午, 申子辰见酉, 亥卯未见子
    branches: {
      '寅': '卯', '午': '卯', '戌': '卯',
      '巳': '午', '酉': '午', '丑': '午',
      '申': '酉', '子': '酉', '辰': '酉',
      '亥': '子', '卯': '子', '未': '子'
    },
    fortune: 2, // 中凶
    description: '桃花临身，多主情欲'
  },

  // 华盖 (华盖)
  HUA_GAI: {
    // 寅午戌见戌, 巳酉丑见丑, 申子辰见辰, 亥卯未见未
    branches: {
      '寅': '戌', '午': '戌', '戌': '戌',
      '巳': '丑', '酉': '丑', '丑': '丑',
      '申': '辰', '子': '辰', '辰': '辰',
      '亥': '未', '卯': '未', '未': '未'
    },
    fortune: 2, // 中凶
    description: '华盖临身，多主孤独'
  }
};

// ==================== Earthly Branch Relationships (地支关系) ====================

// 六合
export const LIU_HE = {
  // 子丑合土, 寅亥合木, 卯戌合火, 辰酉合金, 巳申合水, 午未合火
  combinations: [
    { branch1: '子', branch2: '丑', element: '土', relationship: '六合' },
    { branch1: '寅', branch2: '亥', element: '木', relationship: '六合' },
    { branch1: '卯', branch2: '戌', element: '火', relationship: '六合' },
    { branch1: '辰', branch2: '酉', element: '金', relationship: '六合' },
    { branch1: '巳', branch2: '申', element: '水', relationship: '六合' },
    { branch1: '午', branch2: '未', element: '火', relationship: '六合' }
  ],
  fortune: 4, // 吉
  description: '六合相生，贵人相助'
};

// 六冲
export const LIU_CHONG = {
  // 子午冲, 丑未冲, 寅申冲, 卯酉冲, 辰戌冲, 巳亥冲
  clashes: [
    { branch1: '子', branch2: '午', relationship: '六冲' },
    { branch1: '丑', branch2: '未', relationship: '六冲' },
    { branch1: '寅', branch2: '申', relationship: '六冲' },
    { branch1: '卯', branch2: '酉', relationship: '六冲' },
    { branch1: '辰', branch2: '戌', relationship: '六冲' },
    { branch1: '巳', branch2: '亥', relationship: '六冲' }
  ],
  fortune: 1, // 大凶
  description: '六冲相克，多有阻隔'
};

// 三合
export const SAN_HE = {
  // 申子辰合水局, 寅午戌合火局, 巳酉丑合金局, 亥卯未合木局
  harmonies: [
    { branches: ['申', '子', '辰'], element: '水', name: '水局' },
    { branches: ['寅', '午', '戌'], element: '火', name: '火局' },
    { branches: ['巳', '酉', '丑'], element: '金', name: '金局' },
    { branches: ['亥', '卯', '未'], element: '木', name: '木局' }
  ],
  fortune: 4, // 吉
  description: '三合成局，力量增强'
};

// 三会
export const SAN_HUI = {
  // 寅卯辰会木, 巳午未会火, 申酉戌会金, 亥子丑会水
  meetings: [
    { branches: ['寅', '卯', '辰'], element: '木', name: '东方木局' },
    { branches: ['巳', '午', '未'], element: '火', name: '南方火局' },
    { branches: ['申', '酉', '戌'], element: '金', name: '西方金局' },
    { branches: ['亥', '子', '丑'], element: '水', name: '北方水局' }
  ],
  fortune: 5, // 大吉
  description: '三会成方，气场最强'
};

// 方
export const FANG = {
  // 东方: 寅卯辰, 南方: 巳午未, 西方: 申酉戌, 北方: 亥子丑
  directions: {
    east: ['寅', '卯', '辰'],
    south: ['巳', '午', '未'],
    west: ['申', '酉', '戌'],
    north: ['亥', '子', '丑']
  },
  fortune: 4, // 吉
  description: '同方相助，气场增强'
};

// 刑
export const XING = {
  // 子卯刑, 寅巳申相刑, 丑未戌相刑, 辰辰自刑, 午午自刑, 酉酉自刑
  punishments: [
    { branch1: '子', branch2: '卯', type: '无礼之刑' },
    { branches: ['寅', '巳', '申'], type: '无恩之刑' },
    { branches: ['丑', '未', '戌'], type: '恃势之刑' },
    { branch1: '辰', branch2: '辰', type: '自刑' },
    { branch1: '午', branch2: '午', type: '自刑' },
    { branch1: '酉', branch2: '酉', type: '自刑' }
  ],
  fortune: 2, // 中凶
  description: '刑冲相加，多有磨难'
};

// ==================== Elemental Prosperity States (旺相休囚死) ====================

// 五行四季状态 (Seasonal Five Element States)
export const WANG_XIANG_XIU_QIU_SI = {
  spring: {
    name: '春季',
    months: ['寅', '卯', '辰'], // 农历正、二、三月
    states: {
      木: { state: '旺', strength: 5, description: '木旺春月，气势正盛' },
      火: { state: '相', strength: 4, description: '火相春月，次旺之象' },
      土: { state: '死', strength: 1, description: '土死春月，气数已尽' },
      金: { state: '囚', strength: 2, description: '金囚春月，受制无力' },
      水: { state: '休', strength: 3, description: '水休春月，退藏之象' }
    }
  },
  summer: {
    name: '夏季',
    months: ['巳', '午', '未'], // 农历四、五、六月
    states: {
      火: { state: '旺', strength: 5, description: '火旺夏月，气势正盛' },
      土: { state: '相', strength: 4, description: '土相夏月，次旺之象' },
      金: { state: '死', strength: 1, description: '金死夏月，气数已尽' },
      水: { state: '囚', strength: 2, description: '水囚夏月，受制无力' },
      木: { state: '休', strength: 3, description: '木休夏月，退藏之象' }
    }
  },
  lateSummer: {
    name: '长夏',
    months: ['辰', '戌', '丑', '未'], // 四季月
    states: {
      土: { state: '旺', strength: 5, description: '土旺长夏，气势正盛' },
      金: { state: '相', strength: 4, description: '金相长夏，次旺之象' },
      水: { state: '死', strength: 1, description: '水死长夏，气数已尽' },
      木: { state: '囚', strength: 2, description: '木囚长夏，受制无力' },
      火: { state: '休', strength: 3, description: '火休长夏，退藏之象' }
    }
  },
  autumn: {
    name: '秋季',
    months: ['申', '酉', '戌'], // 农历七、八、九月
    states: {
      金: { state: '旺', strength: 5, description: '金旺秋月，气势正盛' },
      水: { state: '相', strength: 4, description: '水相秋月，次旺之象' },
      木: { state: '死', strength: 1, description: '木死秋月，气数已尽' },
      火: { state: '囚', strength: 2, description: '火囚秋月，受制无力' },
      土: { state: '休', strength: 3, description: '土休秋月，退藏之象' }
    }
  },
  winter: {
    name: '冬季',
    months: ['亥', '子', '丑'], // 农历十、十一、十二月
    states: {
      水: { state: '旺', strength: 5, description: '水旺冬月，气势正盛' },
      木: { state: '相', strength: 4, description: '木相冬月，次旺之象' },
      火: { state: '死', strength: 1, description: '火死冬月，气数已尽' },
      土: { state: '囚', strength: 2, description: '土囚冬月，受制无力' },
      金: { state: '休', strength: 3, description: '金休冬月，退藏之象' }
    }
  }
};

// ==================== Constants specific to Da Liu Ren UI ====================

export const GOLD = "rgba(200,168,75,";

// 天干地支系统
export const HEAVENLY_STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
export const EARTHLY_BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

// 十二天将 - Traditional twelve heavenly generals
export const TWELVE_HEAVENLY_GENERALS = ["贵人","螣蛇","朱雀","六合","勾陈","青龙","天空","白虎","太常","玄武","太阴","天后"];

// 十二天将吉凶值
export const TWELVE_GENERALS_FORTUNE = {
  "贵人": 5, "螣蛇": 3, "朱雀": 4, "六合": 4, "勾陈": 2, "青龙": 5,
  "天空": 2, "白虎": 1, "太常": 4, "玄武": 3, "太阴": 3, "天后": 4
};

// Legacy six gods for backward compatibility
export const GODS = ["青龙","朱雀","勾陈","腾蛇","白虎","玄武","太常"];

// 六神吉凶值
export const GODS_FORTUNE = {
  "青龙": 5, "朱雀": 4, "勾陈": 1, "腾蛇": 3, "白虎": 1, "玄武": 3, "太常": 4
};

// 六亲
export const RELATIVES = ["父母","兄弟","子孙","妻财","官鬼"];
