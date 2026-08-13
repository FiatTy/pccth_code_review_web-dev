import fs from 'node:fs';
import path from 'node:path';

const pages = [
  { name: 'Repositories', title: 'Repositories Overview', desc: 'Manage your repositories here.', thTitle: 'ภาพรวมคลังโค้ด', thDesc: 'จัดการคลังโค้ดทั้งหมดของคุณที่นี่' },
  { name: 'ScanHistory', title: 'Scan History', desc: 'View past code scans.', thTitle: 'ประวัติการสแกน', thDesc: 'ดูประวัติการสแกนโค้ดย้อนหลัง' },
  { name: 'Issues', title: 'Issues', desc: 'Review and triage issues.', thTitle: 'รายการปัญหา', thDesc: 'ตรวจสอบและคัดกรองปัญหาที่พบ' },
  { name: 'Assignments', title: 'Assignments', desc: 'Check assigned tasks.', thTitle: 'งานที่ได้รับมอบหมาย', thDesc: 'ตรวจสอบงานที่ถูกมอบหมายให้คุณ' },
  { name: 'Analysis', title: 'Analysis Overview', desc: 'Dive deep into code metrics.', thTitle: 'ภาพรวมการวิเคราะห์', thDesc: 'เจาะลึกสถิติและตัวชี้วัดของโค้ด' },
  { name: 'SecurityDashboard', title: 'Security Dashboard', desc: 'Monitor vulnerabilities.', thTitle: 'แดชบอร์ดความปลอดภัย', thDesc: 'ตรวจสอบช่องโหว่ด้านความปลอดภัย' },
  { name: 'TechnicalDebt', title: 'Technical Debt', desc: 'Track technical debt over time.', thTitle: 'หนี้ทางเทคนิค', thDesc: 'ติดตามหนี้ทางเทคนิคและปัญหาเรื้อรัง' },
  { name: 'GenerateReport', title: 'Generate Report', desc: 'Export scan results to PDF.', thTitle: 'สร้างรายงาน', thDesc: 'ส่งออกผลลัพธ์การสแกนเป็นไฟล์ PDF' },
  { name: 'ReportHistory', title: 'Report History', desc: 'Download previously generated reports.', thTitle: 'ประวัติรายงาน', thDesc: 'ดาวน์โหลดรายงานที่เคยสร้างไว้' },
  { name: 'SonarQubeConfig', title: 'SonarQube Config', desc: 'Configure connection settings.', thTitle: 'ตั้งค่า SonarQube', thDesc: 'ตั้งค่าการเชื่อมต่อกับ SonarQube' },
  { name: 'NotificationSettings', title: 'Notification Settings', desc: 'Manage alerts.', thTitle: 'ตั้งค่าการแจ้งเตือน', thDesc: 'จัดการการแจ้งเตือนผ่านช่องทางต่างๆ' },
  { name: 'UserManagement', title: 'User Management', desc: 'Administer system users.', thTitle: 'จัดการผู้ใช้งาน', thDesc: 'จัดการผู้ใช้งานในระบบ' }
];

['en', 'th'].forEach(lang => {
  const p = path.join(process.cwd(), `src/locales/${lang}.json`);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (!data.TOUR) data.TOUR = {};
  
  pages.forEach(page => {
    const key = page.name.toUpperCase();
    if (!data.TOUR[key]) {
      data.TOUR[key] = {
        HEADER_TITLE: lang === 'en' ? page.title : page.thTitle,
        HEADER_DESC: lang === 'en' ? page.desc : page.thDesc
      };
    }
  });

  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
});

console.log('Locales updated successfully.');
