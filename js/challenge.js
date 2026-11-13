/*
 * Terminal de DESAFIO da tela inicial — "descubra a senha e faça login".
 * Mini-CTF de brincadeira, na própria senha do site (nada de terceiros).
 * Os COMANDOS são reais do Kali/Linux (help, ls, cat, john, whoami, clear, login);
 * as explicações ficam em português. Assim a pessoa já aprende o jeito certo.
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

  var HINTS = [
    "A senha de acesso é uma FRASE-SENHA fraca — de propósito! Você vai sentir",
    "na pele por que senha previsível é ruim (lembra do EP07?).",
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

  // "candidatos" testados pelo john (o último é a senha certa)
  var GUESSES = ["123456", "password", "admin", "qwerty", "futebol",
    "cavaloazul", "cavaloazultelhado", "cavaloazultelhadocafe"];

  function help() {
    line("Comandos disponíveis (reais do Linux):", "text-terminal");
    line("  help                     mostra esta ajuda");
    line("  whoami                   mostra o usuário atual");
    line("  ls [-a]                  lista arquivos (-a mostra os ocultos)");
    line("  cat <arquivo>            exibe um arquivo (ex.: cat hints.txt)");
    line("  john <arquivo>           quebra o hash com dicionário (John the Ripper)");
    line("  login <senha>            entra com a senha que você montou");
    line("  clear                    limpa a tela");
  }

  function johnRun(i) {
    if (i === 0) {
      line("Using default input encoding: UTF-8", "text-gray-500");
      line("Loaded 1 password hash (raw-SHA256 [SHA256 256/256])", "text-gray-500");
      line("Press 'q' or Ctrl-C to abort, almost any other key for status", "text-gray-500");
    }
    if (i >= GUESSES.length) { busy = false; return; }
    var w = GUESSES[i];
    var ok = i === GUESSES.length - 1;
    if (ok) {
      line(w + "  (?)", "text-terminal font-bold");
      line("1g 0:00:00:02 DONE (dicionário) — senha fraca, quebrou em segundos.", "text-gray-500");
      line("Use agora:  login " + w, "text-amber-light");
      busy = false;
    } else {
      line("trying: " + w, "text-gray-600");
      setTimeout(function () { johnRun(i + 1); }, 300);
    }
  }

  async function handle(raw) {
    var parts = raw.split(/\s+/).filter(Boolean);
    var cmd = (parts[0] || "").toLowerCase();
    var args = parts.slice(1);
    var arg = args.join(" ");
    switch (cmd) {
      case undefined:
      case "":
        break;
      case "help":
        help();
        break;
      case "whoami":
        line("root");
        break;
      case "pwd":
        line("/root/challenge");
        break;
      case "ls": {
        var showHidden = args.some(function (a) { return /^-.*a/.test(a); });
        if (showHidden) line(".  ..  .hash.sha256  hints.txt  vault");
        else line("hints.txt  vault");
        if (!showHidden) line("(dica: tem arquivo oculto. tente: ls -a)", "text-gray-600");
        break;
      }
      case "cat":
        if (arg === "hints.txt") HINTS.forEach(function (l) { line(l, l.indexOf(")") > -1 ? "text-amber-light" : "text-gray-300"); });
        else if (arg === ".hash.sha256") {
          line(HASH, "text-terminal");
          line("É o hash SHA-256 da senha. Hash é só de ida: não dá pra 'desfazer',", "text-gray-500");
          line("só TESTAR candidatos até um bater (igual ao handshake do EP06).", "text-gray-500");
          line("Para testar com um dicionário:  john .hash.sha256", "text-amber-light");
        } else if (arg === "vault/README" || arg === "vault/readme") {
          line("O cofre só abre com a frase-senha certa no login. :)");
        } else if (arg === "vault" || arg === "vault/") {
          line("cat: vault/: Is a directory", "text-red-400");
        } else if (!arg) {
          line("usage: cat <arquivo>", "text-red-400");
        } else {
          line("cat: " + arg + ": No such file or directory", "text-red-400");
        }
        break;
      case "john":
      case "hashcat":
        if (busy) return;
        busy = true;
        johnRun(0);
        break;
      case "clear":
        screen.innerHTML = "";
        break;
      case "login":
        if (!arg) { line("usage: login <senha>", "text-red-400"); break; }
        line("Checando acesso...", "text-gray-400");
        if (await window.Gate.tentar(arg)) {
          line("ACESSO LIBERADO! Bem-vindo(a), hacker ético. Entrando...", "text-terminal font-bold");
          setTimeout(function () { window.location.href = destino; }, 900);
        } else {
          line("Senha incorreta. Releia as pistas (cat hints.txt) ou rode: john .hash.sha256", "text-red-400");
        }
        break;
      default:
        line(cmd + ": command not found   (digite 'help')", "text-red-400");
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
  line("Guia Linux Iniciante — ACCESS CHALLENGE", "text-terminal font-bold");
  line("Sua missão: descobrir a frase-senha e fazer login.", "text-gray-300");
  line("Digite  help  para começar.", "text-amber-light");
})();
