/*
 * Terminal Simulador (sandbox) — comandos fictícios para praticar sem risco.
 * Para adicionar um comando novo: acrescente um case no switch de handle().
 */
(function () {
  var screen = document.getElementById("terminal-screen");
  var form = document.getElementById("terminal-form");
  var input = document.getElementById("terminal-input");
  if (!screen || !form || !input) return;

  var currentDir = "/home/kali";
  var mockFiles = ["nota.txt", "lab", "script.sh", "alvo.txt"];

  function line(text, isInput, isError) {
    var div = document.createElement("div");
    if (isInput) {
      div.className = "text-white font-mono flex gap-2";
      div.innerHTML = '<span class="text-terminal">kali@lab:' + currentDir + "$</span> <span></span>";
      div.lastChild.textContent = text;
    } else if (isError) {
      div.className = "text-red-400 font-mono whitespace-pre-wrap";
      div.textContent = text;
    } else {
      div.className = "text-gray-300 font-mono whitespace-pre-wrap";
      div.textContent = text;
    }
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
  }

  function handle(raw) {
    var parts = raw.split(" ");
    var cmd = parts[0].toLowerCase();
    var arg = parts[1];
    switch (cmd) {
      case "help":
        line("Comandos da sandbox:\n  pwd, ls, cd <pasta>, cat <arquivo>, whoami\n  sudo apt update, nmap, arp-scan, clear");
        break;
      case "pwd": line(currentDir); break;
      case "ls": line(mockFiles.join("  ")); break;
      case "whoami": line("kali"); break;
      case "clear": screen.innerHTML = ""; break;
      case "cd":
        if (!arg || arg === "~") currentDir = "/home/kali";
        else if (arg === "..") currentDir = "/home";
        else currentDir = "/home/kali/" + arg;
        break;
      case "cat":
        if (arg === "nota.txt") line("Segredo do hacking ético: persistência e curiosidade!");
        else if (arg === "alvo.txt") line("Target IP: 192.168.1.100");
        else line("cat: " + (arg || "arquivo") + ": Arquivo não encontrado", false, true);
        break;
      case "sudo":
        if (parts.slice(1).join(" ") === "apt update")
          line("Get:1 http://http.kali.org/kali kali-rolling InRelease [41.2 kB]\nReading package lists... Done!");
        else if (parts[1] === "arp-scan")
          line("Interface: wlan0\n192.168.1.1   roteador\n192.168.1.20  PC do Rafa\n192.168.1.37  nao reconhecido\n3 dispositivos ativos");
        else line("Comando sudo simulado.");
        break;
      case "arp-scan":
        line("Dica: rode com permissão de root -> sudo arp-scan --localnet", false, true);
        break;
      case "nmap":
        line("Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\nNmap done: 1 IP address scanned");
        break;
      default:
        line("bash: command not found: " + cmd, false, true);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = input.value.trim();
    if (!raw) return;
    line(raw, true);
    input.value = "";
    handle(raw);
  });
})();
