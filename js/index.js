document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const loginInput = document.getElementById("login");
    const senhaInput = document.getElementById("senha");
    const errorMessage = document.createElement("p"); // Elemento para exibir mensagens de erro
    errorMessage.style.color = "red";
    loginForm.appendChild(errorMessage);

    // Função para formatar o CPF
    function formatCPF(value) {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
    }

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

    // Event listener para formatar o CPF enquanto digita
    loginInput.addEventListener("input", function(event) {
        loginInput.value = formatCPF(loginInput.value);
    });

    // Event listener para aceitar apenas números
    loginInput.addEventListener("keypress", function(event) {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    });

    // Evento de envio do formulário de login
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Capturar os dados do formulário
        const cpf = loginInput.value.replace(/\D/g, ''); // Remove formatação do CPF
        const senha = senhaInput.value;

        // Validar o CPF
        if (!validarCPF(cpf)) {
            errorMessage.textContent = "CPF inválido. Por favor, insira um CPF válido.";
            return;
        }

        // Recuperar a lista de usuários do localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar se há um usuário com o CPF e senha correspondentes
        const usuarioLogado = usuarios.find(usuario => 
            usuario.cpf === cpf && usuario.senha === senha
        );

        if (usuarioLogado) {
            // Login bem-sucedido
            errorMessage.textContent = ""; // Limpa mensagem de erro
            localStorage.setItem("psicologoLogado", JSON.stringify(usuarioLogado)); // Salva o usuário logado
            alert("Login realizado com sucesso! Redirecionando para o perfil...");
            window.location.href = "principal.html"; // Redireciona para a página principal
        } else {
            // Login falhou
            errorMessage.textContent = "Usuário ou senha incorretos. Tente novamente.";
        }
    });
});