document.addEventListener("DOMContentLoaded", function() {
    const cadastroForm = document.getElementById("cadastroForm");
    const errorMessage = document.createElement("p"); // Elemento para exibir mensagens de erro
    errorMessage.style.color = "red";
    cadastroForm.appendChild(errorMessage);

    // Função para validar o CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove formatação
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica tamanho e dígitos repetidos

        // Cálculo dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Função para validar o e-mail
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato básico de e-mail
        return regex.test(email);
    }

    // Função para salvar usuários
    function salvarUsuario(novoUsuario) {
        // Recuperar a lista de usuários do localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar se o usuário já existe (por CPF ou e-mail)
        const usuarioExistente = usuarios.find(usuario => 
            usuario.cpf === novoUsuario.cpf || usuario.email === novoUsuario.email
        );

        if (usuarioExistente) {
            errorMessage.textContent = "Usuário já cadastrado com este CPF ou e-mail.";
            return false; // Impede o cadastro de usuários duplicados
        }

        // Adicionar o novo usuário à lista
        usuarios.push(novoUsuario);

        // Salvar a lista atualizada no localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        return true; // Cadastro bem-sucedido
    }

    // Função para exibir mensagem de sucesso estilosa
    function exibirMensagemSucesso() {
        // Criar o elemento da mensagem
        const mensagemSucesso = document.createElement("div");
        mensagemSucesso.textContent = "Cadastro realizado com sucesso!";
        mensagemSucesso.style.position = "fixed";
        mensagemSucesso.style.top = "50%";
        mensagemSucesso.style.left = "50%";
        mensagemSucesso.style.transform = "translate(-50%, -50%)";
        mensagemSucesso.style.backgroundColor = "#4CAF50"; // Verde
        mensagemSucesso.style.color = "white";
        mensagemSucesso.style.padding = "20px";
        mensagemSucesso.style.borderRadius = "10px";
        mensagemSucesso.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        mensagemSucesso.style.zIndex = "1000";
        mensagemSucesso.style.fontSize = "1.5em";
        mensagemSucesso.style.textAlign = "center";

        // Adicionar a mensagem ao corpo do documento
        document.body.appendChild(mensagemSucesso);

        // Remover a mensagem após 2 segundos e redirecionar para a página de login
        setTimeout(() => {
            mensagemSucesso.remove();
            window.location.href = "index.html"; // Redireciona para a página de login
        }, 2000); // 2000 milissegundos = 2 segundos
    }

    // Evento de envio do formulário
    cadastroForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Capturar os dados do formulário
        const nomeCompleto = document.getElementById("nomeCompleto").value;
        const cpf = document.getElementById("cpf").value.replace(/\D/g, ''); // Remove formatação do CPF
        const crp = document.getElementById("crp").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // Validar CPF
        if (!validarCPF(cpf)) {
            errorMessage.textContent = "CPF inválido. Por favor, insira um CPF válido.";
            return;
        }

        // Validar e-mail
        if (!validarEmail(email)) {
            errorMessage.textContent = "E-mail inválido. Por favor, insira um e-mail válido.";
            return;
        }

        // Criar um objeto com os dados do psicólogo
        const psicologo = {
            nome: nomeCompleto,
            cpf: cpf,
            crp: crp,
            email: email,
            senha: senha
        };

        // Salvar o usuário
        if (salvarUsuario(psicologo)) {
            errorMessage.textContent = ""; // Limpa mensagem de erro
            exibirMensagemSucesso(); // Exibe a mensagem de sucesso estilosa
        }
    });
});