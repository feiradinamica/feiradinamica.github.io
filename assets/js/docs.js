"use strict";

// Variáveis globais para os elementos do DOM
const sidebarToggler = document.getElementById('docs-sidebar-toggler');
const sidebar = document.getElementById('docs-sidebar');

// Função para inicializar/reinicializar os comportamentos da página
function initDocs() {
    console.log('Docs.js: Iniciando (ou reiniciando) comportamentos.');

    // Certifique-se de que sidebarLinks seja reobtido, pois o DOM pode ter mudado
    const sidebarLinks = document.querySelectorAll('#docs-sidebar .scrollto');

    /* ===== Responsive Sidebar ====== */
    // Estas funções podem ser chamadas ao carregar/redimensionar a página
    // mas a lógica interna deve ser robusta para elementos existentes
    responsiveSidebar();

    // Re-adicionar listeners se eles puderem ser duplicados
    // ou certifique-se de que são adicionados apenas uma vez.
    // Para simplificar, vou manter a adição aqui, mas idealmente
    // se você chama initDocs múltiplas vezes, isso precisaria de um controle.
    if (sidebarToggler && !sidebarToggler._hasClickListener) { // Evita adicionar múltiplos listeners
        sidebarToggler.addEventListener('click', () => {
            if (sidebar.classList.contains('sidebar-visible')) {
                console.log('sidebar: visible -> hidden');
                sidebar.classList.remove('sidebar-visible');
                sidebar.classList.add('sidebar-hidden');
            } else {
                console.log('sidebar: hidden -> visible');
                sidebar.classList.remove('sidebar-hidden');
                sidebar.classList.add('sidebar-visible');
            }
        });
        sidebarToggler._hasClickListener = true; // Marca que o listener foi adicionado
    }

    /* ===== Smooth scrolling ====== */
    // Remova listeners antigos antes de adicionar novos para evitar duplicação
    // ou apenas certifique-se de que esta seção é executada apenas uma vez.
    sidebarLinks.forEach((sidebarLink) => {
        // Se o link já tem um listener 'click' adicionado, não adicione novamente.
        // Uma forma simples é verificar uma propriedade customizada.
        if (!sidebarLink._hasSmoothScrollListener) {
            sidebarLink.addEventListener('click', (e) => {
                e.preventDefault();
                var target = sidebarLink.getAttribute("href").replace('#', '');
                document.getElementById(target).scrollIntoView({ behavior: 'smooth' });

                // Collapse sidebar after clicking
                if (sidebar.classList.contains('sidebar-visible') && window.innerWidth < 1200) {
                    sidebar.classList.remove('sidebar-visible');
                    sidebar.classList.add('sidebar-hidden');
                }
            });
            sidebarLink._hasSmoothScrollListener = true; // Marca que o listener foi adicionado
        }
    });

    /* ===== Gumshoe SrollSpy ===== */
    // Destrua a instância anterior do Gumshoe se existir antes de criar uma nova.
    if (window.spy && typeof window.spy.destroy === 'function') {
        window.spy.destroy();
        console.log('Gumshoe: Instância anterior destruída.');
    }
    // Inicialize Gumshoe
    window.spy = new Gumshoe('#docs-nav a', {
        offset: 69, // sticky header height
    });
    console.log('Gumshoe: Nova instância inicializada.');

    /* ====== SimpleLightbox Plugin ======= */
    // Destrua a instância anterior do SimpleLightbox se existir
    if (window.lightbox && typeof window.lightbox.destroy === 'function') {
        window.lightbox.destroy();
        console.log('SimpleLightbox: Instância anterior destruída.');
    }
    // Inicialize SimpleLightbox
    window.lightbox = new SimpleLightbox('.simplelightbox-gallery a', {});
    console.log('SimpleLightbox: Nova instância inicializada.');
}

// Funções globais que não precisam ser reinicializadas (responsiveSidebar)
window.onload = function() {
    responsiveSidebar();
};

window.onresize = function() {
    responsiveSidebar();
};

function responsiveSidebar() {
    let w = window.innerWidth;
    if (w >= 1200) {
        if (sidebar) { // Verifique se sidebar existe
            sidebar.classList.remove('sidebar-hidden');
            sidebar.classList.add('sidebar-visible');
        }
    } else {
        if (sidebar) { // Verifique se sidebar existe
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
        }
    }
}

// Expõe a função initDocs globalmente ou como parte de um objeto Docs
// para que possa ser chamada de `index.html`
window.Docs = {
    init: initDocs
};