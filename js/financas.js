// Função para adicionar um novo item à lista
function adicionarItem() {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const data = document.getElementById("data").value;
    const opcaoPagamento = document.getElementById("opcoes").value;

    // Limpar os campos após a entrada
    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("data").value = "";
    document.getElementById("opcoes").value = "";

    if (descricao && !isNaN(valor) && data && opcaoPagamento) {
        const item = { descricao, valor, data, opcaoPagamento };
        const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];
        listaItens.push(item);
        localStorage.setItem("listaItens", JSON.stringify(listaItens));
        atualizarLista();
        alert(`✅ Confirmação:\nO pagamento do cliente ${descricao} foi adicionado com sucesso!`);
    } else {
        alert("Preencha todos os campos corretamente.");
    }
}

// Função para atualizar a lista de itens na interface
function atualizarLista() {
    const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];
    const listaItensElement = document.getElementById("lista-itens");
    listaItensElement.innerHTML = "";

    listaItens.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.descricao} - R$ ${item.valor.toFixed(2)} - ${item.data} - ${getOpcaoTexto(item.opcaoPagamento)}`;
        const removerBtn = document.createElement("button");
        removerBtn.textContent = "Remover";
        removerBtn.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
        removerBtn.onclick = () => removerItem(index);
        li.appendChild(removerBtn);
        listaItensElement.appendChild(li);
    });
}

// Função para converter o valor do select em texto legível
function getOpcaoTexto(opcao) {
    switch (opcao) {
        case "opcao1":
            return "Débito";
        case "opcao2":
            return "Crédito";
        case "opcao3":
            return "Pix";
        case "opcao4":
            return "Dinheiro";
        default:
            return "Desconhecido";
    }
}

// Função para remover um item da lista
function removerItem(index) {
    const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];
    listaItens.splice(index, 1);
    localStorage.setItem("listaItens", JSON.stringify(listaItens));
    atualizarLista();
    alert('✔️ Pagamento efetuado com sucesso. Excluindo da lista!');
}

// Função para filtrar itens por data
function filtrarPorData() {
    const dataFiltro = document.getElementById("data").value;
    const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];
    const listaFiltrada = listaItens.filter(item => item.data === dataFiltro);
    const listaItensElement = document.getElementById("lista-itens");
    listaItensElement.innerHTML = "";

    if (listaFiltrada.length === 0) {
        alert("🔍 Nenhum pagamento encontrado para a data selecionada!");
        return; // Encerra a função se não houver itens
    }

    listaFiltrada.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.descricao} - R$ ${item.valor.toFixed(2)} - ${item.data} - ${getOpcaoTexto(item.opcaoPagamento)}`;
        const removerBtn = document.createElement("button");
        removerBtn.textContent = "Remover";
        removerBtn.classList.add("remover-btn");
        removerBtn.onclick = () => removerItem(index);
        li.appendChild(removerBtn);
        listaItensElement.appendChild(li);
    });
}

// Função para limpar o filtro
function limparFiltro() {
    document.getElementById("data").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("opcoes").value = "";
    atualizarLista();
}

// Função para exibir notificações do dia
function exibirNotificacoesDoDia() {
    if (Notification.permission === "granted") {
        const hoje = new Date().toISOString().split('T')[0];
        const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];

        listaItens.forEach(item => {
            if (item.data === hoje) {
                new Notification("Lembrete de Pagamento", {
                    body: `Hoje é o dia de pagamento para ${item.descricao} no valor de R$ ${item.valor.toFixed(2)} via ${getOpcaoTexto(item.opcaoPagamento)}.`,
                });
            }
        });
    }
}

// Configurações iniciais
document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('welcome-text');
    const text = 'Seja bem-vindo a Lista de Finanças';
    let index = 0;

    function type() {
        textElement.textContent += text[index];
        index++;

        if (index < text.length) {
            setTimeout(type, 300); // Ajustar a velocidade (em milissegundos) de digitação
        }
    }

    type();

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    verificarNotificacoesDiarias();
    setInterval(verificarNotificacoesDiarias, 24 * 60 * 60 * 1000); // Verifica a cada 24 horas
});

// Função para verificar notificações diárias
function verificarNotificacoesDiarias() {
    const agora = new Date();
    const horarioAlvo = new Date();
    horarioAlvo.setHours(5, 10, 0, 0);

    if (agora > horarioAlvo) {
        horarioAlvo.setDate(horarioAlvo.getDate() + 1);
    }

    const tempoAteHorarioAlvo = horarioAlvo - agora;

    setTimeout(() => {
        exibirNotificacoesDoDia();
    }, tempoAteHorarioAlvo);
}

// Carregar a lista inicial ao carregar a página
atualizarLista();

// Carregar a lista inicial ao carregar a página
atualizarLista();

document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('welcome-text');
    const text = 'Seja bem-vindo a Lista de Finanças';
    let index = 0;

    function type() {
        textElement.textContent += text[index];
        index++;

        if (index < text.length) {
            setTimeout(type, 300); // Ajustar a velocidade (em milissegundos) de digitação
        }
    }

    type();
    // Solicitar permissão para notificações
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    // Verificar notificações diariamente às 05:10
    verificarNotificacoesDiarias();
    setInterval(verificarNotificacoesDiarias, 24 * 60 * 60 * 1000); // Verifica a cada 24 horas
});

// Função para verificar notificações diárias
function verificarNotificacoesDiarias() {
    const agora = new Date();
    const horarioAlvo = new Date();
    horarioAlvo.setHours(5, 10, 0, 0); // Define as 05:10

    // Se já passou das 05:10 hoje, define o alvo para amanhã às 05:10
    if (agora > horarioAlvo) {
        horarioAlvo.setDate(horarioAlvo.getDate() + 1);
    }

    const tempoAteHorarioAlvo = horarioAlvo - agora;

    setTimeout(() => {
        exibirNotificacoesDoDia();
    }, tempoAteHorarioAlvo);
}

// Função para exibir notificações do dia
function exibirNotificacoesDoDia() {
    if (Notification.permission === "granted") {
        const hoje = new Date().toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD
        const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];

        listaItens.forEach(item => {
            if (item.data === hoje) {
                new Notification("Lembrete de Pagamento", {
                    body: `Hoje é o dia de pagamento para ${item.descricao} no valor de R$ ${item.valor.toFixed(2)}.`,
                });
            }
        });
    }
}