# 04 — Migration Notes (จาก prototype → production)

> รายการสิ่งที่ต้องทำต่อ เพื่อยกจาก UI prototype ให้เป็นแอปใช้งานจริงแทน `pccth_code_review_web-dev`

---

## 1. State Management (แทน SharedDataService)

ของเดิมใช้ **RxJS BehaviorSubject** เก็บ state กลาง. ใน React แนะนำ:

- **React Context + `useReducer`** สำหรับ auth/user (เหมือน `currentUser$`)
- **TanStack Query (React Query)** สำหรับ server state (repositories, scans, issues)
  - แทน pattern "ถ้ามี cache ใช้เลย / ถ้าไม่มี fetch" ได้ตรง ๆ ด้วย query cache
  - หรือใช้ **Zustand** ถ้าต้องการ store แบบเบา ๆ ใกล้เคียง BehaviorSubject

Mapping methods เดิม → query/mutation:

| เดิม (SharedDataService) | ใหม่ (React Query) |
|--------------------------|--------------------|
| `setRepositories` / `repositories$` | `useQuery(['repositories'])` |
| `addRepository` | `useMutation` + `invalidateQueries(['repositories'])` |
| `updateRepository(id)` | `useMutation` + invalidate |
| `removeRepository(id)` | `useMutation` + invalidate |
| `hasRepositoriesCache` | query cache (อัตโนมัติ) |

---

## 2. เชื่อม Backend API

- แอปเดิมยิงไป `http://localhost:8080` (ดู `src/app/environments/environment.ts`)
- สร้าง `src/lib/api.js` (axios/fetch wrapper) + ใส่ base URL ผ่าน `.env`:
  ```
  VITE_API_URL=http://localhost:8080
  ```
- แนบ header ทุก request (ยกเว้น login/register):
  ```
  Authorization: Bearer <accessToken>
  ```
- Swagger ของเดิม: `http://localhost:8080/swagger-ui.html`

---

## 3. Authentication

- เก็บ `accessToken` (เดิมใช้ `tokenstorageService`) — ใน React ใช้ memory + refresh cookie
- ทำ **Protected Route** แทน `authGuard`:
  ```jsx
  function RequireAuth({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
  }
  ```
- ทำ role check แทน `roleGuard(['ADMIN'])` — decode JWT ด้วย `jwt-decode` (มีใน npm เหมือนเดิม)
- เพิ่ม refresh-token flow (interceptor 401 → refresh → retry)

---

## 4. Charts (แทน ng-apexcharts) — ✅ ทำแล้ว

ใช้ **`react-apexcharts`** ผ่าน wrapper [`src/components/charts.jsx`](../src/components/charts.jsx)
(Donut / Radial / Line / Bar) ที่อ่าน `ThemeContext` เพื่อปรับสีตาม dark/light อัตโนมัติ
ใช้อยู่ใน Dashboard, Analytics, Security Dashboard, Technical Debt
> production: เปลี่ยน config ให้รับข้อมูลจริงจาก API แทน mock ได้เลย (โครง options เหมือน ng-apexcharts เดิม)

---

## 5. Export รายงาน

ของเดิมมี `report-generator/` (pdf/excel/word/powerpoint) ใช้:
`jspdf` + `jspdf-autotable`, `xlsx`, `docx`, `pptxgenjs`, `file-saver`
→ library เหล่านี้เป็น framework-agnostic เรียกใช้ใน React ได้เลย

---

## 6. Real-time (WebSocket)

เดิมใช้ `@stomp/stompjs` + `sockjs-client` (`services/websocket/`) สำหรับ noti/scan real-time
→ ทำ custom hook `useWebSocket()` ครอบ STOMP client, subscribe ใน `useEffect`

---

## 7. i18n (EN / TH) — ✅ ทำแล้ว

ใช้ **`react-i18next`** ตั้งค่าที่ [`src/i18n.js`](../src/i18n.js) โดยคัดลอกไฟล์
`en.json` / `th.json` จาก `assets/i18n/` เดิมมาไว้ที่ [`src/locales/`](../src/locales) (โครง key เหมือนเดิม)
ทุกหน้าเรียก `useTranslation()` และสลับภาษาได้จาก [`LanguageSwitcher.jsx`](../src/components/LanguageSwitcher.jsx)
(จำค่าใน localStorage). production: เพิ่มคีย์ที่ยังขาด แล้วอัปเดตทั้งสองไฟล์ให้ครบคู่กัน

---

## 8. หน้าที่ต้องเพิ่ม

ดูรายการเต็มที่ [03-page-mapping.md](03-page-mapping.md) ส่วน "ยังไม่ทำ" — สำคัญ:
auth flow เต็ม, add/edit repo, repo detail, scan result, log viewer, issue detail (+ AI fix),
assignment, แยก security/technical-debt, report history, user management

---

## 9. โครงที่แนะนำเมื่อขยาย

```
src/
├── lib/          # api client, auth, ws
├── hooks/        # useAuth, useRepositories, useScans ...
├── store/        # context / zustand
├── features/     # แยกตาม domain (repositories, scans, issues, reports)
│   └── <feature>/{components, api, hooks}
├── components/   # shared UI (Button, Table, Badge, Modal)
└── pages/        # route-level
```

> เก็บ `styles/theme.css` (ตัวแปรสี) ต่อไป — เป็นสัญญากลางเรื่องธีมที่ทำให้ dark/light ทำงาน
