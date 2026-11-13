/*
 * Comportamentos compartilhados: sidebar, barra de progresso, reveal ao rolar,
 * copiar para a área de transferência (toast), scroll suave e ícones Lucide.
 * Todos os blocos checam a existência dos elementos, então o mesmo arquivo serve
 * para páginas diferentes (guia, fórum, etc.).
 */
(function () {
  // ---- Ícones Lucide ----
  function icons() { if (window.lucide) lucide.createIcons(); }
  window.addEventListener("load", icons);
  window.renderIcons = icons;

  // ---- Sidebar ----
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebar-backdrop");
  var toggleBtn = document.getElementById("toggle-sidebar-btn");
  var closeBtn = document.getElementById("close-sidebar-btn");
  window.openSidebar = function () {
    if (!sidebar) return;
    sidebar.classList.remove("-translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
  };
  window.closeSidebar = function () {
    if (!sidebar) return;
    sidebar.classList.add("-translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
  };
  if (toggleBtn) toggleBtn.addEventListener("click", window.openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", window.closeSidebar);
  if (backdrop) backdrop.addEventListener("click", window.closeSidebar);

  // ---- Scroll suave ----
  window.scrollToSection = function (id) {
    var sec = document.getElementById(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  };

  // ---- Barra de progresso ----
  var bar = document.getElementById("progress-bar");
  if (bar) {
    window.addEventListener("scroll", function () {
      var top = document.body.scrollTop || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (h > 0 ? (top / h) * 100 : 0) + "%";
    });
  }

  // ---- Reveal ao rolar ----
  var reveals = document.querySelectorAll(".reveal-section");
  if (reveals.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) en.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { obs.observe(el); });
  }

  // ---- Copiar + toast ----
  window.copyText = function (text) {
    navigator.clipboard.writeText(text).then(function () { toast("Copiado: " + text); });
  };
  window.toast = function (msg) {
    var t = document.createElement("div");
    t.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-lg bg-terminal text-black font-mono text-sm shadow-lg";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2000);
  };
})();
