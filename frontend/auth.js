(function () {
  async function getSession() {
    const resp = await fetch("/api/auth/session");
    return resp.json();
  }

  async function login(username, password) {
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || "Login gagal");
    return data;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
  }

  window.erpAuth = { getSession, login, logout };
})();
