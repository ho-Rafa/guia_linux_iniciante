# guia_linux_iniciante

Curso guiado para iniciantes em **Linux voltado para cibersegurança** — site da série **Rafa & Raven**.
Site estático (HTML + CSS + JS, sem build), com portão de acesso por senha e fórum da comunidade.

## Estrutura de pastas

```
site/
├── index.html            # Portão de acesso (senha) + landing
├── pages/
│   ├── guia.html         # Curso (tópicos, tabela de comandos, terminal sandbox)
│   └── forum.html        # Fórum da comunidade (Giscus / GitHub Discussions)
├── css/
│   └── styles.css        # Estilos próprios (tema Rafa & Raven)
├── js/
│   ├── config.js         # ⚙️ Configuração central (senha, Giscus, links)
│   ├── tailwind-config.js# Paleta do canal para o Tailwind (CDN)
│   ├── gate.js           # Portão de acesso por senha
│   ├── main.js           # Sidebar, scroll, reveal, copiar, ícones
│   ├── commands.js       # Tabela de comandos 80/20 (dados + busca/filtro)
│   ├── terminal.js       # Terminal simulador (sandbox)
│   └── forum.js          # Giscus + cartões de categoria
├── data/
│   └── course.js         # 📚 Conteúdo do menu/capítulos (fonte da expansão)
├── assets/
│   ├── svg/raven.svg     # Mascote
│   └── img/              # (imagens futuras)
└── .claude/skills/       # Skills de UI/UX (UI UX Pro Max)
```

## Rodar localmente

Qualquer servidor estático serve. Exemplos:

```bash
npx http-server site -p 4178 -c-1
```

Depois abra `http://127.0.0.1:4178/`. (Abrir o `index.html` direto pelo `file://` não roda o JS direito — use um servidor.)

## 1) Acesso só para inscritos (senha única)

O acesso é liberado por uma **senha única** revelada nos vídeos do canal. É um site estático,
então isto apenas evita acesso casual — **não é segurança de verdade**.

Trocar a senha: gere o hash SHA-256 da nova senha e cole em `js/config.js → acesso.senhaSha256`.

```bash
node -e "console.log(require('crypto').createHash('sha256').update('SUA_NOVA_SENHA').digest('hex'))"
```

Senha atual (padrão, **troque antes de publicar**): `rafa-raven`.

## 2) Fórum (Giscus / GitHub Discussions)

O fórum usa o **Giscus** ligado ao repositório `guia_linux_iniciante`. O Discussions já está
habilitado e os IDs já estão em `js/config.js`. **Falta um passo manual:**

1. Instale o app do Giscus no repositório: https://github.com/apps/giscus (escolha só este repo).
2. Pronto — o mural e as categorias (Dúvidas, Ideias, Mostre seu lab, Geral) passam a funcionar.

Enquanto o app não é instalado, o widget mostra "giscus is not installed".

## 3) Como expandir o conteúdo

- **Novo tópico/capítulo:** adicione um item em `data/course.js → capitulos` e crie a
  `<section id="...">` correspondente em `pages/guia.html`. O menu lateral se atualiza sozinho.
- **Novo comando na tabela:** adicione um objeto em `js/commands.js → COMMANDS_DATA`.
- **Novo comando na sandbox:** adicione um `case` em `js/terminal.js`.
- **Nova categoria de fórum:** adicione em `js/config.js → discussions.categorias`.
- **Páginas novas** (ex.: uma aula longa): crie um arquivo em `pages/`, copie o `<head>`
  do `guia.html` (inclui o portão de acesso) e referencie os mesmos CSS/JS.

## 4) Publicar (GitHub Pages)

1. No GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
2. O site fica em `https://ho-rafa.github.io/guia_linux_iniciante/`.
3. Coloque esse link na descrição/Comunidade do YouTube.

> Observação: a pasta do site é `site/`. Para o GitHub Pages servir a partir da raiz do repo,
> ou mova o conteúdo de `site/` para a raiz, ou configure o Pages para a pasta `/site` (via
> GitHub Actions) — veja `docs/COMO-EXPANDIR.md`.

---
Conteúdo educativo. Só teste redes/sistemas que são seus ou com autorização por escrito.

## Raven que segue o mouse (estilo oneko)

Um Raven voa atrás do cursor em todas as páginas (inspirado no `oneko`). Feito do zero em
HTML/CSS/JS, sem bibliotecas:

- **Sprite sheet vetorial:** `assets/svg/raven-sprite.svg` (8 direções × 2 frames de asa + pousado,
  alerta e dormindo). É gerada por um script — para mexer no desenho, edite
  `scripts/build-raven-sprite.mjs` e rode:
  ```bash
  node scripts/build-raven-sprite.mjs
  ```
- **Controlador:** `js/raven-follow.js` — persegue o cursor com suavização, vira para a direção
  do movimento, bate as asas, fica parado e "dorme" (💤) quando o mouse para, e acorda assustado.
- **Respeita o usuário:** não esconde o cursor, não bloqueia cliques (`pointer-events: none`),
  desliga em telas de toque e quando o sistema pede menos animação (`prefers-reduced-motion`).
- **Botão liga/desliga** no canto inferior direito; a preferência fica salva no navegador.

Cada página define `window.__RAVEN_BASE__` (`""` na raiz, `"../"` dentro de `pages/`) antes de
carregar `raven-follow.js`, para os caminhos do sprite funcionarem.
