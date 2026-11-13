/*
 * CONTEÚDO DO CURSO — fonte única para o menu lateral e para expansão.
 * Para ADICIONAR um tópico novo: acrescente um objeto em `capitulos` e crie a
 * <section id="..."> correspondente em pages/guia.html (ou uma página em pages/).
 * O menu lateral é montado automaticamente a partir desta lista.
 */
window.COURSE = {
  titulo: "Guia Linux Iniciante",
  subtitulo: "Do zero à cibersegurança, um comando por vez",

  // Cada capítulo vira um item no menu e aponta para um #id de seção (ou page url).
  capitulos: [
    { num: "01", id: "distro", titulo: "Qual distro escolher?", icone: "disc-3" },
    { num: "02", id: "install", titulo: "Como instalar (VM)", icone: "box" },
    { num: "03", id: "terminal-concepts", titulo: "Como funciona o Shell", icone: "square-terminal" },
    { num: "04", id: "commands", titulo: "Comandos 80/20", icone: "list" },
    { num: "05", id: "warnings", titulo: "Cuidados & Ética", icone: "shield-alert" },
    { num: "06", id: "tools", titulo: "Ferramentas de Pentest", icone: "wrench" },
    { num: "07", id: "roadmap", titulo: "Trilha de Aprendizado", icone: "map" },
  ],

  // Itens interativos extras do menu.
  interativo: [
    { id: "sandbox", titulo: "Terminal Simulador", icone: "terminal" },
  ],

  // Episódios da série ligados aos tópicos (aparência do canal).
  serie: {
    nome: "Rafa & Raven",
    nota: "Cada tópico aqui nasceu de um episódio da série.",
  },
};
