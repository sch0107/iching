# 易经起卦 · I Ching Oracle

A traditional Chinese divination web app with four modes, built with React + Vite. Hosted on GitHub Pages.

**[Live site →](https://sch0107.github.io/iching/)**

---

## Features

### Four Divination Modes

| Mode | 中文 | Description |
|------|------|-------------|
| **I Ching** | 易经 | Full 64-hexagram reading with changing lines and derived hexagram |
| **Coin** | 铜钱/銅錢 | Single coin toss for quick yes/no guidance |
| **Six Signs** | 小六壬 | Classical six-sign oracle calculated from the current time |
| **Plum Blossom** | 梅花易術 | 邵雍's time-based numerology: Earlier Heaven trigram numbers → hexagram + moving line + derived hexagram |

### Multilingual
- Simplified Chinese (简体中文)
- Traditional Chinese (繁體中文)
- English

All text — including all 64 hexagram names, judgments, trigram names, and sign descriptions — lives in the three locale JSON files. No translatable strings are hardcoded in components.

### Timezone Selector (小六壬 & 梅花易術)
- **UTC+8** (default) — uses Chinese standard time for the hour-branch calculation, giving traditionally correct results regardless of where you are
- **Local** — uses the device's local timezone

### Other
- Copy reading to clipboard — paste directly into an AI for interpretation
- Export as `.txt` (I Ching)
- Responsive mobile layout
- Internationalization via [react-i18next](https://react.i18next.com/)

---

## Divination Methods

### 梅花易術 (Plum Blossom Oracle)
Time-based divination (时间起卦) attributed to Shao Yong (邵雍), using Earlier Heaven (先天八卦) numerology:

| Step | Formula |
|------|---------|
| Year number | `year % 100` |
| Upper trigram | `(year + month + day) % 8` → 1=乾 … 8=坤 |
| Lower trigram | `(year + month + day + hour-branch) % 8` |
| Moving line | `(year + month + day + hour-branch) % 6` (0 → 6) |

The primary hexagram is formed from the two trigrams; the moving line is applied to produce the derived hexagram. Body (体卦) and Use (用卦) trigrams are identified based on which trigram contains the moving line.

---

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-i18next](https://react.i18next.com/) — i18n
- GitHub Actions — CI/CD build & deploy
- GitHub Pages — hosting

---

## Project Structure

```
├── App.jsx              # Root: nav bar, mode routing, lang switcher
├── iching.jsx           # I Ching full reading
├── CoinToss.jsx         # Coin toss oracle
├── XiaoLiuRen.jsx       # 小六壬 six-sign oracle (with timezone selector)
├── MeiHua.jsx           # 梅花易術 plum blossom oracle (with timezone selector)
├── i18n.js              # i18next config
├── locales/
│   ├── en.json          # All UI strings + 64 hexagrams + trigrams + signs (EN)
│   ├── zh-Hans.json     # Same, Simplified Chinese
│   └── zh-Hant.json     # Same, Traditional Chinese
├── main.jsx             # React entry point
├── index.html           # Vite template
└── vite.config.js       # base: "/iching/"
```

---

## Local Development

```bash
npm install
npm run dev
```

## Deploy

Push to `main` — GitHub Actions builds and deploys automatically.

The workflow requires **Settings → Pages → Source → GitHub Actions** to be enabled in the repo.
