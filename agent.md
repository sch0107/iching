# Agent Context for I Ching Divination App (易经起卦)

## Project Overview

This is a traditional Chinese divination web application built with React + Vite. It provides six different divination modes and supports three languages (Simplified Chinese, Traditional Chinese, and English). The app is deployed to GitHub Pages.

**Live URL:** https://sch0107.github.io/iching/

## Core Features

### Six Divination Modes
1. **易经 (I Ching)** - Full 64-hexagram divination with changing lines and transformed hexagrams
2. **铜钱 (Coin Toss)** - Single coin toss for quick yes/no questions
3. **小六壬 (Xiao Liu Ren)** - Time-based divination using the six spirits method
4. **梅花易术 (Mei Hua Yi Shu)** - Shao Yong's time-based hexagram method
5. **大六壬 (Da Liu Ren)** - Birth date/time (Ba Zi) divination
6. **塔罗牌 (Tarot)** - 78-card Tarot with multiple spreads and reversal support

### Key Features
- Multi-language support (zh-Hans, zh-Hant, en) - all content in JSON locale files, no hardcoded text in components
- Time zone selection (UTC+8 or local) for Xiao Liu Ren and Mei Hua modes
- Copy results to clipboard (for AI interpretation)
- Export results to .txt file (I Ching mode)
- Mobile-responsive design
- "I'm feeling lucky" randomization toggle

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **react-i18next** - Internationalization
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

## Project Structure

```
├── App.jsx              # Root component with navigation and routing
├── i18n.js              # i18next configuration
├── main.jsx             # React entry point
├── index.html           # Vite template
├── vite.config.js       # Vite config (base: "/iching/")
├── modes/
│   ├── IChing.jsx       # I Ching divination
│   ├── CoinToss.jsx     # Coin toss divination
│   ├── XiaoLiuRen.jsx  # Xiao Liu Ren (six spirits)
│   ├── MeiHua.jsx       # Mei Hua Yi Shu
│   ├── daLiuRen/        # Da Liu Ren (Ba Zi) - Modular architecture
│   │   ├── index.jsx    # Entry point, exports Da6 component
│   │   ├── Da6.jsx      # Main component with UI and state management
│   │   ├── data.js      # Data structures
│   │   ├── calculations/# Calculation logic modules
│   │   │   ├── index.js
│   │   │   ├── threeTransmissions.js    # 三傳 (Nine Schools of Method)
│   │   │   ├── fourClasses.js           # 四課
│   │   │   ├── divineSpirits.js         # 神煞
│   │   │   ├── heavenPan.js             # 天盘
│   │   │   ├── twelveGenerals.js        # 十二将
│   │   │   ├── stemBranch.js            # 干支系统
│   │   │   ├── yueJiang.js              # 月将
│   │   │   ├── elementStates.js         # 五行
│   │   │   ├── branchRelationships.js   # 地支关系
│   │   │   ├── calculateDa6Full.js      # Complete calculation pipeline
│   │   │   └── utilities.js             # Utility functions
│   │   └── components/# UI components
│   │       ├── index.js
│   │       └── Pillar.jsx               # Pillar visualization component
│   ├── Tarot.jsx        # Tarot card divination
│   └── tarotData.js     # 78-card structure + Fisher-Yates shuffle
└── locales/
    ├── en.json          # English translations (UI + hexagrams +八卦 + spirits)
    ├── zh-Hans.json     # Simplified Chinese
    ├── zh-Hant.json     # Traditional Chinese
    ├── tarot-en.json    # English Tarot cards and meanings
    ├── tarot-zh-Hans.json  # Simplified Chinese Tarot
    └── tarot-zh-Hant.json  # Traditional Chinese Tarot
```

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Build and Preview
```bash
npm run build
npm run preview
```

### Deployment
- Push to `main` branch
- GitHub Actions automatically builds and deploys to GitHub Pages
- Must enable: **Settings → Pages → Source → GitHub Actions**

## Important Conventions

### Internationalization
- **All UI text must use `useTranslation()` hook**
- Never hardcode Chinese, English, or any language text directly in JSX
- All translations belong in `locales/` directory
- Structure: `locales/{language}.json` for general content, `locales/tarot-{language}.json` for Tarot-specific content

### Component Structure
- Each divination mode is a separate component in `modes/` directory
- Components are state-managed internally using React hooks
- Navigation is handled in `App.jsx`

### I18n Usage
```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <div>{t('key.path')}</div>;
}
```

## Divination Methods Summary

