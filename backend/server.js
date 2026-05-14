const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "asy-syifaa-erp-mvp", modules: [0, 1] });
});

app.get("/api/dashboard/summary", (req, res) => {
  const role = (req.query.role || "ustadz").toString().toLowerCase();

  const base = {
    totalSantri: 1248,
    santriAktif: 1187,
    pembayaranBulanIni: 842,
    kelasAktif: 36
  };

  const byRole = {
    ustadz: ["Kehadiran Hari Ini", "Jadwal Mengajar", "Pengumuman Akademik"],
    mudiraam: ["Kontrol Operasional", "Approval Data", "Monitoring Keuangan"],
    abuya: ["Ringkasan Strategis", "KPI Pesantren", "Insight Bulanan"]
  };

  res.json({
    role,
    summary: base,
    widgets: byRole[role] || byRole.ustadz
  });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.get("/dashboard", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`ERP MVP berjalan di http://localhost:${PORT}`);
});
