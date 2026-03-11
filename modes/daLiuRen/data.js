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
} from '../daLiuRenData.js';

// Re-export all data from daLiuRenData.js
export {
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
};

// Constants specific to Da Liu Ren implementation
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
