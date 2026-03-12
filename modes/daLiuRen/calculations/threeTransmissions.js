import {
  EARTHLY_BRANCHES,
  TRANSMISSION_TYPES,
  TWELVE_GENERALS,
  getStemElement,
  getBranchElement,
  isControllingRelationship
} from '../data.js';

import {
  findUpperSpirit
} from './twelveGenerals.js';

// Calculate Three Transmissions (三傳) using traditional 九宗门 methods
export function calculateThreeTransmissions(stemBranch, classes, heavenPan, generalsPan, funMode, isDay) {
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

  // Fallback: use 昴星法 > 别责法 > 八专法
  return tryFallbackMethod(classes, heavenPan, generalsPan, stemBranch, isDay);
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

      const second = calculateNextTransmission(firstTransmission, heavenPan, generalsPan);
      const third = calculateNextTransmission(second, heavenPan, generalsPan);

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

// Fallback methods: 昴星法 > 别责法 > 八专法
function tryFallbackMethod(classes, heavenPan, generalsPan, stemBranch, isDay) {
  // 优先级：昴星法 > 别责法 > 八专法

  // 1. 尝试昴星法
  const maoXingResult = tryMaoXingMethod(heavenPan, generalsPan, isDay);
  if (maoXingResult) {
    return maoXingResult;
  }

  // 2. 尝试别责法
  const bieZeResult = tryBieZeMethod(classes, heavenPan, generalsPan, stemBranch);
  if (bieZeResult) {
    return bieZeResult;
  }

  // 3. 最后使用八专法
  return tryBaZhuanMethod(stemBranch, heavenPan, generalsPan, classes);
}

// Check Ba Zhuan (八专法) condition
// 八专法 triggers when all four classes share the same branch (四课俱同干)
function checkBaZhuanCondition(classes, heavenPan, stemBranch) {
  // Check if all four classes share the same branch (四课俱同干)
  const branchElements = classes.map(cls => cls.branch);
  const firstBranch = branchElements[0];
  const allSame = branchElements.every(branch => branch === firstBranch);

  if (allSame) {
    return true;
  }

  // Traditional 八专 cases: specific day configurations where
  // the upper spirits align (all point to same branch)
  // This happens when 天盘地支分布符合八专条件
  const { day } = stemBranch;
  const baZhuanDayStems = ['甲', '己'];

  if (!baZhuanDayStems.includes(day.stem)) {
    return false;
  }

  // Verify that the upper spirits align (all point to same branch)
  // 八专法要求四课上神相同或特定天盘分布
  const upperSpirits = classes.map(cls => findUpperSpirit(heavenPan, cls.branch).branch);
  const firstUpper = upperSpirits[0];
  const allUpperSame = upperSpirits.every(branch => branch === firstUpper);

  return allUpperSame;
}

// 八专法 - For 甲 or 己 days with all classes sharing same branch, use the upper spirit on day branch
function tryBaZhuanMethod(stemBranch, heavenPan, generalsPan, classes) {
  // Check 八专 condition
  if (!checkBaZhuanCondition(classes, heavenPan, stemBranch)) {
    return null;
  }

  const { day } = stemBranch;

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

// Check Bie Ze (别责法) condition
// 别责法 triggers for specific day stem-branch combinations:
// 甲未、乙辰、丙戌、丁丑、己辰、庚戌、辛未、壬丑、癸辰
// OR when 三传重复 (all three transmissions identical)
function checkBieZeCondition(classes, stemBranch) {
  const { day } = stemBranch;
  const dayStem = day.stem;
  const dayBranch = day.branch;

  // Traditional 别责 combinations
  const bieZeCombinations = [
    { stem: '甲', branch: '未' },
    { stem: '乙', branch: '辰' },
    { stem: '丙', branch: '戌' },
    { stem: '丁', branch: '丑' },
    { stem: '己', branch: '辰' },
    { stem: '庚', branch: '戌' },
    { stem: '辛', branch: '未' },
    { stem: '壬', branch: '丑' },
    { stem: '癸', branch: '辰' }
  ];

  // Check if current day matches any 别责 combination
  const isBieZeDay = bieZeCombinations.some(
    combo => combo.stem === dayStem && combo.branch === dayBranch
  );

  return isBieZeDay;
}

// 别责法 - When specific day stem-branch combinations occur
function tryBieZeMethod(classes, heavenPan, generalsPan, stemBranch) {
  // Check 别责 condition
  if (!checkBieZeCondition(classes, stemBranch)) {
    return null;
  }

  const { day } = stemBranch;

  // 别责法 uses the upper spirit of the specific branch
  const targetBranch = day.branch;
  const targetBranchUpperSpirit = findUpperSpirit(heavenPan, targetBranch);

  const firstTransmission = {
    general: generalsPan ? generalsPan[targetBranchUpperSpirit.branch].general : null,
    element: getBranchElement(targetBranchUpperSpirit.branch),
    description: `别责法：${day.stem}${day.branch}`,
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
