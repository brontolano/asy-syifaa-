import * as pdfjsLib from "/vendor/pdfjs/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";

const titleEl = document.getElementById("readerTitle");
const metaEl = document.getElementById("readerMeta");
const canvasEl = document.getElementById("readerCanvas");
const stateEl = document.getElementById("readerState");
const formEl = document.getElementById("readerBookmarkForm");
const msgEl = document.getElementById("readerMsg");
const prevBtn = document.getElementById("prevPageBtn");
const nextBtn = document.getElementById("nextPageBtn");
const gotoInput = document.getElementById("gotoPageInput");
const gotoBtn = document.getElementById("gotoPageBtn");
const pageInfo = document.getElementById("pageInfo");

let currentBook = null;
let pdfDoc = null;
let currentPage = 1;
let totalPages = 1;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

async function renderPage(pageNum) {
  if (!pdfDoc) return;
  currentPage = Math.max(1, Math.min(pageNum, totalPages));
  const page = await pdfDoc.getPage(currentPage);
  const base = page.getViewport({ scale: 1 });
  const maxWidth = document.querySelector(".reader-shell").clientWidth - 8;
  const scale = Math.min(2, maxWidth / base.width);
  const viewport = page.getViewport({ scale });

  canvasEl.width = viewport.width;
  canvasEl.height = viewport.height;
  const ctx = canvasEl.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;

  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
  gotoInput.value = String(currentPage);
  document.getElementById("readerPage").value = String(currentPage);
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

async function loadBook() {
  const id = getParam("id");
  if (!id) {
    stateEl.textContent = "ID buku tidak ditemukan.";
    return;
  }

  const resp = await fetch(`/api/perpustakaan/books`);
  const data = await resp.json();
  const book = (data.data || []).find((v) => v.id === id);
  if (!book) {
    stateEl.textContent = "Buku tidak ditemukan.";
    return;
  }

  currentBook = book;
  titleEl.textContent = book.title || "Reader PDF";
  metaEl.textContent = `Penulis: ${book.author || "-"} | Kategori: ${book.category || "-"}`;
  stateEl.textContent = "Memuat PDF...";

  const loadingTask = pdfjsLib.getDocument(book.fileUrl);
  pdfDoc = await loadingTask.promise;
  totalPages = pdfDoc.numPages;
  stateEl.textContent = "";
  await renderPage(1);
}

prevBtn.addEventListener("click", () => renderPage(currentPage - 1));
nextBtn.addEventListener("click", () => renderPage(currentPage + 1));
gotoBtn.addEventListener("click", () => renderPage(Number(gotoInput.value || 1)));
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") renderPage(currentPage - 1);
  if (e.key === "ArrowRight") renderPage(currentPage + 1);
});
window.addEventListener("resize", () => renderPage(currentPage));

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = getParam("id");
  const page = Number(document.getElementById("readerPage").value);
  const note = document.getElementById("readerNote").value.trim();
  const resp = await fetch("/api/perpustakaan/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId: id, page, note })
  });
  const data = await resp.json();
  if (!resp.ok) {
    msgEl.textContent = data.message || "Gagal simpan bookmark.";
    return;
  }
  msgEl.textContent = `Bookmark tersimpan di halaman ${data.page}`;
});

loadBook();
