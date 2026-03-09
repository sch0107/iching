# 易经起卦 · I Ching Oracle

A traditional Chinese divination web app with three modes, built with React + Vite. Hosted on GitHub Pages.

**[Live site →](https://sch0107.github.io/iching/)**

---

## Features

### Three Divination Modes

| Mode | 中文 | Description |
|------|------|-------------|
| **I Ching** | 易经 | Full 64-hexagram reading with changing lines and derived hexagram |
| **Coin** | 铜钱/銅錢 | Single coin toss for quick yes/no guidance |
| **Six Signs** | 小六壬 | Classical six-sign oracle calculated from the current time |

### Multilingual
- Simplified Chinese (简体中文)
- Traditional Chinese (繁體中文)
- English

### Other
- Copy reading to clipboard — paste directly into an AI for interpretation
- Export as `.txt`
- Responsive mobile layout
- Internationalization via [react-i18next](https://react.i18next.com/)

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
├── XiaoLiuRen.jsx       # 小六壬 six-sign oracle
├── i18n.js              # i18next config
├── locales/
│   ├── en.json
│   ├── zh-Hans.json
│   └── zh-Hant.json
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
