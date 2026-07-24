# 02 — Design System (ธีมสี & สไตล์)

> ตัวแปรสีทั้งหมด **ยกมาจาก** `pccth_code_review_web-dev/src/styles.css` (`:root` และ `.dark-mode`)
> และคัดลอกแบบ 1:1 ไปไว้ที่ [`src/styles/theme.css`](../src/styles/theme.css)
> เพื่อให้ prototype มีหน้าตาตรงกับของเดิม

---

## กลไก Dark / Light mode

แอปเดิมสลับธีมโดย toggle class `dark-mode` บน `<body>` (ใน `app.component.ts`)
Prototype ทำเหมือนกันผ่าน [`ThemeContext.jsx`](../src/context/ThemeContext.jsx):

```jsx
document.body.classList.toggle('dark-mode', darkMode);
```

เพราะฉะนั้น CSS variables ชุดเดียวกันจึงใช้ได้ทันทีทั้งสองธีม

---

## ตัวแปรสีหลัก (light mode `:root`)

| ตัวแปร | ค่า | ใช้กับ |
|--------|-----|--------|
| `--primary` | `#2563eb` | สีหลัก / title |
| `--btn-primary-bg` | `#3b82f6` | ปุ่มหลัก |
| `--bg-main` | `#f8fafc` | พื้นหลังหน้า |
| `--bg-card` / `--card-bg` | `#ffffff` | การ์ด |
| `--text-main` | `#0f172a` | ข้อความหลัก |
| `--text-sub` | `#64748b` | ข้อความรอง |
| `--navbar-active-bg` | `#1e90ff` | เมนูที่ active |
| `--navbar-active-border` | `#ffa500` | เส้นขอบซ้ายเมนู active |
| `--success` | `#10b981` | สถานะผ่าน |
| `--danger` | `#ef4444` | สถานะไม่ผ่าน |

## Dark mode (`.dark-mode`)

| ตัวแปร | ค่า |
|--------|-----|
| `--bg-main` | `#0f172a` |
| `--card-bg` | `#1e293b` |
| `--text-main` | `#ffffff` |
| `--toggle-btn-bg` | `#ffa500` |
| `--repo-tab-text` | `#ffffff` |

---

## สีเฉพาะทาง (semantic)

**Metric icons:**
`--metric-bugs #dc2626`, `--metric-security #d97706`, `--metric-code-smells #0ea5e9`, `--metric-coverage #16a34a`

**Grades:**
`--grade-a #10b981`, `--grade-b #84cc16`, `--grade-c #f59e0b`, `--grade-d #fb923c`, `--grade-e #ef4444`

**Status badges** (จาก `styles.css` เดิม):

| class | bg | text |
|-------|----|----|
| passed / gate-pass | `#d1fae5` | `#065f46` |
| warning | `#fef3c7` | `#92400e` |
| failed / gate-fail | `#fee2e2` | `#991b1b` |
| scanning | `#dbeafe` | `#1e40af` |

**Project type colors:** Angular = `#dd0031`, Spring Boot = `#6db33f`

---

## Component styling

Prototype รวมสไตล์ layout/การ์ด/ตาราง/badge ไว้ที่ [`src/styles/global.css`](../src/styles/global.css)
โดยอ้างอิงคลาสจาก component ของเดิม เช่น:

- `.vertical-navbar`, `.nav-link.active` — เมนูซ้าย
- `.metric-card`, `.welcome-card` — dashboard
- `.repo-card`, `.stat-card` — repositories
- `.data-table`, `.status-badge`, `.gate-badge`, `.severity-badge` — ตาราง/สถานะ
- `.donut`, `.sparkbars`, `.chart-placeholder` — แทนกราฟ ApexCharts

---

## ไอคอน

ใช้ **Bootstrap Icons** เหมือนของเดิม (คลาส `bi bi-*`)
ในเดิมโหลดผ่าน CSS; prototype ติดตั้งเป็น npm package แล้ว import ที่ `main.jsx`:

```js
import 'bootstrap-icons/font/bootstrap-icons.css';
```

ตัวอย่างไอคอนที่ใช้ซ้ำ: `bi-speedometer2` (dashboard), `bi-folder-fill` (repos),
`bi-bug-fill`, `bi-shield-lock-fill`, `bi-graph-up`, `bi-clock-history`
