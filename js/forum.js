/*
 * Fórum interno via Giscus (GitHub Discussions).
 * Monta os cartões de categoria (links para o Discussions) e injeta o widget Giscus.
 * Pré-requisito: instalar o app do Giscus no repositório -> https://github.com/apps/giscus
 */
(function () {
  var CFG = window.SITE_CONFIG || {};
  var G = CFG.giscus || {};

  // ---- Cartões de categoria ----
  var grid = document.getElementById("forum-categorias");
  if (grid && CFG.discussions) {
    CFG.discussions.categorias.forEach(function (c) {
      var a = document.createElement("a");
      a.href = CFG.discussions.base + "/categories/" + c.slug;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "forum-card bg-darkbg-card rounded-xl p-5 border border-darkbg-border flex items-start gap-4";
      a.innerHTML =
        '<div class="text-3xl">' + c.emoji + "</div>" +
        '<div><h3 class="font-mono font-bold text-white">' + c.nome + "</h3>" +
        '<p class="text-xs text-gray-400 mt-1 leading-relaxed">' + c.desc + "</p></div>";
      grid.appendChild(a);
    });
  }

  // ---- Widget Giscus ----
  var mount = document.getElementById("giscus-mount");
  if (mount && G.repoId) {
    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.setAttribute("data-repo", G.repo);
    s.setAttribute("data-repo-id", G.repoId);
    s.setAttribute("data-category", G.category);
    s.setAttribute("data-category-id", G.categoryId);
    s.setAttribute("data-mapping", G.mapping || "specific");
    if ((G.mapping || "specific") === "specific") s.setAttribute("data-term", G.term || "Mural da Comunidade");
    s.setAttribute("data-strict", "0");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", "top");
    s.setAttribute("data-theme", G.theme || "transparent_dark");
    s.setAttribute("data-lang", G.lang || "pt");
    s.crossOrigin = "anonymous";
    s.async = true;
    mount.appendChild(s);
  }
})();
