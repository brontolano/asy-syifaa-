const roleEl = document.getElementById("role");
const kpiGridEl = document.getElementById("kpiGrid");
const dashboardMsg = document.getElementById("dashboardMsg");
const dropZone = document.getElementById("dropZone");
const pdfInput = document.getElementById("pdfInput");
const pickPdfBtn = document.getElementById("pickPdfBtn");
const pendingListWrap = document.getElementById("pendingListWrap");
const pendingList = document.getElementById("pendingList");
const metaForm = document.getElementById("metaForm");
const metaTitle = document.getElementById("metaTitle");
const metaCategory = document.getElementById("metaCategory");
const metaTags = document.getElementById("metaTags");
const cmsMsg = document.getElementById("cmsMsg");
const searchInput = document.getElementById("searchInput");
const pageSizeSelect = document.getElementById("pageSizeSelect");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");
const bulkAction = document.getElementById("bulkAction");
const bulkApplyBtn = document.getElementById("bulkApplyBtn");
const checkAll = document.getElementById("checkAll");
const libraryRows = document.getElementById("libraryRows");
const cmsLibrarySection = document.getElementById("cmsLibrarySection");
const cmsTableSection = document.getElementById("cmsTableSection");
const dashboardLiteSection = document.getElementById("dashboardLiteSection");
const moduleStandaloneSection = document.getElementById("moduleStandaloneSection");
const moduleStandaloneTitle = document.getElementById("moduleStandaloneTitle");
const moduleStandaloneNote = document.getElementById("moduleStandaloneNote");

let selectedFiles = [];
let currentRows = [];
let pageSize = Number(pageSizeSelect?.value || 20);
let currentPage = 1;

function isPdfFile(file) {
  const name = (file?.name || "").toLowerCase();
  const type = (file?.type || "").toLowerCase();
  return type === "application/pdf" || name.endsWith(".pdf");
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function renderPendingFiles() {
  if (!pendingListWrap || !pendingList) return;
  if (!selectedFiles.length) {
    pendingListWrap.hidden = true;
    pendingList.innerHTML = "";
    return;
  }
  pendingListWrap.hidden = false;
  pendingList.innerHTML = "";
  selectedFiles.forEach((file, idx) => {
    const li = document.createElement("li");
    li.textContent = `${idx + 1}. ${file.name} (${formatBytes(file.size)})`;
    pendingList.appendChild(li);
  });
}

function syncActiveSidebar() {
  const currentModule = new URLSearchParams(window.location.search).get("module") || "dashboard";
  const links = Array.from(document.querySelectorAll(".dash-nav .dash-nav-item"));
  links.forEach((link) => {
    const url = new URL(link.href, window.location.origin);
    const linkModule = url.searchParams.get("module");
    const isActive = linkModule === currentModule;
    link.classList.toggle("active", isActive);
  });
}

function syncModuleLayout() {
  const currentModule = new URLSearchParams(window.location.search).get("module") || "dashboard";
  const isDashboard = currentModule === "dashboard";
  const isLibrary = currentModule === "perpustakaan";

  if (dashboardLiteSection) {
    dashboardLiteSection.hidden = !isDashboard;
    dashboardLiteSection.style.display = isDashboard ? "grid" : "none";
  }
  if (cmsLibrarySection) {
    cmsLibrarySection.hidden = !isLibrary;
    cmsLibrarySection.style.display = isLibrary ? "block" : "none";
  }
  if (cmsTableSection) {
    cmsTableSection.hidden = !isLibrary;
    cmsTableSection.style.display = isLibrary ? "block" : "none";
  }

  const isStandalone = !isDashboard && !isLibrary;
  if (moduleStandaloneSection) {
    moduleStandaloneSection.hidden = !isStandalone;
    moduleStandaloneSection.style.display = isStandalone ? "block" : "none";
  }
  if (isStandalone) {
    const label = currentModule
      .split("-")
      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
      .join(" ");
    if (moduleStandaloneTitle) moduleStandaloneTitle.textContent = `Panel ${label}`;
    if (moduleStandaloneNote) {
      moduleStandaloneNote.textContent = currentModule === "website"
        ? "Modul Website status Under Maintenance. Gunakan halaman khusus modul Website untuk status terbaru."
        : `Pengelolaan konten untuk modul ${label} disiapkan terpisah dari modul lain.`;
    }
  }
}

function emptyKpi() {
  kpiGridEl.innerHTML = "";
  [
    ["Total File", "-"],
    ["Draft", "-"],
    ["Publish", "-"],
    ["Pencarian", "-"]
  ].forEach(([label, value]) => {
    const card = document.createElement("article");
    card.className = "kpi dash-stat-card";
    card.innerHTML = `<h3>${label}</h3><p>${value}</p>`;
    kpiGridEl.appendChild(card);
  });
}

function selectedIds() {
  return Array.from(document.querySelectorAll(".row-check:checked")).map((el) => el.value);
}

async function fetchRows() {
  const q = (searchInput.value || "").trim();
  const resp = await fetch(`/api/library?q=${encodeURIComponent(q)}`);
  const data = await resp.json();
  currentRows = Array.isArray(data.data) ? data.data : [];
  renderRows();
}

function renderRows() {
  libraryRows.innerHTML = "";
  if (!currentRows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7">Belum ada file PDF.</td>`;
    libraryRows.appendChild(tr);
    if (pageInfo) pageInfo.textContent = "Halaman 1/1";
    if (prevPageBtn) prevPageBtn.disabled = true;
    if (nextPageBtn) nextPageBtn.disabled = true;
    return;
  }

  const totalPages = Math.max(1, Math.ceil(currentRows.length / pageSize));
  currentPage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = currentRows.slice(start, start + pageSize);

  pageRows.forEach((row, i) => {
    const tr = document.createElement("tr");
    const tags = Array.isArray(row.tags) ? row.tags.join(", ") : "";
    tr.innerHTML = `
      <td><input class="row-check" type="checkbox" value="${row.id}" /></td>
      <td>${start + i + 1}</td>
      <td>${row.title || row.originalName || "-"}</td>
      <td>${row.category || "-"}</td>
      <td>${tags || "-"}</td>
      <td><span class="status-pill ${row.status === "publish" ? "is-publish" : "is-draft"}">${row.status === "publish" ? "Publish" : "Draf"}</span></td>
      <td>
        <button class="btn ghost row-edit" data-id="${row.id}" type="button">Edit</button>
        <button class="btn ghost row-del" data-id="${row.id}" type="button">Hapus</button>
      </td>
    `;
    libraryRows.appendChild(tr);
  });

  if (pageInfo) pageInfo.textContent = `Halaman ${currentPage}/${totalPages}`;
  if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
}

async function uploadSelectedFiles() {
  if (!selectedFiles.length) {
    const fallbackFiles = Array.from(pdfInput?.files || []).filter((f) => isPdfFile(f));
    if (fallbackFiles.length) selectedFiles = fallbackFiles;
  }

  if (!selectedFiles.length) {
    cmsMsg.textContent = "Pilih file PDF terlebih dahulu.";
    return;
  }

  cmsMsg.textContent = "Sedang upload...";
  for (const file of selectedFiles) {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", metaTitle.value.trim());
    formData.append("category", metaCategory.value.trim());
    formData.append("tags", metaTags.value.trim());
    const resp = await fetch("/api/library/upload", { method: "POST", body: formData });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.message || "Upload gagal");
  }

  selectedFiles = [];
  pdfInput.value = "";
  metaForm.reset();
  renderPendingFiles();
}

