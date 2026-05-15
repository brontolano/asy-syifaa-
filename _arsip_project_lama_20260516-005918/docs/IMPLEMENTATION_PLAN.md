# Implementation Plan (Kickoff)

Sumber: `PRD_ERP_PESANTREN_ASY_SYIFAA.md`

## Prioritas Eksekusi
1. Phase 1 (Month 1-2): Foundation + Module 0-4
2. Phase 2 (Month 3-4): Financial & Notification Core
3. Phase 3+ : Modul operasional lanjutan

## Breakdown Sprint Awal (MVP)
1. Sprint 0 - Project Foundation
- Setup repository, branching, coding standards
- Setup baseline architecture (backend, frontend, DB, auth)
- Setup CI basic (lint, test, build)

2. Sprint 1 - Module 0/1
- Module 0 Landing page
- Module 1 Dashboard role-based (Ustadz, Mudir'aam, Abuya)
- KPI tiles + data placeholder

3. Sprint 2 - Module 2 (Master Data Santri)
- CRUD santri + wali
- Validasi data + import data awal
- RBAC akses data per role

4. Sprint 3 - Module 3 (PPDB)
- Form pendaftaran
- Verifikasi berkas
- Pipeline status pendaftar

5. Sprint 4 - Module 4 (Keuangan Basic)
- Setup tagihan santri
- Catat pembayaran
- Rekap pembayaran sederhana

## Definition of Done per Sprint
- Fitur jalan di environment lokal
- Test minimal untuk alur utama
- Dokumentasi singkat update
- Siap di-review via PR

## Catatan
- Eksekusi mengikuti prinsip incremental, bukan big-bang rewrite.
- Semua perubahan harus traceable lewat issue/PR.
