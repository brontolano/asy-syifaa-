# ERP Asy-Syifaa Wal Mahmuudiyyah

Implementasi bertahap ERP Pesantren berbasis PRD `PRD_ERP_PESANTREN_ASY_SYIFAA.md`.

## Checkpoint Proyek (Saat Ini)
1. Akses & role
- Halaman utama ERP (`/`) dikunci login.
- Halaman login khusus di `/login`.
- Akun superadmin default: `superadmin / bismillah`.

2. Module 0 - Landing ERP
- Grid menu modul sudah tersedia dan diurutkan A-Z.
- Tema global diselaraskan ke palet PRD (light/dark).

3. Module 1 - Dashboard CMS
- Sidebar modul sebagai CMS pusat konten.
- Panel tampil mandiri per modul (`?module=...`).
- `module=dashboard`: panel Data + Quick Action.
- `module=perpustakaan`: panel CMS perpustakaan aktif.

4. Module 15 - Perpustakaan Digital
- Halaman publik `/perpustakaan` + PDF Reader in-app `/perpustakaan/reader?id=...`.
- Bookmark toggle aktif/nonaktif.
- Filter + mode grid/list + compact list mode.
- Klik card langsung buka reader (tanpa tombol Baca).

5. CMS Perpustakaan (di Dashboard)
- Upload PDF drag & drop + daftar file pending upload.
- Tabel manajemen file: nomor, nama file, kategori, tag, status, edit, hapus.
- Status ditampilkan badge `Draf/Publish` (tanpa dropdown).
- Bulk action: publish/draft/hapus.
- Search indexing file upload.
- Pagination: 20 / 50 / 100 per halaman.
- Halaman edit detail file: edit atribut + replace PDF.

6. Module Website
- Modul website internal dibuat `Under Maintenance` di route `/website`.

## Data Aktif Saat Ini
1. `backend/data/library.json`
- Koleksi perpustakaan aktif: 21 dokumen.
- Status publish: 21, draft: 0.

2. `backend/data/bookmarks.json`
- Bookmark reader tersimpan: 5 data.

3. `backend/data/students.json`
- Data santri: 0 (belum diisi).

4. `backend/storage/library-pdfs/`
- Menyimpan file PDF fisik yang direferensikan oleh `library.json`.

## Menjalankan Lokal
```bash
npm install
npm run dev
```

Endpoint halaman utama:
- `http://localhost:3000/login`
- `http://localhost:3000/`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/perpustakaan`
- `http://localhost:3000/perpustakaan/reader?id=<bookId>`
- `http://localhost:3000/website` (under maintenance)

## Endpoint API Penting
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/library`
- `POST /api/library/upload`
- `PUT /api/library/:id`
- `DELETE /api/library/:id`
- `POST /api/library/:id/replace`
- `POST /api/library/bulk`
- `GET /api/perpustakaan/search`
- `POST /api/perpustakaan/bookmarks`
- `DELETE /api/perpustakaan/bookmarks/:bookId`

## Rencana Arsitektur Domain (Horizons)
1. Domain utama
- `asy-syifaa.com` dan `www.asy-syifaa.com` sementara menampilkan halaman website `Under Maintenance`.

2. Portal ERP
- `erp.asy-syifaa.com` sebagai pintu masuk ERP (dashboard, login, modul).

3. Modul berbasis subdomain
- Pola: `[modul].asy-syifaa.com`.
- Contoh implementasi aktif saat ini: `perpustakaan.asy-syifaa.com`.
- Modul yang belum tersedia menampilkan pesan "belum tersedia".

4. Integrasi konten
- Opsi CMS artikel via WordPress bisa dipadukan, dengan tema tetap mengikuti base aplikasi.

