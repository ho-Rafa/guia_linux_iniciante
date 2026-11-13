/*
 * Configuração do Tailwind (CDN) — paleta do canal Rafa & Raven.
 * Base "terminal hacker" (verde) + toque quente de meio-dia (âmbar) do canal.
 * Carregue este arquivo logo depois do script do Tailwind CDN e antes do conteúdo.
 */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Verde terminal (identidade do canal e do tema hacker)
        terminal: {
          50: "#eefdf2",
          100: "#d7fbe2",
          400: "#34d399",
          DEFAULT: "#1cd959",
          glow: "#00ff66",
          dark: "#0a3818",
        },
        // Âmbar quente (meio-dia do sertão do Rafa & Raven) — substitui o violeta
        amber: {
          light: "#ffd37a",
          DEFAULT: "#f2b23c",
          dark: "#b9801f",
        },
        // Mantido como "accent" para compatibilidade, apontando pro âmbar do canal
        accent: {
          light: "#ffd37a",
          DEFAULT: "#f2b23c",
          dark: "#b9801f",
        },
        // Fundos escuros
        darkbg: {
          base: "#0b0f12",
          card: "#131920",
          border: "#1f2937",
          terminal: "#090d10",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
};
