// URL da rota protegida para obter os dados do perfil
const urlPerfil = "http://localhost:3000/api/perfil";

// Função global para carregar os dados do perfil
window.carregarPerfil = function() {
    console.log("Função carregarPerfil foi chamada!");

    fetch(urlPerfil, {
        method: "GET",
        credentials: "include", // Envia cookies automaticamente
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Adiciona o token no cabeçalho
        }
    })
    .then(response => {
        console.log("Resposta recebida do servidor:", response.status);
        if (!response.ok) {
            if (response.status === 401) throw new Error("Você precisa fazer login.");
            if (response.status === 404) throw new Error("Dados do perfil não encontrados.");
            throw new Error("Erro ao obter os dados do perfil.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Dados recebidos do backend:", data);

        // Verifica e preenche as informações do perfil no HTML
        const nome = document.getElementById("nome-psicologo");
        const cpf = document.getElementById("cpf");
        const crp = document.getElementById("crp");
        const email = document.getElementById("email");
        const fotoPerfil = document.getElementById("foto-perfil");

        if (nome) nome.textContent = data.nome || "Nome não disponível";
        if (cpf) cpf.textContent = data.cpf || "CPF não disponível";
        if (crp) crp.textContent = data.crp || "CRP não disponível";
        if (email) email.textContent = data.email || "Email não disponível";
        if (fotoPerfil) {
            fotoPerfil.src = data.foto || "../assets/img/default-avatar.png"; // Foto padrão
        }
    })
    .catch(error => {
        console.error("Erro ao carregar perfil:", error.message);

        // Exibe mensagem de erro amigável no HTML
        const errorMessage = document.createElement("p");
        errorMessage.style.color = "red";
        errorMessage.textContent = error.message;
        document.body.appendChild(errorMessage);
    });
};

