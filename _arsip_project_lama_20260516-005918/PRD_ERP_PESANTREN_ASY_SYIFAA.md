# PRD: ERP PESANTREN TERPADU
## Asy-Syifaa Framework - Product Requirements Document

**Status**: PRD v1.0 - For Review  
**Last Updated**: Mei 2026  
**Document Owner**: Product Team Asy-Syifaa Wal Mahmuudiyyah  
**Stakeholders**: Abuya, Mudir'aam, IT Team, Developers

---

## 🎯 BAGIAN 1: EXECUTIVE SUMMARY

### 1.1 Deskripsi Produk
**ERP Pesantren Terpadu** adalah sistem terintegrasi yang menghubungkan semua aspek operasional Pondok Pesantren Islam Internasional Terpadu Asy-Syifaa Wal Mahmuudiyyah—dari administrasi santri, manajemen keuangan syahriyyah, hingga eksekusi akademik dan kesantrian. 

Sistem ini dirancang dengan pendekatan **enterprise-grade** menggunakan modifikasi dari Frappe Framework (dikenal sebagai **Asy-Syifaa Framework**), yang dioptimalkan untuk:
- Skalabilitas pesantren besar (1000+ santri)
- Integrasi multi-role (Ustadz, Admin, Abuya, Orang Tua)
- Automasi proses bisnis pesantren
- Real-time reporting & analytics
- WhatsApp integration untuk komunikasi instan

### 1.2 Problem Statement
Pesantren Asy-Syifaa saat ini menghadapi tantangan operasional:
- ❌ Data santri tersebar di berbagai sistem (Excel, Whatsapp, catatan manual)
- ❌ Proses keuangan tidak terintegrasi, sering terjadi double-billing atau missed payment
- ❌ Komunikasi dengan orang tua lambat dan tidak terstruktur
- ❌ Dashboard eksekutif tidak ada, sulit monitor KPI pesantren
- ❌ Tidak ada single source of truth untuk data akademik & administrasi
- ❌ Scalability terbatas, sistem existing tidak bisa handle pertumbuhan

### 1.3 Solusi yang Ditawarkan
**Asy-Syifaa Framework** adalah solusi ERP terpadu yang:
✅ Centralisasi semua data dalam satu database SQL yang aman  
✅ Automate proses keuangan (tagihan, cicilan, reminder pembayaran)  
✅ WhatsApp broadcast real-time untuk komunikasi efisien  
✅ Dashboard eksekutif dengan KPI & analytics  
✅ Role-based access control (RBAC) untuk keamanan data  
✅ Mobile-responsive UI untuk akses dari mana saja  
✅ AI Agent asisten untuk support pengguna 24/7  
✅ Terintegrasi dengan website & CMS pesantren  
✅ Scalable architecture untuk pertumbuhan jangka panjang

### 1.4 Expected Outcomes (3-6 Bulan)
- **Efisiensi Operasional**: Pengurangan beban manual kerja admin 70%
- **Akurasi Data**: 99% data consistency across modules
- **User Adoption**: 95% staff terlatih & aktif menggunakan sistem
- **Revenue Impact**: Penurunan outstanding receivable 40%, cicilan tepat waktu naik 60%
- **User Satisfaction**: NPS score minimal 7/10

---

## 📊 BAGIAN 2: VISION, MISSION & GOALS

### 2.1 Vision
*"Menjadi sistem manajemen pesantren terintegrasi yang memberdayakan seluruh stakeholder (santri, ustadz, orang tua, dan manajemen) dengan teknologi yang aman, scalable, dan Islami."*

### 2.2 Mission
Menyediakan platform digital terpadu yang:
1. **Transparan**: Semua data real-time, akurat, dapat diaudit
2. **Efisien**: Automasi proses berulang, reduce manual overhead
3. **User-Centric**: Antarmuka intuitif untuk berbagai skill level
4. **Secure**: Enkripsi end-to-end, compliance dengan regulasi
5. **Scalable**: Infrastructure siap untuk pertumbuhan 5-10 tahun ke depan

### 2.3 Goals (OKR Framework)

#### Q1-Q2 2026: MVP Launch
- **Objective**: Launch MVP dengan 5 core modules
- **Key Results**:
  - Module 0,1,2,3,4 production-ready dengan 99.5% uptime
  - 80% staff trained dan aktif
  - Zero critical bugs dalam 30 hari pertama

#### Q3-Q4 2026: Full Platform
- **Objective**: Semua 21 modul fully operational
- **Key Results**:
  - 21 modules integrated & tested
  - 95% user adoption rate
  - 50% reduction in payment delays
  - AI Agent active 24/7 dengan 90% issue resolution rate

#### 2027 Onwards: Ecosystem Expansion
- **Objective**: Dari internal system menjadi B2B ecosystem
- **Key Results**:
  - Public API untuk partner integrations
  - Mobile app untuk iOS & Android
  - White-label offering untuk pesantren lain
  - Analytics marketplace untuk data monetization

---

## 👥 BAGIAN 3: TARGET USERS & PERSONAS

### 3.1 User Personas

#### Persona A: Ustadz/Ustadzah (Primary User)
- **Profil**: Pengajar usia 25-60 tahun, tech literacy medium
- **Pain Points**: 
  - Sibuk dengan mengajar, tidak punya waktu input data manual
  - Perlu lihat nilai santri & laporan pembelajaran cepat
  - Komunikasi dengan orang tua butuh efisien
- **Needs**:
  - Interface sederhana, 1-click actions
  - Mobile-friendly untuk buka di kelas
  - Auto-sync dengan WhatsApp untuk komunikasi
- **Success Criteria**: Input nilai <2 menit, tidak perlu training panjang

#### Persona B: Mudir'aam (Administrator)
- **Profil**: Admin usia 30-50 tahun, tech literacy high
- **Pain Points**:
  - Mengelola data puluhan staff & ribuan transaksi
  - Report manual setiap bulan, error-prone
  - Koordinasi antar departemen lambat
- **Needs**:
  - Advanced filtering & export options
  - Automated reporting & analytics dashboard
  - Batch operations untuk efisiensi
- **Success Criteria**: Dashboard real-time, 50% reduce admin time

#### Persona C: Abuya (Leadership)
- **Profil**: Kepemimpinan pesantren usia 45-75 tahun, tech literacy low-medium
- **Pain Points**:
  - Ingin tahu status pesantren tapi data tidak tersedia cepat
  - Laporan datang seminggu-sebulan kemudian
  - Sulit ambil keputusan strategic tanpa data real-time
- **Needs**:
  - Executive dashboard dengan key metrics
  - Laporan summary tidak terlalu teknis
  - Mobile-friendly untuk check kapan saja
- **Success Criteria**: Dashboard eksekutif tersedia, decision time reduce 50%

#### Persona D: Orang Tua Murid (External User)
- **Profil**: Usia 35-70 tahun, tech literacy low-medium, diverse background
- **Pain Points**:
  - Tidak tahu nilai anak di sekolah
  - Tidak jelas kapan bayar iuran & berapa jumlah
  - Komunikasi dengan pesantren tidak clear
- **Needs**:
  - Portal sederhana untuk lihat akademik & keuangan anak
  - Reminder otomatis untuk bayar iuran
  - Chat dengan ustadz untuk info anak
