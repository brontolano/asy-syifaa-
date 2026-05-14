import * as pdfjsLib from "/vendor/pdfjs/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";

export class ReaderDetailController {
  constructor() {
    this.canvasEl = document.getElementById("readerCanvas");
    this.stateEl = document.getElementById("readerState");
    this.prevPageBtn = document.getElementById("prevPageBtn");
    this.nextPageBtn = document.getElementById("nextPageBtn");
    this.pageInput = document.getElementById("pageInput");
    this.pageTotalEl = document.getElementById("pageTotal");
    this.zoomOutBtn = document.getElementById("zoomOutBtn");
    this.zoomInBtn = document.getElementById("zoomInBtn");
    this.fitToggleBtn = document.getElementById("fitToggleBtn");
    this.readerShell = document.getElementById("readerShell");
    this.readerBookTitleEl = document.getElementById("readerBookTitle");
    this.readerBookInfoEl = document.getElementById("readerBookInfo");

    this.pdfDoc = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.zoomLevel = 1;
    this.MIN_ZOOM = 0.6;
    this.MAX_ZOOM = 2.5;
    this.ZOOM_STEP = 0.2;
    this.fitMode = "width";
    this.touchStartX = null;
    this.RPLayout = { mobileWidth: 768 };
  }

  get isMobile() {
    return window.innerWidth <= this.RPLayout.mobileWidth;
  }

  get activeFitMode() {
    return this.isMobile ? "width" : this.fitMode;
  }

  fitLabel() {
    return this.activeFitMode === "width" ? "Fit Width" : "Fit Height";
  }

  getParam(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  async renderPage(pageNum) {
    if (!this.pdfDoc) return;
    this.currentPage = Math.max(1, Math.min(pageNum, this.totalPages));
    const page = await this.pdfDoc.getPage(this.currentPage);

    const maxWidth = this.readerShell.clientWidth - 12;
    const maxHeight = this.readerShell.clientHeight - 12;
    const baseViewport = page.getViewport({ scale: 1 });
    const widthScale = maxWidth / baseViewport.width;
    const heightScale = maxHeight / baseViewport.height;
    const fitScale = this.activeFitMode === "height" ? Math.max(0.2, heightScale) : Math.max(0.2, widthScale);
    const scale = fitScale * this.zoomLevel;
    const viewport = page.getViewport({ scale });

    this.canvasEl.width = viewport.width;
    this.canvasEl.height = viewport.height;
    const ctx = this.canvasEl.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;

    this.pageInput.value = String(this.currentPage);
    this.pageTotalEl.textContent = `/ ${this.totalPages}`;
    this.stateEl.textContent = `Page ${this.currentPage} / ${this.totalPages} • Zoom ${Math.round(this.zoomLevel * 100)}% • ${this.fitLabel()}`;
    this.prevPageBtn.disabled = this.currentPage <= 1;
    this.nextPageBtn.disabled = this.currentPage >= this.totalPages;
    this.fitToggleBtn.textContent = this.fitLabel();
  }

  async loadBook() {
    const id = this.getParam("id");
    if (!id) {
      this.stateEl.textContent = "ID buku tidak ditemukan.";
      this.readerBookTitleEl.textContent = "Buku tidak ditemukan";
      this.readerBookInfoEl.textContent = "Pastikan tautan detail buku valid.";
      return;
    }

    try {
      const resp = await fetch("/api/perpustakaan/books");
      const data = await resp.json();
      const book = (data.data || []).find((v) => v.id === id);
      if (!book) {
        this.stateEl.textContent = "Buku tidak ditemukan.";
        this.readerBookTitleEl.textContent = "Buku tidak ditemukan";
        this.readerBookInfoEl.textContent = "Kemungkinan data sudah dihapus atau ID tidak cocok.";
        return;
      }

      this.readerBookTitleEl.textContent = book.title || "Tanpa Judul";
      this.readerBookInfoEl.textContent = `${book.author || "-"} • ${book.category || "-"} • ${book.language || "id"}`;
      this.stateEl.textContent = "Memuat PDF...";
      const loadingTask = pdfjsLib.getDocument(book.fileUrl);
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.pageInput.max = String(this.totalPages);
      await this.renderPage(1);
    } catch (_err) {
      this.stateEl.textContent = "Gagal memuat dokumen PDF.";
      this.readerBookTitleEl.textContent = "Terjadi kesalahan";
      this.readerBookInfoEl.textContent = "Coba refresh halaman atau pilih buku lain.";
    }
  }

  bindEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.renderPage(this.currentPage - 1);
      if (e.key === "ArrowRight") this.renderPage(this.currentPage + 1);
    });

    window.addEventListener("resize", () => this.renderPage(this.currentPage));
    this.prevPageBtn.addEventListener("click", () => this.renderPage(this.currentPage - 1));
    this.nextPageBtn.addEventListener("click", () => this.renderPage(this.currentPage + 1));
    this.pageInput.addEventListener("change", () => this.renderPage(Number(this.pageInput.value || 1)));
    this.zoomOutBtn.addEventListener("click", () => {
      this.zoomLevel = Math.max(this.MIN_ZOOM, Number((this.zoomLevel - this.ZOOM_STEP).toFixed(2)));
      this.renderPage(this.currentPage);
    });
    this.zoomInBtn.addEventListener("click", () => {
      this.zoomLevel = Math.min(this.MAX_ZOOM, Number((this.zoomLevel + this.ZOOM_STEP).toFixed(2)));
      this.renderPage(this.currentPage);
    });
    this.fitToggleBtn.addEventListener("click", () => {
      this.fitMode = this.fitMode === "width" ? "height" : "width";
      this.renderPage(this.currentPage);
    });

    this.readerShell.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.readerShell.addEventListener("touchend", (e) => {
      if (this.touchStartX === null || !e.changedTouches || e.changedTouches.length !== 1) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - this.touchStartX;
      this.touchStartX = null;
      if (Math.abs(delta) < 50) return;
      if (delta < 0) this.renderPage(this.currentPage + 1);
      if (delta > 0) this.renderPage(this.currentPage - 1);
    }, { passive: true });
  }

  async init() {
    this.bindEvents();
    await this.loadBook();
  }
}
