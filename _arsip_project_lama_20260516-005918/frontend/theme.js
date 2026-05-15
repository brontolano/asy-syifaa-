(function () {
  const KEY = "asy_syifaa_theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      const isDark = theme === "dark";
      btn.textContent = isDark ? "☀️" : "🌙";
      btn.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
      btn.setAttribute("title", isDark ? "Mode terang" : "Mode gelap");
    }
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getPreferredTheme());

    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

    btn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(KEY, next);
      applyTheme(next);
    });
  });
})();
