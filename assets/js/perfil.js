// Função painel que será executada quando a página de perfil for carregada
function carregarPerfil() {
    // Referências aos elementos
    const conteudopainel = document.getElementById("conteudopainel"); // Contêiner dinâmico
    const perfilTitulo = document.getElementById("perfilTitulo");
    const perfilNome = document.getElementById("perfilNome");
    const perfilCPF = document.getElementById("perfilCPF");
    const perfilCRP = document.getElementById("perfilCRP");
    const perfilEmail = document.getElementById("perfilEmail");
    const editarPerfilButton = document.getElementById("editarPerfilButton");

    // Recuperar os dados do psicólogo logado do localStorage
    const psicologoLogado = JSON.parse(localStorage.getItem("psicologoLogado"));

    // Verificar se há dados do psicólogo logado
    if (psicologoLogado) {
        // Carregar o nome do psicólogo no título
        if (perfilTitulo) perfilTitulo.textContent = psicologoLogado.nome;

        // Carregar as informações do psicólogo
        if (perfilNome) perfilNome.textContent = psicologoLogado.nome;
        if (perfilCPF) perfilCPF.textContent = psicologoLogado.cpf;
        if (perfilCRP) perfilCRP.textContent = psicologoLogado.crp;
        if (perfilEmail) perfilEmail.textContent = psicologoLogado.email;
    } else {
        // Caso não haja dados no localStorage, exibir uma mensagem ou redirecionar
        alert("Nenhum psicólogo logado. Redirecionando para a página de login...");
        window.location.href = "../index.html"; // Redireciona para a página de login
    }

    // Configurar o botão "Editar Perfil" para carregar o formulário dinamicamente
    if (editarPerfilButton) {
        editarPerfilButton.addEventListener("click", function(event) {
            event.preventDefault();

            // Carregar o formulário de edição dinamicamente
            fetch("../pages/editar-perfil.html")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro ao carregar o formulário de edição.");
                    }
                    return response.text();
                })
                .then(data => {
                    conteudopainel.innerHTML = data; // Substituir o conteúdo pelo formulário

                    // Configurar os eventos do formulário de edição
                    configurarFormularioEdicao();
                })
                .catch(error => {
                    console.error("Erro ao carregar o formulário de edição:", error);
                });
        });
    }
}

// Configurar os eventos do formulário de edição
function configurarFormularioEdicao() {
    const salvarPerfilButton = document.getElementById("salvarPerfil");
    const cancelarEdicaoButton = document.getElementById("cancelarEdicao");

    // Salvar alterações no perfil
    if (salvarPerfilButton) {
        salvarPerfilButton.addEventListener("click", function () {
            const nomeCompleto = document.getElementById("nomeCompleto").value;
            const cpf = document.getElementById("cpf").value;
            const crp = document.getElementById("crp").value;
            const email = document.getElementById("email").value;

            // Atualizar os dados no localStorage
            const psicologoLogado = {
                nome: nomeCompleto,
                cpf: cpf,
                crp: crp,
                email: email,
            };
            localStorage.setItem("psicologoLogado", JSON.stringify(psicologoLogado));

            alert("Perfil atualizado com sucesso!");

            // Recarregar o perfil
            carregarPerfil();
        });
    }

    // Cancelar edição e voltar ao perfil
    if (cancelarEdicaoButton) {
        cancelarEdicaoButton.addEventListener("click", carregarPerfil);
    }
}

// Verificar se a página de perfil foi carregada diretamente (não dinamicamente)
if (document.getElementById("perfilTitulo")) {
    carregarPerfil(); // Executa a função painel se o elemento existir
}

// Exportar a função para ser chamada externamente
window.carregarPerfil = carregarPerfil;
