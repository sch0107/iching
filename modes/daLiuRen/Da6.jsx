import { useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  GOLD,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  TRANSMISSION_TYPES,
  CLASS_TYPES
} from './data.js';
import { calculateDa6Full } from './calculations';
import { Pillar } from './components';
import FunModeToggle from '../../components/FunModeToggle.jsx';
import ScreenshotButton from '../../components/ScreenshotButton.jsx';

function LineMini({ val, color }) {
  return val === 1
    ? <div style={{width:60, height:6, background:color, borderRadius:1}}/>
    : <div style={{width:60, display:"flex", gap:4}}>
        <div style={{flex:1, height:6, background:color, borderRadius:1}}/>
        <div style={{flex:1, height:6, background:color, borderRadius:1}}/>
      </div>;
}

// Three Transmissions Display Component
function ThreeTransmissionsDisplay({ transmissions }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        三傳
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['first', 'second', 'third'].map((key) => (
          <div key={key} style={{
            padding: '16px',
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.15)',
            borderRadius: 4
          }}>
            <div style={{
              fontSize: 10,
              color: 'rgba(200,168,75,0.5)',
              marginBottom: 8
            }}>
              {TRANSMISSION_TYPES[key]}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: 16, color: '#f5e09a' }}>
                {transmissions[key].general.name}
              </div>
              <div style={{
                fontSize: 12,
                color: GOLD + '0.7)'
              }}>
                {transmissions[key].element}
              </div>
            </div>
            <div style={{
              marginTop: 8,
              fontSize: 13,
              color: GOLD + '0.6)',
              lineHeight: 1.8
            }}>
              {transmissions[key].description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Four Classes Display Component
function FourClassesDisplay({ classes }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        四課
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12
      }}>
        {classes.map((classData, index) => (
          <div key={index} style={{
            padding: '14px',
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.12)',
            borderRadius: 4
          }}>
            <div style={{
              fontSize: 10,
              color: 'rgba(200,168,75,0.5)',
              marginBottom: 6
            }}>
              {classData.type}
            </div>
            <div style={{
              fontSize: 14,
              color: '#f5e09a',
              marginBottom: 4
            }}>
              {classData.stem}{classData.branch}
            </div>
            <div style={{
              fontSize: 11,
              color: GOLD + '0.6)'
            }}>
              {classData.element} · {classData.relationship}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Heaven Pan Display Component
function HeavenPanDisplay({ generalsPan }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        天盤地盤
      </div>
      <div style={{
        padding: '20px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 8
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8
        }}>
          {EARTHLY_BRANCHES.map((branch) => (
            <div key={branch} style={{
              padding: '10px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 12,
                color: 'rgba(200,168,75,0.5)',
                marginBottom: 4
              }}>
                {branch}
              </div>
              <div style={{
                fontSize: 14,
                color: '#f5e09a'
              }}>
                {generalsPan && generalsPan[branch] ? generalsPan[branch].general.name : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Five Elements Display Component
function FiveElementsDisplay({ elementAnalysis }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        五行分析
      </div>
      <div style={{
        padding: '18px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(200,168,75,0.5)',
            marginBottom: 8
          }}>
            生成关系
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}>
            {elementAnalysis.generating.map((rel, index) => (
              <span key={index} style={{
                padding: '4px 10px',
                background: 'rgba(200,168,75,0.1)',
                borderRadius: 4,
                fontSize: 12,
                color: GOLD + '0.7)'
              }}>
                {rel.from}→{rel.to}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(200,168,75,0.5)',
            marginBottom: 8
          }}>
            克制关系
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}>
            {elementAnalysis.controlling.map((rel, index) => (
              <span key={index} style={{
                padding: '4px 10px',
                background: 'rgba(200,168,75,0.1)',
                borderRadius: 4,
                fontSize: 12,
                color: GOLD + '0.7)'
              }}>
                {rel.from}→{rel.to}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 10,
            color: 'rgba(200,168,75,0.5)',
            marginBottom: 8
          }}>
            元素平衡
          </div>
          <div style={{
            padding: '8px 12px',
            background: 'rgba(200,168,75,0.05)',
            borderRadius: 4,
            fontSize: 12,
            color: elementAnalysis.balanced ? '#4caf50' : '#ff9800'
          }}>
            {elementAnalysis.balanced ? '平衡' : '不平衡'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Vacancies Display Component
function VacanciesDisplay({ vacancies }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        空亡
      </div>
      <div style={{
        padding: '16px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{
          fontSize: 14,
          color: '#f5e09a',
          marginBottom: 8
        }}>
          {vacancies.xunName}
        </div>
        <div style={{
          fontSize: 13,
          color: GOLD + '0.6)'
        }}>
          {vacancies.description}
        </div>
      </div>
    </div>
  );
}

// Divine Spirit Display (神煞显示)
function ShenShaDisplay({ shenShaAnalysis }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        神煞分析
      </div>

      {/* 天乙贵人 */}
      {shenShaAnalysis.tianYiGuiRen.branches.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            天乙贵人
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {shenShaAnalysis.tianYiGuiRen.branches.map((branch, i) => (
              <span key={i} style={{
                fontSize: 16,
                color: '#f5e09a',
                fontWeight: 500
              }}>
                {branch}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {shenShaAnalysis.tianYiGuiRen.description}
          </div>
        </div>
      )}

      {/* 月德月合 */}
      {shenShaAnalysis.yueDeHe.yueDe.branch && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            月德月合
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>月德：</span>
              <span style={{
                fontSize: 16,
                color: '#f5e09a',
                fontWeight: 500,
                marginLeft: 8
              }}>
                {shenShaAnalysis.yueDeHe.yueDe.branch}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>月合：</span>
              <span style={{
                fontSize: 16,
                color: '#f5e09a',
                fontWeight: 500,
                marginLeft: 8
              }}>
                {shenShaAnalysis.yueDeHe.yueHe.branch}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 三奇六仪 */}
      {(shenShaAnalysis.sanQiLiuYi.sanQi.active || shenShaAnalysis.sanQiLiuYi.liuYi.active) && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            三奇六仪
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {shenShaAnalysis.sanQiLiuYi.sanQi.active && (
              <div style={{
                padding: '4px 12px',
                background: 'rgba(76, 175, 80, 0.15)',
                borderRadius: 4,
                fontSize: 11,
                color: '#4caf50'
              }}>
                三奇临身
              </div>
            )}
            {shenShaAnalysis.sanQiLiuYi.liuYi.active && (
              <div style={{
                padding: '4px 12px',
                background: 'rgba(255, 193, 7, 0.15)',
                borderRadius: 4,
                fontSize: 11,
                color: '#ffc107'
              }}>
                六仪临身
              </div>
            )}
          </div>
        </div>
      )}

      {/* 驿马桃花华盖 */}
      {(shenShaAnalysis.yiMaTaoHuaHuaGai.yiMa.branch ||
        shenShaAnalysis.yiMaTaoHuaHuaGai.taoHua.branch ||
        shenShaAnalysis.yiMaTaoHuaHuaGai.huaGai.branch) && (
        <div style={{
          padding: '16px',
          background: 'rgba(200,168,75,0.03)',
          border: '1px solid rgba(200,168,75,0.15)',
          borderRadius: 4
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            驿马桃花华盖
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {shenShaAnalysis.yiMaTaoHuaHuaGai.yiMa.branch && (
              <div>
                <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>驿马：</span>
                <span style={{
                  fontSize: 16,
                  color: '#4caf50',
                  fontWeight: 500,
                  marginLeft: 8
                }}>
                  {shenShaAnalysis.yiMaTaoHuaHuaGai.yiMa.branch}
                </span>
              </div>
            )}
            {shenShaAnalysis.yiMaTaoHuaHuaGai.taoHua.branch && (
              <div>
                <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>桃花：</span>
                <span style={{
                  fontSize: 16,
                  color: '#e57373',
                  fontWeight: 500,
                  marginLeft: 8
                }}>
                  {shenShaAnalysis.yiMaTaoHuaHuaGai.taoHua.branch}
                </span>
              </div>
            )}
            {shenShaAnalysis.yiMaTaoHuaHuaGai.huaGai.branch && (
              <div>
                <span style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)' }}>华盖：</span>
                <span style={{
                  fontSize: 16,
                  color: '#e57373',
                  fontWeight: 500,
                  marginLeft: 8
                }}>
                  {shenShaAnalysis.yiMaTaoHuaHuaGai.huaGai.branch}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Branch Relationships Display (地支关系显示)
function BranchRelationshipsDisplay({ branchRelationships, t }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        地支关系
      </div>

      {/* 六合 */}
      {branchRelationships.liuHe.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            六合
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.liuHe.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(76, 175, 80, 0.15)',
                borderRadius: 4,
                fontSize: 12,
                color: '#4caf50'
              }}>
                {r.element}合
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.liuHe[0].description}
          </div>
        </div>
      )}

      {/* 六冲 */}
      {branchRelationships.liuChong.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(211, 47, 47, 0.08)',
          border: '1px solid rgba(211, 47, 47, 0.2)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            六冲
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.liuChong.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(211, 47, 47, 0.15)',
                borderRadius: 4,
                fontSize: 12,
                color: '#d32f2f'
              }}>
                冲
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.liuChong[0].description}
          </div>
        </div>
      )}

      {/* 三合 */}
      {branchRelationships.sanHe?.active && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            三合
          </div>
          <div style={{ padding: '4px 12px', background: 'rgba(76, 175, 80, 0.15)', borderRadius: 4, fontSize: 12, color: '#4caf50' }}>
            {branchRelationships.sanHe.name}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.sanHe.description}
          </div>
        </div>
      )}

      {/* 三会 */}
      {branchRelationships.sanHui?.active && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.12)',
          border: '1px solid rgba(76, 175, 80, 0.25)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            三会
          </div>
          <div style={{ padding: '4px 12px', background: 'rgba(76, 175, 80, 0.2)', borderRadius: 4, fontSize: 12, color: '#4caf50' }}>
            {branchRelationships.sanHui.name}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.sanHui.description}
          </div>
        </div>
      )}

      {/* 方 */}
      {branchRelationships.fang.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(76, 175, 80, 0.05)',
          border: '1px solid rgba(76, 175, 80, 0.15)',
          borderRadius: 4,
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            方
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.fang.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(76, 175, 80, 0.12)',
                borderRadius: 4,
                fontSize: 12,
                color: '#4caf50'
              }}>
{t(`d6.${r.direction}`)}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.fang[0].description}
          </div>
        </div>
      )}

      {/* 刑 */}
      {branchRelationships.xing.length > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(211, 47, 47, 0.05)',
          border: '1px solid rgba(211, 47, 47, 0.15)',
          borderRadius: 4
        }}>
          <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
            刑
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {branchRelationships.xing.map((r, i) => (
              <div key={i} style={{
                padding: '4px 12px',
                background: 'rgba(211, 47, 47, 0.12)',
                borderRadius: 4,
                fontSize: 12,
                color: '#d32f2f'
              }}>
                {r.type}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: GOLD + '0.7)', marginTop: 8 }}>
            {branchRelationships.xing[0].description}
          </div>
        </div>
      )}
    </div>
  );
}

