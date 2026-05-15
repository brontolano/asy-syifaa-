import * as pdfjsLib from "/vendor/pdfjs/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";

const form = document.getElementById("uploadForm");
const msgEl = document.getElementById("uploadMsg");
const listEl = document.getElementById("libraryList");
const bookmarkMsgEl = document.getElementById("bookmarkMsg");
const uploadSection = document.getElementById("uploadSection");
const filterForm = document.getElementById("filterForm");
const viewListBtn = document.getElementById("viewListBtn");
const viewGridBtn = document.getElementById("viewGridBtn");
const filterLanguageSelect = document.getElementById("filterLanguage");
const tabLibraryBtn = document.getElementById("tabLibraryBtn");
const tabBookmarkBtn = document.getElementById("tabBookmarkBtn");

let currentFilter = { q: "", language: "" };
let lastLibraryCount = 0;
let isSuperadmin = false;
let bookmarkIdSet = new Set();
let activeTab = "library";

function getInitialTab() {
  const fromQuery = (new URLSearchParams(window.location.search).get("tab") || "").toLowerCase();
  if (fromQuery === "bookmark") return "bookmark";
  const saved = (localStorage.getItem("library_active_tab") || "").toLowerCase();
  return saved === "bookmark" ? "bookmark" : "library";
}

function setActiveTab(nextTab) {
  activeTab = nextTab === "bookmark" ? "bookmark" : "library";
  localStorage.setItem("library_active_tab", activeTab);
  const url = new URL(window.location.href);
  if (activeTab === "bookmark") url.searchParams.set("tab", "bookmark");
  else url.searchParams.delete("tab");
  window.history.replaceState({}, "", url.toString());
}

function escapeHtml(value) { return (value || "").toString().replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }

async function toggleBookmark(bookId) {
  if (!bookId) return;
  if (bookmarkIdSet.has(bookId)) {
    const resp = await fetch(`/api/perpustakaan/bookmarks/${encodeURIComponent(bookId)}`, { method: "DELETE" });
    const data = await resp.json();
    if (!resp.ok) return alert(data.message || "Gagal menghapus bookmark");
    bookmarkMsgEl.textContent = "Bookmark dinonaktifkan.";
    await loadBookmarks();
    await loadLibrary();
    return;
  }

  const resp = await fetch("/api/perpustakaan/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, page: 1, note: "" })
  });
  const data = await resp.json();
  if (!resp.ok) return alert(data.message || "Gagal menyimpan bookmark");
  bookmarkMsgEl.textContent = "Bookmark diaktifkan.";
  await loadBookmarks();
  await loadLibrary();
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
  const tags = (item.tags || []).length ? item.tags.map((v) => `<span class="tag-chip">${escapeHtml(v)}</span>`).join("") : "-";
  const active = bookmarkIdSet.has(item.id);
  const bookmarkIcon = `<svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 4.48242C5 3.23978 6.00736 2.23242 7.25 2.23242H17.75C18.9926 2.23242 20 3.23978 20 4.48242V21.4824C20 21.759 19.8478 22.0132 19.6039 22.1437C19.36 22.2742 19.0641 22.2599 18.834 22.1065L12.916 18.1612C12.6641 17.9932 12.3359 17.9932 12.084 18.1612L6.16603 22.1065C5.93588 22.2599 5.63997 22.2742 5.39611 22.1437C5.15224 22.0132 5 21.759 5 21.4824V4.48242ZM7.25 3.73242C6.83579 3.73242 6.5 4.06821 6.5 4.48242V20.081L11.2519 16.9131C12.0077 16.4092 12.9923 16.4092 13.7481 16.9131L18.5 20.081V4.48242C18.5 4.06821 18.1642 3.73242 17.75 3.73242H7.25Z" fill="currentColor"/></svg>`;
  return `<article class="library-item js-open-reader" data-book-id="${escapeHtml(item.id)}"><div class="library-cover-wrap"><canvas class="library-cover" data-cover-url="${escapeHtml(item.fileUrl)}"></canvas></div><div class="library-meta"><h3>${escapeHtml(item.title)}</h3><p class="library-sub">Kategori: ${escapeHtml(item.category || "-")}</p><p class="library-tags">Tag: ${tags}</p></div><div class="library-card-actions"><button class="btn ghost icon-btn js-save-bookmark ${active ? "active-toggle" : ""}" type="button" data-book-id="${escapeHtml(item.id)}" aria-label="Toggle bookmark" title="Toggle bookmark">${bookmarkIcon}</button></div></article>`;
}

