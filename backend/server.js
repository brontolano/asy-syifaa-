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

const SUPERADMIN_USERNAME = "superadmin";
const SUPERADMIN_PASSWORD = "bismillah";
const sessions = new Map();

if (!fs.existsSync(LIBRARY_DIR)) fs.mkdirSync(LIBRARY_DIR, { recursive: true });
if (!fs.existsSync(LIBRARY_DB)) fs.writeFileSync(LIBRARY_DB, "[]");

function readLibrary() {
  return JSON.parse(fs.readFileSync(LIBRARY_DB, "utf8") || "[]");
}

function writeLibrary(items) {
  fs.writeFileSync(LIBRARY_DB, JSON.stringify(items, null, 2));
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return raw.split(";").reduce((acc, item) => {
    const [k, ...v] = item.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(v.join("="));
    return acc;
  }, {});
}

function getSession(req) {
  const cookies = parseCookies(req);
  const token = cookies.erp_session;
  if (!token) return null;
  return sessions.get(token) || null;
}

function requireSuperadmin(req, res, next) {
  const session = getSession(req);
  if (!session || session.role !== "superadmin") {
    return res.status(401).json({ message: "Akses hanya untuk superadmin" });
  }
  req.session = session;
  next();
}

function resolveHost(hostHeader) {
  const host = (hostHeader || "").toLowerCase().split(":")[0];
  if (!host) return "erp";
  if (host.startsWith("perpustakaan.")) return "perpustakaan";
  if (host.startsWith("erp.")) return "erp";
  if (host === "asy-syifaa.com" || host === "www.asy-syifaa.com") return "website-public";
  if (host === "localhost" || host === "127.0.0.1") return "erp";

  const parts = host.split(".");
  if (parts.length >= 3) return parts[0];
  return "erp";
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

app.post("/api/auth/login", (req, res) => {
  const username = (req.body.username || "").toString().trim();
  const password = (req.body.password || "").toString();

  if (username !== SUPERADMIN_USERNAME || password !== SUPERADMIN_PASSWORD) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const token = crypto.randomUUID();
  const session = { role: "superadmin", username, createdAt: new Date().toISOString() };
  sessions.set(token, session);

  res.setHeader("Set-Cookie", `erp_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax`);
  res.json({ ok: true, role: "superadmin", username });
});

app.post("/api/auth/logout", (req, res) => {
  const cookies = parseCookies(req);
  if (cookies.erp_session) sessions.delete(cookies.erp_session);
  res.setHeader("Set-Cookie", "erp_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
  res.json({ ok: true });
});

app.get("/api/auth/session", (req, res) => {
  const session = getSession(req);
  if (!session) return res.json({ authenticated: false, role: "public" });
  res.json({ authenticated: true, role: session.role, username: session.username });
});

app.get("/api/dashboard/summary", requireSuperadmin, (req, res) => {
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

app.post("/api/library/upload", requireSuperadmin, upload.single("pdf"), (req, res) => {
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

app.get("/", (req, res) => {
  const sub = resolveHost(req.headers.host);
  if (sub === "perpustakaan") return res.sendFile(path.join(FRONTEND_DIR, "library.html"));
  if (sub === "website-public") return res.redirect(302, "https://asy-syifaa.com");
  return res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.get("/dashboard", (req, res) => {
  if (!getSession(req)) return res.redirect(302, "/?login=required");
  return res.sendFile(path.join(FRONTEND_DIR, "dashboard.html"));
});

app.get("/perpustakaan", (_req, res) => res.sendFile(path.join(FRONTEND_DIR, "library.html")));

app.listen(PORT, () => {
  console.log(`ERP MVP berjalan di http://localhost:${PORT}`);
});
