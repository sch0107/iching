import { EARTHLY_BRANCHES, getBranchElement } from '../data.js';
import { determineYueJiang } from './yueJiang.js';

// Calculate Heaven Pan (天盤) positions using 月将加时 method
export function calculateHeavenPan(stemBranch, year, month, day, hour) {
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
    heavenPan[branch] = {
      position: rotatedIndex,
      branch: EARTHLY_BRANCHES[rotatedIndex]
    };
  });

  return heavenPan;
}

// Calculate Earth Pan (地盤) - fixed positions
export function calculateEarthPan() {
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
