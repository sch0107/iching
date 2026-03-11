# 大六壬系统完善计划 (Da Liu Ren System Enhancement Plan)

## 概述

大六壬系统目前已完成约75-80%的传统方法准确度，需补充以下三大核心体系以达到接近传统的完善程度：

1. **神煞体系** (Divine Spirit System) - 各类神煞吉凶影响
2. **地支关系** (Earthly Branch Relationships) - 地支间相互作用
3. **旺相休囚死** (Elemental Prosperity States) - 五行四季状态

---

## Phase 1: 神煞体系 (Divine Spirit System)

### 1.1 核心神煞数据结构

**文件：** `/home/eric/iching/modes/daLiuRenData.js`

#### 1.1.1 天乙贵人 (天乙贵人)
```javascript
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
```

#### 1.1.2 月德 (月德)
```javascript
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
```

#### 1.1.3 月合 (月合)
```javascript
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
```

#### 1.1.4 三奇 (三奇)
```javascript
export const SAN_QI = {
  // 乙丙丁为天上三奇, 甲戊庚为地上三奇
  heavenly: ['乙', '丙', '丁'],
  earthly: ['甲', '戊', '庚'],
  fortune: 5, // 大吉
  description: '三奇临身，万事顺遂'
};
```

#### 1.1.6 六仪 (六仪)
```javascript
export const LIU_YI = {
  // 甲戊庚丙壬为六仪
  stems: ['甲', '戊', '庚', '丙', '壬'],
  fortune: 3, // 中吉
  description: '六仪临身，中平之象'
};
```

#### 1.1.7 其他常用神煞
```javascript
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
```

### 1.2 神煞计算函数

**文件：** `/home/eric/iching/modes/Da6.jsx`

#### 1.2.1 计算天乙贵人
```javascript
function calculateTianYiGuiRen(dayStem) {
  const guiRenBranches = TIAN_YI_GUI_REN.branches[dayStem] || [];
  return {
    branches: guiRenBranches,
    fortune: TIAN_YI_GUI_REN.fortune,
    description: TIAN_YI_GUI_REN.description,
    active: false // 在实际计算中检查这些地支是否出现在四课/三传中
  };
}
```

#### 1.2.2 计算月德和月合
```javascript
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
```

#### 1.2.3 计算三奇六仪
```javascript
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
```

#### 1.2.4 计算驿马桃花华盖
```javascript
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
```

---

## Phase 2: 地支关系 (Earthly Branch Relationships)

### 2.1 地支关系数据结构

**文件：** `/home/eric/iching/modes/daLiuRenData.js`

#### 2.1.1 六合 (六合)
```javascript
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
```

#### 2.1.2 六冲 (六冲)
```javascript
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
```

#### 2.1.3 三合 (三合)
```javascript
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
```

#### 2.1.4 三会 (三会)
```javascript
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
```

#### 2.1.5 方 (方)
```javascript
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
```

#### 2.1.6 刑 (刑)
```javascript
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
```

### 2.2 地支关系计算函数

**文件：** `/home/eric/iching/modes/Da6.jsx`

#### 2.2.1 检查六合
```javascript
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
```

#### 2.2.2 检查六冲
```javascript
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
```

#### 2.2.3 检查三合
```javascript
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
```

#### 2.2.4 检查三会
```javascript
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
```

#### 2.2.5 检查方
```javascript
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
```

#### 2.2.6 检查刑
```javascript
function checkXing(branch1, branch2) {
  // 检查无礼之刑 (子卯)
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

  // 检查三刑 (寅巳申, 丑未戌, 自刑)
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
```

---

## Phase 3: 旺相休囚死 (Elemental Prosperity States)

### 3.1 五行四季状态数据结构

**文件：** `/home/eric/iching/modes/daLiuRenData.js`

#### 3.1.1 四季五行状态
```javascript
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
      金: { state: '休', strength: 3, description: '金休秋月，退藏之象' }
    }
  }
};
```

### 3.2 旺相休囚死计算函数

