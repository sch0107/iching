import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  GODS,
  GODS_FORTUNE,
  getStemElement,
  getBranchElement,
  isGeneratingRelationship,
  isControllingRelationship
} from '../data.js';

// Traditional stem-branch calculation (enhanced for full Da Liu Ren)
export function calculateStemBranchTraditional(year, month, day, hour) {
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
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 计算六神 (DEPRECATED - replaced by twelve generals placement)
export function calculateGods(stemBranch) {
  // 甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉、甲戌、乙亥
  // 按天干地支组合确定六神
  const stemIndex = HEAVENLY_STEMS.indexOf(stemBranch.stem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(stemBranch.branch);

  // 六神计算规则（简化版传统大六壬）
  const godIndex = (stemIndex + branchIndex) % 6;
  return GODS[godIndex];
}

// 计算六亲 with proper element logic
export function calculateRelatives(dayStem, targetBranch) {
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
export function calculateRelativesLegacy(god) {
  const godIndex = GODS.indexOf(god);
  return ['父母','兄弟','子孙','妻财','官鬼'][godIndex % 5];
}
