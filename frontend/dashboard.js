const roleEl = document.getElementById("role");
const kpiGridEl = document.getElementById("kpiGrid");
const widgetListEl = document.getElementById("widgetList");
const dashboardMsg = document.getElementById("dashboardMsg");

function toKpis(summary) {
  return [
    ["Total Santri", summary.totalSantri],
    ["Santri Aktif", summary.santriAktif],
    ["Pembayaran Bulan Ini", summary.pembayaranBulanIni],
    ["Kelas Aktif", summary.kelasAktif]
  ];
}

async function loadDashboard(role) {
  const resp = await fetch(`/api/dashboard/summary?role=${role}`);
  const data = await resp.json();

  if (!resp.ok) {
    dashboardMsg.textContent = data.message || "Akses ditolak.";
    kpiGridEl.innerHTML = "";
    widgetListEl.innerHTML = "";
    return;
  }

  dashboardMsg.textContent = "Akses superadmin aktif.";
  kpiGridEl.innerHTML = "";
  toKpis(data.summary).forEach(([label, value]) => {
    const card = document.createElement("article");
    card.className = "kpi";
    card.innerHTML = `<h3>${label}</h3><p>${value}</p>`;
    kpiGridEl.appendChild(card);
  });

  widgetListEl.innerHTML = "";
  data.widgets.forEach((w) => {
    const li = document.createElement("li");
    li.textContent = w;
    widgetListEl.appendChild(li);
  });
}

roleEl.addEventListener("change", () => loadDashboard(roleEl.value));
loadDashboard(roleEl.value);
