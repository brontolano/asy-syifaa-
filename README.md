# ERP Asy-Syifaa Wal Mahmuudiyyah

Repository implementasi bertahap ERP Pesantren berdasarkan PRD `PRD_ERP_PESANTREN_ASY_SYIFAA.md`.

## Progress Saat Ini
- Module 0: Landing Page (selesai versi MVP)
- Module 1: Dashboard role-based (selesai versi MVP)
- Module 15: Perpustakaan Digital (upload + list + buka PDF)
- Module 2+: belum dimulai pada branch ini

## Struktur
- `backend/server.js`: API dan static server Express
- `frontend/index.html`: Module 0 Landing Page
- `frontend/dashboard.html`: Module 1 Dashboard
- `frontend/dashboard.js`: logika role-based dashboard
- `frontend/library.html`: Modul Perpustakaan Digital
- `frontend/library.js`: logika upload dan list PDF
- `frontend/theme.js`: toggle dark/light mode
- `frontend/styles.css`: styling UI

## Menjalankan Lokal
```bash
npm install
npm run dev
```

Buka:
- `http://localhost:3000/` (Module 0)
- `http://localhost:3000/dashboard` (Module 1)
- `http://localhost:3000/perpustakaan` (Module 15)

## Endpoint
- `GET /api/health`
- `GET /api/dashboard/summary?role=ustadz|mudiraam|abuya`
- `GET /api/library`
- `POST /api/library/upload` (`multipart/form-data`, field file: `pdf`)

## Penyimpanan PDF Perpustakaan
- Upload dilakukan dari halaman `http://localhost:3000/perpustakaan`
- File PDF fisik disimpan di `backend/storage/library-pdfs`
- Metadata koleksi disimpan di `backend/data/library.json`
