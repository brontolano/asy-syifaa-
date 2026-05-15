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
  if (host.startsWith("dashboard.")) return "dashboard";
  if (host.startsWith("erp.")) return "erp";
  if (host.startsWith("perpustakaan.")) return "perpustakaan";
  if (host === "asy-syifaa.com" || host === "www.asy-syifaa.com") return "website-public";
  if (host === "localhost" || host === "127.0.0.1") return "erp";
  const parts = host.split(".");
  if (parts.length >= 3) return `module:${parts[0]}`;
  return "erp";
}

function normalizeTags(input) {
  return (input || "").toString().split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
}

function normalizeStatus(input) {
  const raw = (input || "").toString().trim().toLowerCase();
  if (raw === "publish") return "publish";
  return "draft";
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
  limits: { fileSize: 500 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.static(FRONTEND_DIR, { index: false }));
app.use("/library-files", express.static(LIBRARY_DIR));
app.use("/vendor/pdfjs", express.static(path.join(__dirname, "..", "node_modules", "pdfjs-dist", "build")));

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

app.delete("/api/perpustakaan/bookmarks/:bookId", (req, res) => {
  const readerId = getReaderId(req, res);
  const bookId = req.params.bookId;
  const all = readBookmarks();
  const before = all.length;
  const next = all.filter((b) => !(b.readerId === readerId && b.bookId === bookId));
  writeBookmarks(next);
  res.json({ ok: true, removed: before - next.length });
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
  const item = { id: crypto.randomUUID(), title: title || req.file.originalname, author, category, language, tags, status: "draft", originalName: req.file.originalname, fileName: req.file.filename, fileUrl: `/library-files/${req.file.filename}`, fileSize: req.file.size, uploadedAt: now, createdAt: now };
  items.push(item);
  writeLibrary(items);
  res.status(201).json(item);
});

app.put("/api/library/:id", requireSuperadmin, (req, res) => {
  const id = req.params.id;
  const items = readLibrary();
  const idx = items.findIndex((v) => v.id === id);
  if (idx < 0) return res.status(404).json({ message: "Dokumen tidak ditemukan" });

  const title = (req.body.title ?? items[idx].title).toString().trim();
  const category = (req.body.category ?? items[idx].category ?? "").toString().trim();
  const tags = req.body.tags == null ? items[idx].tags || [] : normalizeTags(req.body.tags);
  const status = req.body.status == null ? normalizeStatus(items[idx].status) : normalizeStatus(req.body.status);

  items[idx] = { ...items[idx], title: title || items[idx].originalName, category, tags, status, updatedAt: new Date().toISOString() };
  writeLibrary(items);
  res.json(items[idx]);
});

app.delete("/api/library/:id", requireSuperadmin, (req, res) => {
  const id = req.params.id;
  const items = readLibrary();
  const idx = items.findIndex((v) => v.id === id);
  if (idx < 0) return res.status(404).json({ message: "Dokumen tidak ditemukan" });

  const [row] = items.splice(idx, 1);
  writeLibrary(items);
  if (row.fileName) {
    try { fs.unlinkSync(path.join(LIBRARY_DIR, row.fileName)); } catch {}
  }
  res.json({ ok: true, id });
});

app.get("/api/library/:id", requireSuperadmin, (req, res) => {
  const row = readLibrary().find((v) => v.id === req.params.id);
  if (!row) return res.status(404).json({ message: "Dokumen tidak ditemukan" });
  res.json(row);
});

app.post("/api/library/:id/replace", requireSuperadmin, upload.single("pdf"), (req, res) => {
  const items = readLibrary();
  const idx = items.findIndex((v) => v.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: "Dokumen tidak ditemukan" });
  if (!req.file) return res.status(400).json({ message: "File PDF wajib diunggah" });

  const prev = items[idx];
  items[idx] = {
    ...prev,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    fileUrl: `/library-files/${req.file.filename}`,
    fileSize: req.file.size,
    updatedAt: new Date().toISOString()
  };
  writeLibrary(items);
  if (prev.fileName && prev.fileName !== req.file.filename) {
    try { fs.unlinkSync(path.join(LIBRARY_DIR, prev.fileName)); } catch {}
  }
  res.json(items[idx]);
});

