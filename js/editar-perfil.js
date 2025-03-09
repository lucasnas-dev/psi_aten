document.addEventListener("DOMContentLoaded", function() {
    // Referências aos elementos
    const nomeCompletoInput = document.getElementById("nomeCompleto");
    const cpfInput = document.getElementById("cpf");
    const crpInput = document.getElementById("crp");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const fotoInput = document.getElementById("fotoInput");
    const salvarPerfilButton = document.getElementById("salvarPerfil");
    const cancelarEdicaoButton = document.getElementById("cancelarEdicao");

    // Recuperar os dados do psicólogo logado do localStorage
    const psicologoLogado = JSON.parse(localStorage.getItem("psicologoLogado")) || {
        nome: "Dr. João Silva", // Valor padrão caso não haja dados no localStorage
        cpf: "123.456.789-00",
        crp: "12345/SP",
        email: "joao.silva@exemplo.com",
        senha: "senha123",
        foto: "img/default-avatar.png" // Caminho da foto padrão
    };

    // Preencher o formulário com os dados atuais
    nomeCompletoInput.value = psicologoLogado.nome;
    cpfInput.value = psicologoLogado.cpf;
    crpInput.value = psicologoLogado.crp;
    emailInput.value = psicologoLogado.email;
    senhaInput.value = psicologoLogado.senha;

    // Lidar com o upload da foto de perfil
    fotoInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                psicologoLogado.foto = e.target.result; // Atualiza a foto no objeto
            };
            reader.readAsDataURL(file); // Converte o arquivo para Base64
        }
    });

    // Salvar as alterações no localStorage
    salvarPerfilButton.addEventListener("click", function() {
        // Atualizar os dados do psicólogo
        psicologoLogado.nome = nomeCompletoInput.value;
        psicologoLogado.cpf = cpfInput.value;
        psicologoLogado.crp = crpInput.value;
        psicologoLogado.email = emailInput.value;
        psicologoLogado.senha = senhaInput.value;

        // Salvar os dados atualizados no localStorage
        localStorage.setItem("psicologoLogado", JSON.stringify(psicologoLogado));

        // Exibir mensagem de sucesso
        alert("Perfil atualizado com sucesso!");

        // Redirecionar para a página de perfil
        window.location.href = "perfil.html";
    });

    // Cancelar a edição e voltar para a página de perfil
    cancelarEdicaoButton.addEventListener("click", function() {
        window.location.href = "perfil.html";
    });
});