- **Success Criteria**: Portal usage >80%, payment on-time >70%

#### Persona E: Santri (Internal User)
- **Profil**: Usia 13-25 tahun, tech literacy high, digital native
- **Pain Points**:
  - Tugas & informasi akademik tidak jelas
  - Sistem perizinan manual, ribet
  - Ingin akses value-added services (marketplace, perpustakaan)
- **Needs**:
  - Dashboard untuk lihat tugas & deadline
  - Mobile app untuk semua fitur
  - Gamification untuk engagement
- **Success Criteria**: App adoption >90%, task completion on-time >75%

### 3.2 User Distribution & Activity Matrix

| Persona | Jumlah | Login Freq | Primary Device | Critical Modules |
|---------|--------|-----------|---------------|--------------------|
| Ustadz/Ustadzah | 50-100 | Daily | Mobile + Desktop | Akademik, Presensi, Komunikasi |
| Mudir'aam | 5-10 | Daily | Desktop | Dashboard, Keuangan, Report |
| Abuya | 2-5 | 2-3x/week | Desktop + Mobile | Dashboard Eksekutif, Analytics |
| Orang Tua | 1000+ | Weekly | Mobile | Portal, Keuangan, Komunikasi |
| Santri | 1000+ | Daily | Mobile | Dashboard, Tugas, Marketplace |

---

## 🏗️ BAGIAN 4: TECHNICAL ARCHITECTURE

### 4.1 Technology Stack

#### Frontend Layer
```
Framework: React.js 18+ dengan Next.js 13+
Styling: Tailwind CSS 3.x dengan custom Asy-Syifaa components
State Management: Redux Toolkit + RTK Query
Package Manager: npm 9+
Build Tool: Webpack via Next.js
Testing: Jest + React Testing Library
```

#### Backend Layer
```
Framework: Express.js 4.18+
Database: PostgreSQL 14+ (primary) + Redis (cache)
ORM: Sequelize / TypeORM
API Architecture: RESTful + GraphQL (optional future)
Authentication: JWT + OAuth 2.0 (untuk integrasi eksternal)
Rate Limiting: Redis-based rate limiter
```

#### Infrastructure Layer
```
Deployment: Docker containers + Kubernetes (optional untuk scale)
Cloud Provider: AWS / Google Cloud / DigitalOcean
CDN: Cloudflare untuk asset delivery
Backup: Daily automated backup (3-month retention)
Monitoring: ELK Stack (Elasticsearch, Logstash, Kibana)
```

#### Modified Frappe Integration
```
Frappe Core: v14+ (modified untuk Asy-Syifaa Framework)
Bench: Frappe Bench untuk local development
Customization: Custom DocTypes & Workflows
Automation: Frappe Workflows untuk approval process
Integration Points: REST API ke Express.js backend
```

### 4.2 Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (React.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Web Portal  │  │  Mobile App  │  │  Admin Panel │           │
│  │  (Tailwind)  │  │  (React Native)  │  (Next.js)   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │ HTTPS (TLS 1.3)  │                 │
┌─────────┼─────────────────┼─────────────────┼──────────────────┐
│         │      API GATEWAY LAYER (Express.js)                  │
│  ┌──────▼─────────────────▼──────────────┐  │                 │
│  │   Express.js Backend + Router         │  │                 │
│  │   - Auth & Authorization (JWT)        │  │                 │
│  │   - API Rate Limiting                 │  │                 │
│  │   - Request Validation                │  │                 │
│  │   - Error Handling & Logging          │  │                 │
│  └──────┬──────────────────────────────┬─┘  │                 │
│         │                              │    │                 │
│  ┌──────▼────────────┐  ┌─────────────▼──┐ │                 │
│  │  Business Logic   │  │  Frappe Bridge │ │                 │
│  │  Services         │  │  (REST API)    │ │                 │
│  └──────┬────────────┘  └─────────────┬──┘ │                 │
│         │                             │    │                 │
└─────────┼─────────────────────────────┼────┴──────────────────┘
          │                             │
┌─────────▼─────────────────────────────▼───────────────────────┐
│              DATABASE & CACHE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ PostgreSQL   │  │   Redis      │  │  File Storage│        │
│  │ (Primary DB) │  │   (Cache)    │  │   (S3/Blob)  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────────────────────────────────────────────────┘

          ┌─────────────────────────────┐
          │   EXTERNAL INTEGRATIONS     │
          ├─────────────────────────────┤
          │ WhatsApp Business API       │
          │ Email Service (SendGrid)    │
          │ Payment Gateway (Doku/iP)  │
          │ CMS Integration (WordPress) │
          │ Analytics (Google Analytics)│
          └─────────────────────────────┘
```

### 4.3 Database Schema (High Level)

**Core Entities**:
- `users` - All system users (admin, staff, orang tua)
- `santri` - Master data santri
- `staff` - Master data staff (ustadz, mudir, dll)
- `classes` - Kelas & organisasi santri
- `transactions` - Semua transaksi keuangan
- `academic_records` - Nilai & rapor
- `attendance` - Presensi santri
- `announcements` - Pengumuman sistem
- `documents` - Dokumen cetak (struk, surat keterangan)
- `events` - Event pesantren
- `marketplace_items` - Produk marketplace
- `consultations` - Konseling records

### 4.4 API Specifications

**Base URL**: `https://api.asyifa.id/v1`

**Authentication**: JWT Token (Bearer)

**Rate Limiting**: 
- Free tier: 100 req/min
- Premium tier: 1000 req/min

**Response Format**: JSON

**Error Handling**: Standard HTTP status codes + custom error codes

**Versioning**: V1 (backward compatible untuk future releases)

---

## 🎨 BAGIAN 5: DESIGN SYSTEM

### 5.1 Brand Colors

#### Light Mode Color Palette
```
Primary Green:     #075e54 (Deep forest green - trust, stability)
Secondary Green:   #128c7e (WhatsApp-inspired teal)
Success Green:     #25d366 (WhatsApp success color)
Light Background:  #dcf8c6 (Very light green for messages/highlights)
Primary Blue:      #34b7f1 (Information, secondary action)
Neutral Light:     #ece5dd (Light background, very subtle)
```

#### Dark Mode Color Palette
```
Background Black:  #000000 (True black for dark mode)
Foreground White:  #ffffff (Pure white for contrast)
Accent Pink:       #FE2C55 (TikTok-inspired, bold accent for dark mode)
Accent Cyan:       #25F4EE (Splash of color, futuristic feel)
                   #397684 
```

#### Extended Palette
```
Gray Neutrals (Light):    #f0f0f0, #e0e0e0, #d0d0d0, #b0b0b0
Gray Neutrals (Dark):     #333333, #1a1a1a
Semantic Colors:
  - Success:   #25d366 (light), #25d366 (dark)
  - Warning:   #ff9800
  - Danger:    #ff5252
  - Info:      #34b7f1
```

### 5.2 Typography System

#### Font Stack
```css
/* Display & Headlines */
font-family: "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Body & UI */
font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Monospace (code) */
font-family: "Roboto Mono", "Menlo", "Monaco", monospace;
```

#### Font Scale

