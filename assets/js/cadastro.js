document.addEventListener("DOMContentLoaded", function () {
    const cadastroForm = document.getElementById("cadastroForm");

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

    // Função para validar o CRP
    function validarCRP(crp) {
        crp = crp.replace(/\D/g, ''); // Remove caracteres não numéricos
        return crp.length >= 5; // Exemplo: CRP deve ter pelo menos 5 dígitos
    }

    // Função para validar a senha
    function validarSenha(senha) {
        return senha.length >= 6; // Senha deve ter pelo menos 6 caracteres
    }

    // Função para exibir mensagens de erro
    function exibirErro(campo, mensagem) {
        const erroElemento = document.getElementById(`${campo}Error`);
        erroElemento.textContent = mensagem;
        erroElemento.style.display = "block";
        document.getElementById(campo).classList.add("error-input");
    }

    // Função para limpar mensagens de erro
    function limparErros() {
        document.querySelectorAll(".error-message").forEach(function (el) {
            el.style.display = "none";
        });
        document.querySelectorAll(".error-input").forEach(function (el) {
            el.classList.remove("error-input");
        });
    }

    // Função para salvar usuários no backend
    async function salvarUsuario(novoUsuario) {
        try {
            const response = await fetch("http://localhost:3000/api/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoUsuario),
            });

            const data = await response.json();
            if (response.ok) {
                exibirMensagemSucesso();
            } else {
                exibirErro("cpf", data.mensagem || "Erro ao cadastrar usuário.");
            }
        } catch (error) {
            console.error("Erro:", error);
            exibirErro("cpf", "Erro ao conectar com o servidor.");
        }
    }

    // Função para exibir mensagem de sucesso
    function exibirMensagemSucesso() {
        const mensagemSucesso = document.createElement("div");
        mensagemSucesso.textContent = "Cadastro realizado com sucesso!";
        mensagemSucesso.style.position = "fixed";
        mensagemSucesso.style.top = "50%";
        mensagemSucesso.style.left = "50%";
        mensagemSucesso.style.transform = "translate(-50%, -50%)";
        mensagemSucesso.style.backgroundColor = "#4CAF50";
        mensagemSucesso.style.color = "white";
        mensagemSucesso.style.padding = "20px";
        mensagemSucesso.style.borderRadius = "10px";
        mensagemSucesso.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        mensagemSucesso.style.zIndex = "1000";
        mensagemSucesso.style.fontSize = "1.5em";
        mensagemSucesso.style.textAlign = "center";

        document.body.appendChild(mensagemSucesso);

        setTimeout(() => {
            mensagemSucesso.remove();
            window.location.href = "../index.html"; // Redireciona para a página de login
        }, 2000);
    }

    // Aplicar máscara de CPF
    document.getElementById("cpf").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Evento de envio do formulário
    cadastroForm.addEventListener("submit", function (event) {
        event.preventDefault();
        limparErros();

        // Capturar os dados do formulário
        const nomeCompleto = document.getElementById("nomeCompleto").value;
        const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
        const crp = document.getElementById("crp").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // Validar campos
        let isValid = true;

        if (!validarCPF(cpf)) {
            exibirErro("cpf", "CPF inválido. Por favor, insira um CPF válido.");
            isValid = false;
        }

        if (!validarCRP(crp)) {
            exibirErro("crp", "CRP inválido. Deve ter pelo menos 5 dígitos.");
            isValid = false;
        }

        if (!validarEmail(email)) {
            exibirErro("email", "E-mail inválido. Por favor, insira um e-mail válido.");
            isValid = false;
        }

        if (!validarSenha(senha)) {
            exibirErro("senha", "Senha inválida. Deve ter pelo menos 6 caracteres.");
            isValid = false;
        }

        // Se todos os campos forem válidos, salvar o usuário
        if (isValid) {
            const psicologo = { nome: nomeCompleto, cpf, crp, email, senha };
            salvarUsuario(psicologo);
        }
    });

    // Limpar mensagens de erro ao resetar o formulário
    cadastroForm.addEventListener("reset", limparErros);
});