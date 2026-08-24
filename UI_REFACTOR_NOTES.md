# 📝 UI Refactoring & Architecture Summary

เอกสารนี้จัดทำขึ้นเพื่อสรุปแนวคิด โครงสร้าง และรูปแบบ (Patterns) ที่ได้ทำการปรับปรุงในโปรเจกต์ (ช่วงสิงหาคม 2026) เพื่อให้นักพัฒนาที่จะเข้ามารับช่วงต่อในอนาคต (6 เดือน - 2 ปีข้างหน้า) สามารถทำความเข้าใจแนวทางการเขียนโค้ดและนำไปปรับใช้ต่อได้ทันทีโดยไม่เสียเวลา

---

## 1. Responsive Layout & Breakpoints Strategy (Tailwind CSS)

เราได้วางมาตรฐานการจัดการหน้าจอ (Responsive Design) ใหม่ทั้งหมดในส่วนของ **Filter Toolbars** และ **Card Grids** (ในหน้า `Repositories`, `Issues`, และ `Scan History`) ให้เป็นระเบียบและไม่พังเมื่อย่อขยายหน้าจอ:

- **📱 Mobile (`< 768px`):** 
  - ใช้ `flex-col` และ `w-full` เพื่อให้ฟิลเตอร์และปุ่มทุกอันเรียงซ้อนกันแนวตั้ง กว้างเต็มจอ (Stacked Layout)
- **💻 Tablet & Laptop (`md: 768px` ถึง `lg/xl: 1439px`):**
  - ใช้ **2-Row Grid Layout** เป็นหลัก เพื่อไม่ให้ฟิลเตอร์บีบอัดกันจนเกินไป
  - ตัวอย่าง: `grid-cols-2` หรือ `grid-cols-4` สำหรับ Dropdown ในแถวแรก และใช้ `flex-row justify-between` สำหรับช่อง Search และปุ่ม Action ในแถวที่สอง
- **🖥️ Large Desktop (`2xl: 1536px` ขึ้นไป):**
  - จัดให้อยู่ในแถวเดียวกันทั้งหมด (Single Horizontal Row) โดยใช้ `2xl:flex-row 2xl:items-end` เพื่อใช้พื้นที่หน้าจอขนาดใหญ่ให้เป็นประโยชน์สูงสุด
- **📏 Sizing Standardization:**
  - กำหนดความสูงของ Form Controls (Dropdowns, Inputs, DatePickers, Buttons) ให้เป็น `h-10` (40px) เท่ากันทั้งหมด เพื่อความสวยงาม

---

## 2. Onboarding Tours (Driver.js & Storage Architecture)

ระบบแนะนำการใช้งาน (Product Tours) มีการปรับจูนเทคนิคสำคัญเพื่อให้ User Experience ลื่นไหล และจัดการข้อมูลใน LocalStorage ได้อย่างสะอาด:

- **Organic Chaining (การบังคับให้ผู้ใช้คลิกจริง):** 
  - ในกรณีที่ต้องพาผู้ใช้ข้ามหน้า (เช่น จาก `/issue` ไปยัง `/issuedetail`) เราหลีกเลี่ยงการใช้ปุ่ม "Next" ของ Driver.js
  - **วิธีทำ:** ใน Step สุดท้ายก่อนเปลี่ยนหน้า เราตั้งค่า `showButtons: ['previous', 'close']` (ซ่อนปุ่ม Next) และตั้ง `disableActiveInteraction: false` เพื่อบังคับให้ผู้ใช้ต้องนำเมาส์ไป **คลิกที่ปุ่ม View Details บน UI จริงๆ** 
  - เมื่อผู้ใช้คลิกเปลี่ยนหน้า React Router จะ Unmount หน้าเดิม (ทำลาย Tour เก่า) และ Component ในหน้าใหม่จะเรียก `usePageTour()` เพื่อเริ่ม Tour ถัดไปแบบอัตโนมัติ