| Type | Size | Weight | Line Height | Usage |
|------|------|--------|------------|-------|
| H1 (Page Title) | 32px | 700 (Bold) | 1.4 | Main page heading |
| H2 (Section) | 24px | 700 (Bold) | 1.4 | Section title |
| H3 (Subsection) | 20px | 600 (Semibold) | 1.5 | Subsection title |
| H4 (Small Heading) | 18px | 600 (Semibold) | 1.5 | Card title |
| Body Large | 16px | 400 (Regular) | 1.6 | Main body text |
| Body Regular | 14px | 400 (Regular) | 1.6 | Standard text |
| Body Small | 12px | 400 (Regular) | 1.5 | Secondary text, caption |
| Button | 14px | 600 (Semibold) | 1.4 | Button labels |
| Code | 13px | 400 (Regular) | 1.4 | Code blocks |

### 5.3 Component Design Guidelines

#### Buttons
- **Primary Button**: `#075e54` background, white text, 8px border-radius
- **Secondary Button**: `#128c7e` background, white text
- **Success Button**: `#25d366` background, white text
- **Danger Button**: `#ff5252` background, white text
- **Disabled**: `#b0b0b0` background, `#e0e0e0` text
- **Hover Effect**: Darken by 10%, add subtle shadow
- **Padding**: 10px 16px (vertical/horizontal)

#### Cards
- **Background**: White (light) / `#1a1a1a` (dark)
- **Border**: 1px solid `#e0e0e0` (light) / `#333333` (dark)
- **Border Radius**: 12px
- **Shadow**: `0 2px 8px rgba(0,0,0,0.1)` (light)
- **Padding**: 16px

#### Input Fields
- **Border**: 1px solid `#d0d0d0` (light) / `#333333` (dark)
- **Border Radius**: 8px
- **Focus State**: 2px solid `#075e54` border, no outline
- **Padding**: 10px 12px
- **Font Size**: 14px

#### Navigation & Sidebar
- **Background**: White (light) / Black (dark)
- **Active Item**: `#075e54` background + white text
- **Hover**: `#ece5dd` background (light) / `#333333` (dark)
- **Icon Size**: 24px

### 5.4 Dark/Light Mode Implementation

**CSS Variables Approach**:
```css
/* Light Mode (default) */
:root {
  --color-primary: #075e54;
  --color-secondary: #128c7e;
  --color-success: #25d366;
  --color-info: #34b7f1;
  --color-danger: #ff5252;
  --bg-primary: #ffffff;
  --bg-secondary: #f0f0f0;
  --text-primary: #000000;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
}

/* Dark Mode */
[data-theme="dark"] {
  --color-primary: #25d366;
  --color-secondary: #34b7f1;
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #333333;
}
```

**User Preference**: Detect system preference via `prefers-color-scheme`, allow manual override in settings

### 5.5 Accessibility Guidelines
- **WCAG 2.1 AA** compliance sebagai minimum
- **Color Contrast**: Minimal 4.5:1 untuk text
- **Focus States**: Visible focus indicator untuk keyboard navigation
- **Icons**: Selalu pair dengan text labels
- **Form Labels**: `<label>` tag connected to input via `for` attribute
- **Alt Text**: Semua image punya meaningful alt text
- **ARIA**: Semantic HTML first, ARIA hanya jika necessary

---

## 📋 BAGIAN 6: FUNCTIONAL REQUIREMENTS - 21 MODULES

### MODULE 0: Landing Page - Menu All Apps
**Purpose**: Entry point sistem, navigasi ke semua modul  
**Users**: Semua user types  
**Key Features**:
- App grid/menu menampilkan 21 modul dengan icon & deskripsi singkat
- Search bar untuk quick access modul
- Recent apps shortcut
- User profile menu (change password, settings, logout)
- System status indicator (up/down)
- Help & documentation links

**UI Elements**:
- Hero section dengan brand messaging
- 21 app icons (6x3 atau 5x4 grid, responsive)
- Quick links sidebar
- Mobile: Hamburger menu + app drawer

**Data Requirements**: User session, app manifest, access permissions

**API Endpoints**:
- `GET /apps/list` - List semua apps dengan user permissions
- `GET /apps/{id}` - Detail app & configuration
- `POST /user/recent-apps` - Update recent apps history

---

### MODULE 1: Dashboard Eksekutif
**Purpose**: Real-time KPI & analytics untuk leadership  
**Users**: Abuya, Mudir'aam  
**Key Features**:
- **KPI Cards**: 
  - Total Santri (active + inactive)
  - Total Revenue (bulan ini vs tahun lalu)
  - Outstanding Receivable
  - Pembayaran On-Time Rate
  - Absensi Rate
  - Academic Performance (avg nilai)
  
- **Charts & Graphs**:
  - Revenue trend (6 bulan terakhir)
  - Cash flow projection
  - Santri demographics (pie chart)
  - Pembayaran status (bar chart)
  
- **Alerts & Notifications**:
  - Overdue payments alert
  - High absensi flags
  - System health alerts
  
- **Period Selector**: Monthly, Quarterly, Yearly views

**Data Requirements**: Aggregated data dari semua modules

**API Endpoints**:
- `GET /dashboard/kpi` - Fetch KPI data
- `GET /dashboard/charts/{period}` - Fetch chart data
- `GET /dashboard/alerts` - Fetch active alerts

---

### MODULE 2: Master Data Santri
**Purpose**: Centralized santri information database  
**Users**: Mudir'aam, Ustadz (view), Orang Tua (limited)  
**Key Features**:
- **Biodata Santri**:
  - Personal info (nama, DOB, NISN, tempat lahir)
  - Photo & identification
  - Contact info
  
- **Family Info**:
  - Ayah/Ibu (nama, pekerjaan, kontak)
  - Emergency contact
  - Alamat
  
- **Academic Info**:
  - Kelas/tingkat
  - Prestasi
  - Special needs
  
- **Financial Info**:
  - Payment status
  - Outstanding balance
  - Payment history
  
- **Admin Functions**:
  - Add/edit santri
  - Bulk import (Excel)
  - Export data
  - Archive santri (saat lulus/mutasi)

**Data Validations**:
- NISN format validation
- Email & phone format
- Unique constraint pada NISN, NIK
- Required fields validation

**API Endpoints**:
- `GET /santri` - List dengan pagination & filtering
- `GET /santri/{id}` - Detail santri
- `POST /santri` - Create santri
- `PUT /santri/{id}` - Update santri
- `DELETE /santri/{id}` - Archive santri
- `POST /santri/bulk-import` - Bulk import from Excel

---

### MODULE 3: PPDB (Penerimaan Pendaftar Baru)
**Purpose**: Manage calon santri & enrollment process  
**Users**: PPDB Staff, Abuya (approval)  
**Key Features**:
- **Pendaftar Management**:
  - Form input calon santri
  - Document upload (foto, ijazah, dokumen lainnya)
  - Status tracking (submitted, reviewed, accepted, rejected)
  
- **Workflow**:
  - Pendaftaran → Admin Review → Wawancara → Final Approval
  - Email/SMS notifications di setiap stage
  
- **Acceptance Management**:
  - Bukti pembayaran pendaftaran
  - Acceptance letter generation
  - Move to Santri Master Data setelah acceptance
  
- **Reporting**:
  - Pendaftar summary
  - Acceptance rate
  - Kota asal santri

**Data Requirements**: Pendaftar form data, documents, status history