dropZone.addEventListener("click", () => pdfInput.click());
pickPdfBtn.addEventListener("click", () => pdfInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const files = Array.from(e.dataTransfer.files || []).filter((f) => isPdfFile(f));
  selectedFiles = files;
  cmsMsg.textContent = files.length ? `${files.length} file siap diupload.` : "File tidak valid. Gunakan file PDF.";
  renderPendingFiles();
});

pdfInput.addEventListener("change", () => {
  selectedFiles = Array.from(pdfInput.files || []).filter((f) => isPdfFile(f));
  cmsMsg.textContent = selectedFiles.length ? `${selectedFiles.length} file siap diupload.` : "File tidak valid. Gunakan file PDF.";
  renderPendingFiles();
});

metaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = metaForm.querySelector("button[type='submit']");
  if (submitBtn) submitBtn.disabled = true;
  try {
    await uploadSelectedFiles();
    cmsMsg.textContent = "Upload berhasil.";
    await fetchRows();
  } catch (err) {
    cmsMsg.textContent = err.message;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchInput._t);
  searchInput._t = setTimeout(() => {
    currentPage = 1;
    fetchRows();
  }, 260);
});

if (pageSizeSelect) {
  pageSizeSelect.addEventListener("change", () => {
    pageSize = Number(pageSizeSelect.value || 20);
    currentPage = 1;
    renderRows();
  });
}

if (prevPageBtn) {
  prevPageBtn.addEventListener("click", () => {
    currentPage = Math.max(1, currentPage - 1);
    renderRows();
  });
}

if (nextPageBtn) {
  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(currentRows.length / pageSize));
    currentPage = Math.min(totalPages, currentPage + 1);
    renderRows();
  });
}

checkAll.addEventListener("change", () => {
  document.querySelectorAll(".row-check").forEach((el) => {
    el.checked = checkAll.checked;
  });
});

bulkApplyBtn.addEventListener("click", async () => {
  const action = bulkAction.value;
  const ids = selectedIds();
  if (!action || !ids.length) {
    cmsMsg.textContent = "Pilih bulk action dan checklist minimal satu file.";
    return;
  }

  const resp = await fetch("/api/library/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ids })
  });
  const data = await resp.json();
  if (!resp.ok) {
    cmsMsg.textContent = data.message || "Bulk action gagal.";
    return;
  }
  cmsMsg.textContent = "Bulk action berhasil.";
  checkAll.checked = false;
  bulkAction.value = "";
  currentPage = 1;
  await fetchRows();
});

libraryRows.addEventListener("click", async (e) => {
  const target = e.target;
  if (target.classList.contains("row-del")) {
    const id = target.dataset.id;
    const resp = await fetch(`/api/library/${id}`, { method: "DELETE" });
    const data = await resp.json();
    if (!resp.ok) {
      cmsMsg.textContent = data.message || "Gagal hapus file.";
      return;
    }
    cmsMsg.textContent = "File berhasil dihapus.";
    currentPage = 1;
    await fetchRows();
    return;
  }

  if (target.classList.contains("row-edit")) {
    const id = target.dataset.id;
    window.location.href = `/dashboard/perpustakaan/edit?id=${encodeURIComponent(id)}`;
  }
});

roleEl.addEventListener("change", () => {
  dashboardMsg.textContent = "";
});

emptyKpi();
syncActiveSidebar();
syncModuleLayout();
if ((new URLSearchParams(window.location.search).get("module") || "dashboard") === "perpustakaan") {
  fetchRows();
}
