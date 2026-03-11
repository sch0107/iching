import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FIVE_ELEMENTS,
  ELEMENT_RELATIONSHIPS,
  TWELVE_GENERALS,
  SITUATIONS,
  TRANSMISSION_TYPES,
  CLASS_TYPES,
  BRANCH_ELEMENTS,
  STEM_ELEMENTS,
  getBranchElement,
  getStemElement,
  isGeneratingRelationship,
  isControllingRelationship,
  getElementRelationship,
  getGeneralByPosition,
  calculateBalanceScore,
  isElementsBalanced,
  countElements,
  TIAN_YI_GUI_REN,
  YUE_DE,
  YUE_HE,
  SAN_QI,
  LIU_YI,
  SHEN_SHA,
  LIU_HE,
  LIU_CHONG,
  SAN_HE,
  SAN_HUI,
  FANG,
  XING,
  WANG_XIANG_XIU_QIU_SI
} from './daLiuRenData.js';

const GOLD = "rgba(200,168,75,";

// 天干地支系统
const HEAVENLY_STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EARTHLY_BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

// 十二天将 - Traditional twelve heavenly generals
const TWELVE_HEAVENLY_GENERALS = ["贵人","螣蛇","朱雀","六合","勾陈","青龙","天空","白虎","太常","玄武","太阴","天后"];

// 十二天将吉凶值
const TWELVE_GENERALS_FORTUNE = {
  "贵人": 5, "螣蛇": 3, "朱雀": 4, "六合": 4, "勾陈": 2, "青龙": 5,
  "天空": 2, "白虎": 1, "太常": 4, "玄武": 3, "太阴": 3, "天后": 4
};

// Legacy six gods for backward compatibility
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

// Traditional stem-branch calculation (enhanced for full Da Liu Ren)
function calculateStemBranchTraditional(year, month, day, hour) {
  // Calculate year in the 60-year sexagenary cycle
  const sexagenaryYear = calculateSexagenaryYear(year);
  const yearStemIndex = sexagenaryYear % 10;
  const yearBranchIndex = sexagenaryYear % 12;

  // Month stem: traditional 五虎遁 method
  // Formula: 甲己之年丙作首, 乙庚之年戊为头, 丙辛之年庚为上, 丁壬之年壬为居, 戊癸之年甲为魁
  // First lunar month is 寅月 (index 2)
  const monthBranchIndex = (month + 1) % 12; // 正月=寅月 (index 2)
  const monthStemIndex = (yearStemIndex * 2 + monthBranchIndex) % 10;

  // Day stem and branch (accurate calculation using 60甲子 cycle)
  const dayStemBranch = calculateDayStemBranchAccurate(year, month, day);

  // Hour stem: traditional method (五鼠遁)
  // Formula: 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
  const hourBranchIndex = (hour - 1) % 12;
  const hourStemIndex = calculateHourStemIndex(dayStemBranch.stemIndex, hourBranchIndex);

  return {
    year: {
      stem: HEAVENLY_STEMS[yearStemIndex],
      stemIndex: yearStemIndex,
      branch: EARTHLY_BRANCHES[yearBranchIndex],
      branchIndex: yearBranchIndex
    },
    month: {
      stem: HEAVENLY_STEMS[monthStemIndex],
      stemIndex: monthStemIndex,
      branch: EARTHLY_BRANCHES[monthBranchIndex],
      branchIndex: monthBranchIndex
    },
    day: {
      stem: HEAVENLY_STEMS[dayStemBranch.stemIndex],
      stemIndex: dayStemBranch.stemIndex,
      branch: EARTHLY_BRANCHES[dayStemBranch.branchIndex],
      branchIndex: dayStemBranch.branchIndex
    },
    hour: {
      stem: HEAVENLY_STEMS[hourStemIndex],
      stemIndex: hourStemIndex,
      branch: EARTHLY_BRANCHES[hourBranchIndex],
      branchIndex: hourBranchIndex
    }
  };
}

// Calculate position in 60-year sexagenary cycle
function calculateSexagenaryYear(year) {
  // Reference: 1984 is 甲子 (1st year of cycle)
  const referenceYear = 1984;
  const offset = year - referenceYear;
  return ((offset % 60) + 60) % 60;
}

// Calculate day stem and branch (accurate calculation)
function calculateDayStemBranchAccurate(year, month, day) {
  // Reference: January 1, 1949 is 甲子
  // This is a commonly used reference point in traditional Chinese calendars
  const daysSinceReference = calculateDaysSinceReference(year, month, day);

  const referenceStemIndex = 0; // 甲
  const referenceBranchIndex = 0; // 子

  const stemIndex = (referenceStemIndex + daysSinceReference) % 10;
  const branchIndex = (referenceBranchIndex + daysSinceReference) % 12;

  return { stemIndex, branchIndex };
}

// Calculate hour stem index using traditional 五鼠遁 method
function calculateHourStemIndex(dayStemIndex, hourBranchIndex) {
  // Traditional formula: 甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
  // This maps day stems to the starting stem for 子时 (hourBranchIndex = 0)
  const baseStemForZi = {
    0: 0,  // 甲日：子时为甲
    1: 2,  // 乙日：子时为丙
    2: 4,  // 丙日：子时为戊
    3: 6,  // 丁日：子时为庚
    4: 8,  // 戊日：子时为壬
    5: 0,  // 己日：子时为甲 (same as 甲)
    6: 2,  // 庚日：子时为丙 (same as 乙)
    7: 4,  // 辛日：子时为戊 (same as 丙)
    8: 6,  // 壬日：子时为庚 (same as 丁)
    9: 8   // 癸日：子时为壬 (same as 戊)
  };

  const baseStem = baseStemForZi[dayStemIndex];
  const hourStemIndex = (baseStem + hourBranchIndex) % 10;

  return hourStemIndex;
}

// Calculate days since reference date (with proper leap year handling)
function calculateDaysSinceReference(year, month, day) {
  // Reference: January 1, 1949 is 甲子
  const referenceYear = 1949;
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let days = 0;

  // Add days for each year
  for (let y = referenceYear; y < year; y++) {
    days += isLeapYear(y) ? 366 : 365;
  }

  // Add days for each month
  for (let i = 0; i < month - 1; i++) {
    days += daysPerMonth[i];
    // Add leap day for February
    if (i === 1 && isLeapYear(year)) {
      days += 1;
    }
  }

  // Add days
  days += day - 1;

  return days;
}

