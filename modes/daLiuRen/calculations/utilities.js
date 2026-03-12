import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  SITUATIONS,
  ELEMENT_RELATIONSHIPS,
  getStemElement,
  getBranchElement,
  isGeneratingRelationship,
  isControllingRelationship,
  calculateBalanceScore,
  isElementsBalanced,
  countElements
} from '../data.js';

// Calculate position in 60甲子 cycle
export function calculateSexagenaryPosition(stemIndex, branchIndex) {
  // Find the position (0-59) where the given stem and branch combine
  // This is the least common multiple of (position % 10 == stemIndex) and (position % 12 == branchIndex)

  for (let pos = 0; pos < 60; pos++) {
    if (pos % 10 === stemIndex && pos % 12 === branchIndex) {
      return pos;
    }
  }
  return 0; // Should not happen with valid input
}

// Calculate vacancies based on 旬 (60甲子 cycle)
export function calculateVacanciesByXun(dayStemIndex, dayBranchIndex) {
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

// Legacy version for backward compatibility
// Calculate Situation (局)
export function calculateSituation(stemBranch) {
  const { day, month } = stemBranch;

  // Traditional method based on day and month relationship
  const combined = (day.stemIndex + month.branchIndex) % 3;

  if (combined === 0) return SITUATIONS.upper;
  if (combined === 1) return SITUATIONS.middle;
  return SITUATIONS.lower;
}

// Five Element Analysis
export function analyzeFiveElements(stemBranch, transmissions, classes) {
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
  elements.push(getBranchElement(EARTHLY_BRANCHES[stemBranch.hour.branchIndex]));

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
export function getAllElements(stemBranch, transmissions, classes) {
  const elements = [];

  // Add pillar elements
  elements.push(getStemElement(stemBranch.year.stem));
  elements.push(getBranchElement(EARTHLY_BRANCHES[stemBranch.year.branchIndex]));
  elements.push(getStemElement(stemBranch.month.stem));
  elements.push(getBranchElement(stemBranch.month.branch));
  elements.push(getStemElement(stemBranch.day.stem));
  elements.push(getBranchElement(stemBranch.day.branch));
  elements.push(getStemElement(stemBranch.hour.stem));
  elements.push(getBranchElement(EARTHLY_BRANCHES[stemBranch.hour.branchIndex]));

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
export function isDaytime(hour) {
  // Daytime is considered 7am (辰时, hour=5) to 7pm (戌时, hour=11)
  // Nighttime is 7pm to 7am
  return hour >= 5 && hour <= 11;
}

// Calculate overall fortune score
export function calculateOverallFortune(transmissions, classes, elementAnalysis) {
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
export function getFortuneLabel(fortune) {
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
export function getFortuneDescription(fortune) {
  const descriptions = {
    1: '运势低迷，宜谨慎行事，避免重大决策',
    2: '多有阻碍，宜静不宜动，等待时机',
    3: '平稳过渡，顺其自然，中规中矩',
    4: '运势向好，适宜进取，把握良机',
    5: '运势旺盛，诸事顺遂，大展宏图'
  };
  return descriptions[fortune] || descriptions[3];
}
