const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const editInfo = document.getElementById("editInfo");
const editMsg = document.getElementById("editMsg");
const attrForm = document.getElementById("attrForm");
const replaceForm = document.getElementById("replaceForm");
const titleEl = document.getElementById("title");
const categoryEl = document.getElementById("category");
const tagsEl = document.getElementById("tags");
const statusEl = document.getElementById("status");
const pdfEl = document.getElementById("pdf");

if (!id) window.location.replace("/dashboard?module=perpustakaan");

async function loadDetail() {
  const resp = await fetch(`/api/library/${id}`);
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.message || "Gagal ambil detail.");
  editInfo.textContent = `File: ${data.originalName || "-"}`;
  titleEl.value = data.title || "";
  categoryEl.value = data.category || "";
  tagsEl.value = Array.isArray(data.tags) ? data.tags.join(", ") : "";
  statusEl.value = data.status || "draft";
}

attrForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    title: titleEl.value.trim(),
    category: categoryEl.value.trim(),
    tags: tagsEl.value.trim(),
    status: statusEl.value
  };
  const resp = await fetch(`/api/library/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  editMsg.textContent = resp.ok ? "Atribut berhasil diperbarui." : (data.message || "Gagal update atribut.");
});

replaceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!pdfEl.files?.length) return;
  const formData = new FormData();
  formData.append("pdf", pdfEl.files[0]);
  const resp = await fetch(`/api/library/${id}/replace`, { method: "POST", body: formData });
  const data = await resp.json();
  editMsg.textContent = resp.ok ? "File PDF berhasil diganti." : (data.message || "Gagal replace file.");
  if (resp.ok) {
    replaceForm.reset();
    await loadDetail();
  }
});

loadDetail().catch((err) => {
  editMsg.textContent = err.message;
});