// Check if a year is a leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 计算六神 (DEPRECATED - replaced by twelve generals placement)
function calculateGods(stemBranch) {
  // 甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉、甲戌、乙亥
  // 按天干地支组合确定六神
  const stemIndex = HEAVENLY_STEMS.indexOf(stemBranch.stem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(stemBranch.branch);

  // 六神计算规则（简化版传统大六壬）
  const godIndex = (stemIndex + branchIndex) % 6;
  return GODS[godIndex];
}

// 计算六亲 with proper element logic
function calculateRelatives(dayStem, targetBranch) {
  const dayStemElement = getStemElement(dayStem);
  const targetElement = getBranchElement(targetBranch);

  // Determine relationship based on five elements
  if (dayStemElement === targetElement) {
    return '兄弟'; // Same element: 比和
  }

  if (isGeneratingRelationship(dayStemElement, targetElement)) {
    return '子孙'; // I generate the target: 子孙
  }

  if (isGeneratingRelationship(targetElement, dayStemElement)) {
    return '父母'; // Target generates me: 父母
  }

  if (isControllingRelationship(dayStemElement, targetElement)) {
    return '妻财'; // I control the target: 妻财
  }

  if (isControllingRelationship(targetElement, dayStemElement)) {
    return '官鬼'; // Target controls me: 官鬼
  }

  return '兄弟'; // Fallback
}

// Legacy version for backward compatibility
function calculateRelativesLegacy(god) {
  const godIndex = GODS.indexOf(god);
  return RELATIVES[godIndex % 4];
}

// 寄宫 - Day stem's temporary residence branch
// 正确的十干寄宫: 甲→寅、乙→辰、丙→巳、丁→未、戊→巳、己→未、庚→申、辛→戌、壬→亥、癸→丑
function getJiGong(dayStem) {
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
function getGuiRenPosition(dayStem, isDay) {
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
function placeTwelveGenerals(dayStem, isDay) {
  const guiRenBranch = getGuiRenPosition(dayStem, isDay);
  const guiRenIndex = EARTHLY_BRANCHES.indexOf(guiRenBranch);

  // Place 贵人 at determined position, then place other generals clockwise
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

// Calculate vacancies based on 旬 (60甲子 cycle)
function calculateVacanciesByXun(dayStemIndex, dayBranchIndex) {
  // Calculate position in 60甲子 cycle (0-59)
  // Find the 旬 (group of 10) that contains this day pillar
  // In 60甲子: 甲子(0), 乙丑(1), ..., 癸酉(9) = 第一旬 (甲子旬)
  //            甲戌(10), 乙亥(11), ..., 癸未(19) = 第二旬 (甲戌旬)
  //            etc.

  // Each 旬 has 10 stems and 12 branches total
  // The two branches not in the 旬 are the vacancies (空亡)

  const dayPosition = calculateSexagenaryPosition(dayStemIndex, dayBranchIndex);
  const xunIndex = Math.floor(dayPosition / 10); // 0-5 (six 旬s)

  // Calculate which branches are in this 旬
  const branchesInXun = [];
  for (let i = 0; i < 10; i++) {
    const position = xunIndex * 10 + i;
    const branchIndex = position % 12;
    branchesInXun.push(EARTHLY_BRANCHES[branchIndex]);
  }

  // Find which branches are NOT in the 旬 (these are vacancies)
  const vacantBranches = EARTHLY_BRANCHES.filter(branch => !branchesInXun.includes(branch));

  return {
    stem: HEAVENLY_STEMS[dayStemIndex],
    stemIndex: dayStemIndex,
    branch: EARTHLY_BRANCHES[dayBranchIndex],
    branchIndex: dayBranchIndex,
    xunIndex: xunIndex,
    xunName: ['甲子旬', '甲戌旬', '甲申旬', '甲午旬', '甲辰旬', '甲寅旬'][xunIndex],
    vacantBranches: vacantBranches,
    description: `天干${HEAVENLY_STEMS[dayStemIndex]}${EARTHLY_BRANCHES[dayBranchIndex]}属于${['甲子旬', '甲戌旬', '甲申旬', '甲午旬', '甲辰旬', '甲寅旬'][xunIndex]}，空亡地支：${vacantBranches.join('、')}`
  };
}

// Calculate position in 60甲子 cycle
function calculateSexagenaryPosition(stemIndex, branchIndex) {
  // Find the position (0-59) where the given stem and branch combine
  // This is the least common multiple of (position % 10 == stemIndex) and (position % 12 == branchIndex)

  for (let pos = 0; pos < 60; pos++) {
    if (pos % 10 === stemIndex && pos % 12 === branchIndex) {
      return pos;
    }
  }
  return 0; // Should not happen with valid input
}

// Solar term data (节气)
// Each lunar month has two solar terms: 节气 and 中气
const SOLAR_TERMS = [
  { name: '立春', month: 1, day: 4 },   // Spring begins
  { name: '雨水', month: 2, day: 19 },  // Rain water - 月将 changes to 亥将
  { name: '惊蛰', month: 3, day: 6 },
  { name: '春分', month: 3, day: 21 },  // Spring equinox - 月将 changes to 戌将
  { name: '清明', month: 4, day: 5 },
  { name: '谷雨', month: 4, day: 20 },  // Grain rain - 月将 changes to 酉将
  { name: '立夏', month: 5, day: 6 },
  { name: '小满', month: 5, day: 21 },  // Grain full - 月将 changes to 申将
  { name: '芒种', month: 6, day: 6 },
  { name: '夏至', month: 6, day: 21 },  // Summer solstice - 月将 changes to 未将
  { name: '小暑', month: 7, day: 7 },
  { name: '大暑', month: 7, day: 23 },  // Great heat - 月将 changes to 午将
  { name: '立秋', month: 8, day: 8 },
  { name: '处暑', month: 8, day: 23 },  // Limit of heat - 月将 changes to 巳将
  { name: '白露', month: 9, day: 8 },
  { name: '秋分', month: 9, day: 23 },  // Autumn equinox - 月将 changes to 辰将
  { name: '寒露', month: 10, day: 8 },
  { name: '霜降', month: 10, day: 23 }, // Frost descent - 月将 changes to 卯将
  { name: '立冬', month: 11, day: 7 },
  { name: '小雪', month: 11, day: 22 }, // Light snow - 月将 changes to 寅将
  { name: '大雪', month: 12, day: 7 },
  { name: '冬至', month: 12, day: 22 }, // Winter solstice - 月将 changes to 丑将
  { name: '小寒', month: 1, day: 6 },
  { name: '大寒', month: 1, day: 20 }   // Great cold - 月将 changes to 子将
];

// 月将 - Monthly general based on solar term
const YUE_JIANG = {
  '亥将': { branch: '亥', index: 11, description: '雨水后起亥将' },
  '戌将': { branch: '戌', index: 10, description: '春分后起戌将' },
  '酉将': { branch: '酉', index: 9,  description: '谷雨后起酉将' },
  '申将': { branch: '申', index: 8,  description: '小满后起申将' },
  '未将': { branch: '未', index: 7,  description: '夏至后起未将' },
  '午将': { branch: '午', index: 6,  description: '大暑后起午将' },
  '巳将': { branch: '巳', index: 5,  description: '处暑后起巳将' },
  '辰将': { branch: '辰', index: 4,  description: '秋分后起辰将' },
  '卯将': { branch: '卯', index: 3,  description: '霜降后起卯将' },
  '寅将': { branch: '寅', index: 2,  description: '小雪后起寅将' },
  '丑将': { branch: '丑', index: 1,  description: '冬至后起丑将' },
  '子将': { branch: '子', index: 0,  description: '大寒后起子将' }
};

// Precise solar term dates for different years (extended range: 2020-2030)
const SOLAR_TERMS_PRECISE = [
  { name: '雨水', year2020: '02-19', year2021: '02-18', year2022: '02-19', year2023: '02-19', year2024: '02-19', year2025: '02-18', year2026: '02-18', year2027: '02-19', year2028: '02-19', year2029: '02-18', year2030: '02-18', yueJiang: '亥将' },
  { name: '春分', year2020: '03-20', year2021: '03-20', year2022: '03-20', year2023: '03-21', year2024: '03-20', year2025: '03-20', year2026: '03-20', year2027: '03-20', year2028: '03-20', year2029: '03-20', year2030: '03-20', yueJiang: '戌将' },
  { name: '谷雨', year2020: '04-19', year2021: '04-20', year2022: '04-20', year2023: '04-20', year2024: '04-19', year2025: '04-20', year2026: '04-19', year2027: '04-20', year2028: '04-19', year2029: '04-20', year2030: '04-20', yueJiang: '酉将' },
  { name: '小满', year2020: '05-20', year2021: '05-21', year2022: '05-21', year2023: '05-21', year2024: '05-21', year2025: '05-21', year2026: '05-20', year2027: '05-21', year2028: '05-20', year2029: '05-21', year2030: '05-21', yueJiang: '申将' },
  { name: '夏至', year2020: '06-21', year2021: '06-21', year2022: '06-21', year2023: '06-21', year2024: '06-21', year2025: '06-21', year2026: '06-21', year2027: '06-21', year2028: '06-21', year2029: '06-21', year2030: '06-21', yueJiang: '未将' },
  { name: '大暑', year2020: '07-22', year2021: '07-22', year2022: '07-23', year2023: '07-23', year2024: '07-22', year2025: '07-22', year2026: '07-22', year2027: '07-22', year2028: '07-22', year2029: '07-22', year2030: '07-22', yueJiang: '午将' },
  { name: '处暑', year2020: '08-22', year2021: '08-23', year2022: '08-23', year2023: '08-23', year2024: '08-22', year2025: '08-23', year2026: '08-23', year2027: '08-23', year2028: '08-22', year2029: '08-23', year2030: '08-23', yueJiang: '巳将' },
  { name: '秋分', year2020: '09-22', year2021: '09-23', year2022: '09-23', year2023: '09-23', year2024: '09-22', year2025: '09-23', year2026: '09-22', year2027: '09-23', year2028: '09-22', year2029: '09-23', year2030: '09-22', yueJiang: '辰将' },
  { name: '霜降', year2020: '10-23', year2021: '10-23', year2022: '10-23', year2023: '10-24', year2024: '10-23', year2025: '10-23', year2026: '10-23', year2027: '10-23', year2028: '10-23', year2029: '10-23', year2030: '10-23', yueJiang: '卯将' },
  { name: '小雪', year2020: '11-22', year2021: '11-22', year2022: '11-22', year2023: '11-22', year2024: '11-22', year2025: '11-22', year2026: '11-22', year2027: '11-22', year2028: '11-22', year2029: '11-22', year2030: '11-22', yueJiang: '寅将' },
  { name: '冬至', year2020: '12-21', year2021: '12-21', year2022: '12-22', year2023: '12-22', year2024: '12-21', year2025: '12-21', year2026: '12-21', year2027: '12-21', year2028: '12-21', year2029: '12-21', year2030: '12-21', yueJiang: '丑将' },
  { name: '大寒', year2020: '01-20', year2021: '01-20', year2022: '01-20', year2023: '01-20', year2024: '01-20', year2025: '01-20', year2026: '01-20', year2027: '01-20', year2028: '01-20', year2029: '01-20', year2030: '01-20', yueJiang: '子将' }
];

// Determine 月将 based on date and solar term
function determineYueJiang(year, month, day) {
  const dateObj = new Date(year, month - 1, day);
  const dayOfYear = Math.floor((dateObj - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24));

  // Handle early January (before 大寒 - January 20)
  if (month === 1 && day < 20) {
    // Use previous year's 大寒 as reference
    const prevYear = year - 1;
    const prevDaHanDate = SOLAR_TERMS_PRECISE.find(st => st.name === '大寒')[`year${prevYear}`] || '01-20';
    const [prevMonth, prevDay] = prevDaHanDate.split('-').map(Number);
    const prevDayOfYear = Math.floor((new Date(prevYear, prevMonth - 1, prevDay) - new Date(prevYear, 0, 1)) / (1000 * 60 * 60 * 24));

    // Calculate days from previous year's 大寒 to current date
    const daysFromDaHan = dayOfYear + (365 + (isLeapYear(prevYear) ? 1 : 0) - prevDayOfYear);

    // Determine 月将 based on days from 大寒
    // Each 月将 period is approximately 30 days
    // 0-30 days after 大寒: 子将
    // 30-60 days after 大寒: 丑将, etc.
    const yueJiangOrder = ['子将', '丑将', '寅将', '卯将', '辰将', '巳将', '午将', '未将', '申将', '酉将', '戌将', '亥将'];
    const index = Math.floor(daysFromDaHan / 30) % 12;
    return YUE_JIANG[yueJiangOrder[index]];
  }

  // For other dates, find the most recent solar term
  let mostRecentTerm = null;
  let maxDayOfYear = -1;

  for (const solarTerm of SOLAR_TERMS_PRECISE) {
    const termDate = solarTerm[`year${year}`] || solarTerm.year2026;
    const [termMonth, termDay] = termDate.split('-').map(Number);
    const termDayOfYear = Math.floor((new Date(year, termMonth - 1, termDay) - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24));

    if (termDayOfYear <= dayOfYear && termDayOfYear > maxDayOfYear) {
      maxDayOfYear = termDayOfYear;
      mostRecentTerm = solarTerm;
    }
  }

  if (mostRecentTerm) {
    return YUE_JIANG[mostRecentTerm.yueJiang];
  }

  // Default to 子将 if no term found
  return YUE_JIANG['子将'];
}

// Calculate Three Transmissions (三傳) using traditional 九宗门 methods
function calculateThreeTransmissions(stemBranch, classes, heavenPan, generalsPan, funMode, isDay) {
  const { day } = stemBranch;

  if (funMode) {
    // Fun mode: favorable generals
    const favorableGenerals = TWELVE_GENERALS.filter(g => g.fortune >= 4);
    return {
      first: {
        general: favorableGenerals[0],
        element: favorableGenerals[0].element,
        description: favorableGenerals[0].description,
        type: TRANSMISSION_TYPES.first
      },
      second: {
        general: favorableGenerals[1],
        element: favorableGenerals[1].element,
        description: favorableGenerals[1].description,
        type: TRANSMISSION_TYPES.second
      },
      third: {
        general: favorableGenerals[2],
        element: favorableGenerals[2].element,
        description: favorableGenerals[2].description,
        type: TRANSMISSION_TYPES.third
      }
    };
  }

  // Traditional method using 九宗门
  // First, check for 贼克 (lower controlling upper)
  const zeiKeClasses = findZeiKeClasses(classes, heavenPan);

  // If only one 贼克, use 贼克法 directly
  if (zeiKeClasses.length === 1) {
    return useZeiKeMethod(zeiKeClasses[0], heavenPan, generalsPan, day);
  }

  // If multiple 贼克, use 涉害法 to compare depth
  if (zeiKeClasses.length > 1) {
    const sheHaiResult = trySheHaiMethod(zeiKeClasses, heavenPan, generalsPan, day);
    if (sheHaiResult) {
      return sheHaiResult;
    }
  }

  // If no 贼克, try 遥克法
  const yaoKeResult = tryYaoKeMethod(classes, heavenPan, generalsPan, day);
  if (yaoKeResult) {
    return yaoKeResult;
  }

  // Fallback: use 八专法 > 别责法 > 昴星法
  return tryFallbackMethod(classes, heavenPan, generalsPan, stemBranch);
}

// Find all 贼克 (lower controlling upper) classes
function findZeiKeClasses(classes, heavenPan) {
  const zeiKeClasses = [];

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i];
    const stemElement = getStemElement(cls.stem);
    const branchElement = getBranchElement(cls.branch);

    // Check if lower (branch element) controls upper (stem element) - "下贼上"
    if (isControllingRelationship(branchElement, stemElement)) {
      zeiKeClasses.push({
        class: cls,
        depth: calculateHarmDepth(cls, heavenPan)
      });
    }
  }

  return zeiKeClasses;
}

// Use 贼克法 when only one 贼克 exists
function useZeiKeMethod(zeiKeClass, heavenPan, generalsPan, day) {
  const firstTransmission = {
    general: zeiKeClass.class.general,
    element: zeiKeClass.class.element,
    description: `贼克法：${zeiKeClass.class.stem}${zeiKeClass.class.branch}，下克上`,
    type: TRANSMISSION_TYPES.first
  };

  // Calculate second and third transmissions
  const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
  const third = calculateNextTransmission(second, heavenPan, generalsPan);

  return {
    first: firstTransmission,
    second: second,
    third: third
  };
}

// 涉害法 - Compare depth of harm when multiple 贼克
function trySheHaiMethod(zeiKeClasses, heavenPan, generalsPan, day) {
  if (zeiKeClasses.length === 0) {
    return null; // No 贼克 found
  }

  // Select the class with greatest depth of harm
  zeiKeClasses.sort((a, b) => b.depth - a.depth);
  const selected = zeiKeClasses[0].class;

  const firstTransmission = {
    general: selected.general,
    element: selected.element,
    description: `涉害法：${selected.stem}${selected.branch}，最深涉害`,
    type: TRANSMISSION_TYPES.first
  };

  const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
  const third = calculateNextTransmission(second, heavenPan, generalsPan);

  return {
    first: firstTransmission,
    second: second,
    third: third
  };
}

// 遥克法 - Check for distant control when no internal 贼克
function tryYaoKeMethod(classes, heavenPan, generalsPan, day) {
  // Check for 远克 between day stem and branches
  // Priority: day stem controls branch > branch controls day stem
  const dayStem = day.stem;
  const dayStemElement = getStemElement(dayStem);

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i];
    const branchElement = getBranchElement(cls.branch);

    // First priority: day stem controls branch (远克 - 日克支)
    if (isControllingRelationship(dayStemElement, branchElement)) {
      const firstTransmission = {
        general: cls.general,
        element: cls.element,
        description: `遥克法：${day.stem}克${cls.branch}`,
        type: TRANSMISSION_TYPES.first
      };

      const second = calculateNextTransmission(firstTransmission, heavenPan);
      const third = calculateNextTransmission(second, heavenPan);

      return {
        first: firstTransmission,
        second: second,
        third: third
      };
    }

    // Second priority: branch controls day stem (远克 - 支克日)
    if (isControllingRelationship(branchElement, dayStemElement)) {
      const firstTransmission = {
        general: cls.general,
        element: cls.element,
        description: `遥克法：${cls.branch}克${day.stem}`,
        type: TRANSMISSION_TYPES.first
      };

      const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
      const third = calculateNextTransmission(second, heavenPan, generalsPan);

      return {
        first: firstTransmission,
        second: second,
        third: third
      };
    }
  }

  return null; // No 远克 found
}