**API Endpoints**:
- `GET /ppdb/pendaftar` - List pendaftar dengan filter status
- `POST /ppdb/pendaftar` - Submit pendaftaran baru
- `PUT /ppdb/pendaftar/{id}/status` - Update status pendaftaran
- `POST /ppdb/pendaftar/{id}/accept` - Accept pendaftar
- `POST /ppdb/pendaftar/{id}/reject` - Reject pendaftar
- `GET /ppdb/reports` - PPDB summary reports

---

### MODULE 4: Keuangan Syahriyyah (Tagihan, Pembayaran, Rekap)
**Purpose**: Monthly tuition management, billing & payment tracking  
**Users**: Mudir'aam, Orang Tua, Accounting Staff  
**Key Features**:
- **Tagihan (Billing)**:
  - Auto-generate tagihan setiap bulan
  - SPP amount per class/santri
  - Discount/adjustment manual
  - Due date configuration
  - Email/WhatsApp reminder sebelum due date
  
- **Pembayaran (Payment)**:
  - Multiple payment methods (transfer bank, e-wallet, cash)
  - Payment gateway integration (Doku, iP)
  - Partial payment support
  - Payment receipt generation
  - Reconciliation dengan bank statement
  
- **Rekap (Reporting)**:
  - Outstanding receivable list
  - Payment history per santri
  - Monthly revenue report
  - Collection rate analysis
  - Aged receivable report (0-30, 31-60, 60+ hari)

**Data Requirements**: Santri master, SPP rates, payment transactions, bank accounts

**API Endpoints**:
- `POST /keuangan/generate-tagihan` - Generate monthly bills
- `GET /keuangan/tagihan` - List tagihan dengan filter
- `POST /keuangan/pembayaran` - Record payment
- `GET /keuangan/pembayaran/{id}` - Payment details
- `GET /keuangan/rekap` - Generate report
- `POST /keuangan/reminder` - Send payment reminders

---

### MODULE 5: Tabungan Santri
**Purpose**: Santri savings account management  
**Users**: Mudir'aam, Orang Tua, Santri  
**Key Features**:
- **Account Management**:
  - Automated account creation untuk setiap santri
  - Account balance tracking
  - Transaction history (debit/credit)
  
- **Transactions**:
  - Monthly auto-debit (savings requirement)
  - Manual deposit/withdrawal (via parent request)
  - Interest calculation (jika ada)
  
- **Features**:
  - Balance inquiry (portal & mobile)
  - Withdrawal request workflow
  - Statement generation
  - Final disbursement upon graduation

**Data Requirements**: Santri master, transaction ledger, interest rules

**API Endpoints**:
- `GET /tabungan/{santri-id}/balance` - Current balance
- `GET /tabungan/{santri-id}/transactions` - Transaction history
- `POST /tabungan/{santri-id}/withdrawal-request` - Request withdrawal
- `POST /tabungan/auto-debit` - Execute monthly auto-debit
- `GET /tabungan/reports` - Savings summary reports

---

### MODULE 6: WhatsApp Broadcast & Notifikasi
**Purpose**: Multi-channel communication dengan orang tua & santri  
**Users**: Mudir'aam, Ustadz, Admin  
**Key Features**:
- **Broadcast Management**:
  - Compose message (text + media)
  - Target audience selection (class, group, individual)
  - Scheduling (immediate or scheduled)
  - Template library untuk message predefined
  
- **Notification Types**:
  - Payment reminders (terintegrasi Module 4)
  - Academic alerts (nilai rendah, absensi tinggi)
  - Event announcements
  - Emergency alerts
  - Attendance confirmation
  
- **Message Templates**:
  - Pembayaran pengumuman
  - Akademik report
  - Event invitation
  - Emergency notification
  
- **Analytics**:
  - Delivery status (sent, delivered, read)
  - Open rate tracking
  - Response tracking
  - Cost monitoring

**Data Requirements**: Contact database, message queue, WhatsApp Business API integration

**API Endpoints**:
- `POST /whatsapp/broadcast` - Send broadcast message
- `POST /whatsapp/template/send` - Send from template
- `GET /whatsapp/delivery-status` - Check delivery status
- `GET /whatsapp/analytics` - Message analytics

---

### MODULE 7: AI Agent Asisten ERP
**Purpose**: 24/7 chatbot support untuk pengguna sistem  
**Users**: Semua pengguna  
**Key Features**:
- **Capabilities**:
  - FAQ answering (knowledge base)
  - Troubleshooting guide
  - Password reset assistance
  - Report generation requests
  - Data lookup (santri, payment history)
  - Guided workflows (input nilai, bayar iuran)
  
- **Channels**:
  - In-app chat widget
  - WhatsApp bot
  - Telegram bot (optional)
  
- **Learning**:
  - Context-aware responses (based on user role & history)
  - Escalate ke human support jika diperlukan
  - Feedback loop untuk improvement
  
- **Knowledge Base**:
  - System documentation
  - FAQ per modul
  - Video tutorials
  - Troubleshooting guides

**Data Requirements**: User profile, conversation history, knowledge base, system logs

**API Endpoints**:
- `POST /ai-agent/chat` - Send message & get response
- `GET /ai-agent/faq` - Fetch FAQ & knowledge base
- `POST /ai-agent/escalate` - Escalate ke human support

---

### MODULE 8: Dokumen Cetak (Struk, Keterangan Lunas, Riwayat)
**Purpose**: Generate & manage printed documents  
**Users**: Mudir'aam, Orang Tua  
**Key Features**:
- **Document Types**:
  - Struk Pembayaran (payment receipt)
  - Keterangan Lunas (proof of payment)
  - Surat Keterangan Siswa
  - Laporan Nilai
  - Sertifikat Selesai Tahfidz
  - Riwayat Akademik
  - Riwayat Keuangan
  
- **Generation**:
  - On-demand generation
  - Batch generation (multiple documents)
  - Digital & printable formats (PDF, hardcopy)
  - QR code untuk verification
  
- **Branding**:
  - Official header dengan logo pesantren
  - Signature (digital/scanned)
  - Stamp/watermark
  
- **Storage & Retrieval**:
  - Document archive
  - Search & filter
  - Download history
  - Print tracking

**Data Requirements**: Santri data, transaction data, academic records, document templates

**API Endpoints**:
- `POST /dokumen/generate/{type}` - Generate document
- `GET /dokumen/list` - List generated documents
- `GET /dokumen/{id}/download` - Download document
- `POST /dokumen/batch-generate` - Batch generate

---

### MODULE 9: Pengaturan Sistem (Base Info, Periode, Role, Media/Logo)
**Purpose**: System configuration & administration  
**Users**: Mudir'aam, IT Admin (Abuya approval)  
**Key Features**:
- **Base Information**:
  - Pesantren name, address, contact
  - Principal info
  - Kurikulum type
  - Operational hours
  
- **Periode Akademik**:
  - School year configuration
  - Semester dates
  - Holiday calendar
  - Grade promotion rules
  
- **Role & Permission Management**:
  - Create/edit roles (Ustadz, Admin, Mudir, Abuya, dll)
  - Permission matrix per role
  - Module access control
  - Function-level permissions (view, create, edit, delete)
  
- **Media & Branding**:
  - Logo upload
  - Background images
  - Theme color customization
  - Email signature
  - Document header/footer templates
  
