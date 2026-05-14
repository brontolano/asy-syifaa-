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
const BOOKMARK_DB = path.join(__dirname, "data", "bookmarks.json");

const SUPERADMIN_USERNAME = "superadmin";
const SUPERADMIN_PASSWORD = "bismillah";
const sessions = new Map();

if (!fs.existsSync(LIBRARY_DIR)) fs.mkdirSync(LIBRARY_DIR, { recursive: true });
if (!fs.existsSync(LIBRARY_DB)) fs.writeFileSync(LIBRARY_DB, "[]");
if (!fs.existsSync(BOOKMARK_DB)) fs.writeFileSync(BOOKMARK_DB, "[]");

function readLibrary() {
  return JSON.parse(fs.readFileSync(LIBRARY_DB, "utf8") || "[]");
}
function writeLibrary(items) { fs.writeFileSync(LIBRARY_DB, JSON.stringify(items, null, 2)); }
function readBookmarks() { return JSON.parse(fs.readFileSync(BOOKMARK_DB, "utf8") || "[]"); }
function writeBookmarks(items) { fs.writeFileSync(BOOKMARK_DB, JSON.stringify(items, null, 2)); }

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

function getReaderId(req, res) {
  const session = getSession(req);
  if (session?.role === "superadmin") return `superadmin:${session.username}`;
  const cookies = parseCookies(req);
  let guest = cookies.erp_guest;
  if (!guest) {
    guest = crypto.randomUUID();
    res.append("Set-Cookie", `erp_guest=${guest}; Path=/; Max-Age=31536000; SameSite=Lax`);
  }
  return `public:${guest}`;
}

function requireSuperadmin(req, res, next) {
  const session = getSession(req);
  if (!session || session.role !== "superadmin") return res.status(401).json({ message: "Akses hanya untuk superadmin" });
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

function normalizeTags(input) {
  return (input || "").toString().split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
}

function applyLibraryFilters(items, query) {
  const q = (query.q || "").toString().trim().toLowerCase();
  const category = (query.category || "").toString().trim().toLowerCase();
  const language = (query.language || "").toString().trim().toLowerCase();
  const author = (query.author || "").toString().trim().toLowerCase();

  return items.filter((item) => {
    if (category && (item.category || "").toLowerCase() !== category) return false;
    if (language && (item.language || "").toLowerCase() !== language) return false;
    if (author && !(item.author || "").toLowerCase().includes(author)) return false;
    if (!q) return true;
    const searchable = [item.title, item.author, item.category, item.language, item.originalName, ...(item.tags || [])].join(" ").toLowerCase();
    return searchable.includes(q);
  });
}

function toLibraryList(items, query) { return applyLibraryFilters(items, query).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); }

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, LIBRARY_DIR),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase() || ".pdf"}`)
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => (file.mimetype === "application/pdf" ? cb(null, true) : cb(new Error("Hanya file PDF yang diizinkan"))),
  limits: { fileSize: 20 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.static(FRONTEND_DIR));
app.use("/library-files", express.static(LIBRARY_DIR));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "asy-syifaa-erp-mvp", modules: [0, 1, 15] }));

app.post("/api/auth/login", (req, res) => {
  const username = (req.body.username || "").toString().trim();
  const password = (req.body.password || "").toString();
  if (username !== SUPERADMIN_USERNAME || password !== SUPERADMIN_PASSWORD) return res.status(401).json({ message: "Username atau password salah" });
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
  const base = { totalSantri: 1248, santriAktif: 1187, pembayaranBulanIni: 842, kelasAktif: 36 };
  const byRole = {
    ustadz: ["Kehadiran Hari Ini", "Jadwal Mengajar", "Pengumuman Akademik"],
    mudiraam: ["Kontrol Operasional", "Approval Data", "Monitoring Keuangan"],
    abuya: ["Ringkasan Strategis", "KPI Pesantren", "Insight Bulanan"]
  };
  res.json({ role, summary: base, widgets: byRole[role] || byRole.ustadz });
});

app.get("/api/library", (req, res) => res.json({ total: toLibraryList(readLibrary(), req.query).length, data: toLibraryList(readLibrary(), req.query) }));
app.get("/api/perpustakaan/books", (req, res) => res.json({ total: toLibraryList(readLibrary(), req.query).length, data: toLibraryList(readLibrary(), req.query) }));
app.get("/api/perpustakaan/search", (req, res) => res.json({ total: toLibraryList(readLibrary(), req.query).length, data: toLibraryList(readLibrary(), req.query) }));

app.get("/api/perpustakaan/books/:id/content", (req, res) => {
  const book = readLibrary().find((v) => v.id === req.params.id);
  if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
  res.redirect(book.fileUrl);
});

app.get("/api/perpustakaan/bookmarks", (req, res) => {
  const readerId = getReaderId(req, res);
  const books = readLibrary();
  const rows = readBookmarks().filter((b) => b.readerId === readerId).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  const data = rows.map((r) => {
    const book = books.find((v) => v.id === r.bookId);
    return { ...r, bookTitle: book?.title || "(buku dihapus)" };
  });
  res.json({ total: data.length, data });
});

app.post("/api/perpustakaan/bookmarks", (req, res) => {
  const readerId = getReaderId(req, res);
  const bookId = (req.body.bookId || "").toString().trim();
  const page = Number(req.body.page || 0);
  const note = (req.body.note || "").toString().trim();
  if (!bookId || !Number.isFinite(page) || page < 1) return res.status(400).json({ message: "bookId dan page (>=1) wajib diisi" });

  const book = readLibrary().find((v) => v.id === bookId);
  if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

  const all = readBookmarks();
  const idx = all.findIndex((b) => b.readerId === readerId && b.bookId === bookId);
  const now = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = { ...all[idx], page, note, updatedAt: now };
    writeBookmarks(all);
    return res.json(all[idx]);
  }

  const row = { id: crypto.randomUUID(), readerId, bookId, page, note, createdAt: now, updatedAt: now };
  all.push(row);
  writeBookmarks(all);
  res.status(201).json(row);
});

app.post("/api/library/upload", requireSuperadmin, upload.single("pdf"), (req, res) => {
  const title = (req.body.title || "").toString().trim();
  const author = (req.body.author || "").toString().trim();
  const category = (req.body.category || "").toString().trim();
  const language = (req.body.language || "").toString().trim() || "id";
  const tags = normalizeTags(req.body.tags);
  if (!req.file) return res.status(400).json({ message: "File PDF wajib diunggah" });

  const items = readLibrary();
  const duplicate = items.find((item) => item.originalName === req.file.originalname && item.fileSize === req.file.size);
  if (duplicate) {
    try { fs.unlinkSync(path.join(LIBRARY_DIR, req.file.filename)); } catch {}
    return res.status(409).json({ message: "Dokumen duplikat: nama file dan ukuran sama sudah ada." });
  }

  const now = new Date().toISOString();
  const item = { id: crypto.randomUUID(), title: title || req.file.originalname, author, category, language, tags, originalName: req.file.originalname, fileName: req.file.filename, fileUrl: `/library-files/${req.file.filename}`, fileSize: req.file.size, uploadedAt: now, createdAt: now };
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
app.listen(PORT, () => console.log(`ERP MVP berjalan di http://localhost:${PORT}`));