// Fallback methods: 八专法 > 别责法 > 昴星法
function tryFallbackMethod(classes, heavenPan, generalsPan, stemBranch) {
  // 优先级：八专法 > 别责法 > 昴星法

  // 尝试八专法
  const baZhuanResult = tryBaZhuanMethod(stemBranch, heavenPan, generalsPan);
  if (baZhuanResult) {
    return baZhuanResult;
  }

  // 尝试别责法
  const bieZeResult = tryBieZeMethod(classes, heavenPan, generalsPan);
  if (bieZeResult) {
    return bieZeResult;
  }

  // 最后使用昴星法（带昼夜选择）
  return tryMaoXingMethod(heavenPan, generalsPan, isDay);
}

// 八专法 - For 甲 or 己 days, use the upper spirit on day branch
function tryBaZhuanMethod(stemBranch, heavenPan, generalsPan) {
  const { day } = stemBranch;
  // 检查日干是否为甲或己
  if (day.stem !== '甲' && day.stem !== '己') {
    return null;
  }

  // 八专法：取日支的上神
  const dayBranchUpperSpirit = findUpperSpirit(heavenPan, day.branch);
  const firstTransmission = {
    general: generalsPan ? generalsPan[dayBranchUpperSpirit.branch].general : null,
    element: getBranchElement(dayBranchUpperSpirit.branch),
    description: '八专法：日支上神',
    type: TRANSMISSION_TYPES.first
  };

  const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
  const third = calculateNextTransmission(second, heavenPan, generalsPan);

  return {
    first: firstTransmission,
    second: second,
    third: third
  };
}