// Element States Display (五行状态显示)
function ElementStatesDisplay({ elementStates }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
        五行状态
      </div>

      {/* Season display */}
      <div style={{
        padding: '16px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4,
        marginBottom: 16,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 8 }}>
          季节
        </div>
        <div style={{ fontSize: 18, color: '#f5e09a', fontWeight: 500 }}>
          {elementStates.season}
        </div>
      </div>

      {/* Elements grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12,
        marginBottom: 16
      }}>
        {Object.entries(elementStates.elements).map(([element, state]) => (
          <div key={element} style={{
            padding: '16px',
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.1)',
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 14,
              color: '#f5e09a',
              fontWeight: 500,
              marginBottom: 8
            }}>
              {element}
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
              ...getElementStateStyle(state.state)
            }}>
              {state.state}
            </div>
            <div style={{
              fontSize: 9,
              color: GOLD + '0.6)',
              lineHeight: 1.6
            }}>
              {state.description}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        padding: '16px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{ fontSize: 10, color: 'rgba(200,168,75,0.5)', marginBottom: 12 }}>
          状态摘要
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {elementStates.summary.wang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#4caf50', fontWeight: 500 }}>
                {elementStates.summary.wang}旺
              </span>
            </div>
          )}
          {elementStates.summary.xiang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#81c784', fontWeight: 500 }}>
                {elementStates.summary.xiang}相
              </span>
            </div>
          )}
          {elementStates.summary.xiu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#ffc107', fontWeight: 500 }}>
                {elementStates.summary.xiu}休
              </span>
            </div>
          )}
          {elementStates.summary.qiu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#ff9800', fontWeight: 500 }}>
                {elementStates.summary.qiu}囚
              </span>
            </div>
          )}
          {elementStates.summary.si && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#d32f2f', fontWeight: 500 }}>
                {elementStates.summary.si}死
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get element state styling
function getElementStateStyle(state) {
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

// Situation Display Component
function SituationDisplay({ situation, isDay }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        padding: '14px',
        background: 'rgba(200,168,75,0.03)',
        border: '1px solid rgba(200,168,75,0.15)',
        borderRadius: 4
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8
        }}>
          <div style={{
            fontSize: 14,
            color: '#f5e09a'
          }}>
            {situation.name}
          </div>
          <div style={{
            padding: '4px 10px',
            background: isDay
              ? 'rgba(200,168,75,0.15)'
              : 'rgba(100,100,200,0.15)',
            borderRadius: 4,
            fontSize: 11,
            color: isDay ? '#c8a84b' : '#c0c0f0'
          }}>
            {isDay ? '日占' : '夜占'}
          </div>
        </div>
        <div style={{
          fontSize: 11,
          color: GOLD + '0.6)'
        }}>
          {situation.description}
        </div>
      </div>
    </div>
  );
}

// Get fortune label
function getFortuneLabel(fortune) {
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
function getFortuneDescription(fortune) {
  const descriptions = {
    1: '运势低迷，宜谨慎行事，避免重大决策',
    2: '多有阻碍，宜静不宜动，等待时机',
    3: '平稳过渡，顺其自然，中规中矩',
    4: '运势向好，适宜进取，把握良机',
    5: '运势旺盛，诸事顺遂，大展宏图'
  };
  return descriptions[fortune] || descriptions[3];
}

// Main Da Liu Ren component
export default function Da6() {
  const { t } = useTranslation();
  const resultAreaRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [divining, setDivining] = useState(false);

  // Birth data inputs
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");

  const [copied, setCopied] = useState(false);
  const [funMode, setFunMode] = useState(false);

  const divine = () => {
    if (divining) return;
    if (!birthYear || !birthMonth || !birthDay || !birthHour) return;

    setDivining(true);
    setCopied(false);

    setTimeout(() => {
      const year = parseInt(birthYear);
      const month = parseInt(birthMonth);
      const day = parseInt(birthDay);
      const hour = parseInt(birthHour);

      if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
        setDivining(false);
        return;
      }

      const reading = calculateDa6Full(year, month, day, hour, funMode);
      setResult(reading);
      setDivining(false);
    }, 800);
  };

  const reset = () => {
    setResult(null);
    setCopied(false);
    setQuestion("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthHour("");
  };

  const buildSummary = () => {
    if (!result) return "";
    const lang = t("langLabel") === "简" ? "zh-CN" : "zh-TW";
    let out = t("d6.summaryHeader") + "\n";
    out += t("d6.summaryTime") + new Date().toLocaleString(lang) + "\n";
    if (question) out += t("d6.summaryQ") + question + "\n";
    out += "\n" + t("d6.summaryPillars") + "\n";
    out += "  " + result.pillars.year.stem + result.pillars.year.branch + "\n";
    out += "  " + result.pillars.month.stem + result.pillars.month.branch + "\n";
    out += "  " + result.pillars.day.stem + result.pillars.day.branch + "\n";
    out += "  " + result.pillars.hour.stem + result.pillars.hour.branch + "\n";

    // Add situation
    out += "\n【局】\n";
    out += result.situation.name + " - " + result.situation.description + "\n";

    // Add day/night
    out += result.isDay ? "日占\n" : "夜占\n";

    // Add three transmissions
    out += "\n【三傳】\n";
    out += TRANSMISSION_TYPES.first + "：" + result.transmissions.first.general.name + " (" + result.transmissions.first.element + ")\n";
    out += TRANSMISSION_TYPES.second + "：" + result.transmissions.second.general.name + " (" + result.transmissions.second.element + ")\n";
    out += TRANSMISSION_TYPES.third + "：" + result.transmissions.third.general.name + " (" + result.transmissions.third.element + ")\n";

    // Add four classes
    out += "\n【四課】\n";
    result.classes.forEach((cls, i) => {
      out += cls.type + "：" + cls.stem + cls.branch + " (" + cls.element + ")\n";
    });

    // Add vacancies
    out += "\n【空亡】\n";
    out += result.vacancies.description + "\n";

    // Add overall fortune
    out += "\n【综合卦象】\n";
    out += getFortuneLabel(result.overallFortune) + "\n";
    out += getFortuneDescription(result.overallFortune) + "\n";

    out += "\n---\n" + t("d6.footer");
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const done = result !== null && !divining;

  const inputStyle = {
    width: "100%", maxWidth: 400, padding: "0 10px",
    display: "flex", flexDirection: "column", gap: 10,
  };

  const fieldStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(200,168,75,0.2)",
    color: "#e8d5a0", padding: "10px 14px", fontSize: 14,
    fontFamily: "inherit", transition: "border 0.2s", borderRadius: 4,
  };

  const btnStyle = (active) => ({
    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
    background: active ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.07)",
    border: `1px solid ${active ? "rgba(200,168,75,0.6)" : "rgba(200,168,75,0.3)"}`,
    color: active ? "#f5e09a" : "#d4b86a", padding: "11px 24px",
    fontSize: 13, letterSpacing: 3, fontFamily: "inherit", transition: "all 0.2s",
  });

  const fortuneColors = {
    5: "#c8a84b",  // 大吉
    4: "#e8c84b",  // 吉
    3: "#c8a84b",  // 平
    2: "#c85a3c",  // 凶
    1: "#c85050",  // 大凶
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px 80px", minHeight: "calc(100vh - 48px)" }}>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 40, animation: "fi 0.5s ease" }}>
        <div style={{ fontSize: 10, letterSpacing: 8, color: "#c8a84b", opacity: 0.6, marginBottom: 10 }}>
          {t("d6.subtitle")}
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: 10,
          background: "linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {t("d6.title")}
        </h1>
        <div style={{ width: 100, height: 1,
          background: "linear-gradient(90deg,transparent,#c8a84b,transparent)", margin: "12px auto 0" }} />
      </div>

      {/* Input section */}
      {!done && (
        <div style={{ animation: "fi 0.5s ease", width: "100%", maxWidth: 480 }}>
          {/* Fun mode toggle */}
          <div style={{ marginBottom: 16, animation: "fi 0.5s ease" }}>
            <FunModeToggle enabled={funMode} onChange={setFunMode} />
          </div>

          {/* Birth data input */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "rgba(200,168,75,0.55)", marginBottom: 12 }}>
              {t("d6.birthLabel")}
            </div>
            <div style={inputStyle}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.yearLabel")}
                  </div>
                  <input
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder={t("d6.yearPlaceholder") || "如1990"}
                    type="number"
                    min="1900"
                    max="2100"
                    style={fieldStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.monthLabel")}
                  </div>
                  <input
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    placeholder={t("d6.monthPlaceholder") || "1-12"}
                    type="number"
                    min="1"
                    max="12"
                    style={fieldStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.dayLabel")}
                  </div>
                  <input
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    placeholder={t("d6.dayPlaceholder") || "1-31"}
                    type="number"
                    min="1"
                    max="31"
                    style={fieldStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: GOLD + "0.5)", marginBottom: 6 }}>
                    {t("d6.hourLabel")}
                  </div>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(200,168,75,0.2)", color: "#e8d5a0",
                      padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
                      transition: "border 0.2s", borderRadius: 4,
                    }}
                  >
                    <option value="">--</option>
                    {EARTHLY_BRANCHES.map((branch, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}: {t(`branches.${i}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Question input */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "rgba(200,168,75,0.55)", marginBottom: 10 }}>
              {t("mhy.questionLabel")}
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("mhy.questionPlaceholder")}
              rows={2}
              style={{
                width: "100%", background: "rgba(200,168,75,0.04)",
                border: "1px solid rgba(200,168,75,0.2)", color: "#e8d5a0",
                padding: "12px 16px", fontSize: 14, lineHeight: 1.9,
                fontFamily: "inherit", resize: "vertical", transition: "border 0.2s", borderRadius: 4,
              }}
            />
          </div>

          {/* Divine button */}
          <button
            onClick={divine}
            disabled={divining || !birthYear || !birthMonth || !birthDay || !birthHour}
            style={{
              background: "none", border: "1px solid #c8a84b", color: "#f5e09a",
              padding: "14px 44px", fontSize: 17, letterSpacing: 6,
              cursor: divining ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: divining ? 0.6 : 1,
              boxShadow: "0 0 24px rgba(200,168,75,0.15)", transition: "all 0.2s",
            }}
          >
            {divining ? t("mhy.divining") : t("d6.button")}
          </button>
        </div>
      )}

      {/* Question display after divination */}
      {done && question && (
        <div style={{
          marginBottom: 24, maxWidth: 500, width: "100%",
          borderLeft: "2px solid rgba(200,168,75,0.35)", paddingLeft: 16, animation: "fi 0.5s ease"
        }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(200,168,75,0.5)", marginBottom: 4 }}>
            {t("mhy.questionDisplay")}
          </div>
          <div style={{ fontSize: 14, color: "#e8d5a0", lineHeight: 1.9 }}>{question}</div>
        </div>
      )}

      {/* Result */}
      {done && (
        <div ref={resultAreaRef} style={{ display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, animation: "fi 0.6s ease", width: "100%", maxWidth: 480 }}>

          {/* Situation and Time Display */}
          <SituationDisplay
            situation={result.situation}
            isDay={result.isDay}
          />

          {/* Pillars display */}
          <div style={{
            textAlign: "center", padding: "24px 28px",
            background: "rgba(200,168,75,0.03)", border: "1px solid rgba(200,168,75,0.15)",
            borderRadius: 8, marginBottom: 20
          }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#c8a84b", marginBottom: 16 }}>
              {t("d6.method")}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <Pillar label={t("d6.yearLabel")} stem={result.pillars.year.stem} branch={result.pillars.year.branch} />
              <Pillar label={t("d6.monthLabel")} stem={result.pillars.month.stem} branch={result.pillars.month.branch} />
              <Pillar label={t("d6.dayLabel")} stem={result.pillars.day.stem} branch={result.pillars.day.branch} />
              <Pillar label={t("d6.hourLabel")} stem={result.pillars.hour.stem} branch={result.pillars.hour.branch} />
            </div>
          </div>

          {/* Three Transmissions */}
          <ThreeTransmissionsDisplay transmissions={result.transmissions} />

          {/* Four Classes */}
          <FourClassesDisplay classes={result.classes} />

          {/* Heaven Pan and Earth Pan */}
          <HeavenPanDisplay
            generalsPan={result.generalsPan}
          />

          {/* Five Elements Analysis */}
          <FiveElementsDisplay elementAnalysis={result.elementAnalysis} />

          {/* Vacancies */}
          <VacanciesDisplay vacancies={result.vacancies} />

          {/* Divine Spirits */}
          <ShenShaDisplay shenShaAnalysis={result.shenShaAnalysis} />

          {/* Branch Relationships */}
          <BranchRelationshipsDisplay branchRelationships={result.branchRelationships} t={t} />

          {/* Element States */}
          <ElementStatesDisplay elementStates={result.elementStates} />

          {/* Overall Fortune Summary */}
          <div style={{
            padding: "20px",
            background: fortuneColors[result.overallFortune] || GOLD + '0.08)',
            border: "1px solid rgba(200,168,75,0.2)",
            borderRadius: 6,
            width: "100%",
            maxWidth: 400
          }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: '#c8a84b', marginBottom: 12 }}>
              综合卦象
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#f5e09a',
              marginBottom: 8
            }}>
              {getFortuneLabel(result.overallFortune)}
            </div>
            <div style={{
              fontSize: 14,
              color: GOLD + '0.7)',
              lineHeight: 1.9
            }}>
              {getFortuneDescription(result.overallFortune)}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={handleCopy} style={btnStyle(copied)}>
              <span>{copied ? "✓" : "⎘"}</span>
              <span>{copied ? t("coin.copied") : t("coin.copy")}</span>
            </button>
            <button onClick={divine} style={btnStyle(false)}>
              <span>↺</span>
              <span>{t("mhy.again")}</span>
            </button>
            <ScreenshotButton target={resultAreaRef} filename="daliuren" />
          </div>

          {/* Preview summary */}
          <div style={{
            width: "100%", background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(200,168,75,0.1)", padding: "14px 18px", marginTop: 16
          }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(200,168,75,0.3)", marginBottom: 10 }}>
              {t("actions.preview")}
            </div>
            <pre style={{
              fontSize: 11, color: "rgba(200,168,75,0.55)", lineHeight: 2,
              whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "inherit", margin: 0
            }}>
              {buildSummary()}
            </pre>
          </div>

          <button onClick={reset} style={{
            marginTop: 4, background: "none", border: "none",
            color: "rgba(200,168,75,0.35)", fontSize: 11, letterSpacing: 5,
            cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s"
          }}>
            {t("mhy.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
