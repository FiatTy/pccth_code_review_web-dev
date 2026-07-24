# PCCTH Automate Code Review — React + Vite Prototype

> การ rework ของ **`pccth_code_review_web-dev`** (เดิมเป็น **Angular 18**) ให้เป็น **React + Vite**
> เวอร์ชันนี้เป็น **prototype** เน้น UI/โครงสร้างหน้า และใช้ **mock data** (ยังไม่ต่อ backend API)

---

## เป้าหมายของ Prototype นี้

1. เก็บ **look & feel** ของแอปเดิมไว้ (ธีมสี, dark mode, layout, การ์ด, ตาราง)
2. วางโครงสร้าง **React + Vite** ที่แยกส่วนชัดเจน (routing, layout, pages, data, theme)
3. ครอบคลุมหน้าหลัก: Dashboard, Repositories, Scan History, Issues, Analytics, Generate Report, Settings, Login
4. มีเอกสาร markdown ใน [`docs/`](docs/) ที่อ้างอิงโค้ดของแอปเดิม เพื่อเทียบและเข้าใจการทำงาน

> ⚠️ โปรเจกต์เดิม `pccth_code_review_web-dev` **ไม่ถูกแก้ไข** — ใช้เป็น reference เท่านั้น

---

## Quick Start

```bash
# 1. เข้าโฟลเดอร์
cd code-review-web

# 2. ติดตั้ง dependencies
npm install

# 3. รัน dev server
npm run dev

# 4. build production
npm run build && npm run preview
```

> หมายเหตุ: แอปเดิมใช้พอร์ต `4200` (Angular). ถ้าพอร์ตชนกัน Vite จะเลือกพอร์ตว่างให้อัตโนมัติ

---

## Tech Stack

| ส่วน | เดิม (Angular) | ใหม่ (Prototype) |
|------|----------------|------------------|
| Framework | Angular 18 | React 18 |
| Build tool | Angular CLI / Webpack | Vite 5 |
| Routing | `@angular/router` | `react-router-dom` v6 |
| State | RxJS `BehaviorSubject` (SharedDataService) | React state / Context (prototype) |
| Charts | ng-apexcharts | **react-apexcharts** (กราฟจริง, ปรับตาม dark/light) |
| Icons | Bootstrap Icons | Bootstrap Icons |
| i18n | @ngx-translate | **react-i18next** (EN/TH ใช้ `en.json`/`th.json` เดิม) |

---

## โครงสร้างโปรเจกต์

```
code-review-web/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── logo.svg
├── docs/                     # 📄 เอกสารอ้างอิงแอปเดิม (ดูด้านล่าง)
│   ├── 00-overview.md
│   ├── 01-original-app-reference.md
│   ├── 02-design-system.md
│   ├── 03-page-mapping.md
│   └── 04-migration-notes.md
└── src/
    ├── main.jsx              # entry point (โหลด i18n + theme)
    ├── App.jsx               # routing (พอร์ตจาก app.routes.ts) — 21 เส้นทาง
    ├── i18n.js               # react-i18next config (แทน @ngx-translate)
    ├── context/
    │   └── ThemeContext.jsx  # dark/light toggle (พอร์ตจาก app.component.ts)
    ├── components/
    │   ├── Layout.jsx        # พอร์ตจาก layout.component
    │   ├── Sidebar.jsx       # พอร์ตจาก navbar.component
    │   ├── LanguageSwitcher.jsx
    │   └── charts.jsx        # wrapper react-apexcharts (Donut/Radial/Line/Bar)
    ├── pages/                # 21 หน้า (ดู docs/03-page-mapping.md)
    │   ├── Login / Register / ForgotPassword
    │   ├── Dashboard
    │   ├── Repositories / AddRepository / RepositoryDetail
    │   ├── ScanHistory / ScanResult / LogViewer
    │   ├── Issues / IssueDetail / Assignment
    │   ├── Analytics / SecurityDashboard / TechnicalDebt
    │   ├── GenerateReport / ReportHistory
    │   └── Settings / NotificationSetting / UserManagement
    ├── data/
    │   └── mockData.js       # ข้อมูลจำลอง (shape ตาม interface เดิม)
    ├── locales/
    │   ├── en.json           # คัดลอกจาก assets/i18n/en.json เดิม
    │   └── th.json           # คัดลอกจาก assets/i18n/th.json เดิม
    └── styles/
        ├── theme.css         # ตัวแปรสี (ยกมาจาก styles.css เดิม 1:1)
        └── global.css        # layout & component styling
```

---

## เอกสารอ้างอิง (docs/)

เอกสารเหล่านี้เขียนเพื่อให้เห็น **ตัวอย่างและการทำงานของแอปเดิม** พร้อมชี้ path ไฟล์จริงในโปรเจกต์ `pccth_code_review_web-dev`:

| ไฟล์ | เนื้อหา |
|------|---------|
| [docs/00-overview.md](docs/00-overview.md) | ภาพรวม แอปเดิมทำอะไร, feature หลัก |
| [docs/01-original-app-reference.md](docs/01-original-app-reference.md) | โครงสร้าง Angular, routes, components, services + โค้ดตัวอย่างจริง |
| [docs/02-design-system.md](docs/02-design-system.md) | ธีมสี, CSS variables, dark mode, badge/สถานะ |
| [docs/03-page-mapping.md](docs/03-page-mapping.md) | ตารางเทียบ หน้า Angular ↔ ไฟล์ React |
| [docs/04-migration-notes.md](docs/04-migration-notes.md) | สิ่งที่ต้องทำต่อเพื่อให้เป็น production (ต่อ API, state, charts) |

---

## สถานะ (Prototype scope)

| ทำแล้ว ✅ | ยังไม่ทำ (เฟสถัดไป) ⏳ |
|-----------|------------------------|
| App shell (sidebar + layout + theme toggle) | ต่อ Backend API จริง (`http://localhost:8080`) |
| Dark / Light mode | Auth (JWT, guards, refresh token) |
| **21 หน้า** + mock data | State management (แทน SharedDataService) |
| ธีม/สไตล์ ตรงกับของเดิม | Export PDF/Excel/Word/PPT จริง |
| Routing ครบตาม app.routes.ts | WebSocket (real-time scan/noti) |
| **กราฟจริง** (react-apexcharts, ปรับ dark/light) | Landing page, reset/verify email |
| **i18n EN/TH** (react-i18next + language switcher) | modal มอบหมาย / เปรียบเทียบสแกน |
```