- **Unified LocalStorage Architecture (`app_tour_state`):**
  - ไม่สร้างคีย์แยกย่อย เช่น `has_seen_dashboard_tour`, `has_seen_issues_tour` อีกต่อไป
  - รวมสถานะทั้งหมดไว้ในคีย์เดียว `app_tour_state` ตามโครงสร้าง:
    ```typescript
    interface TourState {
      completedTours: string[]; // e.g. ['dashboard', 'repositories', 'issues', 'scanhistory']
      hasCompletedMainTour: boolean;
      version: number;
    }
    ```
  - จัดการผ่าน Helper Functions ใน [`tourStorage.ts`](file:///N:/---code---/PCC/PRO%201%20Code_Review/wed/src/features/onboarding/lib/tourStorage.ts) และ React Hook [`useTourStore.ts`](file:///N:/---code---/PCC/PRO%201%20Code_Review/wed/src/features/onboarding/hooks/useTourStore.ts):
    - `isTourCompleted(tourId)`
    - `markTourAsCompleted(tourId)`
    - `resetAllTours()`
    - `migrateLegacyTourKeys()`: ระบบย้ายและลบ Key เก่า (`has_seen_*`) อัตโนมัติเมื่อเปิดเว็บ

---

## 3. Form Field Labels (Overline Typography)

เพื่อความเป็นระเบียบและดู Modern ได้มีการเซ็ตมาตรฐานของ Label บนกล่องฟิลเตอร์ (เช่น หน้า `Scan History` และ `Issues`) ดังนี้:

```tsx
<label className="flex w-full flex-col gap-1">
  <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
    {t('ISSUE.TYPE')} หรือ TYPE
  </span>
  <SelectField className="h-10 w-full" ... />
</label>
```
- ใช้ `flex-col gap-1` หุ้มระหว่าง Label และ Input
- **Typography:** ใช้ `font-mono text-[10px] uppercase tracking-wide text-faint` เพื่อให้ตัวอักษรเล็กคมชัด ไม่รบกวนสายตา (Subtle Overline)
- หากในแถวเดียวกันมีปุ่ม (Button) ที่ไม่มี Label ด้านบน ให้หุ้มแถวนั้นด้วย `items-end` เพื่อให้กล่องและปุ่มถูกดึงลงมาเกาะที่เส้น Baseline เดียวกันด้านล่างสุด

---

## 4. Theme & Color Tokens

- **Surface Matching:** เราหลีกเลี่ยงการใช้ `bg-card` หรือพื้นหลังที่แปลกแยกในส่วนของ Filter Toolbar โดยหันมาใช้ `bg-surface` แทน เพื่อให้แถบฟิลเตอร์กลืนเนียนเป็นเนื้อเดียวกันกับ Metric Cards ที่อยู่ด้านบนของหน้าจอ
- **Dark Mode Compatibility:** คอมโพเนนต์ต่างๆ ถูกผูกอยู่กับ Semantic Tokens ใน `src/styles/index.css` (เช่น `border-border`, `text-fg`, `bg-surface`) ซึ่งจะทำหน้าที่สลับสีระหว่างโหมด Light/Dark ให้อัตโนมัติ (WCAG 2.1 AA Compliant)
- โค้ดทั้งหมด **งดเว้นการใช้สีแบบ Hardcode** เช่น `text-gray-500` แต่ใช้ตัวแปรของแอปพลิเคชันอย่าง `text-muted` หรือ `text-faint` แทน

---

## 📌 บทสรุปสำหรับผู้สานต่อ
หากคุณกำลังจะสร้างหน้าจอใหม่ที่มี **Filter Toolbar, Table, หรือ Grid Cards** ขอแนะนำให้เปิดดูโค้ดของ `src/pages/IssuesPage.tsx` หรือ `src/pages/ScanHistoryPage.tsx` เป็น **แม่แบบ (Template)** เนื่องจากสองหน้านี้ได้รับการ Optimized ทั้งเรื่อง Responsive Layout, การวาง DOM Structure, และ Typography ไว้สมบูรณ์แบบที่สุดแล้วครับ
