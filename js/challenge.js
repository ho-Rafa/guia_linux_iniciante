/*
 * Terminal de DESAFIO da tela inicial — "descubra a senha e faça login".
 * É um mini-CTF de brincadeira, na própria senha do site (nada de terceiros):
 * dá pistas, mostra o hash e tem um "quebrador" simulado que revela a frase-senha,
 * amarrando com os episódios de senha fraca / handshake do Rafa & Raven.
 */
(function () {
  var screen = document.getElementById("chal-screen");
  var form = document.getElementById("chal-form");
  var input = document.getElementById("chal-input");
  if (!screen || !form || !input) return;

  var CFG = window.SITE_CONFIG || {};
  var HASH = (CFG.acesso && CFG.acesso.senhaSha256) || "???";
  var destino = "pages/guia.html";
  var busy = false;

  function line(text, cls) {
    var div = document.createElement("div");
    div.className = (cls || "text-gray-300") + " font-mono whitespace-pre-wrap";
    div.textContent = text;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
    return div;
  }
  function prompt(text) {
    var div = document.createElement("div");
    div.className = "text-white font-mono flex gap-2";
    div.innerHTML = '<span class="text-terminal">root@guia:~$</span> <span></span>';
    div.lastChild.textContent = text;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
  }

  var PISTAS = [
    "A senha de acesso é uma FRASE-SENHA fraca — de propósito! Você vai sentir na",
    "pele por que senha previsível é ruim (lembra do EP07?).",
    "",
    "Regras: 4 palavras comuns em português, tudo junto, minúsculas, SEM acento.",
    "Tema: uma cena do sertão do Rafa & Raven ao meio-dia.",
    "",
    "Pistas (junte as 4 palavras):",
    "  1) o animal de quatro patas que relincha",
    "  2) a cor do céu de meio-dia",
    "  3) a parte de cima da casa, feita de telhas",
    "  4) a bebida quente mais famosa do Brasil (sem acento)",
    "",
    "Montou? Rode:  login <suasenha>   (ou use a caixa de login ao lado)",
  ];

  var WORDLIST = ["123456", "senha", "admin", "qwerty", "futebol", "brasil", "raven",
    "cachorro", "cavaloazul", "cavalopreto", "cavaloazultelhado", "cavaloazultelhadocafe"];

  function help() {
    line("Comandos do desafio:", "text-terminal");
    line("  ajuda                 mostra esta ajuda");
    line("  ls                    lista os arquivos");
    line("  cat <arquivo>         abre um arquivo (ex.: cat pistas.txt)");
    line("  quebrar               roda um ataque de dicionário (simulado)");
    line("  login <senha>         tenta entrar com a senha que você montou");
    line("  dica                  uma ajudinha rápida");
    line("  limpar                limpa a tela");
  }

  function crackAnim(i) {
    if (i >= WORDLIST.length) { busy = false; return; }
    var w = WORDLIST[i];
    var ok = i === WORDLIST.length - 1;
    line((ok ? "[+] ACHOU  " : "[-] testando ") + w, ok ? "text-terminal font-bold" : "text-gray-500");
    if (ok) {
      line("", "");
      line("senha encontrada: " + w, "text-terminal font-bold");
      line("Era previsível — por isso quebrou rápido. Agora faça: login " + w, "text-amber-light");
      busy = false;
    } else {
      setTimeout(function () { crackAnim(i + 1); }, 320);
    }
  }

  async function handle(raw) {
    var parts = raw.split(/\s+/);
    var cmd = (parts[0] || "").toLowerCase();
    var arg = parts.slice(1).join(" ");
    switch (cmd) {
      case "":
        break;
      case "ajuda":
      case "help":
        help();
        break;
      case "ls":
      case "dir":
        line("pistas.txt   .senha.sha256   cofre/");
        break;
      case "cat":
        if (arg === "pistas.txt") PISTAS.forEach(function (l) { line(l, l.indexOf(")") > -1 ? "text-amber-light" : "text-gray-300"); });
        else if (arg === ".senha.sha256") {
          line(HASH, "text-terminal");
          line("É o hash SHA-256 da senha. Hash é só de ida: não dá pra 'desfazer',", "text-gray-500");
          line("só TESTAR candidatos até um bater (igual ao handshake do EP06).", "text-gray-500");
        } else if (arg === "cofre/README" || arg === "cofre/readme") {
          line("Vazio. O cofre só abre com a frase-senha certa no login. :)");
        } else if (arg === "cofre" || arg === "cofre/") {
          line("cat: cofre/: É um diretório. Tente: cat cofre/README", "text-red-400");
        } else {
          line("cat: " + (arg || "arquivo") + ": não encontrado", "text-red-400");
        }
        break;
      case "quebrar":
      case "john":
      case "hashcat":
        if (busy) return;
        busy = true;
        line("Rodando dicionário contra .senha.sha256 ...", "text-gray-400");
        setTimeout(function () { crackAnim(0); }, 300);
        break;
      case "dica":
        line("4 palavras: um ANIMAL + uma COR + parte da CASA + uma BEBIDA. Tudo junto, sem acento.", "text-amber-light");
        break;
      case "limpar":
      case "clear":
        screen.innerHTML = "";
        break;
      case "login":
        if (!arg) { line("uso: login <senha>", "text-red-400"); break; }
        line("Testando acesso...", "text-gray-400");
        if (await window.Gate.tentar(arg)) {
          line("ACESSO LIBERADO! Bem-vindo(a), hacker ético. Entrando...", "text-terminal font-bold");
          setTimeout(function () { window.location.href = destino; }, 900);
        } else {
          line("Senha incorreta. Releia as pistas (cat pistas.txt) ou rode: quebrar", "text-red-400");
        }
        break;
      default:
        line("comando não encontrado: " + cmd + "   (digite 'ajuda')", "text-red-400");
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = input.value.trim();
    prompt(raw);
    input.value = "";
    if (!busy) handle(raw);
  });

  // Intro
  line("Guia Linux Iniciante — DESAFIO DE ACESSO", "text-terminal font-bold");
  line("Sua missão: descobrir a frase-senha e fazer login.", "text-gray-300");
  line("Digite  ajuda  para começar.", "text-amber-light");
})();
