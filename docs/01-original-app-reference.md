# 01 — Reference โค้ดแอปเดิม (Angular 18)

> โค้ดตัวอย่างในไฟล์นี้ **คัดมาจากไฟล์จริง** ในโปรเจกต์ `pccth_code_review_web-dev`
> path ที่ระบุคือ path ในโปรเจกต์เดิม เพื่อให้เปิดดูของจริงเทียบได้

---

## 1. โครงสร้างโฟลเดอร์ (src/app)

```
src/app/
├── app.component.ts/html/css     # root: router-outlet + theme toggle
├── app.config.ts                 # providers (router, http, translate)
├── app.routes.ts                 # เส้นทางทั้งหมด
├── components/
│   ├── analytics-page/           # analysis, securitydashboard, technicaldebt
│   ├── dashboard/
│   ├── issue-page/               # issue, issuedetail, assignment, issuemodal
│   ├── landingpage/
│   ├── layout/                   # app-container = navbar + main-content
│   ├── navbar/                   # เมนูซ้ายแนวตั้ง
│   ├── report-page/              # generatereport, reporthistory
│   ├── repository-page/          # repositories, addrepository, detailrepository
│   ├── scan-page/                # scanhistory, scanresult, logviewer
│   ├── setting-web/              # sonarqubeconfig, notificationsetting, usermanagement
│   ├── user-page/                # login, register, forgot/reset password, verify-*
│   └── language-switcher/
├── services/                     # 1 โฟลเดอร์ต่อ 1 service (ดูข้อ 4)
├── interface/                    # TypeScript interfaces
├── pipes/                        # custom pipes (เช่น userStatus)
└── environments/                 # apiUrl config
```

---

## 2. Routing — `src/app/app.routes.ts`

route หลักที่ต้อง login จะอยู่ใต้ `LayoutComponent` + `authGuard`:

```typescript
export const routes: Routes = [
  { path: '', component: LandingpageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  // ... verify-email / verify-success / verify-failed

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'repositories', component: RepositoriesComponent },
      { path: 'addrepository', component: AddrepositoryComponent },
      { path: 'settingrepo/:projectId', component: AddrepositoryComponent },
      { path: 'detailrepo/:projectId', component: DetailrepositoryComponent },
      { path: 'scanhistory', component: ScanhistoryComponent },
      { path: 'scanresult/:scanId', component: ScanresultComponent },
      { path: 'logviewer/:scanId', component: LogviewerComponent },
      { path: 'issue', component: IssueComponent },
      { path: 'issuedetail/:issuesId', component: IssuedetailComponent },
      { path: 'assignment', component: AssignmentComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'security-dashboard', component: SecuritydashboardComponent },
      { path: 'technical-debt', component: TechnicaldebtComponent },
      { path: 'generatereport', component: GeneratereportComponent },
      { path: 'reporthistory', component: ReporthistoryComponent },
      { path: 'sonarqubeconfig', component: SonarqubeconfigComponent },
      { path: 'notificationsetting', component: NotificationsettingComponent },
      // ADMIN only:
      { path: 'usermanagement', component: UsermanagementComponent,
        canActivate: [roleGuard(['ADMIN'])] },
    ]
  },
  { path: '**', redirectTo: '' }
];
```

➡️ Prototype แปลงเป็น React Router ที่ [`src/App.jsx`](../src/App.jsx) (เก็บ subset ของหน้าหลัก)

---

## 3. Layout & Navbar

**`src/app/components/layout/layout.component.html`** — โครงหน้าจอ:

```html
<div class="app-container">
  <app-navbar></app-navbar>
  <div class="main-content">
    <div class="content-wrapper">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
```

**`src/app/components/navbar/navbar.component.ts`** — เมนู + เช็ค ADMIN จาก JWT:

```typescript
get isAdmin(): boolean {
  const token = this.tokenStorage.getAccessToken();
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role || decoded.roles || decoded.authority;
    return userRole === 'ADMIN';
  } catch {
    return false;
  }
}
```

