# 03 — ตารางเทียบหน้า Angular ↔ React

> เทียบ component เดิม (`pccth_code_review_web-dev/src/app/components/...`)
> กับไฟล์ prototype (`code-review-web/src/...`)

---

## หน้าที่ทำใน Prototype แล้ว ✅

| หน้า | Angular (เดิม) | React (prototype) | Route |
|------|----------------|-------------------|-------|
| Login | `user-page/login/` | [`pages/Login.jsx`](../src/pages/Login.jsx) | `/login` |
| Register | `user-page/register/` | [`pages/Register.jsx`](../src/pages/Register.jsx) | `/register` |
| Forgot Password | `user-page/forgot-password/` | [`pages/ForgotPassword.jsx`](../src/pages/ForgotPassword.jsx) | `/forgot-password` |
| Dashboard | `dashboard/` | [`pages/Dashboard.jsx`](../src/pages/Dashboard.jsx) | `/dashboard` |
| Repositories | `repository-page/repositories/` | [`pages/Repositories.jsx`](../src/pages/Repositories.jsx) | `/repositories` |
| Add / Edit Repository | `repository-page/addrepository/` | [`pages/AddRepository.jsx`](../src/pages/AddRepository.jsx) | `/addrepository`, `/settingrepo/:projectId` |
| Repository Detail | `repository-page/detailrepository/` | [`pages/RepositoryDetail.jsx`](../src/pages/RepositoryDetail.jsx) | `/detailrepo/:projectId` |
| Scan History | `scan-page/scanhistory/` | [`pages/ScanHistory.jsx`](../src/pages/ScanHistory.jsx) | `/scanhistory` |
| Scan Result | `scan-page/scanresult/` | [`pages/ScanResult.jsx`](../src/pages/ScanResult.jsx) | `/scanresult/:scanId` |
| Log Viewer | `scan-page/logviewer/` | [`pages/LogViewer.jsx`](../src/pages/LogViewer.jsx) | `/logviewer/:scanId` |
| Issues | `issue-page/issue/` | [`pages/Issues.jsx`](../src/pages/Issues.jsx) | `/issue` |
| Issue Detail | `issue-page/issuedetail/` | [`pages/IssueDetail.jsx`](../src/pages/IssueDetail.jsx) | `/issuedetail/:issuesId` |
| Assignment | `issue-page/assignment/` | [`pages/Assignment.jsx`](../src/pages/Assignment.jsx) | `/assignment` |
| Analytics (overview) | `analytics-page/analysis/` | [`pages/Analytics.jsx`](../src/pages/Analytics.jsx) | `/analysis` |
| Security Dashboard | `analytics-page/securitydashboard/` | [`pages/SecurityDashboard.jsx`](../src/pages/SecurityDashboard.jsx) | `/security-dashboard` |
| Technical Debt | `analytics-page/technicaldebt/` | [`pages/TechnicalDebt.jsx`](../src/pages/TechnicalDebt.jsx) | `/technical-debt` |
| Generate Report | `report-page/generatereport/` | [`pages/GenerateReport.jsx`](../src/pages/GenerateReport.jsx) | `/generatereport` |
| Report History | `report-page/reporthistory/` | [`pages/ReportHistory.jsx`](../src/pages/ReportHistory.jsx) | `/reporthistory` |
| SonarQube Config | `setting-web/sonarqubeconfig/` | [`pages/Settings.jsx`](../src/pages/Settings.jsx) | `/sonarqubeconfig` |
| Notification Setting | `setting-web/notificationsetting/` | [`pages/NotificationSetting.jsx`](../src/pages/NotificationSetting.jsx) | `/notificationsetting` |
| User Management (ADMIN) | `setting-web/usermanagement/` | [`pages/UserManagement.jsx`](../src/pages/UserManagement.jsx) | `/usermanagement` |
| App shell | `layout/` + `navbar/` | [`components/Layout.jsx`](../src/components/Layout.jsx) + [`Sidebar.jsx`](../src/components/Sidebar.jsx) | — |
| Theme toggle | `app.component.ts` | [`context/ThemeContext.jsx`](../src/context/ThemeContext.jsx) | — |
| Language switch | `language-switcher/` | [`components/LanguageSwitcher.jsx`](../src/components/LanguageSwitcher.jsx) | — |
| Charts (ApexCharts) | ng-apexcharts | [`components/charts.jsx`](../src/components/charts.jsx) | — |
| i18n (EN/TH) | @ngx-translate | [`i18n.js`](../src/i18n.js) + [`locales/`](../src/locales) | — |

---

## ยังไม่ทำ / ทำต่อ (เฟสถัดไป) ⏳

| หน้า / งาน | Angular (เดิม) | หมายเหตุ |
|------------|----------------|----------|
| Landing page | `landingpage/` | หน้าแรกก่อน login |
| Reset password / Verify email | `user-page/reset-password`, `verify-*` | ส่วนที่เหลือของ auth flow |
| Issue / assign modals | `issue-page/issuemodal/` | modal มอบหมาย/เปลี่ยนสถานะ |
| Compare scans modal | `scanhistory` (compare) | ยังไม่ทำ modal เปรียบเทียบ |
| ต่อ Backend API + Auth จริง | ทุก service | ดู [04-migration-notes.md](04-migration-notes.md) |

---

## หมายเหตุ

- **Charts**: Dashboard / Analytics / Security Dashboard / Technical Debt ใช้ **ApexCharts จริง**
  (`react-apexcharts`) ผ่าน wrapper [`components/charts.jsx`](../src/components/charts.jsx) ที่ปรับสีตาม dark/light อัตโนมัติ
- **i18n**: ทุกหน้าใช้ `useTranslation()` + key จาก `en.json` / `th.json` (คัดลอกมาจากของเดิม)
  สลับภาษาได้จาก **language switcher** ใน sidebar และหน้า Login/Register (i18next จำค่าใน localStorage)
- **ข้อมูล**: ยังเป็น **mock data** ทั้งหมด (`src/data/mockData.js`) — ยังไม่ต่อ API
