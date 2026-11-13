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
  var SPEED = 0.10;       // o Raven é MAIS LENTO que o mouse (menor = mais lento)
  var FLAP_MS = 220;      // troca de frame da asa (maior = batida mais calma)
  var SLEEP_MS = 6000;    // tempo pousado até começar a dormir
  var STOP_R = 16;        // chega bem perto do ponto ao lado antes de pousar
  var WAKE_R = 60;        // o mouse se afastou tanto que ele volta a voar (histerese)
  var PARK = { x: -30, y: -4 }; // pousa AO LADO do ponteiro, não em cima
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
  var flying = false, parkedAt = 0, lastMove = 0;
  var flapOn = false, lastFlap = 0, alertUntil = 0;

  function setCell(col, row) {
    el.style.backgroundPosition = -(col * SIZE) + "px " + -(row * SIZE) + "px";
  }

  function onMove(e) {
    var p = e.touches ? e.touches[0] : e;
    mouseX = p.clientX;
    mouseY = p.clientY;
    lastMove = Date.now();
  }

  function frame(now) {
    // alvo = AO LADO do ponteiro (não em cima dele)
    var tx = mouseX + PARK.x, ty = mouseY + PARK.y;
    var dx = tx - x, dy = ty - y;
    var dist = Math.hypot(dx, dy);
    var mouseStill = now - lastMove > 120;

    if (flying) {
      // voa atrás, sempre mais devagar que o mouse
      x += dx * SPEED;
      y += dy * SPEED;
      // só POUSA quando chega perto E o mouse está parado -> para ao lado do ponteiro
      if (dist < STOP_R && mouseStill) { flying = false; parkedAt = now; }
      if (now < alertUntil) {
        setCell(1, 2); // susto ao acordar
      } else {
        if (now - lastFlap > FLAP_MS) { flapOn = !flapOn; lastFlap = now; }
        setCell(dirCol(Math.atan2(dy, dx) * 180 / Math.PI), flapOn ? 1 : 0);
      }
    } else {
      // pousado ao lado do mouse
      if (dist > WAKE_R) {
        // o mouse foi embora -> volta a voar (acorda assustado se estava dormindo)
        flying = true;
        if (now - parkedAt > SLEEP_MS) alertUntil = now + 320;
      } else if (now - parkedAt > SLEEP_MS) {
        setCell(Math.floor(now / 550) % 2 === 0 ? 2 : 3, 2); // dormindo: z / z z
      } else {
        setCell(0, 2); // pousado, acordado
      }
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
