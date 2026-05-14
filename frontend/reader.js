import * as pdfjsLib from "/vendor/pdfjs/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";

const canvasEl = document.getElementById("readerCanvas");
const stateEl = document.getElementById("readerState");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInput = document.getElementById("pageInput");
const pageTotalEl = document.getElementById("pageTotal");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const fitToggleBtn = document.getElementById("fitToggleBtn");
const readerShell = document.getElementById("readerShell");
const readerBookTitleEl = document.getElementById("readerBookTitle");
const readerBookInfoEl = document.getElementById("readerBookInfo");

let pdfDoc = null;
let currentPage = 1;
let totalPages = 1;
let zoomLevel = 1;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;
let fitMode = "width";
let touchStartX = null;
const RPLayout = {
  mobileWidth: 768,
  get isMobile() {
    return window.innerWidth <= this.mobileWidth;
  },
  get fitMode() {
    return this.isMobile ? "width" : fitMode;
  },
  label() {
    return this.fitMode === "width" ? "Fit Width" : "Fit Height";
  }
};

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

async function renderPage(pageNum) {
  if (!pdfDoc) return;
  currentPage = Math.max(1, Math.min(pageNum, totalPages));
  const page = await pdfDoc.getPage(currentPage);

  const maxWidth = readerShell.clientWidth - 12;
  const maxHeight = readerShell.clientHeight - 12;

  const baseViewport = page.getViewport({ scale: 1 });
  const widthScale = maxWidth / baseViewport.width;
  const heightScale = maxHeight / baseViewport.height;
  const targetFitMode = RPLayout.fitMode;
  const fitScale = targetFitMode === "height"
    ? Math.max(0.2, heightScale)
    : Math.max(0.2, widthScale);
  const scale = fitScale * zoomLevel;
  const viewport = page.getViewport({ scale });

  canvasEl.width = viewport.width;
  canvasEl.height = viewport.height;
  const ctx = canvasEl.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;

  pageInput.value = String(currentPage);
  pageTotalEl.textContent = `/ ${totalPages}`;
  stateEl.textContent = `Page ${currentPage} / ${totalPages} • Zoom ${Math.round(zoomLevel * 100)}% • ${targetFitMode === "width" ? "Fit Width" : "Fit Height"}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
  fitToggleBtn.textContent = RPLayout.label();
}

async function loadBook() {
  const id = getParam("id");
  if (!id) {
    stateEl.textContent = "ID buku tidak ditemukan.";
    readerBookTitleEl.textContent = "Buku tidak ditemukan";
    readerBookInfoEl.textContent = "Pastikan tautan detail buku valid.";
    return;
  }

  try {
    const resp = await fetch(`/api/perpustakaan/books`);
    const data = await resp.json();
    const book = (data.data || []).find((v) => v.id === id);
    if (!book) {
      stateEl.textContent = "Buku tidak ditemukan.";
      readerBookTitleEl.textContent = "Buku tidak ditemukan";
      readerBookInfoEl.textContent = "Kemungkinan data sudah dihapus atau ID tidak cocok.";
      return;
    }

    readerBookTitleEl.textContent = book.title || "Tanpa Judul";
    readerBookInfoEl.textContent = `${book.author || "-"} • ${book.category || "-"} • ${book.language || "id"}`;
    stateEl.textContent = "Memuat PDF...";
    const loadingTask = pdfjsLib.getDocument(book.fileUrl);
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;
    pageInput.max = String(totalPages);
    await renderPage(1);
  } catch (_err) {
    stateEl.textContent = "Gagal memuat dokumen PDF.";
    readerBookTitleEl.textContent = "Terjadi kesalahan";
    readerBookInfoEl.textContent = "Coba refresh halaman atau pilih buku lain.";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") renderPage(currentPage - 1);
  if (e.key === "ArrowRight") renderPage(currentPage + 1);
});

window.addEventListener("resize", () => renderPage(currentPage));

prevPageBtn.addEventListener("click", () => renderPage(currentPage - 1));
nextPageBtn.addEventListener("click", () => renderPage(currentPage + 1));
pageInput.addEventListener("change", () => renderPage(Number(pageInput.value || 1)));
zoomOutBtn.addEventListener("click", () => {
  zoomLevel = Math.max(MIN_ZOOM, Number((zoomLevel - ZOOM_STEP).toFixed(2)));
  renderPage(currentPage);
});
zoomInBtn.addEventListener("click", () => {
  zoomLevel = Math.min(MAX_ZOOM, Number((zoomLevel + ZOOM_STEP).toFixed(2)));
  renderPage(currentPage);
});
fitToggleBtn.addEventListener("click", () => {
  fitMode = fitMode === "width" ? "height" : "width";
  renderPage(currentPage);
});

readerShell.addEventListener("touchstart", (e) => {
  if (!e.touches || e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

readerShell.addEventListener("touchend", (e) => {
  if (touchStartX === null || !e.changedTouches || e.changedTouches.length !== 1) return;
  const endX = e.changedTouches[0].clientX;
  const delta = endX - touchStartX;
  touchStartX = null;
  if (Math.abs(delta) < 50) return;
  if (delta < 0) renderPage(currentPage + 1);
  if (delta > 0) renderPage(currentPage - 1);
}, { passive: true });

loadBook();
