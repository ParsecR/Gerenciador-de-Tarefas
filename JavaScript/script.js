// =============================================
// script.js — lógica geral do projeto
// Roda em todas as páginas que incluírem este arquivo.
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------------------------------------------------
  // NAVBAR ATIVA
  // Detecta qual página está aberta e destaca o link
  // correspondente adicionando a classe "ativo".
  // ---------------------------------------------------
  const caminhoAtual = window.location.pathname;
  // Ex: "/todo-list/login.html"

  const linksNavbar = document.querySelectorAll('.nav-links a');
  // querySelectorAll retorna todos os <a> dentro de .nav-links

  linksNavbar.forEach(function (link) {
    link.classList.remove('ativo'); // limpa primeiro

    // getAttribute('href') pega o valor do atributo href do link
    if (caminhoAtual.includes(link.getAttribute('href'))) {
      link.classList.add('ativo');
    }
  });


  // ---------------------------------------------------
  // FORMULÁRIO DE CADASTRO (cadastro.html)
  // ---------------------------------------------------
  const formCadastro = document.getElementById('formCadastro');

  if (formCadastro) {

    formCadastro.addEventListener('submit', function (evento) {
      evento.preventDefault(); // impede recarregar a página

      const nome  = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value;

      if (senha.length < 6) {
        alert('A senha precisa ter ao menos 6 caracteres.');
        return;
      }

      // Salva nome e email no localStorage.
      // Nunca salve a senha em texto puro em produção real.
      const usuario = { nome, email };
      localStorage.setItem('usuario', JSON.stringify(usuario));
      // JSON.stringify: converte o objeto JS em texto para salvar

      // Redireciona para login após cadastro
      window.location.href = 'login.html';
    });

  }


  // ---------------------------------------------------
  // FORMULÁRIO DE LOGIN (login.html)
  // ---------------------------------------------------
  const formLogin = document.getElementById('formLogin');

  if (formLogin) {

    formLogin.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const emailDigitado = document.getElementById('email').value.trim();
      const lembrar       = document.getElementById('lembrar').checked;
      // .checked: propriedade do checkbox — true se marcado

      // Recupera o usuário salvo no cadastro
      const salvo = localStorage.getItem('usuario');

      if (!salvo) {
        alert('Nenhum cadastro encontrado. Crie sua conta primeiro.');
        window.location.href = 'cadastro.html';
        return;
      }

      const usuario = JSON.parse(salvo);
      // JSON.parse: converte o texto de volta para objeto JS

      if (usuario.email !== emailDigitado) {
        alert('E-mail não encontrado. Verifique ou faça seu cadastro.');
        return;
      }

      // Salva o estado de login
      localStorage.setItem('logado', 'true');

      // Se "lembrar de mim" estiver marcado, salva o e-mail
      if (lembrar) {
        localStorage.setItem('emailSalvo', emailDigitado);
      } else {
        localStorage.removeItem('emailSalvo');
      }

      // Redireciona para a lista de tarefas
      window.location.href = 'tarefas.html';
    });

    // Preenche o e-mail automaticamente se foi salvo antes
    const emailSalvo = localStorage.getItem('emailSalvo');
    if (emailSalvo) {
      document.getElementById('email').value = emailSalvo;
      document.getElementById('lembrar').checked = true;
    }

  }


  // ---------------------------------------------------
  // PÁGINA DE TAREFAS (tarefas.html)
  // ---------------------------------------------------

  const listaTarefasEl = document.getElementById('listaTarefas');

  // Só roda se estivermos na página de tarefas
  if (listaTarefasEl) {

    // ── PROTEÇÃO DE ROTA ──────────────────────────────
    // Se o usuário não estiver logado, volta pro login.
    // Isso impede acessar a página de tarefas diretamente pela URL.
    if (!localStorage.getItem('logado')) {
      window.location.href = 'login.html';
      return; // para a execução do restante
    }

    // ── SAUDAÇÃO PERSONALIZADA ────────────────────────
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const primeiroNome = (usuario.nome || 'você').split(' ')[0];
    // .split(' ')[0] pega só o primeiro nome
    // Ex: "João Silva" → ["João", "Silva"] → "João"

    document.getElementById('saudacao').textContent =
      'Olá, ' + primeiroNome + ' 👋';

    // ── ESTADO DA APLICAÇÃO ───────────────────────────
    // "estado" é o objeto central que guarda todos os dados da tela.
    // filtroAtivo controla qual filtro está selecionado.
    let filtroAtivo = 'todas';

    // ── CARREGA TAREFAS DO LOCALSTORAGE ───────────────
    // Se não existir nada salvo, começa com array vazio [].
    function carregarTarefas() {
      const salvo = localStorage.getItem('tarefas');
      return salvo ? JSON.parse(salvo) : [];
    }

    // ── SALVA TAREFAS NO LOCALSTORAGE ─────────────────
    function salvarTarefas(tarefas) {
      localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // ── RENDERIZA A LISTA NA TELA ─────────────────────
    // Toda vez que os dados mudam, chamamos renderizar().
    // Ela apaga a lista e redesenha tudo do zero.
    // Isso é chamado de "render pattern" — simples e confiável.
    function renderizar() {
      const tarefas = carregarTarefas();

      // Filtra as tarefas conforme o filtro ativo
      let visiveis = tarefas;
      if (filtroAtivo === 'pendentes') {
        visiveis = tarefas.filter(function (t) { return !t.concluida; });
        // .filter() retorna um novo array só com os itens que passam no teste
      } else if (filtroAtivo === 'concluidas') {
        visiveis = tarefas.filter(function (t) { return t.concluida; });
      }

      // Limpa a lista atual
      listaTarefasEl.innerHTML = '';
      // innerHTML = '' apaga todo o conteúdo HTML de dentro do elemento

      // Mostra/esconde estado vazio
      const estadoVazio = document.getElementById('estadoVazio');
      const tarefasFooter = document.getElementById('tarefasFooter');

      if (visiveis.length === 0) {
        estadoVazio.style.display = 'block';
        tarefasFooter.style.display = 'none';
      } else {
        estadoVazio.style.display = 'none';
        tarefasFooter.style.display = 'flex';
      }

      // Atualiza o resumo e o contador
      const pendentes = tarefas.filter(function (t) { return !t.concluida; }).length;
      document.getElementById('resumo').textContent =
        pendentes + ' pendente' + (pendentes !== 1 ? 's' : '') +
        ' · ' + tarefas.length + ' no total';

      document.getElementById('contadorPendentes').textContent =
        pendentes + ' tarefa' + (pendentes !== 1 ? 's' : '') + ' pendente' + (pendentes !== 1 ? 's' : '');

      // Cria um <li> para cada tarefa visível
      visiveis.forEach(function (tarefa) {
        const li = document.createElement('li');
        // createElement: cria um novo elemento HTML pelo nome da tag

        li.className = 'tarefa-item' + (tarefa.concluida ? ' concluida' : '');
        // Adiciona a classe "concluida" se a tarefa estiver feita

        // innerHTML: define o HTML interno do elemento de uma vez
        // Template literal (crase): permite inserir variáveis com ${}
        li.innerHTML = `
          <button class="tarefa-check" data-id="${tarefa.id}" title="Marcar como concluída">
            ${tarefa.concluida ? '✓' : ''}
          </button>

          <span class="tarefa-texto">${tarefa.texto}</span>

          <span class="tarefa-prioridade prioridade-${tarefa.prioridade}">
            ${tarefa.prioridade}
          </span>

          <button class="btn-detalhes" data-id="${tarefa.id}">
            Detalhes
          </button>

          <button class="btn-deletar" data-id="${tarefa.id}" title="Remover tarefa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
        `;

        listaTarefasEl.appendChild(li);
        // appendChild: insere o <li> como filho do <ul>
      });
    }

    // ── ADICIONAR TAREFA ──────────────────────────────
    const formTarefa = document.getElementById('formTarefa');

    formTarefa.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const input = document.getElementById('inputTarefa');
      const texto = input.value.trim();

      if (!texto) return; // não adiciona tarefa vazia

      const prioridade = document.getElementById('selectPrioridade').value;

      const novaTarefa = {
        id: Date.now().toString(),
        // Date.now() retorna o timestamp atual em ms — único o suficiente para ID
        texto: texto,
        prioridade: prioridade,
        concluida: false,
        criadaEm: new Date().toLocaleDateString('pt-BR')
        // toLocaleDateString: formata a data conforme o idioma
        // Ex: "05/07/2025"
      };

      const tarefas = carregarTarefas();
      tarefas.unshift(novaTarefa);
      // .unshift() adiciona no INÍCIO do array (tarefas novas aparecem no topo)

      salvarTarefas(tarefas);
      renderizar();

      input.value = '';   // limpa o campo após adicionar
      input.focus();      // devolve o foco pro campo
    });

    // ── DELEGAÇÃO DE EVENTOS ──────────────────────────
    // Em vez de adicionar um listener em cada botão individualmente,
    // adicionamos UM listener na lista pai.
    // Quando um botão é clicado, o evento "sobe" até a lista (bubbling).
    // Verificamos quem foi clicado com evento.target.closest().
    listaTarefasEl.addEventListener('click', function (evento) {

      // .closest() procura o ancestral mais próximo com aquele seletor
      const btnCheck   = evento.target.closest('.tarefa-check');
      const btnDeletar = evento.target.closest('.btn-deletar');
      const btnDetalhes = evento.target.closest('.btn-detalhes');

      const tarefas = carregarTarefas();

      // CONCLUIR / DESCONCLUIR
      if (btnCheck) {
        const id = btnCheck.dataset.id;
        // dataset.id lê o atributo data-id do elemento

        const tarefa = tarefas.find(function (t) { return t.id === id; });
        // .find() retorna o primeiro item que satisfaz a condição

        if (tarefa) {
          tarefa.concluida = !tarefa.concluida;
          // ! inverte o booleano: true vira false, false vira true
          salvarTarefas(tarefas);
          renderizar();
        }
      }

      // DELETAR
      if (btnDeletar) {
        const id = btnDeletar.dataset.id;
        const novas = tarefas.filter(function (t) { return t.id !== id; });
        // .filter() mantém todas EXCETO a que tem o id clicado
        salvarTarefas(novas);
        renderizar();
      }

      // IR PARA DETALHES
      if (btnDetalhes) {
        const id = btnDetalhes.dataset.id;
        // Salva o ID da tarefa selecionada para a próxima página ler
        localStorage.setItem('tarefaSelecionada', id);
        window.location.href = 'detalhes.html';
      }

    });

    // ── FILTROS ───────────────────────────────────────
    const btnsFiltro = document.querySelectorAll('.btn-filtro');

    btnsFiltro.forEach(function (btn) {
      btn.addEventListener('click', function () {

        // Remove "filtro-ativo" de todos os botões
        btnsFiltro.forEach(function (b) { b.classList.remove('filtro-ativo'); });

        // Adiciona só no clicado
        btn.classList.add('filtro-ativo');

        // Atualiza o filtro e re-renderiza
        filtroAtivo = btn.dataset.filtro;
        renderizar();
      });
    });

    // ── LIMPAR CONCLUÍDAS ─────────────────────────────
    document.getElementById('btnLimparConcluidas').addEventListener('click', function () {
      const tarefas = carregarTarefas();
      const restantes = tarefas.filter(function (t) { return !t.concluida; });
      salvarTarefas(restantes);
      renderizar();
    });

    // ── BOTÃO SAIR ────────────────────────────────────
    document.getElementById('btnSair').addEventListener('click', function () {
      localStorage.removeItem('logado');
      window.location.href = 'login.html';
    });

    // ── RENDERIZAÇÃO INICIAL ──────────────────────────
    // Roda uma vez ao carregar a página para mostrar as tarefas salvas.
    renderizar();

  } // fim do bloco de tarefas


  // ---------------------------------------------------
  // PÁGINA DE DETALHES (detalhes.html)
  // ---------------------------------------------------

  const detalheCard = document.getElementById('detalheCard');

  if (detalheCard) {

    // Proteção de rota: exige login
    if (!localStorage.getItem('logado')) {
      window.location.href = 'login.html';
      return;
    }

    // ── CARREGA A TAREFA SELECIONADA ──────────────────
    // O botão "Detalhes" em tarefas.html salvou o ID antes de redirecionar.
    const idSelecionado = localStorage.getItem('tarefaSelecionada');
    const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]');

    // Procura a tarefa pelo ID
    const tarefa = tarefas.find(function (t) { return t.id === idSelecionado; });

    // Se não encontrou: mostra mensagem de erro
    if (!tarefa) {
      document.getElementById('detalheErro').style.display = 'block';
      return;
    }

    // ── PREENCHE O CARD COM OS DADOS DA TAREFA ────────
    detalheCard.style.display = 'flex';

    // Badge de prioridade (reutiliza as classes do CSS de tarefas)
    const badgePrioridade = document.getElementById('detalhePrioridade');
    badgePrioridade.textContent = tarefa.prioridade;
    badgePrioridade.className = 'tarefa-prioridade prioridade-' + tarefa.prioridade;

    // Badge de status
    const badgeStatus = document.getElementById('detalheStatus');
    badgeStatus.textContent = tarefa.concluida ? 'Concluída' : 'Pendente';
    if (tarefa.concluida) badgeStatus.classList.add('status-concluida');

    // Título, data e ID
    document.getElementById('detalheTitulo').textContent = tarefa.texto;
    document.getElementById('detalheCriadaEm').textContent = tarefa.criadaEm || '—';
    // slice(0, 8) exibe só os primeiros 8 caracteres do ID (suficiente para identificar)
    document.getElementById('detalheId').textContent = '#' + tarefa.id.slice(0, 8);

    // Anotações salvas (se houver)
    const anotacoesEl = document.getElementById('detalheAnotacoes');
    anotacoesEl.value = tarefa.anotacoes || '';

    // ── BOTÃO CONCLUIR / REABRIR ──────────────────────
    const btnConcluir = document.getElementById('btnConcluir');

    // Função auxiliar: atualiza a aparência do botão conforme o estado
    function atualizarBtnConcluir(concluida) {
      if (concluida) {
        btnConcluir.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Reabrir tarefa
        `;
        // Troca a classe para o visual "ghost" (transparente)
        btnConcluir.classList.add('ja-concluida');
      } else {
        btnConcluir.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Marcar como concluída
        `;
        btnConcluir.classList.remove('ja-concluida');
      }
    }

    // Define o visual inicial do botão
    atualizarBtnConcluir(tarefa.concluida);

    btnConcluir.addEventListener('click', function () {
      // Recarrega as tarefas para garantir dados atualizados
      const lista = JSON.parse(localStorage.getItem('tarefas') || '[]');
      const t = lista.find(function (x) { return x.id === idSelecionado; });

      if (t) {
        t.concluida = !t.concluida;
        localStorage.setItem('tarefas', JSON.stringify(lista));

        // Atualiza o badge de status na tela sem recarregar a página
        badgeStatus.textContent = t.concluida ? 'Concluída' : 'Pendente';
        if (t.concluida) {
          badgeStatus.classList.add('status-concluida');
        } else {
          badgeStatus.classList.remove('status-concluida');
        }

        atualizarBtnConcluir(t.concluida);
      }
    });

    // ── BOTÃO SALVAR ANOTAÇÕES ────────────────────────
    document.getElementById('btnSalvarNotas').addEventListener('click', function () {
      const lista = JSON.parse(localStorage.getItem('tarefas') || '[]');
      const t = lista.find(function (x) { return x.id === idSelecionado; });

      if (t) {
        // Salva o conteúdo do textarea dentro do objeto da tarefa
        t.anotacoes = anotacoesEl.value.trim();
        localStorage.setItem('tarefas', JSON.stringify(lista));

        // Feedback visual: muda o texto do botão por 2 segundos
        const btn = document.getElementById('btnSalvarNotas');
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '✓ Salvo!';
        btn.style.color = '#22c55e';
        btn.style.borderColor = '#22c55e';

        // setTimeout: executa uma função após um tempo (em milissegundos)
        setTimeout(function () {
          btn.innerHTML = textoOriginal;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000); // 2000ms = 2 segundos
      }
    });

    // ── BOTÃO DELETAR ─────────────────────────────────
    document.getElementById('btnDeletarDetalhe').addEventListener('click', function () {
      // confirm() abre uma caixa de diálogo nativa com OK / Cancelar
      // Retorna true se o usuário clicou em OK
      const confirmar = confirm('Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita.');

      if (confirmar) {
        const lista = JSON.parse(localStorage.getItem('tarefas') || '[]');
        const restantes = lista.filter(function (x) { return x.id !== idSelecionado; });
        localStorage.setItem('tarefas', JSON.stringify(restantes));
        // Volta para a lista após deletar
        window.location.href = 'tarefas.html';
      }
    });

    // ── BOTÃO SAIR ────────────────────────────────────
    document.getElementById('btnSair').addEventListener('click', function () {
      localStorage.removeItem('logado');
      window.location.href = 'login.html';
    });

  } // fim do bloco de detalhes


  // ---------------------------------------------------
  // PÁGINA DE CONTATO (contato.html)
  // ---------------------------------------------------
  const formContato = document.getElementById('formContato');

  if (formContato) {

    formContato.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const assunto = document.getElementById('contatoAssunto').value;

      if (!assunto) {
        alert('Por favor, selecione um assunto.');
        return;
      }

      // Simula o envio. Em um projeto real, aqui iria um fetch() para um servidor.
      const alerta = document.getElementById('alertaSucesso');
      alerta.style.display = 'flex';

      // Rola suavemente até o alerta para o usuário ver
      // scrollIntoView: garante que o elemento fique visível na tela
      // behavior: 'smooth' = animação suave; block: 'center' = centraliza
      alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // .reset(): método nativo que limpa todos os campos do formulário
      formContato.reset();
    });

  }

});