### I Ching (易经)
- Uses simulated "yarrow stalk method" probability
- 64 hexagrams with changing lines
- Generates original hexagram and transformed hexagram

### Coin Toss (铜钱)
- Single coin toss for yes/no
- Heads = Yang (auspicious), Tails = Yin (caution)

### Xiao Liu Ren (小六壬)
- Time-based calculation using month, day, and time
- Results in one of six spirits: 大安, 留连, 速喜, 赤口, 小吉, 空亡
- Formula: (month + day + time_branch) % 6

### Mei Hua Yi Shu (梅花易术)
- Shao Yong's time-based method
- Upper trigram: (year + month + day) % 8
- Lower trigram: (year + month + day + time_branch) % 8
- Moving line: (year + month + day + time_branch) % 6
- Uses pre-heaven (先天) Ba Gua numbers

### Da Liu Ren (大六壬)
- Requires birth date/time input (Ba Zi - 8 pillars)
- **Complete traditional implementation** following authentic Chinese divination methods
- **九宗门 (Nine Schools of Method)** for 三傳: 贼克法, 涉害法, 遥克法, 昴星法, 别责法, 八专法
- **三傳 (Three Transmissions)**: First, second, and third transmissions based on 九宗门 priority rules
- **四課 (Four Classes)**: Traditional derivation using 日干寄宫 and 天盘上神
- **月将加时 (Monthly General + Hour)**: Heaven pan rotates based on 月将 + hour branch
- **天盤地盤 (Heaven & Earth Pans)**: Proper heaven pan rotation using 月将, fixed earth pan
- **五行分析 (Five Elements Analysis)**: Complete analysis of generating and controlling relationships, element balance
- **空亡 (Vacancies)**: 旬-based calculation from 60甲子 cycle (accurate method)
- **局 (Situations)**: Upper, middle, or lower situation based on day/month relationship
- **十二将 (Twelve Generals)**: Complete placement of all 12 generals (贵人, 螣蛇, 朱雀, 六合, 勾陈, 青龙, 天空, 白虎, 太常, 玄武, 太阴, 天后) based on 日干 and day/night
- **六亲 (Six Relatives)**: Accurate calculation based on five-element relationships (父母, 子孙, 官鬼, 妻财, 兄弟)
- **月将 (Monthly General)**: Determined by 24 solar terms (节气) - accurate traditional method
- **寄宫 (Temporary Residence)**: 日干寄宫 mapping (甲己寄丑, 乙庚寄子, etc.)
- **综合卦象 (Overall Fortune)**: Comprehensive fortune scoring (大吉, 吉, 平, 凶, 大凶)
- **日占/夜占 (Day/Night Divination)**: Different 贵人 position for daytime (辰时-戌时) vs nighttime
- Traditional calendar-based stem-branch calculations with proper leap year handling
- Data structures in `modes/daLiuRenData.js`

### Tarot (塔罗牌)
- 78 cards: 22 Major Arcana + 56 Minor Arcana (4 suits × 14)
- Spreads: single, 3-card, 5-card, Celtic Cross (10-card)
- Optional reversal support
- Fisher-Yates shuffle algorithm in `tarotData.js`

## Common Tasks

### Adding a new language
1. Create new JSON files in `locales/`
2. Add translation data matching existing structure
3. Update `i18n.js` to include new language
4. Add language option in `App.jsx`

### Modifying divination logic
- Each mode is self-contained in its JSX file
- Check corresponding locale files for translation keys
- Test with all three languages

### Adding features
- Follow existing component patterns
- Use React hooks for state management
- Add translations to all three locale files
- Test mobile responsiveness

## Testing Notes

- Test all six divination modes
- Verify all three languages work correctly
- Check mobile layout (responsive design)
- Test copy-to-clipboard functionality
- Verify export to .txt (I Ching mode)
- Test time zone switching (Xiao Liu Ren, Mei Hua)

## Key Files to Reference

- `App.jsx` - Main navigation and layout
- `i18n.js` - Translation configuration
- `locales/` - All translation content
- `modes/tarotData.js` - Tarot card data and shuffle algorithm
- `vite.config.js` - Build configuration for GitHub Pages

## Git Workflow

- Main branch: `main`
- Auto-deploy to GitHub Pages on push
- Ensure all tests pass before pushing
- Build process: `npm run build`

## Notes for Agents

- This is a cultural/divination app - treat content respectfully
- Translation accuracy is critical - verify all language changes
- Traditional Chinese characters are used for zh-Hant locale
- The app simulates traditional divination methods for educational/entertainment purposes
- All divination calculations follow documented traditional methods
