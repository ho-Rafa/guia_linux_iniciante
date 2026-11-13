/*
 * Configuração central do site — Guia Linux Iniciante (Rafa & Raven)
 * Edite este arquivo para mudar senha, Giscus e links. Nada aqui é secreto de verdade
 * (é um site estático), então o portão por senha apenas evita acesso casual.
 */
window.SITE_CONFIG = {
  // --- Identidade ---
  nome: "Guia Linux Iniciante",
  canal: "Rafa & Raven",
  youtube: "https://youtube.com/@rafaeraven", // TODO: troque pelo link real do canal

  // --- Portão de acesso (senha única) ---
  // Guarde o SHA-256 da senha, nunca a senha em texto. Para gerar um novo hash:
  //   node -e "console.log(require('crypto').createHash('sha256').update('SUA_SENHA').digest('hex'))"
  // Senha padrão atual: "rafa-raven"  (TROQUE antes de publicar!)
  acesso: {
    senhaSha256: "0ee98982eb98d8769873dbb20b0672abfe73e504a072592a365476216d984c44",
    // Quanto tempo o acesso fica liberado no navegador (em horas). 0 = só a sessão atual.
    validadeHoras: 72,
    dica: "A senha é revelada nos vídeos do canal e fixada na aba Comunidade do YouTube.",
  },

  // --- Fórum (Giscus / GitHub Discussions) ---
  // IDs já preenchidos para o repositório guia_linux_iniciante.
  // FALTA: instalar o app do Giscus no repositório -> https://github.com/apps/giscus
  giscus: {
    repo: "ho-Rafa/guia_linux_iniciante",
    repoId: "R_kgDOVsWx_g",
    category: "General",
    categoryId: "DIC_kwDOVsWx_s4DLDIb",
    mapping: "specific",
    term: "Mural da Comunidade",
    theme: "transparent_dark",
    lang: "pt",
  },

  // Link direto para as categorias do fórum completo (GitHub Discussions)
  discussions: {
    base: "https://github.com/ho-Rafa/guia_linux_iniciante/discussions",
    categorias: [
      { nome: "Dúvidas & Ajuda", slug: "q-a", emoji: "🙋", desc: "Travou num comando? Pergunte aqui." },
      { nome: "Ideias", slug: "ideas", emoji: "💡", desc: "Sugira tópicos e melhorias para o guia." },
      { nome: "Mostre seu lab", slug: "show-and-tell", emoji: "🧪", desc: "Compartilhe prints, scripts e descobertas." },
      { nome: "Geral", slug: "general", emoji: "💬", desc: "Papo livre da comunidade." },
    ],
  },
};
