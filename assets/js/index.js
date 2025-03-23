document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginInput = document.getElementById("cpfInput");
    const senhaInput = document.getElementById("senhaInput");
    const errorMessage = document.getElementById("loginError");

    // Função para formatar o CPF
    function formatCPF(value) {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
    }

    // Validar CPF no envio
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove formatação
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Tamanho e repetição
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }

    // Formatar CPF enquanto digita
    loginInput.addEventListener("input", function () {
        loginInput.value = formatCPF(loginInput.value);
    });

    // Submeter formulário
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const cpf = loginInput.value.replace(/\D/g, '');
        const senha = senhaInput.value;

        // Validação
        if (!validarCPF(cpf)) {
            errorMessage.textContent = "CPF inválido.";
            errorMessage.style.display = "block";
            return;
        }

        // Envio ao backend
        fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, senha })
        })
        .then(response => {
            if (!response.ok) {
                // Diferentes mensagens para status de erro
                if (response.status === 401) throw new Error("CPF ou senha incorretos.");
                if (response.status === 500) throw new Error("Erro no servidor.");
                throw new Error("Erro desconhecido.");
            }
            return response.json();
        })
        .then(() => {
            // Login bem-sucedido
            alert(`Login bem-sucedido!`);
            window.location.href = "pages/painel.html"; // Redirecionar para a página do painel
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        });
    });
});
