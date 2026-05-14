const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
const LIBRARY_DIR = path.join(__dirname, "storage", "library-pdfs");
const LIBRARY_DB = path.join(__dirname, "data", "library.json");

if (!fs.existsSync(LIBRARY_DIR)) fs.mkdirSync(LIBRARY_DIR, { recursive: true });
if (!fs.existsSync(LIBRARY_DB)) fs.writeFileSync(LIBRARY_DB, "[]");

function readLibrary() {
  return JSON.parse(fs.readFileSync(LIBRARY_DB, "utf8") || "[]");
}

function writeLibrary(items) {
  fs.writeFileSync(LIBRARY_DB, JSON.stringify(items, null, 2));
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, LIBRARY_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".pdf";
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new Error("Hanya file PDF yang diizinkan"));
  },
  limits: { fileSize: 20 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.static(FRONTEND_DIR));
app.use("/library-files", express.static(LIBRARY_DIR));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "asy-syifaa-erp-mvp", modules: [0, 1, 15] });
});

app.get("/api/dashboard/summary", (req, res) => {
  const role = (req.query.role || "ustadz").toString().toLowerCase();

  const base = {
    totalSantri: 1248,
    santriAktif: 1187,
    pembayaranBulanIni: 842,
    kelasAktif: 36
  };

  const byRole = {
    ustadz: ["Kehadiran Hari Ini", "Jadwal Mengajar", "Pengumuman Akademik"],
    mudiraam: ["Kontrol Operasional", "Approval Data", "Monitoring Keuangan"],
    abuya: ["Ringkasan Strategis", "KPI Pesantren", "Insight Bulanan"]
  };

  res.json({ role, summary: base, widgets: byRole[role] || byRole.ustadz });
});

app.get("/api/library", (_req, res) => {
  const items = readLibrary().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json({ total: items.length, data: items });
});

app.post("/api/library/upload", upload.single("pdf"), (req, res) => {
  const title = (req.body.title || "").toString().trim();
  if (!req.file) return res.status(400).json({ message: "File PDF wajib diunggah" });

  const items = readLibrary();
  const item = {
    id: crypto.randomUUID(),
    title: title || req.file.originalname,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    fileUrl: `/library-files/${req.file.filename}`,
    fileSize: req.file.size,
    uploadedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  items.push(item);
  writeLibrary(items);
  res.status(201).json(item);
});

app.use((err, _req, res, next) => {
  if (!err) return next();
  res.status(400).json({ message: err.message || "Upload gagal" });
});

app.get("/", (_req, res) => res.sendFile(path.join(FRONTEND_DIR, "index.html")));
app.get("/dashboard", (_req, res) => res.sendFile(path.join(FRONTEND_DIR, "dashboard.html")));
app.get("/perpustakaan", (_req, res) => res.sendFile(path.join(FRONTEND_DIR, "library.html")));

app.listen(PORT, () => {
  console.log(`ERP MVP berjalan di http://localhost:${PORT}`);
});