// 别责法 - When there are duplicate branches in the four classes
function tryBieZeMethod(classes, heavenPan, generalsPan) {
  // 检查是否有两个相同的地支
  const branchCounts = {};
  classes.forEach(cls => {
    branchCounts[cls.branch] = (branchCounts[cls.branch] || 0) + 1;
  });

  const duplicateBranch = Object.keys(branchCounts).find(
    branch => branchCounts[branch] >= 2
  );

  if (duplicateBranch) {
    const duplicateBranchUpperSpirit = findUpperSpirit(heavenPan, duplicateBranch);
    const firstTransmission = {
      general: generalsPan ? generalsPan[duplicateBranchUpperSpirit.branch].general : null,
      element: getBranchElement(duplicateBranchUpperSpirit.branch),
      description: `别责法：${duplicateBranch}`,
      type: TRANSMISSION_TYPES.first
    };

    const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
    const third = calculateNextTransmission(second, heavenPan, generalsPan);

    return {
      first: firstTransmission,
      second: second,
      third: third
    };
  }

  return null;
}

// 昴星法 - Use 酉 for daytime, 卯 for nighttime
function tryMaoXingMethod(heavenPan, generalsPan, isDay) {
  // 昴星法：昼取酉，夜取卯
  const targetBranch = isDay ? '酉' : '卯';

  const targetBranchUpperSpirit = findUpperSpirit(heavenPan, targetBranch);
  const firstTransmission = {
    general: generalsPan ? generalsPan[targetBranchUpperSpirit.branch].general : null,
    element: getBranchElement(targetBranchUpperSpirit.branch),
    description: `昴星法：${targetBranch}上神`,
    type: TRANSMISSION_TYPES.first
  };

  const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
  const third = calculateNextTransmission(second, heavenPan, generalsPan);

  return {
    first: firstTransmission,
    second: second,
    third: third
  };
}

// Calculate harm depth for 涉害法
function calculateHarmDepth(cls, heavenPan) {
  // Traditional 涉害法 depth calculation:
  // Count the number of branches that are "harmed" (controlled by the original branch's element)
  // along the path from the original branch to its upper spirit on the heaven pan
  let depth = 0;

  const branchIndex = EARTHLY_BRANCHES.indexOf(cls.branch);
  const upperBranch = heavenPan[cls.branch].branch;
  const upperIndex = EARTHLY_BRANCHES.indexOf(upperBranch);

  // Calculate the branch element of the original branch
  const branchElement = getBranchElement(cls.branch);

  // Count branches that are controlled by the original branch element along the path
  // Traditional method: trace from original branch to upper spirit (clockwise),
  // counting branches that the original branch controls (i.e., branches it harms)
  let currentIndex = branchIndex;
  while (currentIndex !== upperIndex) {
    currentIndex = (currentIndex + 1) % 12;
    const currentBranch = EARTHLY_BRANCHES[currentIndex];
    const currentElement = getBranchElement(currentBranch);

    // Check if this branch is controlled by the original branch element
    // (i.e., the original branch "harms" this branch)
    if (isControllingRelationship(branchElement, currentElement)) {
      depth++;
    }
  }

  return depth;
}

// Calculate next transmission based on current transmission
function calculateNextTransmission(currentTransmission, heavenPan, generalsPan) {
  // Find the branch corresponding to current general using generalsPan
  let branchIndex = -1;
  for (let i = 0; i < EARTHLY_BRANCHES.length; i++) {
    const branch = EARTHLY_BRANCHES[i];
    if (generalsPan[branch].general.name === currentTransmission.general.name) {
      branchIndex = i;
      break;
    }
  }

  if (branchIndex === -1) {
    // Fallback: use next general in sequence
    const currentIndex = TWELVE_GENERALS.findIndex(g => g.name === currentTransmission.general.name);
    const nextIndex = (currentIndex + 1) % 12;
    return {
      general: TWELVE_GENERALS[nextIndex],
      element: TWELVE_GENERALS[nextIndex].element,
      description: '续传',
      type: '续传'
    };
  }

  // Get the upper branch for this position using heavenPan
  const upperBranch = heavenPan[EARTHLY_BRANCHES[branchIndex]].branch;

  // Get the general for the upper branch using generalsPan
  const upperGeneral = generalsPan[upperBranch].general;

  return {
    general: upperGeneral,
    element: upperGeneral.element,
    description: `${upperBranch}之${upperGeneral.name}`,
    type: '续传'
  };
}