**文件：** `/home/eric/iching/modes/Da6.jsx`

#### 3.2.1 根据月支确定季节
```javascript
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
```

#### 3.2.2 计算五行状态
```javascript
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
```

#### 3.2.3 分析所有五行状态
```javascript
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
```

---

## Phase 4: 综合分析与UI集成

### 4.1 综合神煞分析函数

**文件：** `/home/eric/iching/modes/Da6.jsx`

#### 4.1.1 计算所有神煞
```javascript
function calculateAllShenSha(stemBranch) {
  const { day, month } = stemBranch;

  return {
    tianYiGuiRen: calculateTianYiGuiRen(day.stem),
    yueDeHe: calculateYueDeHe(month.branch),
    sanQiLiuYi: calculateSanQiLiuYi(day.stem),
    yiMaTaoHuaHuaGai: calculateYiMaTaoHuaHuaGai(day.branch)
  };
}
```

#### 4.1.2 检查所有地支关系
```javascript
function checkAllBranchRelationships(branches) {
  const relationships = {
    liuHe: [],
    liuChong: [],
    sanHe: null,
    sanHui: null,
    fang: [],
    xing: []
  };

  // 检查两两关系
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const liuHe = checkLiuHe(branches[i], branches[j]);
      const liuChong = checkLiuChong(branches[i], branches[j]);
      const xing = checkXing(branches[i], branches[j]);

      if (liuHe.active) relationships.liuHe.push(liuHe);
      if (liuChong.active) relationships.liuChong.push(liuChong);
      if (xing.active) relationships.xing.push(xing);
    }

    // 检查方
    const fang = checkFang(branches[i]);
    if (fang.active) relationships.fang.push(fang);
  }

  // 检查三合
  if (branches.length >= 3) {
    relationships.sanHe = checkSanHe(branches[0], branches[1], branches[2]);
  }

  // 检查三会
  relationships.sanHui = checkSanHui(branches);

  return relationships;
}
```

### 4.2 更新主计算函数

**文件：** `/home/eric/iching/modes/Da6.jsx`

#### 4.2.1 更新 calculateDa6Full 函数
```javascript
function calculateDa6Full(year, month, day, hour, funMode) {
  // ... existing code ...

  // 新增：神煞分析
  const shenShaAnalysis = calculateAllShenSha(pillars);

  // 新增：地支关系分析
  const allBranches = [
    pillars.day.branch,
    pillars.month.branch,
    ...classes.map(c => c.branch)
  ];
  const branchRelationships = checkAllBranchRelationships(allBranches);

  // 新增：五行状态分析
  const elementStates = analyzeAllElementStates(pillars.month.branch);

  // 新增：综合运势计算（包含神煞和地支关系）
  const comprehensiveFortune = calculateComprehensiveFortune(
    transmissions,
    classes,
    elementAnalysis,
    shenShaAnalysis,
    branchRelationships,
    elementStates
  );

  return {
    // ... existing properties ...
    shenShaAnalysis,
    branchRelationships,
    elementStates,
    comprehensiveFortune
  };
}
```

