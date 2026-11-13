/*
 * Raven que segue o mouse — estilo "oneko", feito do zero (HTML/CSS/JS).
 * Usa a folha de sprites vetorial assets/svg/raven-sprite.svg (gerada por
 * scripts/build-raven-sprite.mjs). Voa atrás do cursor, vira para 8 direções,
 * fica parado quando o mouse para e "dorme" após um tempo. Não esconde o cursor
 * e não bloqueia cliques (pointer-events: none). Tem botão para ligar/desligar.
 */
(function () {
  // Desliga em telas de toque ou quando o usuário prefere menos animação.
  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SIZE = 52;          // tamanho exibido do Raven (px)
  var CELL = 64;          // tamanho da célula na folha
  var COLS = 8;           // direções por linha
  var SPEED = 0.16;       // suavidade da perseguição (lerp)
  var FLAP_MS = 140;      // troca de frame da asa
  var IDLE_MS = 5000;     // tempo parado até dormir
  var KEY = "gli_raven_on";

  // Ordem das colunas na linha de voo: E, SE, S, SW, W, NW, N, NE  (ângulos 0..315)
  function dirCol(deg) {
    var a = ((deg % 360) + 360) % 360;
    return Math.round(a / 45) % COLS;
  }

  var el, raf, running = false;
  // Começa fora da tela (topo): o Raven "voa pra dentro" no primeiro movimento do mouse.
  var mouseX = window.innerWidth / 2, mouseY = -80;
  var x = mouseX, y = mouseY;
  var lastMove = Date.now();
  var flapOn = false, lastFlap = 0, alertUntil = 0;

  function setCell(col, row) {
    el.style.backgroundPosition = -(col * SIZE) + "px " + -(row * SIZE) + "px";
  }

  function onMove(e) {
    var p = e.touches ? e.touches[0] : e;
    mouseX = p.clientX;
    mouseY = p.clientY;
    if (Date.now() - lastMove > IDLE_MS) alertUntil = Date.now() + 350; // acordou
    lastMove = Date.now();
  }

  function frame(now) {
    var dx = mouseX - x, dy = mouseY - y;
    var dist = Math.hypot(dx, dy);

    if (now < alertUntil) {
      setCell(1, 2); // alerta
    } else if (dist < 12) {
      // parado: idle ou dormindo
      if (Date.now() - lastMove > IDLE_MS) {
        setCell(Math.floor(now / 600) % 2 === 0 ? 2 : 3, 2); // sono A/B
      } else {
        setCell(0, 2); // pousado
      }
    } else {
      // voando: move e escolhe a direção
      x += dx * SPEED;
      y += dy * SPEED;
      if (now - lastFlap > FLAP_MS) { flapOn = !flapOn; lastFlap = now; }
      setCell(dirCol(Math.atan2(dy, dx) * 180 / Math.PI), flapOn ? 1 : 0);
    }

    el.style.transform = "translate(" + (x - SIZE / 2) + "px," + (y - SIZE / 2) + "px)";
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    if (!el) {
      var base = window.__RAVEN_BASE__ || "";
      el = document.createElement("div");
      el.id = "raven-follow";
      el.setAttribute("aria-hidden", "true");
      el.style.width = SIZE + "px";
      el.style.height = SIZE + "px";
      el.style.backgroundImage = "url('" + base + "assets/svg/raven-sprite.svg')";
      el.style.backgroundSize = (COLS * SIZE) + "px " + (3 * SIZE) + "px";
      document.body.appendChild(el);
    }
    el.style.display = "block";
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    updateBtn();
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    if (el) el.style.display = "none";
    try { localStorage.setItem(KEY, "0"); } catch (e) {}
    updateBtn();
  }

  var btn;
  function updateBtn() {
    if (!btn) return;
    btn.title = running ? "Desligar o Raven" : "Ligar o Raven";
    btn.classList.toggle("raven-on", running);
  }

  function addToggle() {
    btn = document.createElement("button");
    btn.id = "raven-toggle";
    btn.type = "button";
    btn.innerHTML = '<img src="' + (window.__RAVEN_BASE__ || "") + 'assets/svg/raven.svg" alt="" width="22" height="22">';
    btn.addEventListener("click", function () { running ? stop() : start(); });
    document.body.appendChild(btn);
    updateBtn();
  }

  // Preferência salva (padrão: ligado), respeitando acessibilidade.
  window.RavenFollow = { start: start, stop: stop };
  document.addEventListener("DOMContentLoaded", function () {
    addToggle();
    var saved;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var ligar = saved === null ? !(coarse || reduce) : saved === "1";
    if (ligar && !coarse) start(); else updateBtn();
  });
})();
