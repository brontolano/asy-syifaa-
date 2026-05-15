const pfName = document.getElementById("pfName");
const pfRole = document.getElementById("pfRole");
const pfStatus = document.getElementById("pfStatus");
const pfMsg = document.getElementById("pfMsg");
const logoutBtn = document.getElementById("logoutBtn");

async function boot() {
  const session = await window.erpAuth.getSession();
  if (!session?.authenticated) {
    window.location.replace("/login");
    return;
  }

  pfName.textContent = session.username || "-";
  pfRole.textContent = session.role || "-";
  pfStatus.textContent = "Aktif";
  pfMsg.textContent = session.role === "superadmin"
    ? "Akses penuh untuk modul internal ERP."
    : "Akses terbatas sesuai role.";
}

logoutBtn.addEventListener("click", async () => {
  await window.erpAuth.logout();
  window.location.replace("/login");
});

boot();
