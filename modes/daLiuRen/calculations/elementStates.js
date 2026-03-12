import {
  EARTHLY_BRANCHES,
  getBranchElement,
  WANG_XIANG_XIU_QIU_SI
} from '../data.js';

// Calculate element state for a specific element based on month branch
function analyzeElementState(element, monthBranch) {
  // Determine season based on month branch
  const monthIndex = EARTHLY_BRANCHES.indexOf(monthBranch);

  // Map month index to season
  let season, seasonData;
  if (monthIndex >= 2 && monthIndex <= 4) { // 寅卯辰 - Spring
    season = '春季';
    seasonData = WANG_XIANG_XIU_QIU_SI.spring;
  } else if (monthIndex >= 5 && monthIndex <= 7) { // 巳午未 - Summer
    season = '夏季';
    seasonData = WANG_XIANG_XIU_QIU_SI.summer;
  } else if (monthIndex >= 8 && monthIndex <= 10) { // 申酉戌 - Autumn
    season = '秋季';
    seasonData = WANG_XIANG_XIU_QIU_SI.autumn;
  } else { // 亥子丑 - Winter
    season = '冬季';
    seasonData = WANG_XIANG_XIU_QIU_SI.winter;
  }

  const state = seasonData.states[element] || { state: '休', strength: 3, description: '普通状态' };

  return {
    element: element,
    state: state.state,
    strength: state.strength,
    description: state.description
  };
}

// Analyze all element states (旺相休囚死分析)
export function analyzeAllElementStates(monthBranch) {
  const elements = ['金', '木', '水', '火', '土'];
  const analysis = {};

  // Determine season based on month branch
  const monthIndex = EARTHLY_BRANCHES.indexOf(monthBranch);
  let season;
  if (monthIndex >= 2 && monthIndex <= 4) { // 寅卯辰 - Spring
    season = '春季';
  } else if (monthIndex >= 5 && monthIndex <= 7) { // 巳午未 - Summer
    season = '夏季';
  } else if (monthIndex >= 8 && monthIndex <= 10) { // 申酉戌 - Autumn
    season = '秋季';
  } else { // 亥子丑 - Winter
    season = '冬季';
  }

  // Analyze each element's state
  elements.forEach(element => {
    analysis[element] = analyzeElementState(element, monthBranch);
  });

  // Find elements in each state category
  const states = analysis;
  const summary = {
    wang: elements.find(e => states[e].state === '旺'),
    xiang: elements.find(e => states[e].state === '相'),
    xiu: elements.find(e => states[e].state === '休'),
    qiu: elements.find(e => states[e].state === '囚'),
    si: elements.find(e => states[e].state === '死')
  };

  return {
    season,
    elements: analysis,
    summary
  };
}

// Helper function to get element state styling
export function getElementStateStyle(state) {
  const styles = {
    旺: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      color: '#4caf50'
    },
    相: {
      backgroundColor: 'rgba(129, 199, 132, 0.2)',
      color: '#81c784'
    },
    休: {
      backgroundColor: 'rgba(255, 193, 7, 0.2)',
      color: '#ffc107'
    },
    囚: {
      backgroundColor: 'rgba(255, 152, 0, 0.2)',
      color: '#ff9800'
    },
    死: {
      backgroundColor: 'rgba(211, 47, 47, 0.2)',
      color: '#d32f2f'
    }
  };
  return styles[state] || styles.休;
}