// Calculate Four Classes (四课) using traditional method
function calculateFourClasses(stemBranch, heavenPan, generalsPan, funMode) {
  const { day } = stemBranch;

  if (funMode) {
    // Fun mode: favorable classes
    return [
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[(day.branchIndex + 3) % 12],
        element: '木',
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[(day.branchIndex + 3) % 12]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.first
      },
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[(day.branchIndex + 6) % 12],
        element: '水',
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[(day.branchIndex + 6) % 12]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.second
      },
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[(day.branchIndex + 9) % 12],
        element: '火',
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[(day.branchIndex + 9) % 12]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.third
      },
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[day.branchIndex],
        element: getStemElement(day.stem),
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[day.branchIndex]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.fourth
      }
    ];
  }

  // Traditional method: Four classes derived using 寄宫 and 上神
  const classes = [];

  // Step 1: Find day stem's 寄宫
  const jiGongBranch = getJiGong(day.stem);

  // Step 2: First class - 寄宫 branch's 上神
  const firstClassUpperSpirit = findUpperSpirit(heavenPan, jiGongBranch);
  const firstClass = {
    stem: day.stem,
    branch: firstClassUpperSpirit.branch,
    element: getBranchElement(firstClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[firstClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(firstClassUpperSpirit.branch)),
    type: CLASS_TYPES.first,
    jiGong: jiGongBranch
  };
  classes.push(firstClass);

  // Step 3: Second class - First class branch's 上神
  const secondClassUpperSpirit = findUpperSpirit(heavenPan, firstClass.branch);
  const secondClass = {
    stem: day.stem,
    branch: secondClassUpperSpirit.branch,
    element: getBranchElement(secondClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[secondClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(secondClassUpperSpirit.branch)),
    type: CLASS_TYPES.second
  };
  classes.push(secondClass);

  // Step 4: Third class - Day branch's 上神
  const thirdClassUpperSpirit = findUpperSpirit(heavenPan, day.branch);
  const thirdClass = {
    stem: day.stem,
    branch: thirdClassUpperSpirit.branch,
    element: getBranchElement(thirdClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[thirdClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(thirdClassUpperSpirit.branch)),
    type: CLASS_TYPES.third
  };
  classes.push(thirdClass);

  // Step 5: Fourth class - Third class branch's 上神
  const fourthClassUpperSpirit = findUpperSpirit(heavenPan, thirdClass.branch);
  const fourthClass = {
    stem: day.stem,
    branch: fourthClassUpperSpirit.branch,
    element: getBranchElement(fourthClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[fourthClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(fourthClassUpperSpirit.branch)),
    type: CLASS_TYPES.fourth
  };
  classes.push(fourthClass);

  return classes;
}

// Calculate single class (legacy - for backward compatibility)
function calculateSingleClass(day, month, classIndex) {
  // Traditional method: each class derived from day stem
  const dayStemElement = getStemElement(day.stem);
  const dayBranchElement = getBranchElement(day.branch);

  // Calculate class branch based on class index and day/moon relationship
  const offset = classIndex * 3;
  const branchIndex = (day.branchIndex + month.branchIndex + offset) % 12;
  const branch = EARTHLY_BRANCHES[branchIndex];
  const branchElement = getBranchElement(branch);

  // Determine relationship
  const relationship = getElementRelationship(dayStemElement, branchElement);

  return {
    stem: day.stem,
    branch,
    element: branchElement,
    relationship,
    type: Object.values(CLASS_TYPES)[classIndex]
  };
}

// Calculate Heaven Pan (天盤) positions using 月将加时 method
function calculateHeavenPan(stemBranch, year, month, day, hour) {
  const { hour: hourPillar } = stemBranch;

  // Determine 月将 based on solar term
  const yueJiang = determineYueJiang(year, month, day);
  const yueJiangBranchIndex = yueJiang.index;

  // Hour branch index (0-11)
  const hourBranchIndex = hourPillar.branchIndex;

  // 月将加时: 月将落在时支的位置上
  // 比如月将=亥(11)、时支=子(0)，天盘子位应该是亥
  // The heaven pan rotates so that the 月将 branch aligns with the hour branch
  // baseRotation should make heavenPan[时支] contain 月将
  const baseRotation = (yueJiangBranchIndex - hourBranchIndex + 12) % 12;

  const heavenPan = {};
  EARTHLY_BRANCHES.forEach((branch, index) => {
    const rotatedIndex = (index + baseRotation) % 12;
    // 修改：只返回天盤地支，不包含天将
    heavenPan[branch] = {
      position: rotatedIndex,
      branch: EARTHLY_BRANCHES[rotatedIndex]
    };
  });

  return heavenPan;
}

// Calculate Twelve Heavenly Generals Pan (十二天将盘)
function calculateGeneralsPan(dayStem, isDay) {
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
// Modified: Only returns branch from heavenPan, general should come from generalsPan
function findUpperSpirit(heavenPan, branch) {
  const heavenData = heavenPan[branch];
  return {
    branch: heavenData.branch
  };
}

// Calculate Earth Pan (地盤) - fixed positions
function calculateEarthPan() {
  const earthPan = {};

  EARTHLY_BRANCHES.forEach((branch, index) => {
    earthPan[branch] = {
      branch: branch,
      position: index,
      element: getBranchElement(branch)
    };
  });

  return earthPan;
}

// Calculate Vacancies (空亡) - Updated to use proper 旬-based logic
function calculateVacancies(dayStemIndex, dayBranchIndex) {
  // Use the proper 旬-based calculation
  return calculateVacanciesByXun(dayStemIndex, dayBranchIndex);
}

// Legacy version for backward compatibility
// Calculate Situation (局)
function calculateSituation(stemBranch) {
  const { day, month } = stemBranch;

  // Traditional method based on day and month relationship
  const combined = (day.stemIndex + month.branchIndex) % 3;

  if (combined === 0) return SITUATIONS.upper;
  if (combined === 1) return SITUATIONS.middle;
  return SITUATIONS.lower;
}

// ==================== Divine Spirit Analysis Functions (神煞分析) ====================

// Calculate Tian Yi Gui Ren (天乙贵人)
function calculateTianYiGuiRen(dayStem) {
  const guiRenBranches = TIAN_YI_GUI_REN.branches[dayStem] || [];
  return {
    branches: guiRenBranches,
    fortune: TIAN_YI_GUI_REN.fortune,
    description: TIAN_YI_GUI_REN.description
  };
}

// Calculate Monthly Virtue and Harmony (月德和月合)
function calculateYueDeHe(monthBranch) {
  const monthNumber = EARTHLY_BRANCHES.indexOf(monthBranch) + 1;
  const yueDeBranch = YUE_DE.monthToBranch[monthNumber];
  const yueHeBranch = YUE_HE.monthToBranch[monthNumber];

  return {
    yueDe: {
      branch: yueDeBranch,
      fortune: YUE_DE.fortune,
      description: YUE_DE.description
    },
    yueHe: {
      branch: yueHeBranch,
      fortune: YUE_HE.fortune,
      description: YUE_HE.description
    }
  };
}

// Calculate Three Marvels and Six Instruments (三奇六仪)
function calculateSanQiLiuYi(dayStem) {
  const sanQiActive = SAN_QI.heavenly.includes(dayStem) ||
                   SAN_QI.earthly.includes(dayStem);
  const liuYiActive = LIU_YI.stems.includes(dayStem);

  return {
    sanQi: {
      active: sanQiActive,
      fortune: sanQiActive ? SAN_QI.fortune : 0,
      description: sanQiActive ? SAN_QI.description : ''
    },
    liuYi: {
      active: liuYiActive,
      fortune: liuYiActive ? LIU_YI.fortune : 0,
      description: liuYiActive ? LIU_YI.description : ''
    }
  };
}

// Calculate Post Horse, Peach Blossom, and Flower Canopy (驿马桃花华盖)
function calculateYiMaTaoHuaHuaGai(dayBranch) {
  return {
    yiMa: {
      branch: SHEN_SHA.YI_MA.branches[dayBranch],
      fortune: SHEN_SHA.YI_MA.fortune,
      description: SHEN_SHA.YI_MA.description
    },
    taoHua: {
      branch: SHEN_SHA.TAO_HUA.branches[dayBranch],
      fortune: SHEN_SHA.TAO_HUA.fortune,
      description: SHEN_SHA.TAO_HUA.description
    },
    huaGai: {
      branch: SHEN_SHA.HUA_GAI.branches[dayBranch],
      fortune: SHEN_SHA.HUA_GAI.fortune,
      description: SHEN_SHA.HUA_GAI.description
    }
  };
}

// Calculate all divine spirits (计算所有神煞)
function calculateAllShenSha(stemBranch) {
  const { day, month } = stemBranch;

  return {
    tianYiGuiRen: calculateTianYiGuiRen(day.stem),
    yueDeHe: calculateYueDeHe(month.branch),
    sanQiLiuYi: calculateSanQiLiuYi(day.stem),
    yiMaTaoHuaHuaGai: calculateYiMaTaoHuaHuaGai(day.branch)
  };
}

// ==================== Earthly Branch Relationships Functions (地支关系函数) ====================

// Check for 六合
function checkLiuHe(branch1, branch2) {
  const combination = LIU_HE.combinations.find(c =>
    (c.branch1 === branch1 && c.branch2 === branch2) ||
    (c.branch1 === branch2 && c.branch2 === branch1)
  );

  if (combination) {
    return {
      active: true,
      relationship: '六合',
      element: combination.element,
      fortune: LIU_HE.fortune,
      description: LIU_HE.description
    };
  }
  return { active: false };
}

// Check for 六冲
function checkLiuChong(branch1, branch2) {
  const clash = LIU_CHONG.clashes.find(c =>
    (c.branch1 === branch1 && c.branch2 === branch2) ||
    (c.branch1 === branch2 && c.branch2 === branch1)
  );

  if (clash) {
    return {
      active: true,
      relationship: '六冲',
      fortune: LIU_CHONG.fortune,
      description: LIU_CHONG.description
    };
  }
  return { active: false };
}

// Check for 三合
function checkSanHe(branch1, branch2, branch3) {
  const branches = [branch1, branch2, branch3].sort();
  const harmony = SAN_HE.harmonies.find(h =>
    h.branches.every(b => branches.includes(b))
  );

  if (harmony) {
    return {
      active: true,
      relationship: '三合',
      element: harmony.element,
      name: harmony.name,
      fortune: SAN_HE.fortune,
      description: SAN_HE.description
    };
  }
  return { active: false };
}

// Check for 三会
function checkSanHui(branches) {
  for (const meeting of SAN_HUI.meetings) {
    if (meeting.branches.every(b => branches.includes(b))) {
      return {
        active: true,
        relationship: '三会',
        element: meeting.element,
        name: meeting.name,
        fortune: SAN_HUI.fortune,
        description: SAN_HUI.description
      };
    }
  }
  return { active: false };
}

// Check for 方
function checkFang(branch) {
  for (const [direction, directionBranches] of Object.entries(FANG.directions)) {
    if (directionBranches.includes(branch)) {
      return {
        active: true,
        relationship: '方',
        direction: direction,
        fortune: FANG.fortune,
        description: FANG.description
      };
    }
  }
  return { active: false };
}

// Check for 刑
function checkXing(branch1, branch2) {
  // Check for simple punishment (子卯)
  const simplePunishment = XING.punishments.find(p =>
    (p.branch1 === branch1 && p.branch2 === branch2) ||
    (p.branch1 === branch2 && p.branch2 === branch1)
  );

  if (simplePunishment) {
    return {
      active: true,
      relationship: '刑',
      type: simplePunishment.type,
      fortune: XING.fortune,
      description: XING.description
    };
  }

  // Check for three-element punishment (寅巳申, 丑未戌, 自刑)
  for (const punishment of XING.punishments) {
    if (punishment.branches &&
        punishment.branches.includes(branch1) &&
        punishment.branches.includes(branch2)) {
      return {
        active: true,
        relationship: '三刑',
        type: punishment.type,
        fortune: XING.fortune,
        description: XING.description
      };
    }
  }

  return { active: false };
}

// Check all branch relationships
function checkAllBranchRelationships(branches) {
  const relationships = {
    liuHe: [],
    liuChong: [],
    sanHe: null,
    sanHui: null,
    fang: [],
    xing: []
  };

  // Check two-branch relationships
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const liuHe = checkLiuHe(branches[i], branches[j]);
      const liuChong = checkLiuChong(branches[i], branches[j]);
      const xing = checkXing(branches[i], branches[j]);

      if (liuHe.active) relationships.liuHe.push(liuHe);
      if (liuChong.active) relationships.liuChong.push(liuChong);
      if (xing.active) relationships.xing.push(xing);
    }

    // Check for 方
    const fang = checkFang(branches[i]);
    if (fang.active && !relationships.fang.find(f => f.direction === f.direction)) {
      relationships.fang.push(fang);
    }
  }

  // Check for 三合
  if (branches.length >= 3) {
    relationships.sanHe = checkSanHe(branches[0], branches[1], branches[2]);
  }

  // Check for 三会
  relationships.sanHui = checkSanHui(branches);

  return relationships;
}

// ==================== Elemental Prosperity States Functions (旺相休囚死函数) ====================

// Determine season by month branch
function getSeasonByMonthBranch(monthBranch) {
  if (['寅', '卯', '辰'].includes(monthBranch)) {
    return WANG_XIANG_XIU_QIU_SI.spring;
  } else if (['巳', '午', '未'].includes(monthBranch)) {
    return WANG_XIANG_XIU_QIU_SI.summer;
  } else if (['申', '酉', '戌'].includes(monthBranch)) {
    return WANG_XIANG_XIU_QIU_SI.autumn;
  } else if (['亥', '子', '丑'].includes(monthBranch)) {
    return WANG_XIANG_XIU_QIU_SI.winter;
  }
  return WANG_XIANG_XIU_QIU_SI.spring; // Default
}

// Calculate element state based on month branch
function calculateElementState(element, monthBranch) {
  const season = getSeasonByMonthBranch(monthBranch);
  const state = season.states[element];

  return {
    element: element,
    state: state.state,
    strength: state.strength,
    description: state.description,
    season: season.name
  };
}

// Analyze all element states
function analyzeAllElementStates(monthBranch) {
  const season = getSeasonByMonthBranch(monthBranch);
  const elements = ['木', '火', '土', '金', '水'];

  const analysis = {};
  elements.forEach(element => {
    analysis[element] = calculateElementState(element, monthBranch);
  });

  return {
    season: season.name,
    monthBranch: monthBranch,
    elements: analysis,
    summary: {
      wang: elements.find(e => analysis[e].state === '旺'),
      xiang: elements.find(e => analysis[e].state === '相'),
      xiu: elements.find(e => analysis[e].state === '休'),
      qiu: elements.find(e => analysis[e].state === '囚'),
      si: elements.find(e => analysis[e].state === '死')
    }
  };
}

// Five Element Analysis
function analyzeFiveElements(stemBranch, transmissions, classes) {
  const analysis = {
    generating: [],   // 生成关系
    controlling: [],  // 克制关系
    balance: 0        // 元素平衡分析
  };

  // Collect all elements from pillars
  const elements = [];
  elements.push(getStemElement(stemBranch.year.stem));
  elements.push(getBranchElement(EARTHLY_BRANCHES[stemBranch.year.branchIndex]));
  elements.push(getStemElement(stemBranch.month.stem));
  elements.push(getBranchElement(stemBranch.month.branch));
  elements.push(getStemElement(stemBranch.day.stem));
  elements.push(getBranchElement(stemBranch.day.branch));
  elements.push(getStemElement(stemBranch.hour.stem));
  elements.push(getBranchElement(stemBranch.hour.branch));

  // Add elements from transmissions
  if (transmissions) {
    elements.push(transmissions.first.element);
    elements.push(transmissions.second.element);
    elements.push(transmissions.third.element);
  }

  // Add elements from classes
  if (classes) {
    classes.forEach(cls => {
      elements.push(cls.element);
    });
  }

  // Determine generating/controlling relationships
  const uniqueElements = [...new Set(elements)];
  uniqueElements.forEach(element => {
    if (ELEMENT_RELATIONSHIPS[element]) {
      const rel = ELEMENT_RELATIONSHIPS[element];

      // Add generating relationship if the target element exists
      if (uniqueElements.includes(rel.generates)) {
        analysis.generating.push({
          from: element,
          to: rel.generates,
          type: '生成'
        });
      }

      // Add controlling relationship if the target element exists
      if (uniqueElements.includes(rel.controls)) {
        analysis.controlling.push({
          from: element,
          to: rel.controls,
          type: '克制'
        });
      }
    }
  });

  // Calculate balance
  const elementCounts = countElements(elements);
  analysis.balance = calculateBalanceScore(elementCounts);
  analysis.balanced = isElementsBalanced(elementCounts);
  analysis.elementCounts = elementCounts;

  return analysis;
}

// Get all elements from all components
function getAllElements(stemBranch, transmissions, classes) {
  const elements = [];

  // Add pillar elements
  elements.push(getStemElement(stemBranch.year.stem));
  elements.push(getBranchElement(EARTHLY_BRANCHES[stemBranch.year.branchIndex]));
  elements.push(getStemElement(stemBranch.month.stem));
  elements.push(getBranchElement(stemBranch.month.branch));
  elements.push(getStemElement(stemBranch.day.stem));
  elements.push(getBranchElement(stemBranch.day.branch));
  elements.push(getStemElement(stemBranch.hour.stem));
  elements.push(getBranchElement(stemBranch.hour.branch));

  // Add transmission elements
  if (transmissions) {
    elements.push(transmissions.first.element);
    elements.push(transmissions.second.element);
    elements.push(transmissions.third.element);
  }

  // Add class elements
  if (classes) {
    classes.forEach(cls => {
      elements.push(cls.element);
    });
  }

  return elements;
}

// Determine if it's daytime
function isDaytime(hour) {
  // Daytime is considered 7am (辰时, hour=5) to 7pm (戌时, hour=11)
  // Nighttime is 7pm to 7am
  return hour >= 5 && hour <= 11;
}

// Calculate overall fortune score
function calculateOverallFortune(transmissions, classes, elementAnalysis) {
  let totalScore = 0;
  let count = 0;

  // Score from transmissions
  if (transmissions) {
    totalScore += transmissions.first.general.fortune;
    totalScore += transmissions.second.general.fortune;
    totalScore += transmissions.third.general.fortune;
    count += 3;
  }

  // Score from classes (simplified)
  if (classes) {
    classes.forEach(cls => {
      if (cls.relationship === '吉') {
        totalScore += 4;
      } else if (cls.relationship === '比和') {
        totalScore += 3;
      } else if (cls.relationship === '生成') {
        totalScore += 4;
      } else if (cls.relationship === '被生成') {
        totalScore += 5;
      } else {
        totalScore += 2;
      }
      count += 1;
    });
  }

  // Score from element balance
  if (elementAnalysis.balanced) {
    totalScore += 4;
    count += 1;
  } else {
    totalScore += 2;
    count += 1;
  }

  // Calculate average (1-5 scale)
  const average = totalScore / count;
  return Math.round(average);
}

// Get fortune label
function getFortuneLabel(fortune) {
  const labels = {
    1: '大凶',
    2: '凶',
    3: '平',
    4: '吉',
    5: '大吉'
  };
  return labels[fortune] || '平';
}

// Get fortune description
function getFortuneDescription(fortune) {
  const descriptions = {
    1: '运势低迷，宜谨慎行事，避免重大决策',
    2: '多有阻碍，宜静不宜动，等待时机',
    3: '平稳过渡，顺其自然，中规中矩',
    4: '运势向好，适宜进取，把握良机',
    5: '运势旺盛，诸事顺遂，大展宏图'
  };
  return descriptions[fortune] || descriptions[3];
}

// Full Da Liu Ren calculation
function calculateDa6Full(year, month, day, hour, funMode) {
  // Calculate pillars using traditional method
  const pillars = calculateStemBranchTraditional(year, month, day, hour);

  // Calculate Heaven Pan (with 月将加时) - needed before Four Classes
  const heavenPan = calculateHeavenPan(pillars, year, month, day, hour);

  // Determine if it's day or night
  const isDay = isDaytime(hour);

  // Calculate Twelve Heavenly Generals Pan (十二天将盘) - separated from Heaven Pan
  const generalsPan = calculateGeneralsPan(pillars.day.stem, isDay);

  // Calculate Four Classes (needs heavenPan and generalsPan)
  const classes = calculateFourClasses(pillars, heavenPan, generalsPan, funMode);

  // Calculate Three Transmissions (needs classes, heavenPan, and generalsPan)
  const transmissions = calculateThreeTransmissions(pillars, classes, heavenPan, generalsPan, funMode, isDay);

  // Calculate Earth Pan
  const earthPan = calculateEarthPan();

  // Calculate Vacancies (with proper 旬-based logic)
  const vacancies = calculateVacancies(pillars.day.stemIndex, pillars.day.branchIndex);

  // Calculate Situation
  const situation = calculateSituation(pillars);

  // Analyze Five Elements
  const elementAnalysis = analyzeFiveElements(pillars, transmissions, classes);

  // Calculate overall fortune
  const overallFortune = calculateOverallFortune(transmissions, classes, elementAnalysis);

  // Calculate Divine Spirit Analysis (神煞分析)
  const shenShaAnalysis = calculateAllShenSha(pillars);

  // Calculate Branch Relationships (地支关系分析)
  const allBranches = [
    pillars.day.branch,
    pillars.month.branch,
    ...classes.map(c => c.branch)
  ];
  const branchRelationships = checkAllBranchRelationships(allBranches);

  // Calculate Element States (旺相休囚死分析)
  const elementStates = analyzeAllElementStates(pillars.month.branch);

  return {
    pillars,
    transmissions,
    classes,
    heavenPan,
    generalsPan,
    earthPan,
    vacancies,
    situation,
    elementAnalysis,
    overallFortune,
    shenShaAnalysis,
    branchRelationships,
    elementStates,
    isDay
  };
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

// Three Transmissions Display Component
function ThreeTransmissionsDisplay({ transmissions }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        三傳
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['first', 'second', 'third'].map((key) => (
          <div key={key} style={{
            padding: '16px',
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.15)',
            borderRadius: 4
          }}>
            <div style={{
              fontSize: 10,
              color: 'rgba(200,168,75,0.5)',
              marginBottom: 8
            }}>
              {TRANSMISSION_TYPES[key]}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: 16, color: '#f5e09a' }}>
                {transmissions[key].general.name}
              </div>
              <div style={{
                fontSize: 12,
                color: GOLD + '0.7)'
              }}>
                {transmissions[key].element}
              </div>
            </div>
            <div style={{
              marginTop: 8,
              fontSize: 13,
              color: GOLD + '0.6)',
              lineHeight: 1.8
            }}>
              {transmissions[key].description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Four Classes Display Component
function FourClassesDisplay({ classes }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        四課
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12
      }}>
        {classes.map((classData, index) => (
          <div key={index} style={{
            padding: '14px',
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.12)',
            borderRadius: 4
          }}>
            <div style={{
              fontSize: 10,
              color: 'rgba(200,168,75,0.5)',
              marginBottom: 6
            }}>
              {classData.type}
            </div>
            <div style={{
              fontSize: 14,
              color: '#f5e09a',
              marginBottom: 4
            }}>
              {classData.stem}{classData.branch}
            </div>
            <div style={{
              fontSize: 11,
              color: GOLD + '0.6)'
            }}>
              {classData.element} · {classData.relationship}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Heaven Pan Display Component
function HeavenPanDisplay({ generalsPan }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        天盤地盤
      </div>
      <div style={{
        padding: '20px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 8
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8
        }}>
          {EARTHLY_BRANCHES.map((branch) => (
            <div key={branch} style={{
              padding: '10px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 12,
                color: 'rgba(200,168,75,0.5)',
                marginBottom: 4
              }}>
                {branch}
              </div>
              <div style={{
                fontSize: 14,
                color: '#f5e09a'
              }}>
                {generalsPan && generalsPan[branch] ? generalsPan[branch].general.name : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Five Elements Display Component
function FiveElementsDisplay({ elementAnalysis }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        五行分析
      </div>
      <div style={{
        padding: '18px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(200,168,75,0.5)',
            marginBottom: 8
          }}>
            生成关系
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}>
            {elementAnalysis.generating.map((rel, index) => (
              <span key={index} style={{
                padding: '4px 10px',
                background: 'rgba(200,168,75,0.1)',
                borderRadius: 4,
                fontSize: 12,
                color: GOLD + '0.7)'
              }}>
                {rel.from}→{rel.to}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(200,168,75,0.5)',
            marginBottom: 8
          }}>
            克制关系
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}>
            {elementAnalysis.controlling.map((rel, index) => (
              <span key={index} style={{
                padding: '4px 10px',
                background: 'rgba(200,168,75,0.08)',
                borderRadius: 4,
                fontSize: 12,
                color: GOLD + '0.6)'
              }}>
                {rel.from}→{rel.to}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div style={{
            fontSize: 10,
            color: 'rgba(200,168,75,0.5)',
            marginBottom: 8
          }}>
            元素平衡
          </div>
          <div style={{
            padding: '8px',
            background: elementAnalysis.balanced
              ? 'rgba(200,168,75,0.1)'
              : 'rgba(200,50,50,0.1)',
            borderRadius: 4,
            fontSize: 12,
            color: elementAnalysis.balanced
              ? '#c8a84b'
              : '#c85050'
          }}>
            {elementAnalysis.balanced ? '五行平衡' : '五行失衡'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Vacancies Display Component
function VacanciesDisplay({ vacancies }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        空亡
      </div>
      <div style={{
        padding: '14px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{
          fontSize: 12,
          color: GOLD + '0.7)',
          marginBottom: 8
        }}>
          {vacancies.description}
        </div>
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {vacancies.vacantBranches.map((branch) => (
            <span key={branch} style={{
              padding: '4px 8px',
              background: 'rgba(200,168,75,0.1)',
              borderRadius: 4,
              fontSize: 11,
              color: GOLD + '0.6)'
            }}>
              {branch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Situation Display Component
function SituationDisplay({ situation, isDay }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        局與時
      </div>
      <div style={{
        padding: '14px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8
        }}>
          <div style={{
            fontSize: 14,
            color: '#f5e09a'
          }}>
            {situation.name}
          </div>
          <div style={{
            padding: '4px 10px',
            background: isDay
              ? 'rgba(200,168,75,0.15)'
              : 'rgba(100,100,200,0.15)',
            borderRadius: 4,
            fontSize: 11,
            color: isDay ? '#c8a84b' : '#c0c0f0'
          }}>
            {isDay ? '日占' : '夜占'}
          </div>
        </div>
        <div style={{
          fontSize: 11,
          color: GOLD + '0.6)'
        }}>
          {situation.description}
        </div>
      </div>
    </div>
  );
}

// ==================== New Display Components ====================

// Divine Spirit Display (神煞显示)
function ShenShaDisplay({ shenShaAnalysis }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        神煞分析
      </div>

      {/* 天乙贵人 */}
      {shenShaAnalysis.tianYiGuiRen.branches.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            天乙贵人
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {shenShaAnalysis.tianYiGuiRen.branches.map((branch, i) => (
              <span key={i} style={{
                fontSize: 16,
                color: '#f5e09a',
                fontWeight: 500
              }}>
                {branch}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {shenShaAnalysis.tianYiGuiRen.description}
          </div>
        </div>
      )}

      {/* 月德月合 */}
      {shenShaAnalysis.yueDeHe.yueDe.branch && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            月德月合
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>月德：</span>
              <span style={{
                fontSize: 16,
                color: '#f5e09a',
                fontWeight: 500,
                marginLeft: 8
              }}>
                {shenShaAnalysis.yueDeHe.yueDe.branch}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>月合：</span>
              <span style={{
                fontSize: 16,
                color: '#f5e09a',
                fontWeight: 500,
                marginLeft: 8
              }}>
                {shenShaAnalysis.yueDeHe.yueHe.branch}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 三奇六仪 */}
      {(shenShaAnalysis.sanQiLiuYi.sanQi.active || shenShaAnalysis.sanQiLiuYi.liuYi.active) && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            三奇六仪
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {shenShaAnalysis.sanQiLiuYi.sanQi.active && (
              <div style={{
                padding: '4px 12px',
                background: 'rgba(76, 175, 80, 0.15)',
                borderRadius: 4,
                fontSize: 11,
                color: '#4caf50'
              }}>
                三奇临身
              </div>
            )}
            {shenShaAnalysis.sanQiLiuYi.liuYi.active && (
              <div style={{
                padding: '4px 12px',
                background: 'rgba(255, 193, 7, 0.15)',
                borderRadius: 4,
                fontSize: 11,
                color: '#ffc107'
              }}>
                六仪临身
              </div>
            )}
          </div>
        </div>
      )}

      {/* 驿马桃花华盖 */}
      {(shenShaAnalysis.yiMaTaoHuaHuaGai.yiMa.branch ||
        shenShaAnalysis.yiMaTaoHuaHuaGai.taoHua.branch ||
        shenShaAnalysis.yiMaTaoHuaHuaGai.huaGai.branch) && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            驿马桃花华盖
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {shenShaAnalysis.yiMaTaoHuaHuaGai.yiMa.branch && (
              <div>
                <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>驿马：</span>
                <span style={{
                  fontSize: 16,
                  color: '#4caf50',
                  fontWeight: 500,
                  marginLeft: 8
                }}>
                  {shenShaAnalysis.yiMaTaoHuaHuaGai.yiMa.branch}
                </span>
              </div>
            )}
            {shenShaAnalysis.yiMaTaoHuaHuaGai.taoHua.branch && (
              <div>
                <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>桃花：</span>
                <span style={{
                  fontSize: 16,
                  color: '#e57373',
                  fontWeight: 500,
                  marginLeft: 8
                }}>
                  {shenShaAnalysis.yiMaTaoHuaHuaGai.taoHua.branch}
                </span>
              </div>
            )}
            {shenShaAnalysis.yiMaTaoHuaHuaGai.huaGai.branch && (
              <div>
                <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>华盖：</span>
                <span style={{
                  fontSize: 16,
                  color: '#e57373',
                  fontWeight: 500,
                  marginLeft: 8
                }}>
                  {shenShaAnalysis.yiMaTaoHuaHuaGai.huaGai.branch}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Branch Relationships Display (地支关系显示)
function BranchRelationshipsDisplay({ branchRelationships }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        地支关系
      </div>

      {/* 六合 */}
      {branchRelationships.liuHe.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            六合
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.liuHe.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(76, 175, 80, 0.15)',
                borderRadius: 4,
                fontSize: 12,
                color: '#4caf50'
              }}>
                {r.element}合
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.liuHe[0].description}
          </div>
        </div>
      )}

      {/* 六冲 */}
      {branchRelationships.liuChong.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(211, 47, 47, 0.08)',
          border: '1px solid rgba(211, 47, 47, 0.2)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            六冲
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.liuChong.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(211, 47, 47, 0.15)',
                borderRadius: 4,
                fontSize: 12,
                color: '#d32f2f'
              }}>
                冲
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.liuChong[0].description}
          </div>
        </div>
      )}

      {/* 三合 */}
      {branchRelationships.sanHe?.active && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            三合
          </div>
          <div style={{ padding: '4px 12px', background: 'rgba(76, 175, 80, 0.15)', borderRadius: 4, fontSize: 12, color: '#4caf50' }}>
            {branchRelationships.sanHe.name}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.sanHe.description}
          </div>
        </div>
      )}

      {/* 三会 */}
      {branchRelationships.sanHui?.active && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.12)',
          border: '1px solid rgba(76, 175, 80, 0.25)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            三会
          </div>
          <div style={{ padding: '4px 12px', background: 'rgba(76, 175, 80, 0.2)', borderRadius: 4, fontSize: 12, color: '#4caf50' }}>
            {branchRelationships.sanHui.name}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.sanHui.description}
          </div>
        </div>
      )}

      {/* 方 */}
      {branchRelationships.fang.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.05)',
          border: '1px solid rgba(76, 175, 80, 0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            方
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.fang.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(76, 175, 80, 0.12)',
                borderRadius: 4,
                fontSize: 12,
                color: '#4caf50'
              }}>
                {r.direction}方
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.fang[0].description}
          </div>
        </div>
      )}

      {/* 刑 */}
      {branchRelationships.xing.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(211, 47, 47, 0.05)',
          border: '1px solid rgba(211, 47, 47, 0.15)',
          borderRadius: 4
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            刑
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.xing.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(211, 47, 47, 0.12)',
                borderRadius: 4,
                fontSize: 12,
                color: '#d32f2f'
              }}>
                {r.type}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.xing[0].description}
          </div>
        </div>
      )}
    </div>
  );
}