function toQueryString(filter) {
  const q = new URLSearchParams();
  if (filter.q) q.set("q", filter.q);
  if (filter.language) q.set("language", filter.language);
  return q.toString();
}

async function loadLibrary() {
  const qs = toQueryString(currentFilter);
  const resp = await fetch(`/api/perpustakaan/search${qs ? `?${qs}` : ""}`);
  const data = await resp.json();
  let filteredRows = data.data || [];
  if (activeTab === "bookmark") {
    filteredRows = filteredRows.filter((item) => bookmarkIdSet.has(item.id));
  }
  lastLibraryCount = filteredRows.length || 0;
  tabLibraryBtn.textContent = `Koleksi PDF (${activeTab === "library" ? lastLibraryCount : (data.data || []).length})`;
  if (!filteredRows.length) { listEl.innerHTML = "<p class='note'>Belum ada dokumen sesuai filter.</p>"; return; }
  listEl.innerHTML = filteredRows.map(row).join("");
  await renderGridCovers();
}

async function loadBookmarks() {
  const resp = await fetch("/api/perpustakaan/bookmarks");
  const data = await resp.json();
  bookmarkIdSet = new Set((data.data || []).map((v) => v.bookId));
  tabBookmarkBtn.textContent = `Bookmark Saya (${(data.data || []).length})`;
}

async function applyUploadAccess() {
  const s = await window.erpAuth.getSession();
  isSuperadmin = !!(s.authenticated && s.role === "superadmin");
  if (isSuperadmin && uploadSection) {
    uploadSection.hidden = false;
    if (msgEl) msgEl.textContent = "Mode superadmin aktif: upload PDF diizinkan.";
    return;
  }
  if (uploadSection) uploadSection.hidden = true;
}

if (form) {
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
}

filterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentFilter = {
    q: document.getElementById("q").value.trim(),
    language: (filterLanguageSelect.value || "").trim().toLowerCase()
  };
  await loadLibrary();
});

filterLanguageSelect.addEventListener("change", async () => {
  currentFilter.language = (filterLanguageSelect.value || "").trim().toLowerCase();
  await loadLibrary();
});

viewListBtn.addEventListener("click", () => setViewMode("list"));
viewGridBtn.addEventListener("click", () => setViewMode("grid"));
tabLibraryBtn.addEventListener("click", () => {
  setActiveTab("library");
  tabLibraryBtn.classList.add("active-toggle");
  tabBookmarkBtn.classList.remove("active-toggle");
  loadLibrary();
});
tabBookmarkBtn.addEventListener("click", () => {
  setActiveTab("bookmark");
  tabBookmarkBtn.classList.add("active-toggle");
  tabLibraryBtn.classList.remove("active-toggle");
  loadLibrary();
});
listEl.addEventListener("click", async (e) => {
  const bookmarkBtn = e.target.closest(".js-save-bookmark");
  if (bookmarkBtn) {
    e.preventDefault();
    await toggleBookmark(bookmarkBtn.getAttribute("data-book-id"));
    return;
  }
  const card = e.target.closest(".js-open-reader");
  if (card) window.location.href = `/perpustakaan/reader?id=${encodeURIComponent(card.getAttribute("data-book-id"))}`;
});

async function initLibraryPage() {
  setActiveTab(getInitialTab());
  if (activeTab === "bookmark") {
    tabBookmarkBtn.classList.add("active-toggle");
    tabLibraryBtn.classList.remove("active-toggle");
  } else {
    tabLibraryBtn.classList.add("active-toggle");
    tabBookmarkBtn.classList.remove("active-toggle");
  }
  await applyUploadAccess();
  setViewMode("grid");
  await loadBookmarks();
  await loadLibrary();
}

initLibraryPage();
