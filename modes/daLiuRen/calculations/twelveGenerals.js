import {
  EARTHLY_BRANCHES,
  TWELVE_HEAVENLY_GENERALS,
  TWELVE_GENERALS,
  getBranchElement,
  isControllingRelationship
} from '../data.js';

// 寄宫 - Day stem's temporary residence branch
// 正确的十干寄宫: 甲→寅、乙→辰、丙→巳、丁→未、戊→巳、己→未、庚→申、辛→戌、壬→亥、癸→丑
export function getJiGong(dayStem) {
  const jiGongMap = {
    '甲': '寅',  // 甲寄寅
    '乙': '辰',  // 乙寄辰
    '丙': '巳',  // 丙寄巳
    '丁': '未',  // 丁寄未
    '戊': '巳',  // 戊寄巳
    '己': '未',  // 己寄未
    '庚': '申',  // 庚寄申
    '辛': '戌',  // 辛寄戌
    '壬': '亥',  // 壬寄亥
    '癸': '丑'   // 癸寄丑
  };
  return jiGongMap[dayStem] || '寅';
}

// Get 贵人 position based on day stem
// 昼贵人: 甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，六辛逢马虎，壬癸蛇兔藏
// 夜贵人: 乙己夜贵→申，丙丁夜贵→酉，壬癸夜贵→卯，辛夜贵→寅，甲戊庚夜贵同昼
export function getGuiRenPosition(dayStem, isDay) {
  const guiRenDayMap = {
    '甲': '丑', '戊': '丑', '庚': '丑',  // 甲戊庚: 贵人在丑 (daytime) - 牛羊
    '乙': '子', '己': '子',              // 乙己: 贵人在子 (daytime) - 鼠猴
    '丙': '亥', '丁': '亥',              // 丙丁: 贵人在亥 (daytime) - 猪鸡
    '壬': '巳', '癸': '巳',              // 壬癸: 贵人在巳 (daytime) - 蛇兔
    '辛': '午'                           // 辛: 贵人在午 (daytime) - 马虎
  };

  // 夜贵人 - not just opposite of daytime贵人
  const guiRenNightMap = {
    '甲': '丑', '乙': '申', '丙': '酉', '丁': '酉',
    '戊': '丑', '己': '申', '庚': '丑',
    '壬': '卯', '癸': '卯', '辛': '寅'
  };

  const map = isDay ? guiRenDayMap : guiRenNightMap;
  return map[dayStem] || '丑';
}

// Place all twelve generals based on 贵人 position
export function placeTwelveGenerals(dayStem, isDay) {
  const guiRenBranch = getGuiRenPosition(dayStem, isDay);
  const guiRenIndex = EARTHLY_BRANCHES.indexOf(guiRenBranch);

  const generalPlacement = {};
  EARTHLY_BRANCHES.forEach((branch, index) => {
    const relativeIndex = (index - guiRenIndex + 12) % 12;
    generalPlacement[branch] = {
      general: TWELVE_HEAVENLY_GENERALS[relativeIndex],
      position: relativeIndex,
      isGuiRen: relativeIndex === 0
    };
  });

  return generalPlacement;
}

// Calculate Twelve Heavenly Generals Pan (十二天将盘)
export function calculateGeneralsPan(dayStem, isDay) {
  const guiRenBranch = getGuiRenPosition(dayStem, isDay);
  const guiRenIndex = EARTHLY_BRANCHES.indexOf(guiRenBranch);

  const generalPlacement = {};
  EARTHLY_BRANCHES.forEach((branch, index) => {
    // 昼占：顺时针；夜占：逆时针
    const relativeIndex = isDay
      ? (index - guiRenIndex + 12) % 12
      : (guiRenIndex - index + 12) % 12;

    generalPlacement[branch] = {
      general: TWELVE_GENERALS[relativeIndex],
      position: relativeIndex,
      isGuiRen: relativeIndex === 0
    };
  });

  return generalPlacement;
}

// Find 上神 (upper spirit) on heaven pan for a given branch
export function findUpperSpirit(heavenPan, branch) {
  const heavenData = heavenPan[branch];
  return {
    branch: heavenData.branch
  };
}
