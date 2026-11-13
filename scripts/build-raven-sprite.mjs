/*
 * Gera assets/svg/raven-sprite.svg — folha de sprites vetorial do Raven, no estilo oneko.
 * Grade de células 64×64:
 *   Linha 0: 8 direções (E, SE, S, SW, W, NW, N, NE) — asas BAIXAS (frame A)
 *   Linha 1: mesmas 8 direções — asas ALTAS (frame B)   -> batida de asa
 *   Linha 2: col0 idle (pousado), col1 alerta, col2 sono A, col3 sono B
 * O Raven de voo é desenhado em VISTA DE CIMA apontando para LESTE e girado por direção,
 * então uma mesma arte serve as 8 direções. Rode:  node scripts/build-raven-sprite.mjs
 */
import fs from "node:fs";
import path from "node:path";

const CELL = 64;
const C = { feather: "#23232e", featherDark: "#15151d", featherHi: "#3a3a4c", beak: "#5d5e6c", eye: "#fbfbfb", line: "#08080d", z: "#8cf0a0" };

// --- Raven de voo (vista de cima, apontando para LESTE, centro em 32,32) ---
function flying(frame) {
  const up = frame === 1; // asas altas
  // asas: dois formatos que varrem para trás; "up" deixa as pontas mais recolhidas
  var wingTop = up
    ? "M30 26 Q18 18 20 10 Q28 16 34 26 Z"
    : "M30 28 Q12 18 8 26 Q18 26 34 30 Z";
  var wingBot = up
    ? "M30 38 Q18 46 20 54 Q28 48 34 38 Z"
    : "M30 36 Q12 46 8 38 Q18 38 34 34 Z";
  return `
    <!-- cauda -->
    <path d="M18 32 L6 26 L12 32 L6 38 Z" fill="${C.featherDark}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- asas (atrás do corpo) -->
    <path d="${wingTop}" fill="${C.featherDark}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${wingBot}" fill="${C.featherDark}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- corpo -->
    <ellipse cx="31" cy="32" rx="13" ry="8.5" fill="${C.feather}" stroke="${C.line}" stroke-width="2"/>
    <path d="M24 29 Q31 27 38 30" stroke="${C.featherHi}" stroke-width="1.5" fill="none"/>
    <!-- cabeça -->
    <circle cx="44" cy="32" r="8" fill="${C.feather}" stroke="${C.line}" stroke-width="2"/>
    <!-- bico -->
    <path d="M51 32 L60 29 L60 35 Z" fill="${C.beak}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- olhos (vista de cima: um de cada lado da cabeça) -->
    <circle cx="43" cy="27" r="2.6" fill="${C.eye}"/><circle cx="43.6" cy="27" r="1.2" fill="#101018"/>
    <circle cx="43" cy="37" r="2.6" fill="${C.eye}"/><circle cx="43.6" cy="37" r="1.2" fill="#101018"/>`;
}

// --- Raven pousado (vista de lado, apontando para a direita) ---
function perched(kind) {
  var eyes, wing, tufts = `<path d="M34 22 l-6 -6 l7 -1 l-4 -7 l8 4 l0 -7 l5 7 l5 -5 l1 7 l7 -2 l-5 6 Z" fill="${C.featherDark}"/>`;
  var bodyLift = kind === "alert" ? -2 : 0;
  if (kind === "sleepA" || kind === "sleepB") {
    eyes = `<path d="M38 33 q4 3 8 0" stroke="${C.line}" stroke-width="2" fill="none" stroke-linecap="round"/>`; // olho fechado
    tufts = `<path d="M34 24 l-6 -5 l7 -1 l-3 -6 l7 4 l1 -6 l4 7 l6 -4 l0 7 l6 -1 l-5 6 Z" fill="${C.featherDark}"/>`;
  } else if (kind === "alert") {
    eyes = `<circle cx="42" cy="31" r="4.5" fill="${C.eye}" stroke="${C.line}" stroke-width="1.2"/><circle cx="43" cy="31" r="2.2" fill="#101018"/>`;
  } else { // idle
    eyes = `<circle cx="42" cy="32" r="4" fill="${C.eye}" stroke="${C.line}" stroke-width="1.2"/><circle cx="43" cy="32.5" r="2" fill="#101018"/>`;
  }
  wing = `<path d="M26 34 q14 -4 20 6 q-10 2 -20 0 Z" fill="${C.featherDark}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>`;
  var zzz = "";
  if (kind === "sleepA") zzz = `<text x="52" y="18" font-family="monospace" font-size="9" fill="${C.z}">z</text>`;
  if (kind === "sleepB") zzz = `<text x="52" y="15" font-family="monospace" font-size="7" fill="${C.z}">z</text><text x="56" y="22" font-family="monospace" font-size="10" fill="${C.z}">z</text>`;
  return `
    <g transform="translate(0 ${bodyLift})">
      ${tufts}
      <!-- cauda -->
      <path d="M18 40 L8 36 L14 42 L8 46 Z" fill="${C.featherDark}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- corpo -->
      <path d="M22 44 Q20 26 36 24 Q50 26 48 44 Q46 54 35 54 Q24 54 22 44 Z" fill="${C.feather}" stroke="${C.line}" stroke-width="2"/>
      ${wing}
      <!-- cabeça -->
      <circle cx="40" cy="30" r="10" fill="${C.feather}" stroke="${C.line}" stroke-width="2"/>
      ${eyes}
      <!-- bico -->
      <path d="M49 30 L60 28 L52 35 Z" fill="${C.beak}" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- pés -->
      <g stroke="#2e2e38" stroke-width="2.4" stroke-linecap="round"><path d="M32 54 l-1 6 M40 54 l1 6"/></g>
    </g>
    ${zzz}`;
}

// Direções da linha 0/1 (ângulo em graus, tela: +x direita, +y baixo)
const DIRS = [0, 45, 90, 135, 180, 225, 270, 315]; // E SE S SW W NW N NE

function cell(col, row, inner) {
  return `<g transform="translate(${col * CELL} ${row * CELL})">${inner}</g>`;
}

var cells = [];
// linhas 0 e 1: voo em 8 direções, 2 frames de asa
[0, 1].forEach(function (frame) {
  DIRS.forEach(function (ang, col) {
    var g = `<g transform="rotate(${ang} 32 32)">${flying(frame)}</g>`;
    cells.push(cell(col, frame, g));
  });
});
// linha 2: estados parados
cells.push(cell(0, 2, perched("idle")));
cells.push(cell(1, 2, perched("alert")));
cells.push(cell(2, 2, perched("sleepA")));
cells.push(cell(3, 2, perched("sleepB")));

var W = 8 * CELL, H = 3 * CELL;
var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="geometricPrecision">
${cells.join("\n")}
</svg>
`;

var out = path.resolve(import.meta.dirname, "..", "assets", "svg", "raven-sprite.svg");
fs.writeFileSync(out, svg);
console.log("ok ->", out, "(" + W + "x" + H + ")");
