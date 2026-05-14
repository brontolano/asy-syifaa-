const loginForm = document.getElementById("loginForm");
const authMsg = document.getElementById("authMsg");
const sessionInfo = document.getElementById("sessionInfo");
const logoutBtn = document.getElementById("logoutBtn");

async function refreshSession() {
  const s = await window.erpAuth.getSession();
  if (s.authenticated) {
    sessionInfo.textContent = `Login aktif: ${s.username} (${s.role})`;
    return;
  }
  sessionInfo.textContent = "Mode publik: hanya modul yang dibagikan publik yang bisa diakses.";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    await window.erpAuth.login(username, password);
    authMsg.textContent = "Login berhasil. Dashboard sekarang bisa diakses.";
    loginForm.reset();
    await refreshSession();
  } catch (err) {
    authMsg.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await window.erpAuth.logout();
  authMsg.textContent = "Logout berhasil.";
  await refreshSession();
});

refreshSession();
