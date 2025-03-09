document.addEventListener("DOMContentLoaded", function() {
    const conteudoPrincipal = document.getElementById("conteudoPrincipal");
    const links = document.querySelectorAll('.menu ul li a');
    const sairLink = document.getElementById("sair");

    // Função para carregar conteúdo dinamicamente
    function carregarConteudo(pagina) {
        fetch(`${pagina}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar ${pagina}.html: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                // Insere o conteúdo da página
                conteudoPrincipal.innerHTML = data;

                // Extrair e executar scripts
                const scripts = conteudoPrincipal.querySelectorAll("script");
                scripts.forEach(script => {
                    const novoScript = document.createElement("script");
                    if (script.src) {
                        // Se o script tiver um src, carregue o arquivo externo
                        novoScript.src = script.src;
                    } else {
                        // Se for um script inline, copie o conteúdo
                        novoScript.textContent = script.textContent;
                    }
                    document.body.appendChild(novoScript).remove();
                });

                // Verificar se a página carregada é o perfil e executar o código correspondente
                if (pagina === "perfil" && typeof window.carregarPerfil === "function") {
                    window.carregarPerfil(); // Executa a função do perfil
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a página:', error);
                conteudoPrincipal.innerHTML = `<p>Erro ao carregar a página. Tente novamente mais tarde.</p>`;
            });
    }

    // Adiciona event listeners aos links do menu
    links.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const pagina = this.getAttribute("data-page");
            carregarConteudo(pagina);
        });
    });

    // Adiciona event listener ao link "Sair"
    sairLink.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "index.html"; // Redireciona para a página de login
    });

    // Carregar a página inicial por padrão
    carregarConteudo('inicio');
});