- **System Configuration**:
  - SPP amount per class
  - Late fee rules
  - Grace period
  - Attendance threshold
  - Backup schedule
  - Log retention

**Data Requirements**: Configuration database, file storage

**API Endpoints**:
- `GET /settings/base-info` - Fetch base info
- `PUT /settings/base-info` - Update base info
- `GET /settings/roles` - List all roles
- `POST /settings/roles` - Create role
- `PUT /settings/roles/{id}` - Edit role
- `DELETE /settings/roles/{id}` - Delete role
- `POST /settings/media/upload` - Upload media

---

### MODULE 10: Website & CMS Integrasi
**Purpose**: Integration dengan website pesantren & content management  
**Users**: Marketing/Content Admin  
**Key Features**:
- **Website Integration**:
  - PPDB form embedding
  - Payment gateway embedding
  - Real-time santri count display
  - Event calendar widget
  - News/blog from CMS
  
- **Content Management**:
  - News/blog posts
  - Event management
  - Gallery/photo management
  - Team profiles (ustadz/staff)
  - Testimonials
  
- **SEO & Analytics**:
  - Sitemap generation
  - Meta tag management
  - Google Analytics integration
  - Traffic reporting
  
- **Synchronization**:
  - Auto-sync events dari ERP
  - Auto-sync santri data (limited public info)
  - Push notifications dari website

**Data Requirements**: CMS database, website traffic logs

**API Endpoints**:
- `GET /website/events` - Fetch events for display
- `POST /website/contact-form` - Handle contact form submission
- `GET /website/gallery` - Fetch photo gallery
- `GET /website/team` - Fetch team profiles

---

### MODULE 11: Kesantrian (Asrama, Pelanggaran, Perizinan, Absensi)
**Purpose**: Dormitory & discipline management  
**Users**: Mudir'aam, Asrama Custodian, Ustadz  
**Key Features**:
- **Asrama (Dormitory)**:
  - Room allocation (santri per ruangan)
  - Room inventory tracking
  - Maintenance request system
  - Cleaning schedule
  - Occupancy reporting
  
- **Pelanggaran (Discipline)**:
  - Violation type master (terlambat, bolos, dll)
  - Incident recording
  - Point system (accumulate points untuk punishment)
  - Punishment type (nasehat, denda, hukuman, dll)
  - Progressive discipline workflow
  - Appeal process
  
