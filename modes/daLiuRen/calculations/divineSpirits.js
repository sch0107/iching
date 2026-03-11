import {
  EARTHLY_BRANCHES,
  TIAN_YI_GUI_REN,
  YUE_DE,
  YUE_HE,
  SAN_QI,
  LIU_YI,
  SHEN_SHA
} from '../data.js';

// Calculate Tian Yi Gui Ren (天乙贵人)
export function calculateTianYiGuiRen(dayStem) {
  const guiRenBranches = TIAN_YI_GUI_REN.branches[dayStem] || [];
  return {
    branches: guiRenBranches,
    fortune: TIAN_YI_GUI_REN.fortune,
    description: TIAN_YI_GUI_REN.description
  };
}

// Calculate Monthly Virtue and Harmony (月德和月合)
export function calculateYueDeHe(monthBranch) {
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
export function calculateSanQiLiuYi(dayStem) {
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
export function calculateYiMaTaoHuaHuaGai(dayBranch) {
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
export function calculateAllShenSha(stemBranch) {
  const { day, month } = stemBranch;

  return {
    tianYiGuiRen: calculateTianYiGuiRen(day.stem),
    yueDeHe: calculateYueDeHe(month.branch),
    sanQiLiuYi: calculateSanQiLiuYi(day.stem),
    yiMaTaoHuaHuaGai: calculateYiMaTaoHuaHuaGai(day.branch)
  };
}
