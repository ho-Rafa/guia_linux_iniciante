/*
 * Matriz de comandos 80/20 — dados + render + busca + filtro por categoria.
 * Para adicionar um comando: acrescente um objeto em COMMANDS_DATA.
 * Categorias (type): 'file' (arquivos), 'sys' (sistema), 'net' (rede).
 */
window.COMMANDS_DATA = [
  { cmd: "pwd", type: "file", desc: "Mostra onde você está na pasta atual", ex: "pwd" },
  { cmd: "ls / ls -la", type: "file", desc: "Lista arquivos e diretórios (mostra ocultos)", ex: "ls -la" },
  { cmd: "cd", type: "file", desc: "Muda de pasta atual", ex: "cd /home   cd ..   cd ~" },
  { cmd: "mkdir", type: "file", desc: "Cria uma nova pasta", ex: "mkdir lab" },
  { cmd: "touch", type: "file", desc: "Cria um arquivo vazio", ex: "touch nota.txt" },
  { cmd: "cat", type: "file", desc: "Mostra o conteúdo de um arquivo", ex: "cat /etc/os-release" },
  { cmd: "nano / vim", type: "file", desc: "Editores de texto no terminal", ex: "nano arquivo.txt" },
  { cmd: "cp / mv / rm", type: "file", desc: "Copiar / Mover / Apagar arquivos", ex: "rm -rf pasta" },
  { cmd: "sudo", type: "sys", desc: "Executa um comando como root (administrador)", ex: "sudo apt update" },
  { cmd: "apt update", type: "sys", desc: "Atualiza a lista de pacotes do repositório", ex: "sudo apt update" },
  { cmd: "apt install", type: "sys", desc: "Instala um programa novo", ex: "sudo apt install htop" },
  { cmd: "which / whereis", type: "sys", desc: "Localiza o caminho de um comando instalado", ex: "which nmap" },
  { cmd: "man", type: "sys", desc: "Abre o manual completo de qualquer comando", ex: "man ls" },
  { cmd: "history", type: "sys", desc: "Mostra o histórico dos últimos comandos rodados", ex: "history" },
  { cmd: "ip a / ip addr", type: "net", desc: "Mostra interfaces de rede e endereços IP", ex: "ip a" },
  { cmd: "ping", type: "net", desc: "Testa conectividade de rede com um alvo", ex: "ping 8.8.8.8" },
  { cmd: "ss -tuln", type: "net", desc: "Lista portas de rede abertas e escutando", ex: "ss -tuln" },
  { cmd: "arp-scan --localnet", type: "net", desc: "Descobre dispositivos ativos na rede local (EP09)", ex: "sudo arp-scan --localnet" },
  { cmd: "ip route", type: "net", desc: "Mostra a rota padrão — diagnóstico de internet (EP10)", ex: "ip route" },
];

(function () {
  var tbody = document.getElementById("command-tbody");
  var searchInput = document.getElementById("command-search");
  if (!tbody) return; // página sem a tabela

  function render(list) {
    tbody.innerHTML = "";
    list.forEach(function (item) {
      var tr = document.createElement("tr");
      tr.className = "hover:bg-darkbg-base/60 transition border-b border-darkbg-border/60";
      tr.innerHTML =
        '<td class="p-3.5 font-bold text-terminal font-mono whitespace-nowrap">' + item.cmd + "</td>" +
        '<td class="p-3.5 text-gray-300 font-sans">' + item.desc + "</td>" +
        '<td class="p-3.5 font-mono text-gray-400"><code>' + item.ex + "</code></td>" +
        '<td class="p-3.5 text-right">' +
        '<button onclick="copyText(\'' + item.ex.replace(/'/g, "\\'") + '\')" class="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800" title="Copiar">' +
        '<i data-lucide="copy" class="w-4 h-4"></i></button></td>';
      tbody.appendChild(tr);
    });
    if (window.lucide) lucide.createIcons();
  }

  render(window.COMMANDS_DATA);

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      var q = e.target.value.toLowerCase();
      render(window.COMMANDS_DATA.filter(function (c) {
        return c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.ex.toLowerCase().includes(q);
      }));
    });
  }

  window.filterCmds = function (type, btn) {
    document.querySelectorAll(".cmd-tag-btn").forEach(function (b) {
      b.classList.remove("bg-terminal/10", "text-terminal", "border-terminal/30");
      b.classList.add("bg-darkbg-base", "text-gray-400", "border-gray-800");
    });
    if (btn) {
      btn.classList.add("bg-terminal/10", "text-terminal", "border-terminal/30");
      btn.classList.remove("bg-darkbg-base", "text-gray-400", "border-gray-800");
    }
    if (type === "all") render(window.COMMANDS_DATA);
    else render(window.COMMANDS_DATA.filter(function (c) { return c.type === type; }));
  };
})();
