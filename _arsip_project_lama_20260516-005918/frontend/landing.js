const sessionInfo = document.getElementById("sessionInfo");

async function boot() {
  const s = await window.erpAuth.getSession();
  if (s?.authenticated && s?.role === "superadmin") {
    sessionInfo.textContent = `Login sebagai ${s.username}.`;
    return;
  }
  sessionInfo.textContent = "Mode publik aktif. Login staff melalui /login atau dashboard.asy-syifaa.com.";
}

boot();
