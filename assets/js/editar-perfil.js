document.addEventListener("DOMContentLoaded", function () {
    const nomeCompletoInput = document.getElementById("nomeCompleto");
    const cpfInput = document.getElementById("cpf");
    const crpInput = document.getElementById("crp");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const salvarPerfilButton = document.getElementById("salvarPerfil");
    const cancelarEdicaoButton = document.getElementById("cancelarEdicao");

    // Simulação: dados do usuário logado
    const psicologoLogado = {
        nome: "Lucas Souza",
        cpf: "12345678901",
        crp: "CRP123456",
        email: "lucas@email.com",
        senha: "senha123"
    };

    // Preenche os campos com os dados atuais
    nomeCompletoInput.value = psicologoLogado.nome || "";
    cpfInput.value = psicologoLogado.cpf || "";
    crpInput.value = psicologoLogado.crp || "";
    emailInput.value = psicologoLogado.email || "";
    senhaInput.value = psicologoLogado.senha || "";

    // Salvar perfil
    salvarPerfilButton.addEventListener("click", function () {
        // Atualiza os dados do usuário com os valores do formulário
        psicologoLogado.nome = nomeCompletoInput.value;
        psicologoLogado.cpf = cpfInput.value;
        psicologoLogado.crp = crpInput.value;
        psicologoLogado.email = emailInput.value;
        psicologoLogado.senha = senhaInput.value;

        // Simulação: exibe mensagem e redireciona
        alert("Perfil atualizado com sucesso!");
        window.location.href = "../pages/perfil.html";
    });

    // Cancelar edição
    cancelarEdicaoButton.addEventListener("click", function () {
        window.location.href = "../pages/perfil.html";
    });
});
