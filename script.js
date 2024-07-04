document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('nomePesquisador')) {
        var nomePesquisador = prompt('Por favor, digite seu nome:');
        if (nomePesquisador) {
            localStorage.setItem('nomePesquisador', nomePesquisador);
        }
    }
});

document.getElementById('formularioPesquisa').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio tradicional do formulário

    // Captura os dados do formulário
    var dadosDoFormulario = {
        regiao: document.getElementById('regiao').value,
        nome: document.getElementById('nome').value,
        seuBairro: document.getElementById('seuBairro').value,
        sexo: document.getElementById('sexo').value,
        idade: document.getElementById('idade').value,
        avaliacaoGoverno: document.getElementById('avaliacaoGoverno').value,
        notaGoverno: document.getElementById('notaGoverno').value,
        votoEspontaneo: document.getElementById('votoEspontaneo').value,
        votoCandidatos: document.getElementById('votoCandidatos').value,
        porqueEscolheu: document.getElementById('porqueEscolheu').value,
        segundaOpcaoVoto: document.getElementById('segundaOpcaoVoto').value,
        rejeicaoVoto: document.getElementById('rejeicaoVoto').value,
        nomeVereador: document.getElementById('nomeVereador').value,
        condenacaoMarco: document.getElementById('condenacaoMarco').value,
        condenacaoCris: document.getElementById('condenacaoCris').value,
        uniaoCrisMarco: document.getElementById('uniaoCrisMarco').value,
        oqueachaCondenacao: document.getElementById('oqueachaCondenacao').value,
        telefone: document.getElementById('telefone').value
    };

    // Gera uma chave única para cada entrada
    var chave = 'DadosFormulario_' + Date.now();
    // Armazena os dados no localStorage em formato de string JSON
    localStorage.setItem(chave, JSON.stringify(dadosDoFormulario));

    alert('Dados salvos com sucesso!');

    // Limpa manualmente cada campo
    document.getElementById('regiao').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('seuBairro').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('avaliacaoGoverno').value = '';
    document.getElementById('notaGoverno').value = '';
    document.getElementById('votoEspontaneo').value = '';
    document.getElementById('votoCandidatos').value = '';
    document.getElementById('porqueEscolheu').value = '';
    document.getElementById('segundaOpcaoVoto').value = '';
    document.getElementById('rejeicaoVoto').value = '';
    document.getElementById('nomeVereador').value = '';
    document.getElementById('condenacaoMarco').value = '';
    document.getElementById('condenacaoCris').value = '';
    document.getElementById('uniaoCrisMarco').value = '';
    document.getElementById('oqueachaCondenacao').value = '';
    document.getElementById('telefone').value = '';
});

// CODIGO INSTALAÇÃO PERSONALIZADA -------------------------------------------------------------
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Mostrar o botão apenas se o PWA não estiver instalado.
    // Esta é uma aproximação, já que não podemos verificar diretamente se o PWA está instalado.
    const btnInstalarApp = document.getElementById('btnInstalarApp');
    if (btnInstalarApp) {
        btnInstalarApp.style.display = 'block';
    }
});

document.getElementById('btnInstalarApp')?.addEventListener('click', () => {
    // Ocultar o botão quando o usuário decide instalar o PWA.
    const btnInstalarApp = document.getElementById('btnInstalarApp');
    btnInstalarApp.style.display = 'none';

    // Mostrar o prompt de instalação.
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Usuário aceitou a instalação do app');
        } else {
            console.log('Usuário recusou a instalação do app');
        }
        deferredPrompt = null;
    });
});

window.addEventListener('appinstalled', () => {
    console.log('A aplicação foi instalada.');

    // Ocultar o botão após a instalação.
    const btnInstalarApp = document.getElementById('btnInstalarApp');
    if (btnInstalarApp) {
        btnInstalarApp.style.display = 'none';
    }
});

// Função para exportar dados em CSV
function exportarDadosParaCSV() {
    var senha = prompt("Digite a senha para exportar:");
    if (senha == "senhaSecreta") {
        var dadosRecuperados = [];
        for (var i = 0; i < localStorage.length; i++) {
            var chave = localStorage.key(i);
            if (chave.startsWith('DadosFormulario_')) {
                var valor = localStorage.getItem(chave);
                dadosRecuperados.push(JSON.parse(valor));
            }
        }

        // Modificação para incluir o nome do pesquisador e a data no nome do arquivo
        var nomePesquisador = localStorage.getItem('nomePesquisador') || 'pesquisador';
        var dataAtual = new Date().toISOString().slice(0,10); // Formato 'AAAA-MM-DD'
        var nomeArquivo = `dados_pesquisa_${nomePesquisador}_${dataAtual}.csv`;

        var csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        var cabeçalhos = Object.keys(dadosRecuperados[0]).join(",") + "\r\n";
        csvContent += cabeçalhos;

        dadosRecuperados.forEach(function(obj) {
            var row = Object.values(obj).map(function(val){
                // Assegura que strings com vírgulas sejam envoltas em aspas
                return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
            }).join(",");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", nomeArquivo);
        document.body.appendChild(link);

        link.click(); // Inicia o download
    } else {
        alert("Senha incorreta!");
    }
}

// Event listener para enviar o email quando o dispositivo estiver online
window.addEventListener('online', function() {
    enviarEmailCSV();
});

// Configuração do EmailJS
const emailjsConfig = {
    serviceID: 'service_mq3mlv5', // ID do seu serviço no EmailJS
    templateID: 'template_vcqq8sf', // ID do template de email no EmailJS
    publicKey: 'J8Uij04yqVsNpSxGN', // Chave pública do EmailJS
    privateKey: 'myTqFl3aVGZ5TOWcxpBhE' // Chave privada do EmailJS
};

// Função para enviar email com dados CSV
function enviarEmailCSV() {
    // Recupera os dados do cache ou de onde estiverem armazenados
    var dadosCSV = gerarDadosCSV(); // Função para gerar o CSV com os dados do cache

    // Configuração do email
    var templateParams = {
        reply_to: 'reply_to_value', // Pode ser necessário dependendo do template
        to_name: 'to_name_value', // Pode ser necessário dependendo do template
        message_html: dadosCSV // Conteúdo do email é o CSV gerado
    };

    // Envia o email usando EmailJS
    emailjs.send(emailjsConfig.serviceID, emailjsConfig.templateID, templateParams, {
        user_id: emailjsConfig.publicKey // Usa a chave pública como user_id
    }).then(function(response) {
        console.log('Email enviado com sucesso!', response);
    }, function(error) {
        console.log('Erro ao enviar email:', error);
    });
}

// Função para gerar o CSV com os dados do cache
function gerarDadosCSV() {
    var dadosRecuperados = [];
    for (var i = 0; i < localStorage.length; i++) {
        var chave = localStorage.key(i);
        if (chave.startsWith('DadosFormulario_')) {
            var valor = localStorage.getItem(chave);
            dadosRecuperados.push(JSON.parse(valor));
        }
    }

    // Formatação dos dados para CSV
    var csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    var cabeçalhos = Object.keys(dadosRecuperados[0]).join(",") + "\r\n";
    csvContent += cabeçalhos;

    dadosRecuperados.forEach(function(obj) {
        var row = Object.values(obj).map(function(val){
            return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",");
        csvContent += row + "\r\n";
    });

    return csvContent;
}
