document.addEventListener("DOMContentLoaded", function () {
    const nomeCompletoInput = document.getElementById("nomeCompleto");
    const cpfInput = document.getElementById("cpf");
    const crpInput = document.getElementById("crp");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const fotoInput = document.getElementById("fotoInput");
    const salvarPerfilButton = document.getElementById("salvarPerfil");
    const cancelarEdicaoButton = document.getElementById("cancelarEdicao");

    // Recupera os dados do psicólogo logado
    const psicologoLogado = JSON.parse(localStorage.getItem("psicologoLogado")) || {};

    // Preenche os campos com os dados atuais
    nomeCompletoInput.value = psicologoLogado.nome || "";
    cpfInput.value = psicologoLogado.cpf || "";
    crpInput.value = psicologoLogado.crp || "";
    emailInput.value = psicologoLogado.email || "";
    senhaInput.value = psicologoLogado.senha || "";

    // Mantém a foto de perfil se já existir
    if (psicologoLogado.foto) {
        document.getElementById("fotoPreview").src = psicologoLogado.foto;
    }

    // Lida com o upload da foto de perfil
    fotoInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                psicologoLogado.foto = e.target.result; // Salva a foto
            };
            reader.readAsDataURL(file);
        }
    });

    // Salvar perfil
    salvarPerfilButton.addEventListener("click", function () {
        // Atualiza os dados
        psicologoLogado.nome = nomeCompletoInput.value;
        psicologoLogado.cpf = cpfInput.value;
        psicologoLogado.crp = crpInput.value;
        psicologoLogado.email = emailInput.value;
        psicologoLogado.senha = senhaInput.value;

        // Espera a foto ser carregada antes de salvar
        setTimeout(() => {
            localStorage.setItem("psicologoLogado", JSON.stringify(psicologoLogado));
            alert("Perfil atualizado com sucesso!");
            window.location.href = "../pages/perfil.html"; // Caminho correto
        }, 500);
    });

    // Cancelar edição
    cancelarEdicaoButton.addEventListener("click", function () {
        window.location.href = "../pages/perfil.html"; // Caminho corrigido
    });
});
