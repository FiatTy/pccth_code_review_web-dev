# 00 — ภาพรวมแอปเดิม (pccth_code_review_web-dev)

> เอกสารชุดนี้อ้างอิงโปรเจกต์เดิมที่อยู่ที่:
> `../pccth_code_review_web-dev` (Angular 18) — **ห้ามแก้ไข** ใช้เพื่อดูตัวอย่างเท่านั้น

---

## แอปนี้คืออะไร

**PCCTH Automate Code Review** เป็น Frontend สำหรับระบบตรวจสอบคุณภาพโค้ดอัตโนมัติ
เชื่อมกับ **SonarQube** ผ่าน backend API (`http://localhost:8080`) เพื่อ:

- จัดการ **Repositories** (Angular / Spring Boot projects)
- สั่ง **Scan** โค้ดและดูผล (bugs, vulnerabilities, code smells, coverage, quality gate)
- ติดตาม **Issues** ที่พบ พร้อมมอบหมาย (assignment) ให้ผู้รับผิดชอบ
- ดู **Analytics**: Security Dashboard, Technical Debt
- **Generate Report** เป็น PDF / Excel / Word / PowerPoint
- ตั้งค่า SonarQube, Notification, และจัดการ User (ADMIN)

---

## Feature หลัก (ตาม README เดิม)

| กลุ่ม | รายละเอียด |
|-------|-----------|
| Authentication | Login, Register, Forgot/Reset password, Verify email (JWT + refresh token) |
| Dashboard | สรุปคุณภาพโปรเจกต์: metric cards, quality gate, recent scans, trends |
| Repositories | เพิ่ม/แก้/ลบ repo, รันสแกน, ดู metric ต่อ repo |
| Scan | ประวัติการสแกน, ดู log, ดูผล, เปรียบเทียบสแกน |
| Issues | รายการ issue, filter, assign developer, ดูรายละเอียด + AI fix |
| Analytics | Security dashboard (OWASP), Technical debt (ต้นทุนเป็นเงิน) |
| Report | สร้างรายงานหลายฟอร์แมต + ประวัติรายงาน |
| Settings | SonarQube config, Notification, User management (ADMIN เท่านั้น) |
| อื่น ๆ | Dark/Light mode, i18n (EN/TH), WebSocket (real-time scan/noti) |

---

## จุดสำคัญทางสถาปัตยกรรม (ของเดิม)

1. **SharedDataService (RxJS BehaviorSubject)** — เป็นหัวใจ state management
   - เก็บ `currentUser$`, `repositories$`, `selectedRepository$`, `recentScans$`
   - กฎ: ถ้ายังไม่มีข้อมูล → fetch API แล้ว set ลง service; ถ้ามีแล้ว → ใช้ต่อ (ไม่ fetch ซ้ำ)
   - ดูโค้ดจริง: `pccth_code_review_web-dev/src/app/services/shared-data/`

2. **Auth Guards** — `authGuard`, `roleGuard(['ADMIN'])`
   - route ที่ต้อง login อยู่ใต้ `LayoutComponent`
   - ดู: `src/app/services/authservice/auth.guard.ts`, `role.guard.ts`

3. **HTTP + JWT** — ทุก request (ยกเว้น login/register) แนบ `Authorization: Bearer <token>`

4. **Standalone Components** — Angular 18 ใช้ standalone (ไม่มี NgModule)

---

## สิ่งที่ prototype นี้เลือกทำ

Prototype โฟกัส **UI + โครงสร้าง** เพื่อพิสูจน์ว่า React + Vite ทำหน้าตาแบบเดิมได้
โดยตัดส่วนที่ผูกกับ backend ออกชั่วคราว (ใช้ mock data) — รายละเอียดการ map ดูที่
[03-page-mapping.md](03-page-mapping.md) และแผนทำต่อที่ [04-migration-notes.md](04-migration-notes.md)
