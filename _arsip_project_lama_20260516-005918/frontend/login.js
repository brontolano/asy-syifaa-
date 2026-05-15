const loginForm = document.getElementById("loginForm");
const authMsg = document.getElementById("authMsg");

async function boot() {
  const session = await window.erpAuth.getSession();
  if (session?.authenticated && session?.role === "superadmin") {
    window.location.replace("/");
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    await window.erpAuth.login(username, password);
    window.location.replace("/");
  } catch (err) {
    authMsg.textContent = err.message || "Login gagal";
  }
});

boot();
