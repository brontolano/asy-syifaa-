import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";

const form = document.getElementById("uploadForm");
const msgEl = document.getElementById("uploadMsg");
const listEl = document.getElementById("libraryList");
const listInfoEl = document.getElementById("listInfo");
const bookmarkListEl = document.getElementById("bookmarkList");
const bookmarkMsgEl = document.getElementById("bookmarkMsg");
const uploadSection = document.getElementById("uploadSection");
const lockedSection = document.getElementById("lockedSection");
const filterForm = document.getElementById("filterForm");
const resetFilterBtn = document.getElementById("resetFilter");
const viewListBtn = document.getElementById("viewListBtn");
const viewGridBtn = document.getElementById("viewGridBtn");

let currentFilter = { q: "", category: "", language: "" };

function formatBytes(bytes) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; }
function escapeHtml(value) { return (value || "").toString().replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }

async function saveBookmark(bookId) {
  const pageRaw = window.prompt("Simpan bookmark halaman berapa?", "1");
  if (!pageRaw) return;
  const page = Number(pageRaw);
  if (!Number.isFinite(page) || page < 1) return alert("Halaman harus angka >= 1");
  const note = window.prompt("Catatan bookmark (opsional)", "") || "";

  const resp = await fetch("/api/perpustakaan/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, page, note })
  });
  const data = await resp.json();
  if (!resp.ok) return alert(data.message || "Gagal menyimpan bookmark");

  bookmarkMsgEl.textContent = `Bookmark tersimpan di halaman ${data.page}`;
  await loadBookmarks();
}

function setViewMode(mode) {
  listEl.classList.toggle("library-grid", mode === "grid");
  viewListBtn.classList.toggle("active-toggle", mode === "list");
  viewGridBtn.classList.toggle("active-toggle", mode === "grid");
}

async function renderCover(canvas, pdfUrl) {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.35 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
  } catch {
    const ctx = canvas.getContext("2d");
    canvas.width = 180;
    canvas.height = 240;
    ctx.fillStyle = "#ece5dd";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#666";
    ctx.font = "16px sans-serif";
    ctx.fillText("PDF", 72, 120);
  }
}

async function renderGridCovers() {
  const canvases = Array.from(document.querySelectorAll("canvas[data-cover-url]"));
  for (const c of canvases) {
    const url = c.getAttribute("data-cover-url");
    await renderCover(c, url);
  }
}

function row(item) {
  const uploaded = new Date(item.uploadedAt).toLocaleString("id-ID");
  const tags = (item.tags || []).length ? item.tags.map((v) => `<span class="tag-chip">${escapeHtml(v)}</span>`).join("") : "-";
  return `<article class="library-item"><div class="library-cover-wrap"><canvas class="library-cover" data-cover-url="${escapeHtml(item.fileUrl)}"></canvas></div><div><h3>${escapeHtml(item.title)}</h3><p>Penulis: ${escapeHtml(item.author || "-")}</p><p>Kategori: ${escapeHtml(item.category || "-")} • Bahasa: ${escapeHtml(item.language || "-")}</p><p>Tag: ${tags}</p><p>${escapeHtml(item.originalName)} • ${formatBytes(item.fileSize)} • ${uploaded}</p></div><div class="actions"><a class="btn ghost" href="/perpustakaan/reader?id=${escapeHtml(item.id)}">Buka PDF</a><button class="btn ghost js-save-bookmark" type="button" data-book-id="${escapeHtml(item.id)}">Bookmark</button></div></article>`;
}

function bookmarkRow(item) {
  const upd = new Date(item.updatedAt).toLocaleString("id-ID");
  return `<article class="library-item"><div><h3>${escapeHtml(item.bookTitle)}</h3><p>Halaman: ${item.page}</p><p>Catatan: ${escapeHtml(item.note || "-")}</p><p>Diperbarui: ${upd}</p></div></article>`;
}

function toQueryString(filter) { const q = new URLSearchParams(); if (filter.q) q.set("q", filter.q); if (filter.category) q.set("category", filter.category); if (filter.language) q.set("language", filter.language); return q.toString(); }

async function loadLibrary() {
  const qs = toQueryString(currentFilter);
  const resp = await fetch(`/api/perpustakaan/search${qs ? `?${qs}` : ""}`);
  const data = await resp.json();
  listInfoEl.textContent = `${data.total || 0} dokumen ditemukan`;
  if (!data.data.length) { listEl.innerHTML = "<p class='note'>Belum ada dokumen sesuai filter.</p>"; return; }
  listEl.innerHTML = data.data.map(row).join("");
  await renderGridCovers();
}

async function loadBookmarks() {
  const resp = await fetch("/api/perpustakaan/bookmarks");
  const data = await resp.json();
  if (!data.data.length) { bookmarkListEl.innerHTML = "<p class='note'>Belum ada bookmark tersimpan.</p>"; return; }
  bookmarkListEl.innerHTML = data.data.map(bookmarkRow).join("");
}

async function applyUploadAccess() {
  const s = await window.erpAuth.getSession();
  if (s.authenticated && s.role === "superadmin") { uploadSection.hidden = false; lockedSection.hidden = true; msgEl.textContent = "Mode superadmin aktif: upload PDF diizinkan."; return; }
  uploadSection.hidden = true; lockedSection.hidden = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = new FormData();
  body.append("title", document.getElementById("title").value.trim());
  body.append("author", document.getElementById("author").value.trim());
  body.append("category", document.getElementById("category").value.trim());
  body.append("language", document.getElementById("language").value.trim());
  body.append("tags", document.getElementById("tags").value.trim());
  const pdf = document.getElementById("pdf").files[0];
  if (!pdf) return (msgEl.textContent = "Pilih file PDF dulu.");
  body.append("pdf", pdf);
  msgEl.textContent = "Sedang upload...";
  const resp = await fetch("/api/library/upload", { method: "POST", body });
  const data = await resp.json();
  if (!resp.ok) return (msgEl.textContent = data.message || "Upload gagal.");
  msgEl.textContent = `Upload berhasil: ${data.title}`;
  form.reset();
  await loadLibrary();
});

filterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentFilter = { q: document.getElementById("q").value.trim(), category: document.getElementById("filterCategory").value.trim(), language: document.getElementById("filterLanguage").value.trim() };
  await loadLibrary();
});

resetFilterBtn.addEventListener("click", async () => { filterForm.reset(); currentFilter = { q: "", category: "", language: "" }; await loadLibrary(); });
viewListBtn.addEventListener("click", () => setViewMode("list"));
viewGridBtn.addEventListener("click", () => setViewMode("grid"));
listEl.addEventListener("click", async (e) => {
  const bookmarkBtn = e.target.closest(".js-save-bookmark");
  if (bookmarkBtn) await saveBookmark(bookmarkBtn.getAttribute("data-book-id"));
});

applyUploadAccess();
setViewMode("grid");
loadLibrary();
loadBookmarks();