#### 4.2.2 综合运势计算函数
```javascript
function calculateComprehensiveFortune(
  transmissions,
  classes,
  elementAnalysis,
  shenShaAnalysis,
  branchRelationships,
  elementStates
) {
  let totalScore = 0;
  let weightCount = 0;

  // 三传评分 (权重 0.3)
  if (transmissions) {
    const transmissionScore = (
      transmissions.first.general.fortune +
      transmissions.second.general.fortune +
      transmissions.third.general.fortune
    ) / 3;
    totalScore += transmissionScore * 0.3;
    weightCount += 0.3;
  }

  // 神煞评分 (权重 0.25)
  let shenShaScore = 0;
  let shenShaCount = 0;

  if (shenShaAnalysis.tianYiGuiRen.active) {
    shenShaScore += shenShaAnalysis.tianYiGuiRen.fortune;
    shenShaCount++;
  }
  if (shenShaAnalysis.yueDeHe.yueDe.fortune) {
    shenShaScore += shenShaAnalysis.yueDeHe.yueDe.fortune;
    shenShaCount++;
  }
  if (shenShaAnalysis.sanQiLiuYi.sanQi.active) {
    shenShaScore += shenShaAnalysis.sanQiLiuYi.sanQi.fortune;
    shenShaCount++;
  }

  if (shenShaCount > 0) {
    totalScore += (shenShaScore / shenShaCount) * 0.25;
    weightCount += 0.25;
  }

  // 地支关系评分 (权重 0.25)
  let relationshipScore = 0;
  let relationshipCount = 0;

  branchRelationships.liuHe.forEach(r => {
    relationshipScore += r.fortune;
    relationshipCount++;
  });
  branchRelationships.sanHe?.active && relationshipCount++;
  branchRelationships.sanHui?.active && relationshipCount++;

  branchRelationships.liuChong.forEach(r => {
    relationshipScore += r.fortune;
    relationshipCount++;
  });
  branchRelationships.xing.forEach(r => {
    relationshipScore += r.fortune;
    relationshipCount++;
  });

  if (relationshipCount > 0) {
    totalScore += (relationshipScore / relationshipCount) * 0.25;
    weightCount += 0.25;
  }

  // 五行状态评分 (权重 0.2)
  const dayElement = getStemElement(pillars.day.stem);
  const elementState = elementStates.elements[dayElement];
  if (elementState) {
    totalScore += (elementState.strength / 5) * 5 * 0.2;
    weightCount += 0.2;
  }

  // 标准化最终评分
  const finalScore = weightCount > 0 ? totalScore / weightCount : 3;

  return {
    score: Math.round(finalScore),
    label: getFortuneLabel(finalScore),
    description: getFortuneDescription(finalScore),
    breakdown: {
      transmissions: transmissions ? (transmissions.first.general.fortune + transmissions.second.general.fortune + transmissions.third.general.fortune) / 3 : 0,
      shenSha: shenShaCount > 0 ? shenShaScore / shenShaCount : 0,
      relationships: relationshipCount > 0 ? relationshipScore / relationshipCount : 0,
      elementState: elementState ? elementState.strength : 0
    }
  };
}
```

---

## Phase 5: UI组件开发

### 5.1 神煞显示组件

**文件：** `/home/eric/iching/modes/Da6.jsx`

#### 5.1.1 神煞信息显示
```jsx
function ShenShaDisplay({ shenShaAnalysis }) {
  const { t } = useTranslation();

  if (!shenShaAnalysis) return null;

  return (
    <div style={styles.section}>
      <h3>{t('da6.shenShaAnalysis')}</h3>

      {/* 天乙贵人 */}
      {shenShaAnalysis.tianYiGuiRen && (
        <div style={styles.item}>
          <span style={styles.label}>天乙贵人：</span>
          {shenShaAnalysis.tianYiGuiRen.branches.map(b => (
            <span key={b} style={styles.value}>{b}</span>
          ))}
          <span style={styles.description}>{shenShaAnalysis.tianYiGuiRen.description}</span>
        </div>
      )}

      {/* 月德月合 */}
      {shenShaAnalysis.yueDeHe && (
        <div style={styles.item}>
          <span style={styles.label}>月德：</span>
          <span style={styles.value}>{shenShaAnalysis.yueDeHe.yueDe.branch}</span>
          <span style={styles.label}>月合：</span>
          <span style={styles.value}>{shenShaAnalysis.yueDeHe.yueHe.branch}</span>
        </div>
      )}

      {/* 三奇六仪 */}
      {shenShaAnalysis.sanQiLiuYi && (
        <div style={styles.item}>
          {shenShaAnalysis.sanQiLiuYi.sanQi.active && (
            <span style={styles.value}>三奇临身</span>
          )}
          {shenShaAnalysis.sanQiLiuYi.liuYi.active && (
            <span style={styles.value}>六仪临身</span>
          )}
        </div>
      )}
    </div>
  );
}
```

### 5.2 地支关系显示组件

