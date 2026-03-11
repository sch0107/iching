import {
  EARTHLY_BRANCHES,
  CLASS_TYPES,
  getBranchElement,
  getStemElement,
  getElementRelationship
} from '../data.js';
import { getJiGong, findUpperSpirit } from './twelveGenerals.js';

// Calculate Four Classes (四课) using traditional method
export function calculateFourClasses(stemBranch, heavenPan, generalsPan, funMode) {
  const { day } = stemBranch;

  if (funMode) {
    // Fun mode: favorable classes
    return [
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[(day.branchIndex + 3) % 12],
        element: '木',
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[(day.branchIndex + 3) % 12]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.first
      },
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[(day.branchIndex + 6) % 12],
        element: '水',
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[(day.branchIndex + 6) % 12]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.second
      },
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[(day.branchIndex + 9) % 12],
        element: '火',
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[(day.branchIndex + 9) % 12]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.third
      },
      {
        stem: day.stem,
        branch: EARTHLY_BRANCHES[day.branchIndex],
        element: getStemElement(day.stem),
        general: generalsPan ? generalsPan[EARTHLY_BRANCHES[day.branchIndex]].general : null,
        relationship: '吉',
        type: CLASS_TYPES.fourth
      }
    ];
  }

  // Traditional method: Four classes derived using 寄宫 and 上神
  const classes = [];

  // Step 1: Find day stem's 寄宫
  const jiGongBranch = getJiGong(day.stem);

  // Step 2: First class - 寄宫 branch's 上神
  const firstClassUpperSpirit = findUpperSpirit(heavenPan, jiGongBranch);
  const firstClass = {
    stem: day.stem,
    branch: firstClassUpperSpirit.branch,
    element: getBranchElement(firstClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[firstClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(firstClassUpperSpirit.branch)),
    type: CLASS_TYPES.first,
    jiGong: jiGongBranch
  };
  classes.push(firstClass);

  // Step 3: Second class - First class branch's 上神
  const secondClassUpperSpirit = findUpperSpirit(heavenPan, firstClass.branch);
  const secondClass = {
    stem: day.stem,
    branch: secondClassUpperSpirit.branch,
    element: getBranchElement(secondClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[secondClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(secondClassUpperSpirit.branch)),
    type: CLASS_TYPES.second
  };
  classes.push(secondClass);

  // Step 4: Third class - Day branch's 上神
  const thirdClassUpperSpirit = findUpperSpirit(heavenPan, day.branch);
  const thirdClass = {
    stem: day.stem,
    branch: thirdClassUpperSpirit.branch,
    element: getBranchElement(thirdClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[thirdClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(thirdClassUpperSpirit.branch)),
    type: CLASS_TYPES.third
  };
  classes.push(thirdClass);

  // Step 5: Fourth class - Third class branch's 上神
  const fourthClassUpperSpirit = findUpperSpirit(heavenPan, thirdClass.branch);
  const fourthClass = {
    stem: day.stem,
    branch: fourthClassUpperSpirit.branch,
    element: getBranchElement(fourthClassUpperSpirit.branch),
    general: generalsPan ? generalsPan[fourthClassUpperSpirit.branch].general : null,
    relationship: getElementRelationship(getStemElement(day.stem), getBranchElement(fourthClassUpperSpirit.branch)),
    type: CLASS_TYPES.fourth
  };
  classes.push(fourthClass);

  return classes;
}
