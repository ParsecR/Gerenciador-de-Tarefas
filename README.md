# MinhaLista — Documentação do Projeto

Aplicação web de lista de tarefas (to-do list) desenvolvida com HTML, CSS e JavaScript puro.
Projeto criado com fins educacionais, cobrindo estrutura de múltiplas páginas, estilização com CSS moderno e manipulação do DOM com JavaScript.

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Estrutura de arquivos](#2-estrutura-de-arquivos)
3. [Páginas](#3-páginas)
4. [CSS — conceitos e decisões](#4-css--conceitos-e-decisões)
5. [JavaScript — conceitos e decisões](#5-javascript--conceitos-e-decisões)
6. [Fluxo de navegação](#6-fluxo-de-navegação)
7. [localStorage — como os dados são salvos](#7-localstorage--como-os-dados-são-salvos)
8. [Glossário rápido](#8-glossário-rápido)

---

## 1. Visão geral

O MinhaLista é uma aplicação de múltiplas páginas que permite ao usuário:

- Criar uma conta (cadastro)
- Fazer login com e-mail e senha
- Adicionar, concluir, filtrar e deletar tarefas
- Ver os detalhes de cada tarefa e escrever anotações
- Entrar em contato através de um formulário

Todos os dados são salvos diretamente no navegador via `localStorage`, sem necessidade de servidor ou banco de dados externo.

---

## 2. Estrutura de arquivos

```
todo-list/
├── main.html          → Página inicial (apresentação do site)
├── cadastro.html      → Formulário de criação de conta
├── login.html         → Formulário de autenticação
├── tarefas.html       → Lista de tarefas do usuário
├── detalhes.html      → Detalhes de uma tarefa individual
├── contato.html       → Formulário de contato e FAQ
│
├── CSS/
│   └── style.css      → Estilos de todas as páginas
│
└── JavaScript/
    └── script.js      → Lógica de todas as páginas
```

O CSS e o JavaScript são compartilhados entre todas as páginas. Cada página inclui os mesmos arquivos:

```html
<link rel="stylesheet" href="CSS/style.css" />
<script src="JavaScript/script.js"></script>
```

O JavaScript usa `document.getElementById()` para verificar quais elementos existem na página atual e só executa o bloco de código correspondente.

---

## 3. Páginas

### 3.1 `main.html` — Página inicial

Apresenta o site ao visitante. É a primeira página que o usuário vê.

**Seções:**
- **Navbar** — barra de navegação fixa no topo com links para todas as páginas e botão "Criar conta"
- **Hero** — título principal, descrição do produto e dois botões de ação (primário e secundário)
- **Cards de funcionalidades** — três cartões em grid explicando o que o site oferece
- **Como funciona** — lista numerada com os três passos para começar a usar
- **Footer** — rodapé com copyright e links rápidos

**Elementos HTML introduzidos:**
- `<nav>` — tag semântica para menus de navegação
- `<section>` — agrupa blocos de conteúdo relacionado
- `<footer>` — rodapé da página
- `<ol>` e `<li>` — lista ordenada para os passos numerados
- SVG inline — ícone desenhado diretamente no HTML, sem imagem externa

---

### 3.2 `cadastro.html` — Cadastro

Formulário de criação de conta. É o ponto de entrada para novos usuários.

**Campos:**
- Nome completo (`type="text"`)
- E-mail (`type="email"` — o browser valida o formato automaticamente)
- Senha (`type="password"` — esconde os caracteres digitados, `minlength="6"`)

**Comportamento:**
1. O usuário preenche e clica em "Criar minha conta"
2. O JavaScript valida se a senha tem ao menos 6 caracteres
3. Os dados (nome e e-mail, sem a senha) são salvos no `localStorage`
4. O usuário é redirecionado para `login.html`

**Botão "Voltar ao início"** — link estilizado como botão que leva de volta para `main.html`.

**Atributos HTML utilizados:**
- `required` — torna o campo obrigatório (validação nativa do browser)
- `minlength="6"` — impede envio com menos de 6 caracteres
- `placeholder` — texto de dica exibido quando o campo está vazio

---

### 3.3 `login.html` — Login

Formulário de autenticação para usuários já cadastrados.

**Campos:**
- E-mail (`type="email"`, `autocomplete="email"`)
- Senha (`type="password"`, `autocomplete="current-password"`)
- Checkbox "Lembrar de mim"

**Funcionalidades:**
- **Logo clicável** — a logo no topo do card leva de volta para `main.html`, tanto a da navbar quanto a dentro do card
- **Link "Esqueci minha senha"** — posicionado à direita do label de senha com `justify-content: space-between`
- **Lembrar de mim** — se marcado, salva o e-mail no `localStorage` e preenche o campo automaticamente na próxima visita
- **Validação** — verifica se o e-mail digitado corresponde ao cadastro salvo

**Comportamento:**
1. O JS recupera o usuário salvo no `localStorage`
2. Compara o e-mail digitado com o e-mail do cadastro
3. Se for válido, salva `logado: true` no `localStorage` e redireciona para `tarefas.html`

---

### 3.4 `tarefas.html` — Lista de tarefas

Página principal da aplicação. Exibe todas as tarefas do usuário.

**Componentes:**

**Cabeçalho:**
- Saudação personalizada com o primeiro nome do usuário (lido do `localStorage`)
- Resumo de tarefas pendentes e total
- Botões de filtro: Todas / Pendentes / Concluídas

**Formulário de nova tarefa:**
- Campo de nome da tarefa (linha 1, largura total)
- Select de prioridade: Normal / Importante / Urgente (linha 2, à esquerda)
- Botão "Adicionar" (linha 2, à direita)

**Lista de tarefas:**
- Cada tarefa exibe: checkbox de conclusão, texto, badge de prioridade, botão "Detalhes" e botão deletar
- Animação de entrada ao adicionar uma nova tarefa (`@keyframes`)
- Estado vazio exibido quando não há tarefas

**Footer fixo:**
- Contador de tarefas pendentes
- Botão "Limpar concluídas"

**Botão "Sair"** na navbar — remove o estado de login e redireciona para `login.html`.

**Proteção de rota:** se o usuário tentar acessar a página sem estar logado (sem o `logado: true` no `localStorage`), é redirecionado automaticamente para `login.html`.

**Prioridades e suas cores:**

| Prioridade | Cor |
|---|---|
| Normal | Cinza |
| Importante | Amarelo |
| Urgente | Vermelho |

---

### 3.5 `detalhes.html` — Detalhes da tarefa

Exibida ao clicar em "Detalhes" em qualquer tarefa. Mostra informações completas e permite ações.

**Como a tarefa é passada entre páginas:**
O botão "Detalhes" em `tarefas.html` salva o `id` da tarefa selecionada no `localStorage` antes de redirecionar. Em `detalhes.html`, o JS lê esse ID e busca a tarefa correspondente.

**Informações exibidas:**
- Badge de prioridade (reutiliza as mesmas classes CSS de `tarefas.html`)
- Badge de status: Pendente ou Concluída (fica verde quando concluída)
- Título da tarefa
- Data de criação e ID resumido (primeiros 8 caracteres)

**Ações disponíveis:**
- **Marcar como concluída / Reabrir** — alterna o estado da tarefa e atualiza o badge na tela sem recarregar a página. O botão muda de visual conforme o estado
- **Salvar anotações** — campo de texto livre (`<textarea>`) onde o usuário escreve observações. O conteúdo é salvo dentro do objeto da tarefa no `localStorage`. O botão exibe "✓ Salvo!" por 2 segundos após clicar
- **Deletar tarefa** — abre uma confirmação nativa do browser (`confirm()`). Se confirmado, remove a tarefa e volta para `tarefas.html`

**Botão "Voltar"** — link estilizado como botão ghost que retorna para `tarefas.html`.

**Estado de erro:** se nenhum ID estiver salvo ou a tarefa não for encontrada, exibe uma mensagem com link para voltar à lista.

---

### 3.6 `contato.html` — Contato

Página de contato com formulário e informações da equipe.

**Layout:** duas colunas em CSS Grid (`3fr 2fr`) — formulário à esquerda, informações à direita.

**Formulário:**
- Nome e e-mail em linha dupla (`grid-template-columns: 1fr 1fr`)
- Select de assunto: Dúvida / Bug / Sugestão / Outro
- Textarea de mensagem
- Botão enviar

**Comportamento:** ao enviar, exibe um alerta de sucesso verde no topo do card e rola suavemente até ele (`scrollIntoView`). O formulário é limpo com `.reset()`. Em um projeto real, aqui seria feita uma requisição `fetch()` para um servidor.

**Coluna de informações:**
- Três blocos com ícone: e-mail, horário de atendimento e localização
- Seção de FAQ usando `<details>` + `<summary>` — accordion 100% nativo do HTML, sem JavaScript

---

## 4. CSS — conceitos e decisões

### Variáveis CSS (Custom Properties)

Definidas em `:root`, disponíveis em todo o arquivo. Permite mudar a identidade visual do site alterando apenas um lugar:

```css
:root {
  --cor-primaria: #6c63ff;
  --cor-fundo: #080810;
  --fonte-corpo: 'Segoe UI', system-ui, sans-serif;
  --transicao: 0.22s ease;
}
```

### Sistema de layout

O projeto usa dois sistemas de layout modernos:

**Flexbox** — para alinhar elementos em uma dimensão (linha ou coluna):
- Navbar (horizontal)
- Campos de formulário (vertical)
- Linha de ações das tarefas (horizontal)

**CSS Grid** — para layouts em duas dimensões (linhas e colunas):
- Cards de funcionalidades na `main.html` (`repeat(3, 1fr)`)
- Grid de contato (`3fr 2fr`)
- Campos duplos no formulário de contato (`1fr 1fr`)

### Navbar sticky

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}
```

`position: sticky` faz a navbar acompanhar a rolagem e grudar no topo. `backdrop-filter: blur()` cria o efeito de vidro fosco atrás dela. `z-index: 100` garante que fique na frente de todos os outros elementos.

### Responsividade

O projeto usa `@media (max-width: 768px)` para adaptar o layout em telas menores:
- Os links da navbar são ocultados em mobile
- Os grids de múltiplas colunas viram uma coluna só
- Os paddings são reduzidos

### Tamanho de fonte responsivo com `clamp()`

```css
font-size: clamp(2.4rem, 6vw, 4rem);
```

`clamp(mínimo, ideal, máximo)` define um tamanho que cresce proporcionalmente com a tela, sem ultrapassar os limites definidos. Evita a necessidade de múltiplos `@media` só para fontes.

### Animação de entrada das tarefas

```css
@keyframes entrar {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tarefa-item {
  animation: entrar 0.25s ease;
}
```

Toda vez que uma tarefa é adicionada à lista, ela aparece com uma animação suave de cima para baixo.

### `accent-color`

```css
input[type="checkbox"] {
  accent-color: var(--cor-primaria);
}
```

Propriedade moderna que altera a cor de elementos nativos como checkbox e radio sem precisar escondê-los e criar substitutos em HTML.

---

## 5. JavaScript — conceitos e decisões

### Estrutura geral do script

Todo o código está dentro de um único `addEventListener('DOMContentLoaded')`:

```javascript
document.addEventListener('DOMContentLoaded', function () {
  // código aqui
});
```

Isso garante que o JavaScript só executa após o HTML estar completamente carregado. Cada bloco de funcionalidade verifica se o elemento correspondente existe na página antes de rodar:

```javascript
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  // só executa na login.html
}
```

### Detecção de página para navbar ativa

```javascript
const caminhoAtual = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(function (link) {
  if (caminhoAtual.includes(link.getAttribute('href'))) {
    link.classList.add('ativo');
  }
});
```

O JS lê o caminho da URL atual e adiciona a classe `ativo` ao link da navbar correspondente, destacando visualmente a página aberta.

### Padrão renderizar()

A lista de tarefas usa um padrão simples e robusto: sempre que os dados mudam, a lista inteira é apagada e redesenhada do zero:

```javascript
function renderizar() {
  const tarefas = carregarTarefas();
  listaTarefasEl.innerHTML = ''; // apaga tudo
  tarefas.forEach(function (tarefa) {
    const li = document.createElement('li');
    li.innerHTML = `...`;
    listaTarefasEl.appendChild(li);
  });
}
```

Isso garante que a tela esteja sempre sincronizada com os dados salvos.

### Delegação de eventos

Em vez de adicionar um listener em cada botão de cada tarefa, um único listener é adicionado na lista pai:

```javascript
listaTarefasEl.addEventListener('click', function (evento) {
  const btnCheck   = evento.target.closest('.tarefa-check');
  const btnDeletar = evento.target.closest('.btn-deletar');
  const btnDetalhes = evento.target.closest('.btn-detalhes');
  // ...
});
```

`.closest()` sobe pelo DOM a partir do elemento clicado procurando o seletor indicado. Isso funciona mesmo para botões adicionados dinamicamente depois que a página carregou.

### Proteção de rota

Páginas que exigem login verificam o `localStorage` antes de exibir qualquer conteúdo:

```javascript
if (!localStorage.getItem('logado')) {
  window.location.href = 'login.html';
  return;
}
```

Se o usuário tentar acessar `tarefas.html` ou `detalhes.html` diretamente pela URL sem estar autenticado, é redirecionado para o login.

### Métodos de array utilizados

| Método | O que faz | Exemplo de uso |
|---|---|---|
| `.forEach()` | Percorre cada item do array | Renderizar tarefas na tela |
| `.filter()` | Retorna novo array com itens que passam na condição | Filtrar pendentes / concluídas |
| `.find()` | Retorna o primeiro item que satisfaz a condição | Buscar tarefa pelo ID |
| `.unshift()` | Adiciona item no início do array | Nova tarefa aparece no topo |

### setTimeout para feedback visual

```javascript
btn.innerHTML = '✓ Salvo!';
setTimeout(function () {
  btn.innerHTML = textoOriginal;
}, 2000);
```

`setTimeout` executa uma função após um tempo em milissegundos. Usado para exibir a confirmação "Salvo!" por 2 segundos e depois restaurar o texto original do botão.

---

## 6. Fluxo de navegação

```
main.html
   │
   ├──► cadastro.html ──► login.html ──► tarefas.html ──► detalhes.html
   │                          ▲               │
   │                          └───────────────┘ (botão Sair)
   │
   └──► contato.html
```

O usuário novo passa por: `main.html` → `cadastro.html` → `login.html` → `tarefas.html`.
O usuário que retorna vai direto para: `login.html` → `tarefas.html`.
Qualquer tentativa de acessar `tarefas.html` ou `detalhes.html` sem login redireciona para `login.html`.

---

## 7. localStorage — como os dados são salvos

O `localStorage` é um espaço de armazenamento do próprio navegador. Os dados persistem mesmo após fechar e reabrir o browser. Tudo é salvo como texto (string), então objetos JavaScript precisam ser convertidos com `JSON.stringify()` ao salvar e `JSON.parse()` ao ler.

**Chaves utilizadas no projeto:**

| Chave | Conteúdo | Quando é criada |
|---|---|---|
| `usuario` | `{ nome, email }` | Ao concluir o cadastro |
| `logado` | `"true"` | Ao fazer login com sucesso |
| `emailSalvo` | string do e-mail | Ao marcar "Lembrar de mim" no login |
| `tarefas` | array de objetos de tarefa | Ao adicionar a primeira tarefa |
| `tarefaSelecionada` | ID da tarefa | Ao clicar em "Detalhes" |

**Estrutura de uma tarefa no localStorage:**

```json
{
  "id": "1720123456789",
  "texto": "Estudar JavaScript por 1 hora",
  "prioridade": "importante",
  "concluida": false,
  "criadaEm": "05/07/2025",
  "anotacoes": "Ver capítulo 8 do livro Eloquent JavaScript"
}
```

---

## 8. Glossário rápido

| Termo | Significado |
|---|---|
| DOM | Document Object Model — representação do HTML como objetos manipuláveis pelo JS |
| Semântica HTML | Usar tags pelo seu significado (`<nav>`, `<main>`, `<footer>`) e não apenas pela aparência |
| Flexbox | Sistema de layout CSS para alinhar elementos em uma linha ou coluna |
| CSS Grid | Sistema de layout CSS para organizar elementos em linhas e colunas simultaneamente |
| `localStorage` | Armazenamento de dados no navegador, persistente entre sessões |
| `JSON.stringify` | Converte objeto JavaScript em texto para salvar no localStorage |
| `JSON.parse` | Converte texto salvo no localStorage de volta para objeto JavaScript |
| Event Listener | Função que "escuta" e reage a uma ação do usuário (clique, envio, digitação) |
| Delegação de eventos | Técnica de adicionar um único listener no elemento pai para capturar eventos dos filhos |
| Proteção de rota | Verificação que impede acesso a páginas restritas sem autenticação |
| `@keyframes` | Regra CSS para definir animações personalizadas |
| `clamp()` | Função CSS para tamanho responsivo com limites mínimo e máximo |
| `position: sticky` | Elemento que acompanha a rolagem e gruda em uma posição |
| `backdrop-filter` | Efeito visual aplicado atrás de um elemento semitransparente (ex: desfoque) |
| Template literal | String com crase (`) que permite inserir variáveis com `${}` |

---

*Projeto desenvolvido como exercício prático de desenvolvimento web front-end.*
