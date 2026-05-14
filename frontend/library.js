const form = document.getElementById("uploadForm");
const msgEl = document.getElementById("uploadMsg");
const listEl = document.getElementById("libraryList");
const uploadSection = document.getElementById("uploadSection");
const lockedSection = document.getElementById("lockedSection");

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function row(item) {
  const uploaded = new Date(item.uploadedAt).toLocaleString("id-ID");
  return `
    <article class="library-item">
      <div>
        <h3>${item.title}</h3>
        <p>${item.originalName}</p>
        <p>${formatBytes(item.fileSize)} • ${uploaded}</p>
      </div>
      <div class="actions">
        <a class="btn ghost" href="${item.fileUrl}" target="_blank" rel="noreferrer">Buka PDF</a>
      </div>
    </article>
  `;
}

async function loadLibrary() {
  const resp = await fetch("/api/library");
  const data = await resp.json();

  if (!data.data.length) {
    listEl.innerHTML = "<p class='note'>Belum ada PDF diunggah.</p>";
    return;
  }

  listEl.innerHTML = data.data.map(row).join("");
}

async function applyUploadAccess() {
  const s = await window.erpAuth.getSession();
  if (s.authenticated && s.role === "superadmin") {
    uploadSection.hidden = false;
    lockedSection.hidden = true;
    msgEl.textContent = "Mode superadmin aktif: upload PDF diizinkan.";
    return;
  }
  uploadSection.hidden = true;
  lockedSection.hidden = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const pdf = document.getElementById("pdf").files[0];

  if (!pdf) {
    msgEl.textContent = "Pilih file PDF dulu.";
    return;
  }

  const body = new FormData();
  body.append("title", title);
  body.append("pdf", pdf);

  msgEl.textContent = "Sedang upload...";

  const resp = await fetch("/api/library/upload", { method: "POST", body });
  const data = await resp.json();

  if (!resp.ok) {
    msgEl.textContent = data.message || "Upload gagal.";
    return;
  }

  msgEl.textContent = `Upload berhasil: ${data.title}`;
  form.reset();
  await loadLibrary();
});

applyUploadAccess();
loadLibrary();