// Element States Display (五行状态显示)
function ElementStatesDisplay({ elementStates }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        五行状态
      </div>

      {/* Season display */}
      <div style={{
        padding: '16px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4,
        marginBottom: 16,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
          季节
        </div>
        <div style={{ fontSize: 18, color: '#f5e09a', fontWeight: 500 }}>
          {elementStates.season}
        </div>
      </div>

      {/* Elements grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12,
        marginBottom: 16
      }}>
        {Object.entries(elementStates.elements).map(([element, state]) => (
          <div key={element} style={{
            padding: '16px',
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.1)',
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 14,
              color: '#f5e09a',
              fontWeight: 500,
              marginBottom: 8
            }}>
              {element}
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
              ...getElementStateStyle(state.state)
            }}>
              {state.state}
            </div>
            <div style={{
              fontSize: 9,
              color: GOLD + '0.6)',
              lineHeight: 1.6
            }}>
              {state.description}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        padding: '16px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 12 }}>
          状态摘要
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {elementStates.summary.wang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#4caf50', fontWeight: 500 }}>
                {elementStates.summary.wang}旺
              </span>
            </div>
          )}
          {elementStates.summary.xiang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#81c784', fontWeight: 500 }}>
                {elementStates.summary.xiang}相
              </span>
            </div>
          )}
          {elementStates.summary.xiu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#ffc107', fontWeight: 500 }}>
                {elementStates.summary.xiu}休
              </span>
            </div>
          )}
          {elementStates.summary.qiu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#ff9800', fontWeight: 500 }}>
                {elementStates.summary.qiu}囚
              </span>
            </div>
          )}
          {elementStates.summary.si && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#d32f2f', fontWeight: 500 }}>
                {elementStates.summary.si}死
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get element state styling
function getElementStateStyle(state) {
  const styles = {
    旺: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      color: '#4caf50'
    },
    相: {
      backgroundColor: 'rgba(129, 199, 132, 0.2)',
      color: '#81c784'
    },
    休: {
      backgroundColor: 'rgba(255, 193, 7, 0.2)',
      color: '#ffc107'
    },
    囚: {
      backgroundColor: 'rgba(255, 152, 0, 0.2)',
      color: '#ff9800'
    },
    死: {
      backgroundColor: 'rgba(211, 47, 47, 0.2)',
      color: '#d32f2f'
    }
  };
  return styles[state] || styles.休;
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

      const reading = calculateDa6Full(year, month, day, hour, funMode);
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

    // Add situation
    out += "\n【局】\n";
    out += result.situation.name + " - " + result.situation.description + "\n";

    // Add day/night
    out += result.isDay ? "日占\n" : "夜占\n";

    // Add three transmissions
    out += "\n【三傳】\n";
    out += TRANSMISSION_TYPES.first + "：" + result.transmissions.first.general.name + " (" + result.transmissions.first.element + ")\n";
    out += TRANSMISSION_TYPES.second + "：" + result.transmissions.second.general.name + " (" + result.transmissions.second.element + ")\n";
    out += TRANSMISSION_TYPES.third + "：" + result.transmissions.third.general.name + " (" + result.transmissions.third.element + ")\n";

    // Add four classes
    out += "\n【四課】\n";
    result.classes.forEach((cls, i) => {
      out += cls.type + "：" + cls.stem + cls.branch + " (" + cls.element + ")\n";
    });

    // Add vacancies
    out += "\n【空亡】\n";
    out += result.vacancies.description + "\n";

    // Add overall fortune
    out += "\n【综合卦象】\n";
    out += getFortuneLabel(result.overallFortune) + "\n";
    out += getFortuneDescription(result.overallFortune) + "\n";

    out += "\n---\n" + t("d6.footer");
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
    5: "#c8a84b",  // 大吉
    4: "#e8c84b",  // 吉
    3: "#c8a84b",  // 平
    2: "#c85a3c",  // 凶
    1: "#c85050",  // 大凶
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

          {/* Situation and Time Display */}
          <SituationDisplay
            situation={result.situation}
            isDay={result.isDay}
          />

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

          {/* Three Transmissions */}
          <ThreeTransmissionsDisplay transmissions={result.transmissions} />

          {/* Four Classes */}
          <FourClassesDisplay classes={result.classes} />

          {/* Heaven Pan and Earth Pan */}
          <HeavenPanDisplay
            generalsPan={result.generalsPan}
          />

          {/* Five Elements Analysis */}
          <FiveElementsDisplay elementAnalysis={result.elementAnalysis} />

          {/* Vacancies */}
          <VacanciesDisplay vacancies={result.vacancies} />

          {/* Divine Spirits */}
          <ShenShaDisplay shenShaAnalysis={result.shenShaAnalysis} />

          {/* Branch Relationships */}
          <BranchRelationshipsDisplay branchRelationships={result.branchRelationships} />

          {/* Element States */}
          <ElementStatesDisplay elementStates={result.elementStates} />

          {/* Overall Fortune Summary */}
          <div style={{
            padding: "20px",
            background: fortuneColors[result.overallFortune] || GOLD + '0.08)',
            border: "1px solid rgba(200,168,75,0.2)",
            borderRadius: 6,
            width: "100%",
            maxWidth: 400
          }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
              综合卦象
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#f5e09a',
              marginBottom: 8
            }}>
              {getFortuneLabel(result.overallFortune)}
            </div>
            <div style={{
              fontSize: 14,
              color: GOLD + '0.7)',
              lineHeight: 1.9
            }}>
              {getFortuneDescription(result.overallFortune)}
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
