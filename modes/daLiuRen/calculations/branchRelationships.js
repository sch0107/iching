import {
  EARTHLY_BRANCHES,
  LIU_HE,
  LIU_CHONG,
  SAN_HE,
  SAN_HUI,
  FANG,
  XING
} from '../data.js';

// Check for 六合
export function checkLiuHe(branch1, branch2) {
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
export function checkLiuChong(branch1, branch2) {
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
export function checkSanHe(branch1, branch2, branch3) {
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
export function checkSanHui(branches) {
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
export function checkFang(branch) {
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
export function checkXing(branch1, branch2) {
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
  const threeElementPunishment = XING.punishments.find(p =>
    p.branches && p.branches.includes(branch1) && p.branches.includes(branch2)
  );

  if (threeElementPunishment) {
    return {
      active: true,
      relationship: '刑',
      type: threeElementPunishment.type,
      fortune: XING.fortune,
      description: XING.description
    };
  }

  // Check for self-punishment (辰辰, 午午, 酉酉)
  const selfPunishment = XING.punishments.find(p =>
    p.branch1 === branch1 && p.branch1 === branch2
  );

  if (selfPunishment) {
    return {
      active: true,
      relationship: '刑',
      type: selfPunishment.type,
      fortune: XING.fortune,
      description: XING.description
    };
  }

  return { active: false };
}

// Check all branch relationships for a set of branches
export function checkAllBranchRelationships(branches) {
  const result = {
    liuHe: [],      // 六合
    liuChong: [],    // 六冲
    sanHe: null,     // 三合
    sanHui: null,    // 三会
    fang: [],        // 方
    xing: []         // 刑
  };

  // Check for 六合
  for (let i = 0; i < branches.length - 1; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const heResult = checkLiuHe(branches[i], branches[j]);
      if (heResult.active) {
        result.liuHe.push(heResult);
      }
    }
  }

  // Check for 六冲
  for (let i = 0; i < branches.length - 1; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const chongResult = checkLiuChong(branches[i], branches[j]);
      if (chongResult.active) {
        result.liuChong.push(chongResult);
      }
    }
  }

  // Check for 三合 (need 3 branches)
  if (branches.length >= 3) {
    for (let i = 0; i <= branches.length - 3; i++) {
      for (let j = i + 1; j <= branches.length - 2; j++) {
        for (let k = j + 1; k <= branches.length - 1; k++) {
          const he3Result = checkSanHe(branches[i], branches[j], branches[k]);
          if (he3Result.active) {
            result.sanHe = he3Result;
            break;
          }
        }
        if (result.sanHe) break;
      }
      if (result.sanHe) break;
    }
  }

  // Check for 三会
  const huiResult = checkSanHui(branches);
  if (huiResult.active) {
    result.sanHui = huiResult;
  }

  // Check for 方
  for (const branch of branches) {
    const fangResult = checkFang(branch);
    if (fangResult.active) {
      result.fang.push(fangResult);
    }
  }

  // Check for 刑
  for (let i = 0; i < branches.length - 1; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const xingResult = checkXing(branches[i], branches[j]);
      if (xingResult.active) {
        result.xing.push(xingResult);
      }
    }
  }

  return result;
}