```jsx
function BranchRelationshipsDisplay({ branchRelationships }) {
  const { t } = useTranslation();

  if (!branchRelationships) return null;

  return (
    <div style={styles.section}>
      <h3>{t('da6.branchRelationships')}</h3>

      {/* 六合 */}
      {branchRelationships.liuHe.length > 0 && (
        <div style={styles.item}>
          <span style={styles.label}>六合：</span>
          {branchRelationships.liuHe.map((r, i) => (
            <span key={i} style={styles.value}>
              {r.element}合 ({t('da6.auspicious')})
            </span>
          ))}
        </div>
      )}

      {/* 六冲 */}
      {branchRelationships.liuChong.length > 0 && (
        <div style={styles.item}>
          <span style={styles.label}>六冲：</span>
          {branchRelationships.liuChong.map((r, i) => (
            <span key={i} style={styles.negativeValue}>
              {t('da6.clash')} ({t('da6.inauspicious')})
            </span>
          ))}
        </div>
      )}

      {/* 三合 */}
      {branchRelationships.sanHe?.active && (
        <div style={styles.item}>
          <span style={styles.label}>三合：</span>
          <span style={styles.value}>
            {branchRelationships.sanHe.name} ({t('da6.auspicious')})
          </span>
        </div>
      )}

      {/* 三会 */}
      {branchRelationships.sanHui?.active && (
        <div style={styles.item}>
          <span style={styles.label}>三会：</span>
          <span style={styles.value}>
            {branchRelationships.sanHui.name} ({t('da6.veryAuspicious')})
          </span>
        </div>
      )}
    </div>
  );
}
```

### 5.3 五行状态显示组件

```jsx
function ElementStatesDisplay({ elementStates }) {
  const { t } = useTranslation();

  if (!elementStates) return null;

  return (
    <div style={styles.section}>
      <h3>{t('da6.elementStates')}</h3>
      <p>{t('da6.season')}: {elementStates.season}</p>

      <div style={styles.grid}>
        {Object.entries(elementStates.elements).map(([element, state]) => (
          <div key={element} style={styles.elementCard}>
            <div style={styles.elementName}>{element}</div>
            <div style={{
              ...styles.stateBadge,
              backgroundColor: getStateColor(state.state)
            }}>
              {state.state}
            </div>
            <div style={styles.stateDescription}>
              {state.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStateColor(state) {
  const colors = {
    旺: 'rgba(76, 175, 80, 0.8)',    // green
    相: 'rgba(56, 142, 60, 0.6)',    // light green
    休: 'rgba(255, 193, 7, 0.6)',     // yellow
    囚: 'rgba(255, 152, 0, 0.6)',     // orange
    死: 'rgba(211, 47, 47, 0.6)'      // red
  };
  return colors[state] || 'rgba(158, 158, 158, 0.6)';
}
```

---

## Phase 6: 国际化更新

### 6.1 语言文件更新

#### 6.1.1 英文 (locales/en.json)
```json
{
  "da6": {
    "shenShaAnalysis": "Divine Spirit Analysis",
    "branchRelationships": "Branch Relationships",
    "elementStates": "Element States",
    "tianYiGuiRen": "Tian Yi Gui Ren",
    "yueDe": "Monthly Virtue",
    "yueHe": "Monthly Harmony",
    "sanQi": "Three Marvels",
    "liuYi": "Six Instruments",
    "yiMa": "Post Horse",
    "taoHua": "Peach Blossom",
    "huaGai": "Flower Canopy",
    "liuHe": "Six Harmonies",
    "liuChong": "Six Clashes",
    "sanHe": "Three Harmonies",
    "sanHui": "Three Meetings",
    "fang": "Direction",
    "xing": "Punishment",
    "season": "Season",
    "state": "State",
    "auspicious": "Auspicious",
    "inauspicious": "Inauspicious",
    "veryAuspicious": "Very Auspicious",
    "prosperous": "Prosperous",
    "growing": "Growing",
    "resting": "Resting",
    "imprisoned": "Imprisoned",
    "dead": "Dead"
  }
}
```