- **Perizinan (Permission)**:
  - Leave request form
  - Approval workflow (Asrama custodian → Mudir'aam)
  - Leave type (sakit, izin keluarga, izin khusus)
  - Auto-mark absensi as "izin"
  - Parent notification
  
- **Absensi (Attendance)**:
  - Daily roll call (morning, prayer, class)
  - Mark present/absent/izin
  - Auto-calculate absensi rate
  - Alert jika melebihi threshold
  - Monthly attendance report

**Data Requirements**: Santri master, asrama info, violation rules, attendance records

**API Endpoints**:
- `POST /kesantrian/pelanggaran` - Record violation
- `GET /kesantrian/pelanggaran/{santri-id}` - Santri violation history
- `POST /kesantrian/perizinan` - Submit leave request
- `GET /kesantrian/perizinan/pending` - Pending approvals
- `PUT /kesantrian/perizinan/{id}/approve` - Approve leave
- `POST /kesantrian/absensi` - Record attendance
- `GET /kesantrian/absensi/report` - Attendance report

---

### MODULE 12: Akademik (Kurikulum, Mapel, Nilai, Wali Kelas)
**Purpose**: Academic management & grading  
**Users**: Ustadz, Guru Wali, Mudir'aam, Abuya  
**Key Features**:
- **Kurikulum Management**:
  - Define kurikulum (Nasional, Islamic, Hybrid)
  - Competency standards
  - Learning objectives
  - Assessment criteria
  
- **Mapel (Subjects)**:
  - Subject master data
  - Subject code & description
  - Credit hours
  - Semester assignment
  - Teacher assignment
  
- **Nilai (Grading)**:
  - Multiple assessment types (quiz, mid-term, final, project, attendance)
  - Weighting configuration
  - Automatic GPA calculation
  - Grade conversion (A-F, 1-4 scale)
  - Curve grading (bell curve) option
  
- **Wali Kelas (Homeroom Teacher)**:
  - Class assignment
  - Responsibilities tracking
  - Student roster management
  - Class performance analytics
  
- **Rapor (Report Card)**:
  - Auto-generation berdasarkan nilai
  - Parent-visible summary
  - Full detail untuk staff
  - Comments field untuk wali kelas
  - Finalization workflow

**Data Requirements**: Subject master, class structure, grade configuration, assessment records

**API Endpoints**:
- `GET /akademik/subjects` - List subjects
- `POST /akademik/nilai` - Record grade
- `GET /akademik/nilai/{santri-id}` - Santri grades
- `GET /akademik/rapor/{santri-id}` - Generate report card
- `PUT /akademik/rapor/{id}/finalize` - Finalize rapor
- `GET /akademik/analytics` - Class performance analytics

---

### MODULE 13: Tahfidz & Halaqah
**Purpose**: Quran memorization & learning circles management  
**Users**: Tahfidz Teachers, Santri, Mudir'aam  
**Key Features**:
- **Tahfidz Tracking**:
  - Santri tahfidz target (juz/surah)
  - Progress tracking (halaman/ayat)
  - Monthly target monitoring
  - Achievement milestones
  
- **Halaqah (Learning Circles)**:
  - Halaqah schedule & location
  - Teacher assignment
  - Santri grouping
  - Attendance tracking
  - Weekly hafalan testing
  
- **Testing & Evaluation**:
  - Sempro (semi-final recitation)
  - Final tilawah (recitation)
  - Scoring rubric (makhraj, tajweed, fluency)
  - Certification generation
  
- **Reporting**:
  - Individual tahfidz progress
  - Class halaqah analytics
  - Monthly achievement report
  - Graduation certification

**Data Requirements**: Santri master, quran metadata (juz/surah), tahfidz progress records

**API Endpoints**:
- `POST /tahfidz/progress` - Record hafalan progress
- `GET /tahfidz/progress/{santri-id}` - Individual progress
- `POST /tahfidz/test` - Record test result
- `GET /tahfidz/report` - Monthly report
- `POST /tahfidz/certificate/generate` - Generate completion certificate

---

### MODULE 14: LMS (Pesantren Online)
**Purpose**: Online learning platform untuk kelas online & self-study  
**Users**: Ustadz, Santri, Orang Tua (monitoring)  
**Key Features**:
- **Course Management**:
  - Create/edit courses
  - Course schedule
  - Learning materials (video, PDF, doc)
  - Module/lesson structure
  - Assignments & quizzes
  
- **Learning Activities**:
  - Video streaming (with subtitles)
  - Document viewer (PDF reader)
  - Discussion forum
  - Live chat during class
  - Recording & playback
  
- **Assessment**:
  - Quiz/test creation
  - Automated scoring
  - Assignment submission & grading
  - Progress tracking
  - Certification upon completion
  
- **Communication**:
  - Announcement posting
  - Messaging (student-teacher)
  - Bulk communication
  - Notification system

**Data Requirements**: Course content, student enrollment, assessment data, learning records

**API Endpoints**:
- `GET /lms/courses` - List courses
- `POST /lms/courses` - Create course
- `POST /lms/courses/{id}/enroll` - Enroll student
- `GET /lms/courses/{id}/materials` - Course materials
- `POST /lms/assignments/submit` - Submit assignment
- `POST /lms/quiz/submit` - Submit quiz
- `GET /lms/progress/{student-id}` - Learning progress

---

### MODULE 15: Perpustakaan Digital (PDF Reader)
**Purpose**: Digital library with searchable content  
**Users**: Santri, Ustadz, Orang Tua (some content)  
**Key Features**:
- **Content Management**:
  - Upload books (PDF, ePub, MOBI)
  - Metadata (title, author, category, language)
  - Tagging & classification
  - Search indexing
  - Duplicate detection
  
- **Reader Interface**:
  - PDF viewer dengan annotation tools
  - Bookmarks & highlights
  - Notes & personal library
  - Search within document
  - Text size & theme customization
  - Page numbers & references
  
- **Collections**:
  - Curated reading lists
  - Subject-based collections
  - Recommended readings per class/level
  - Islamic literature collection
  - Reference materials
  
- **Usage Analytics**:
  - Popular books tracking
  - Reading time statistics
  - Usage per student/class
  - Collection effectiveness

**Data Requirements**: Book catalog, reading records, annotations, search index

**API Endpoints**:
- `GET /perpustakaan/books` - List books dengan filter
- `GET /perpustakaan/books/{id}/content` - Fetch book PDF
- `POST /perpustakaan/bookmarks` - Save bookmark
- `POST /perpustakaan/highlights` - Save highlight & notes
- `GET /perpustakaan/search` - Search across documents

---

### MODULE 16: Marketplace Pesantren
**Purpose**: Internal marketplace untuk jual-beli produk pesantren  
**Users**: Santri, Staff, Orang Tua (visitors)  
**Key Features**:
- **Product Catalog**:
  - Product listing (uniform, books, snacks, dll)
  - Categories & subcategories
  - Product photos & description
  - Price & availability
  - Stock management
  - Supplier tracking
  
- **Shopping**:
  - Add to cart
  - Order placement
  - Payment options (bank transfer, e-wallet, cash on delivery)
  - Order tracking
  - Delivery management
  
- **Seller Management** (Staff as seller):
  - Seller profile & ratings
  - Product listing management
  - Order fulfillment
  - Customer reviews & ratings
  
- **Reporting**:
  - Sales analytics
  - Inventory reporting
  - Seller performance
  - Revenue tracking

**Data Requirements**: Product catalog, order records, inventory, seller info, payment records

**API Endpoints**:
- `GET /marketplace/products` - List products
- `GET /marketplace/products/{id}` - Product details
- `POST /marketplace/cart/add` - Add to cart
- `POST /marketplace/orders` - Place order
- `GET /marketplace/orders/{id}` - Order details
- `PUT /marketplace/orders/{id}/status` - Update order status

---

### MODULE 17: Tugas/Todolist Santri Pengabdian
**Purpose**: Task assignment & management untuk santri duties  
**Users**: Ustadz, Santri  
**Key Features**:
- **Task Management**:
  - Create task/assignment
  - Assign to santri/group
  - Due date setting
  - Priority level (low, medium, high)
  - Task description & attachment
  
- **Santri View**:
  - Personal todolist
  - Task status tracking (pending, in-progress, completed)
  - Due date reminder
  - Submit task completion
  - Mark as done
  
- **Ustadz View**:
  - Mass task assignment
  - Task status monitoring
  - Incomplete task alerts
  - Late submission tracking
  - Feedback on submissions
  
- **Gamification** (Optional):
  - Point system untuk task completion
  - Leaderboard
  - Achievement badges
  - Level/rank progression

**Data Requirements**: Task records, santri assignments, submission tracking

**API Endpoints**:
- `POST /tugas/create` - Create task
- `POST /tugas/assign` - Assign task to santri
- `GET /tugas/my-tasks` - Santri personal tasks
- `GET /tugas/assigned` - All assigned tasks (admin view)
- `POST /tugas/{id}/submit` - Submit task completion
- `PUT /tugas/{id}/status` - Update task status

---

### MODULE 18: Konseling (Santri/Orangtua/Staff)
**Purpose**: Counseling & consultation management  
**Users**: Counselor, Santri, Orang Tua, Staff  
**Key Features**:
- **Consultation Booking**:
  - Availability calendar
  - Book consultation slot
  - Type of consultation (academic, personal, family, behavioral)
  - Confidentiality settings
  
- **Session Recording**:
  - Session notes
  - Concerns & issues
  - Action items & follow-up
  - Confidential records
  
- **Reporting**:
  - Individual progress notes
  - Trend analysis (multiple sessions)
  - Referral to external specialists jika perlu
  - Parent notification (with consent)
  
- **Resource Library**:
  - Self-help materials
  - Mental health resources
  - Contact untuk emergency helplines

**Data Requirements**: Consultation schedule, session notes, counselor profiles, consultation types

**API Endpoints**:
- `GET /konseling/availability` - Available slots
- `POST /konseling/book` - Book consultation
- `GET /konseling/sessions/{santri-id}` - Consultation history
- `POST /konseling/notes` - Record session notes
- `GET /konseling/resources` - Resource library

---

### MODULE 19: CS & Informasi Umum Pesantren
**Purpose**: Customer service & general information hub  
**Users**: Orang Tua, Santri, Visitors  
**Key Features**:
- **General Information**:
  - About pesantren
  - Vision & mission
  - Contact information
  - Location & map
  - History & achievements
  
- **FAQ Section**:
  - Frequently asked questions
  - Searchable
  - Categories (keuangan, akademik, kesantrian)
  
- **Contact & Support**:
  - Contact form submission
  - Live chat (office hours)
  - Email support
  - Phone support queue
  - Ticketing system untuk tracking
  
- **Announcements & Updates**:
  - Important announcements
  - Event calendar
  - Holiday schedule
  - Maintenance notifications
  
- **Feedback & Surveys**:
  - Satisfaction survey
  - Suggestion box
  - Complaint tracking
  - Response tracking

**Data Requirements**: FAQ database, contact records, announcement list, feedback records

**API Endpoints**:
- `GET /cs/faq` - Fetch FAQ
- `POST /cs/contact-form` - Submit contact form
- `GET /cs/announcements` - Fetch announcements
- `POST /cs/feedback` - Submit feedback
- `POST /cs/tickets` - Create support ticket

---

### MODULE 20: Event Plan, Eksekusi, dan Laporan Iuran
**Purpose**: Event management & associated fundraising  
**Users**: Event Organizer, Mudir'aam, Orang Tua  
**Key Features**:
- **Event Planning**:
  - Event name, date, location
  - Event type (academic, religious, social, fundraising)
  - Participant list
  - Budget planning
  - Task assignment & timeline
  - Checklist management
  
- **Event Execution**:
  - Real-time status tracking
  - Attendance recording
  - Photo/documentation capture
  - Expense tracking
  - Participant feedback
  
- **Fundraising / Iuran Khusus** (if applicable):
  - Event-specific billing
  - Contribution tracking
  - Sponsor/donor management
  - Thank you communication
  
- **Post-Event Reporting**:
  - Event summary report
  - Financial report (income vs expense)
  - Attendance report
  - Photo gallery
  - Feedback analysis
  - Lessons learned documentation

**Data Requirements**: Event details, participant list, expense records, contribution records

**API Endpoints**:
- `POST /events/create` - Create event
- `GET /events` - List events
- `POST /events/{id}/attendance` - Record attendance
- `POST /events/{id}/expenses` - Record expense
- `POST /events/{id}/billing` - Create event-specific billing
- `GET /events/{id}/report` - Generate event report

---

## 🗓️ BAGIAN 7: PROJECT TIMELINE & ROADMAP

### 7.1 Development Phases

#### Phase 1: Foundation (Month 1-2)
**Focus**: Core infrastructure & Module 0-2
```
Week 1-2:
  - Infrastructure setup (AWS, CI/CD, Git)
  - Database design & schema creation
  - API architecture setup
  - Frontend boilerplate (Next.js + Tailwind)
  
Week 3-4:
  - Module 0 (Landing Page): Complete
  - Module 1 (Dashboard): Basic layout
  - Module 2 (Master Data Santri): Core CRUD
  
Week 5-8:
  - Module 3 (PPDB): Full implementation
  - Module 4 (Keuangan): Basic implementation
  - Testing & bug fixes
  - Documentation
```

#### Phase 2: Core Operations (Month 3-4)
**Focus**: Modules 5-9 (Financial, Settings, Notifications)
```
Week 9-12:
  - Module 5 (Tabungan): Complete
  - Module 6 (WhatsApp): Integration & testing
  - Module 7 (AI Agent): MVP (FAQ + basic troubleshooting)
  - Module 8 (Dokumen Cetak): PDF generation
  - Module 9 (Pengaturan): Complete
```

#### Phase 3: Operational Features (Month 5-6)
**Focus**: Modules 10-14 (Web, Kesantrian, Akademik, Tahfidz, LMS)
```
Week 13-18:
  - Module 10 (Website Integration): Complete
  - Module 11 (Kesantrian): Full implementation
  - Module 12 (Akademik): Core features
  - Module 13 (Tahfidz): Complete
  - Module 14 (LMS): MVP
```

#### Phase 4: Enhancement & Polish (Month 7-9)
**Focus**: Modules 15-20 (Library, Marketplace, Tasks, Counseling, CS, Events)
```
Week 19-28:
  - Module 15 (Perpustakaan Digital): Complete
  - Module 16 (Marketplace): MVP
  - Module 17 (Tugas): Complete
  - Module 18 (Konseling): Complete
  - Module 19 (CS): Complete
  - Module 20 (Events): Complete
  - Integration testing
  - Performance optimization
```

#### Phase 5: Training & Launch (Month 10)
**Focus**: UAT, Training, Go-live
```
Week 29-32:
  - User Acceptance Testing (UAT)
  - Staff training (video + workshop)
  - Production deployment
  - Post-launch support
  - Performance monitoring
```

### 7.2 Milestone Timeline

| Milestone | Target Date | Status |
|-----------|------------|--------|
| Phase 1 Complete (MVP: 3 modul) | Bulan 2 | TBD |
| Phase 2 Complete (Financial core) | Bulan 4 | TBD |
| Phase 3 Complete (Operations) | Bulan 6 | TBD |
| Phase 4 Complete (All 21 modul) | Bulan 9 | TBD |
| UAT & Training | Bulan 9-10 | TBD |
| **Go-Live (Production)** | **Bulan 10** | **TBD** |
| Performance & Stability (3 bulan) | Bulan 13 | TBD |

### 7.3 Release Roadmap

**v1.0 (Go-Live)**: All 21 modules functional
**v1.1 (Month 11-12)**: Bug fixes, performance optimization, minor features
**v1.2 (Month 13-14)**: Advanced reporting, analytics enhancements
**v2.0 (6-9 bulan kemudian)**: 
  - Mobile app (iOS + Android)
  - Public API for third-party integration
  - Advanced AI (predictive analytics)
  - White-label offering

---

## 📊 BAGIAN 8: SUCCESS METRICS & KPIs

### 8.1 Business Metrics
| Metric | Target | Baseline | Timeline |
|--------|--------|----------|----------|
| **Payment On-Time Rate** | 70% | 45% | 3 months |
| **Outstanding Receivable** | -40% reduction | TBD | 6 months |
| **Administrative Overhead** | -70% | 100% | 3 months |
| **Data Accuracy** | 99% | ~80% | Immediate |
| **User Adoption** | 95% | 0% | 3 months |
| **System Uptime** | 99.5% | N/A | Ongoing |

### 8.2 User Experience Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **User Satisfaction** | NPS 7/10 | Post-launch survey |
| **Task Completion Time** | <2 min per task | UX testing |
| **System Learning Curve** | <1 hour training | Staff feedback |
| **Feature Discovery** | >80% know features | Usage analytics |
| **Mobile Usability** | 4.5/5 rating | App store reviews |

### 8.3 Technical Metrics
| Metric | Target | Tool |
|--------|--------|------|
| **API Response Time** | <200ms (p95) | Application insights |
| **Database Query Time** | <100ms (p95) | Performance monitoring |
| **Page Load Time** | <2s (mobile) | Lighthouse |
| **Error Rate** | <0.1% | Error tracking (Sentry) |
| **CPU Usage** | <60% peak | Infrastructure monitoring |
| **Memory Usage** | <80% peak | Kubernetes monitoring |

---

## 💰 BAGIAN 9: BUDGET & RESOURCE ESTIMATION

### 9.1 Development Team Composition
```
Product Manager: 1 FTE
Frontend Engineers: 3 FTE (React/Next.js specialists)
Backend Engineers: 2 FTE (Express.js, Node.js specialists)
DevOps Engineer: 1 FTE (Infrastructure, CI/CD)
QA/Testing: 1 FTE (Manual + automated testing)
UI/UX Designer: 1 FTE
Consultant (Frappe Framework): 1 PT (as needed)
───────────────
Total: 10 FTE + 1 PT
```

### 9.2 Infrastructure Costs (Monthly)
```
Cloud Compute (AWS):     $800
Database (PostgreSQL):   $300
CDN (Cloudflare):        $100
Email Service:           $50
SMS/WhatsApp API:        $500
Monitoring Tools:        $200
Backup & Storage:        $150
───────────────
Total Monthly:           ~$2,100
Annual:                  ~$25,200
```

### 9.3 Development Budget Estimation

**Total Project Cost (10 months)**:
```
Development Labor (10 FTE × 10 months × $3,500/month):     $350,000
UI/UX & Design:                                             $25,000
Infrastructure & Tools:                                     $25,000
Training & Documentation:                                   $15,000
Contingency (20%):                                          $83,000
───────────────
**TOTAL PROJECT BUDGET:                                     $498,000**
```

**Ongoing Operational Costs (Annual)**:
```
Infrastructure:                                            $25,200
Maintenance & Support (2 FTE):                             $84,000
Feature Development & Enhancements:                        $50,000
Training & Continuous Improvement:                         $10,000
───────────────
**TOTAL ANNUAL OPEX:                                        $169,200**
```

---

## ⚠️ BAGIAN 10: RISKS & MITIGATION

### 10.1 Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|-----------|
| 1 | User adoption delay | Medium | High | Early training, change management plan, success stories |
| 2 | Technical complexity (integration) | Medium | High | Expert consultation, modular architecture, thorough testing |
| 3 | Data migration issues | Low | High | Data validation scripts, dry-run testing, rollback plan |
| 4 | Scope creep | High | Medium | Strict change control, phased rollout, clear scope definition |
| 5 | Performance issues at scale | Medium | High | Load testing, caching strategy, database optimization |
| 6 | Security vulnerability | Low | Critical | Penetration testing, secure SDLC, regular audits |
| 7 | Staff turnover during project | Medium | Medium | Documentation, knowledge transfer, contingency staffing |
| 8 | Vendor/third-party dependency | Low | Medium | Alternative solutions identified, contract clarity |
| 9 | Budget overrun | Medium | Medium | Contingency fund (20%), strict cost tracking, scope management |

### 10.2 Mitigation Strategies

**Risk 1: User Adoption**
- ✅ Create champions program (early adopters)
- ✅ Provide multiple training formats (video, workshop, documentation)
- ✅ Dedicated support during transition period
- ✅ Gather feedback & iterate quickly

**Risk 2: Technical Complexity**
- ✅ Hire Frappe Framework expert
- ✅ Design modular, loosely-coupled architecture
- ✅ Comprehensive testing strategy
- ✅ Code review & quality gates

**Risk 3: Data Migration**
- ✅ Create data validation & cleansing scripts
- ✅ Perform multiple dry-run migrations
- ✅ Backup original data extensively
- ✅ Have rollback plan ready

**Risk 4: Scope Creep**
- ✅ Strict change control board (CCB)
- ✅ Clear phased rollout (MVP first)
- ✅ Well-defined requirements document
- ✅ Regular stakeholder alignment

**Risk 5: Performance**
- ✅ Early load testing with realistic data volume
- ✅ Caching strategy (Redis, CDN)
- ✅ Database indexing optimization
- ✅ Infrastructure auto-scaling

**Risk 6: Security**
- ✅ Regular penetration testing
- ✅ OWASP compliance (Top 10)
- ✅ Encryption for sensitive data
- ✅ Access control & audit logging
- ✅ Regular security training for team

---

## 🔒 BAGIAN 11: SECURITY & COMPLIANCE

### 11.1 Security Requirements
- **Authentication**: Multi-factor for admin, strong password policy
- **Encryption**: TLS 1.3 for transit, AES-256 for data at rest
- **Access Control**: Role-based access control (RBAC)
- **Data Privacy**: GDPR-compliant (if applicable), local data residency
- **Audit Logging**: All actions logged with timestamp & user ID
- **Backup**: Daily encrypted backups with 90-day retention
- **Penetration Testing**: Annual PT by third-party firm

### 11.2 Compliance Requirements
- **Data Protection**: Personal data of santri/orang tua protected
- **Financial Compliance**: Audit-ready financial records
- **System Availability**: 99.5% uptime SLA
- **Disaster Recovery**: RTO < 4 hours, RPO < 1 hour
- **Accessibility**: WCAG 2.1 AA compliance

---

## 📚 BAGIAN 12: DOCUMENTATION & TRAINING

### 12.1 Documentation Deliverables
- **System Documentation**:
  - Architecture guide
  - API documentation (Swagger/OpenAPI)
  - Database schema documentation
  - Deployment guide
  
- **User Documentation**:
  - User manual per modul
  - Video tutorials (1-5 min each)
  - FAQ per modul
  - Troubleshooting guides
  
- **Administrator Documentation**:
  - System configuration guide
  - User management guide
  - Backup & recovery procedures
  - Performance tuning guide

### 12.2 Training Plan
- **Phase 1**: Administrator & super-user training (1 week before go-live)
- **Phase 2**: Ustadz/staff training (1 week before go-live)
- **Phase 3**: On-the-job training post-launch (2 weeks)
- **Phase 4**: Orang tua & santri self-service training (post-launch)

---

## ✅ BAGIAN 13: SUCCESS CRITERIA & GO-LIVE CHECKLIST

### 13.1 Pre-Launch Checklist
- [ ] All 21 modules tested & approved (UAT)
- [ ] Performance tested (load testing passed)
- [ ] Security testing completed (penetration testing passed)
- [ ] Data migration completed & validated
- [ ] Staff trained & certified
- [ ] Documentation complete
- [ ] Monitoring & alerting configured
- [ ] Disaster recovery plan tested
- [ ] Go-live communication sent to all users

### 13.2 Go-Live Success Criteria (First 30 Days)
- ✅ System uptime > 99%
- ✅ Zero critical bugs
- ✅ <5 medium bugs per day
- ✅ User adoption > 80%
- ✅ Average task completion <2 minutes
- ✅ API response time < 200ms (p95)
- ✅ Support ticket resolution time < 2 hours
- ✅ User satisfaction NPS > 6

---

## 📞 BAGIAN 14: CONTACT & GOVERNANCE

### 14.1 Project Governance
- **Steering Committee**: Abuya, Finance Lead, Academic Lead (meets monthly)
- **Project Manager**: Owns timeline, budget, scope
- **Technical Lead**: Owns architecture, technical decisions
- **Product Owner**: Owns feature prioritization, user requirements

### 14.2 Decision Making
- **Major Decisions** (scope, budget, timeline): Steering committee approval
- **Technical Decisions**: Technical lead + dev team
- **Feature Prioritization**: Product owner + stakeholder input

### 14.3 Status Reporting
- **Weekly**: Dev team standup (progress, blockers)
- **Bi-weekly**: Stakeholder update (milestone progress)
- **Monthly**: Steering committee review (budget, timeline, risk)

---

## 📋 APPENDIX A: REFERENCE & RESOURCES

### A.1 Framework & Technology References
- **Frappe Framework**: https://frappe.io/framework
- **React.js**: https://react.dev
- **Next.js**: https://nextjs.org
- **Express.js**: https://expressjs.com
- **PostgreSQL**: https://www.postgresql.org
- **Tailwind CSS**: https://tailwindcss.com

### A.2 Design Resources
- **Google Sans Font**: https://fonts.google.com/specimen/Google+Sans
- **Roboto Font**: https://fonts.google.com/specimen/Roboto
- **Tailwind Components**: https://tailwindui.com
- **Color Palette Guide**: WAI-ARIA color contrast guidelines

### A.3 Best Practices
- **API Design**: REST principles, versioning strategy
- **Database**: Normalization, indexing, backup strategy
- **Security**: OWASP Top 10, secure SDLC
- **Performance**: Caching, CDN, optimization techniques

---

## 📝 DOCUMENT HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | May 2026 | Product Team | Initial draft |
| 1.0 | May 2026 | Product Team | Ready for review |

---

**Status**: 🔄 FOR REVIEW  
**Next Step**: Stakeholder approval & team kickoff meeting  
**Approved By**: _____________________________ (Abuya/Leadership)  
**Date**: _______________________

---

**END OF PRD DOCUMENT**

---

*Disusun dengan penuh tanggung jawab untuk kesuksesan Pondok Pesantren Islam Internasional Terpadu Asy-Syifaa Wal Mahmuudiyyah*

*Wassalamu alaikum warahmatullahi wabarakatuh* 🌙
