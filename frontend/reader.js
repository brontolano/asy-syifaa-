import * as pdfjsLib from "/vendor/pdfjs/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";

const canvasEl = document.getElementById("readerCanvas");
const stateEl = document.getElementById("readerState");

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

  const shell = document.querySelector(".reader-only-shell");
  const maxWidth = shell.clientWidth - 12;
  const maxHeight = shell.clientHeight - 12;

  const baseViewport = page.getViewport({ scale: 1 });
  const widthScale = maxWidth / baseViewport.width;
  const heightScale = maxHeight / baseViewport.height;
  const scale = Math.max(0.2, Math.min(widthScale, heightScale));
  const viewport = page.getViewport({ scale });

  canvasEl.width = viewport.width;
  canvasEl.height = viewport.height;
  const ctx = canvasEl.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;

  stateEl.textContent = `Page ${currentPage} / ${totalPages}`;
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

  stateEl.textContent = "Memuat PDF...";
  const loadingTask = pdfjsLib.getDocument(book.fileUrl);
  pdfDoc = await loadingTask.promise;
  totalPages = pdfDoc.numPages;
  await renderPage(1);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") renderPage(currentPage - 1);
  if (e.key === "ArrowRight") renderPage(currentPage + 1);
});

window.addEventListener("resize", () => renderPage(currentPage));

loadBook();