#### 6.1.2 简体中文 (locales/zh-Hans.json)
```json
{
  "da6": {
    "shenShaAnalysis": "神煞分析",
    "branchRelationships": "地支关系",
    "elementStates": "五行状态",
    "tianYiGuiRen": "天乙贵人",
    "yueDe": "月德",
    "yueHe": "月合",
    "sanQi": "三奇",
    "liuYi": "六仪",
    "yiMa": "驿马",
    "taoHua": "桃花",
    "huaGai": "华盖",
    "liuHe": "六合",
    "liuChong": "六冲",
    "sanHe": "三合",
    "sanHui": "三会",
    "fang": "方",
    "xing": "刑",
    "season": "季节",
    "state": "状态",
    "auspicious": "吉",
    "inauspicious": "凶",
    "veryAuspicious": "大吉",
    "prosperous": "旺",
    "growing": "相",
    "resting": "休",
    "imprisoned": "囚",
    "dead": "死"
  }
}
```

#### 6.1.3 繁體中文 (locales/zh-Hant.json)
```json
{
  "da6": {
    "shenShaAnalysis": "神煞分析",
    "branchRelationships": "地支關係",
    "elementStates": "五行狀態",
    "tianYiGuiRen": "天乙貴人",
    "yueDe": "月德",
    "yueHe": "月合",
    "sanQi": "三奇",
    "liuYi": "六儀",
    "yiMa": "驛馬",
    "taoHua": "桃花",
    "huaGai": "華蓋",
    "liuHe": "六合",
    "liuChong": "六沖",
    "sanHe": "三合",
    "sanHui": "三會",
    "fang": "方",
    "xing": "刑",
    "season": "季節",
    "state": "狀態",
    "auspicious": "吉",
    "inauspicious": "凶",
    "veryAuspicious": "大吉",
    "prosperous": "旺",
    "growing": "相",
    "resting": "休",
    "imprisoned": "囚",
    "dead": "死"
  }
}
```

---

## 实施时间表

### Week 1: Phase 1 - 神煞体系
- Day 1-2: 创建神煞数据结构
- Day 3-4: 实现神煞计算函数
- Day 5: 集成到主计算函数并测试

### Week 2: Phase 2 - 地支关系
- Day 1-2: 创建地支关系数据结构
- Day 3-4: 实现地支关系检查函数
- Day 5: 集成到主计算函数并测试

### Week 3: Phase 3 - 旺相休囚死
- Day 1-2: 创建五行四季状态数据结构
- Day 3-4: 实现五行状态计算函数
- Day 5: 集成到主计算函数并测试

### Week 4: Phase 4-5 - 综合分析与UI
- Day 1-2: 实现综合分析函数
- Day 3-5: 开发UI显示组件

### Week 5: Phase 6 - 国际化与测试
- Day 1-2: 更新所有语言文件
- Day 3-4: 全面测试所有功能
- Day 5: 文档更新和部署

---

## 验证检查清单

### 功能验证
- [ ] 神煞数据结构正确，计算结果准确
- [ ] 地支关系检查准确（六合、六冲、三合、三会、方、刑）
- [ ] 五行状态根据季节正确显示（旺、相、休、囚、死）
- [ ] 综合运势评分合理，权重分配合理
- [ ] UI组件显示正确，样式美观

### 测试验证
- [ ] 测试春、夏、秋、冬四季的不同情况
- [ ] 测试不同日干月支的组合
- [ ] 测试神煞出现的各种情况
- [ ] 测试地支关系的各种组合
- [ ] 移动端显示正常

### 文档验证
- [ ] README.md更新说明新功能
- [ ] 代码注释完整
- [ ] 国际化文本完整

---

## 预期结果

完成后，大六壬系统将达到：
- **90-95%** 的传统方法准确度
- **完整**的神煞体系分析
- **全面**的地支关系检查
- **准确**的五行状态判断
- **综合**的运势评估系统

为用户提供更加专业和全面的大六壬占卜体验，接近传统大师级的分析深度。
