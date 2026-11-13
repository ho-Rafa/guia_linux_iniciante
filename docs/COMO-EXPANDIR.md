# Como expandir o site

Guia rápido para adicionar conteúdo sem quebrar nada. O site é estático e modular.

## Adicionar um novo tópico (capítulo)

1. Em `data/course.js`, acrescente um item na lista `capitulos`:
   ```js
   { num: "08", id: "permissoes", titulo: "Permissões de arquivos", icone: "lock" }
   ```
   (`icone` é um nome de ícone do Lucide: https://lucide.dev/icons)

2. Em `pages/guia.html`, crie a seção com o **mesmo id**:
   ```html
   <section id="permissoes" class="reveal-section scroll-mt-24">
     <div class="flex items-center gap-3 mb-4">
       <span class="px-3 py-1 rounded bg-amber/10 border border-amber/40 text-amber-light font-mono font-bold text-xs">08</span>
       <h2 class="text-2xl sm:text-3xl font-bold font-mono text-white">Permissões de arquivos</h2>
     </div>
     <!-- conteúdo -->
   </section>
   ```

O menu lateral é gerado automaticamente a partir de `course.js` — não precisa editar o menu à mão.

## Adicionar comandos à tabela 80/20

Em `js/commands.js`, adicione um objeto em `COMMANDS_DATA`:
```js
{ cmd: "chmod", type: "sys", desc: "Muda permissões de um arquivo", ex: "chmod +x script.sh" }
```
`type` deve ser `file`, `sys` ou `net` (para os filtros).

## Adicionar um comando à sandbox (terminal simulador)

Em `js/terminal.js`, adicione um `case` no `switch` da função `handle`:
```js
case "chmod":
  line("Permissões alteradas (simulação).");
  break;
```

## Momento de salvar (card de comandos)

Para destacar comandos "para dar print" (como nos vídeos), reutilize o padrão de card escuro
em mono. Exemplo de bloco (cole numa seção):
```html
<div class="bg-darkbg-terminal border border-terminal/40 rounded-xl p-5 font-mono text-sm">
  <p class="text-gray-400 mb-2"># Descoberta de dispositivos na rede autorizada</p>
  <p class="text-terminal">$ sudo arp-scan --localnet</p>
</div>
```

## Criar uma página nova (ex.: aula longa, trilha separada)

1. Crie `pages/minha-aula.html`.
2. Copie o `<head>` inteiro do `pages/guia.html` (ele já inclui o portão de acesso).
3. Referencie os mesmos CSS/JS com `../css/...` e `../js/...`.
4. Linke a nova página de onde quiser (menu, cards, etc.).

## Trocar a senha de acesso

```bash
node -e "console.log(require('crypto').createHash('sha256').update('NOVA_SENHA').digest('hex'))"
```
Cole o resultado em `js/config.js → acesso.senhaSha256`.

## Publicar no GitHub Pages servindo a pasta `site/`

Opção simples: mova o conteúdo de `site/` para a raiz do repositório e ative Pages em `main`/root.

Opção sem mover arquivos (GitHub Actions): crie `.github/workflows/pages.yml` no repo com um
job que publica a pasta `site/` como artifact do Pages. Peça ajuda ao Claude para gerar esse
workflow quando for publicar.
