import { isLeapYear } from './stemBranch.js';

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
export function determineYueJiang(year, month, day) {
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