เมนู (จาก `navbar.component.html`): Dashboard, Repositories, Scan History, Issue,
Analytics, Report (submenu: Generate/History), Setting (submenu: SonarQube/Notification/User Mgmt),
Logout — โดย User Management จะโชว์เฉพาะ `isAdmin`

➡️ Prototype: [`src/components/Layout.jsx`](../src/components/Layout.jsx) +
[`src/components/Sidebar.jsx`](../src/components/Sidebar.jsx)

---

## 4. Services (state + API)

หนึ่งโฟลเดอร์ต่อหนึ่ง service ที่ `src/app/services/`:

| Service | หน้าที่ |
|---------|--------|
| `shared-data/` | **State กลาง** (RxJS BehaviorSubject) — สำคัญที่สุด |
| `authservice/` | login/logout/refresh + `auth.guard.ts`, `role.guard.ts` |
| `reposervice/` | CRUD repositories |
| `scanservice/` | สั่ง/ดึงผลสแกน |
| `issueservice/` | จัดการ issue |
| `assignservice/` | มอบหมาย issue |
| `dashboardservice/` | ข้อมูลสรุป dashboard |
| `securityservice/`, `technicaldebtservice/` | analytics |
| `report-generator/` | pdf / excel / word / powerpoint |
| `notiservice/`, `websocket/` | แจ้งเตือน real-time (STOMP/SockJS) |
| `tokenstorageService/` | เก็บ/อ่าน JWT |
| `language/` | i18n (ngx-translate) |

### Pattern SharedDataService (จาก README เดิม)

```typescript
ngOnInit() {
  // 1. subscribe รับข้อมูล
  this.sharedData.repositories$.subscribe(repos => this.repositories = repos);

  // 2. ถ้ายังไม่มี cache → fetch
  if (!this.sharedData.hasRepositoriesCache) {
    this.loadRepositories();
  }
}

loadRepositories() {
  this.repoService.getAllRepo().subscribe({
    next: (repos) => this.sharedData.setRepositories(repos),   // 3. เก็บลง state กลาง
    error: (err) => console.error(err)
  });
}
```

Methods ที่ใช้บ่อย: `setRepositories`, `addRepository`, `updateRepository(id, updates)`,
`removeRepository(id)`, `setUserFromLoginResponse(res)`, `clearAll()`
Sync props: `userId`, `isAdmin`, `hasRepositoriesCache`, `repositoriesValue`

➡️ Prototype ยังไม่ทำ layer นี้ (ใช้ mock ตรง ๆ) — แผนดูที่ [04-migration-notes.md](04-migration-notes.md)

---

## 5. Interfaces — `src/app/interface/user_interface.ts`

```typescript
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  status: string;
}

export interface LoginResponse {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}
```

➡️ Prototype จำลอง shape เหล่านี้ (แบบย่อ) ใน [`src/data/mockData.js`](../src/data/mockData.js)

---

## 6. Dashboard (ตัวอย่างหน้าใหญ่สุด)

`src/app/components/dashboard/dashboard.component.html` ประกอบด้วย 5 ส่วน:

1. **Header** — export, notifications (dropdown + tabs All/Unread/Scans/Issues/System), profile menu (change password / verify email)
2. **Welcome banner** — ทักทาย + total scans / projects
3. **Metric grid (4)** — Bugs / Security / Code Smells / Coverage
4. **Quality Gate (pie) + Recent Scans (ตาราง)**
5. **Project distribution + Top issues** และ **Quality trends (line chart)**

กราฟใช้ `apx-chart` (ng-apexcharts). Prototype แทนด้วย CSS (donut / sparkbars)

➡️ Prototype: [`src/pages/Dashboard.jsx`](../src/pages/Dashboard.jsx)

---

## 7. Dependencies เด่นของเดิม (`package.json`)

`@angular/*ˋ 18`, `rxjs`, `@ngx-translate/core`, `ng-apexcharts` + `apexcharts`,
`jspdf` + `jspdf-autotable`, `docx`, `pptxgenjs`, `xlsx`, `file-saver` (export),
`@stomp/stompjs` + `sockjs-client` (websocket), `jwt-decode`, `sweetalert2`,
`dompurify`, `marked`, `bootstrap`
