import {
  calculateStemBranchTraditional
} from './stemBranch.js';
import { determineYueJiang } from './yueJiang.js';
import { calculateHeavenPan, calculateEarthPan } from './heavenPan.js';
import { calculateGeneralsPan, getGuiRenPosition } from './twelveGenerals.js';
import { calculateFourClasses } from './fourClasses.js';
import { calculateThreeTransmissions } from './threeTransmissions.js';
import {
  calculateVacanciesByXun,
  calculateSituation,
  analyzeFiveElements,
  isDaytime,
  calculateOverallFortune
} from './utilities.js';
import { calculateAllShenSha } from './divineSpirits.js';
import { checkAllBranchRelationships } from './branchRelationships.js';
import { analyzeAllElementStates } from './elementStates.js';

// Full Da Liu Ren calculation
export function calculateDa6Full(year, month, day, hour, funMode) {
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
  const vacancies = calculateVacanciesByXun(pillars.day.stemIndex, pillars.day.branchIndex);

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

// Calculate Vacancies (空亡) - Updated to use proper 旬-based logic
export function calculateVacancies(dayStemIndex, dayBranchIndex) {
  return calculateVacanciesByXun(dayStemIndex, dayBranchIndex);
}
