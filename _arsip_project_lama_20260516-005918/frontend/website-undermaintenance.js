(function () {
  const backCmsLink = document.getElementById("backCmsLink");
  const titleEl = document.getElementById("wmTitle");
  const msgEl = document.getElementById("wmMessage");
  const raw = localStorage.getItem("website_maintenance_draft");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (titleEl && data.title) titleEl.textContent = data.title;
      if (msgEl && data.message) msgEl.textContent = data.message;
    } catch {}
  }

  if (window.erpAuth?.getSession && backCmsLink) {
    window.erpAuth.getSession().then((s) => {
      const allowed = !!(s?.authenticated && s?.role === "superadmin");
      backCmsLink.hidden = !allowed;
    }).catch(() => {
      backCmsLink.hidden = true;
    });
  }

  const canvas = document.getElementById("dnaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let t = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function draw() {
    t += 0.02;
    ctx.clearRect(0, 0, w, h);

    const centerY = h * 0.5;
    const amp = Math.min(70, h * 0.12);
    const freq = 0.012;

    ctx.lineWidth = 1.2;
    for (let i = 0; i < 2; i += 1) {
      const phase = i === 0 ? 0 : Math.PI;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = centerY + Math.sin(x * freq + t + phase) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i === 0 ? "rgba(57,118,132,0.55)" : "rgba(37,211,102,0.35)";
      ctx.stroke();
    }

    for (let x = 0; x <= w; x += 32) {
      const y1 = centerY + Math.sin(x * freq + t) * amp;
      const y2 = centerY + Math.sin(x * freq + t + Math.PI) * amp;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();
