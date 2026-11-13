/*
 * Portão de acesso por senha única (site estático).
 * - Em index.html: valida a senha digitada e libera o acesso.
 * - Nas páginas internas: redireciona pro index se não houver acesso liberado.
 * Observação: por ser estático, isto só evita acesso casual. Não é segurança real.
 */
(function () {
  var CFG = (window.SITE_CONFIG && window.SITE_CONFIG.acesso) || {};
  var KEY = "gli_access";

  async function sha256(text) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function salvarAcesso() {
    var exp = CFG.validadeHoras > 0 ? Date.now() + CFG.validadeHoras * 3600e3 : 0;
    try { localStorage.setItem(KEY, JSON.stringify({ ok: true, exp: exp })); } catch (e) {}
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }

  function temAcesso() {
    try {
      if (sessionStorage.getItem(KEY) === "1") return true;
      var raw = localStorage.getItem(KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      if (!d.ok) return false;
      if (d.exp && Date.now() > d.exp) { localStorage.removeItem(KEY); return false; }
      return true;
    } catch (e) { return false; }
  }

  // API pública
  window.Gate = {
    temAcesso: temAcesso,
    // Protege uma página interna: chame no topo. Redireciona se não liberado.
    proteger: function (caminhoIndex) {
      if (!temAcesso()) {
        var alvo = caminhoIndex || "../index.html";
        window.location.replace(alvo + "?redir=" + encodeURIComponent(location.pathname));
      }
    },
    sair: function () {
      try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
    },
    // Confere uma senha; se bater, libera o acesso. Retorna Promise<boolean>.
    tentar: async function (senha) {
      var hash = await sha256(senha || "");
      if (hash === CFG.senhaSha256) { salvarAcesso(); return true; }
      return false;
    },
    // Liga o formulário do portão (index.html)
    ligarFormulario: function (form, input, erroEl, destino) {
      var self = this;
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (await self.tentar(input.value)) {
          window.location.href = destino || "pages/guia.html";
        } else {
          if (erroEl) erroEl.classList.remove("hidden");
          input.value = "";
          input.classList.add("gate-shake");
          setTimeout(function () { input.classList.remove("gate-shake"); }, 400);
        }
      });
    },
  };
})();
