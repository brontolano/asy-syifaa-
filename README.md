# ERP Asy-Syifaa Wal Mahmuudiyyah

Repository implementasi bertahap ERP Pesantren berdasarkan PRD `PRD_ERP_PESANTREN_ASY_SYIFAA.md`.

## Progress Saat Ini
- Module 0: Landing Page (selesai versi MVP)
- Module 1: Dashboard role-based (selesai versi MVP)
- Module 2+: belum dimulai pada branch ini

## Struktur
- `backend/server.js`: API dan static server Express
- `frontend/index.html`: Module 0 Landing Page
- `frontend/dashboard.html`: Module 1 Dashboard
- `frontend/dashboard.js`: logika role-based dashboard
- `frontend/styles.css`: styling UI

## Menjalankan Lokal
```bash
npm install
npm run dev
```

Buka:
- `http://localhost:3000/` (Module 0)
- `http://localhost:3000/dashboard` (Module 1)

## Endpoint
- `GET /api/health`
- `GET /api/dashboard/summary?role=ustadz|mudiraam|abuya`
