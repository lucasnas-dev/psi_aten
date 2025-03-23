document.addEventListener("DOMContentLoaded", function () {
    const conteudopainel = document.getElementById("conteudopainel");
    const links = document.querySelectorAll('.menu ul li a');
    const sairLink = document.getElementById("sair");

    if (!conteudopainel) {
        console.error("Elemento 'conteudopainel' não foi encontrado.");
        return;
    }

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
                // Insere o conteúdo da página carregada no painel
                conteudopainel.innerHTML = data;
    
                // Lógica específica para o perfil.html
                if (pagina === "perfil") {
                    const scriptJaCarregado = document.querySelector('script[src="../assets/js/perfil.js"]');
                    if (!scriptJaCarregado) {
                        const scriptPerfil = document.createElement("script");
                        scriptPerfil.src = "../assets/js/perfil.js";
                        document.body.appendChild(scriptPerfil);
    
                        scriptPerfil.onload = () => {
                            if (typeof window.carregarPerfil === "function") {
                                console.log("perfil.js carregado. Executando carregarPerfil.");
                                window.carregarPerfil();
                            }
    
                            // Adicionar evento ao botão "Editar Perfil" após carregar o perfil.html
                            const botaoEditarPerfil = document.querySelector('#editar-perfil');
                            if (botaoEditarPerfil) {
                                botaoEditarPerfil.addEventListener("click", function (event) {
                                    event.preventDefault();
                                    carregarConteudo("editar-perfil"); // Carrega o editar-perfil.html
                                });
                            } else {
                                console.warn("Botão 'Editar Perfil' não encontrado após carregar perfil.html.");
                            }
                        };
                    } else if (typeof window.carregarPerfil === "function") {
                        window.carregarPerfil();
    
                        // Adicionar evento ao botão "Editar Perfil" após carregar o perfil.html
                        const botaoEditarPerfil = document.querySelector('#editar-perfil');
                        if (botaoEditarPerfil) {
                            botaoEditarPerfil.addEventListener("click", function (event) {
                                event.preventDefault();
                                carregarConteudo("editar-perfil"); // Carrega o editar-perfil.html
                            });
                        } else {
                            console.warn("Botão 'Editar Perfil' não encontrado após carregar perfil.html.");
                        }
                    }
                }
    
            })
            .catch(error => {
                console.error("Erro ao carregar a página:", error);
                conteudopainel.innerHTML = `
                    <p style="color: red; text-align: center;">
                        Erro ao carregar a página. Por favor, tente novamente mais tarde.
                    </p>`;
            });
    }
    // Adiciona event listeners aos links do menu
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const pagina = this.getAttribute("data-page");
            carregarConteudo(pagina); // Carrega a página correspondente dinamicamente
        });
    });

    // Adiciona event listener ao link "Sair"
    if (sairLink) {
        sairLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "../index.html"; // Redireciona para a página de login
        });
    } else {
        console.warn("Link 'Sair' não encontrado.");
    }

    // Carregar a página inicial por padrão
    carregarConteudo("inicio");
});