app.post("/api/library/bulk", requireSuperadmin, (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids.map((v) => v.toString()) : [];
  const action = (req.body.action || "").toString().trim().toLowerCase();
  if (!ids.length) return res.status(400).json({ message: "ids wajib diisi" });
  if (!["delete", "publish", "draft"].includes(action)) return res.status(400).json({ message: "action tidak valid" });

  const idSet = new Set(ids);
  const now = new Date().toISOString();
  let items = readLibrary();

  if (action === "delete") {
    const removed = items.filter((v) => idSet.has(v.id));
    items = items.filter((v) => !idSet.has(v.id));
    writeLibrary(items);
    removed.forEach((row) => {
      if (!row.fileName) return;
      try { fs.unlinkSync(path.join(LIBRARY_DIR, row.fileName)); } catch {}
    });
    return res.json({ ok: true, updated: 0, deleted: removed.length });
  }

  let updated = 0;
  items = items.map((row) => {
    if (!idSet.has(row.id)) return row;
    updated += 1;
    return { ...row, status: action, updatedAt: now };
  });
  writeLibrary(items);
  res.json({ ok: true, updated, deleted: 0 });
});

app.use((err, _req, res, next) => {
  if (!err) return next();
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File terlalu besar. Maksimal 500 MB." });
  }
  res.status(400).json({ message: err.message || "Upload gagal" });
});

app.get("/", (req, res) => {
  const sub = resolveHost(req.headers.host);
  if (sub === "perpustakaan") return res.sendFile(path.join(FRONTEND_DIR, "library-public.html"));
  if (sub === "dashboard") {
    const session = getSession(req);
    if (!session || session.role !== "superadmin") return res.redirect(302, "/login");
    return res.redirect(302, "/dashboard");
  }
  if (sub === "website-public") return res.sendFile(path.join(FRONTEND_DIR, "website-undermaintenance.html"));
  if (sub.startsWith("module:")) {
    const moduleName = sub.split(":")[1] || "unknown";
    return res.status(404).send(`Subdomain modul '${moduleName}' belum tersedia. Gunakan erp.asy-syifaa.com atau dashboard.asy-syifaa.com.`);
  }
  if (sub === "erp") return res.sendFile(path.join(FRONTEND_DIR, "index.html"));
  const session = getSession(req);
  if (!session || session.role !== "superadmin") return res.redirect(302, "/login");
  return res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.get("/login", (req, res) => {
  const session = getSession(req);
  if (session && session.role === "superadmin") return res.redirect(302, "/");
  return res.sendFile(path.join(FRONTEND_DIR, "login.html"));
});

app.get("/dashboard", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "superadmin") return res.redirect(302, "/login");
  return res.sendFile(path.join(FRONTEND_DIR, "dashboard.html"));
});

app.get("/profil", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "superadmin") return res.redirect(302, "/login");
  return res.sendFile(path.join(FRONTEND_DIR, "profile.html"));
});

app.get("/website", (req, res) => {
  const host = (req.headers.host || "").toLowerCase();
  if (host.startsWith("erp.asy-syifaa.com")) {
    return res.redirect(301, "https://asy-syifaa.com");
  }
  const session = getSession(req);
  if (!session || session.role !== "superadmin") return res.redirect(302, "/login");
  return res.sendFile(path.join(FRONTEND_DIR, "website-undermaintenance.html"));
});

app.get("/perpustakaan", (_req, res) => res.sendFile(path.join(FRONTEND_DIR, "library-public.html")));
app.get("/perpustakaan/reader", (_req, res) => res.sendFile(path.join(FRONTEND_DIR, "reader.html")));
app.get("/dashboard/perpustakaan/edit", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "superadmin") return res.redirect(302, "/login");
  return res.sendFile(path.join(FRONTEND_DIR, "library-edit.html"));
});
app.listen(PORT, () => console.log(`ERP MVP berjalan di http://localhost:${PORT}`));
