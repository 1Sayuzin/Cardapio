// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const searchInput = document.getElementById('searchInput');
    const menuItems = document.querySelectorAll('.menu-item');
    const navLinks = document.querySelectorAll('.nav a');
    const header = document.querySelector('.header');
    
    // Funcionalidade de filtro do menu
    function initMenuFilter() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Remove classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona classe active ao botão clicado
                this.classList.add('active');
                
                // Filtra as categorias
                filterMenuCategories(category);
                
                // Adiciona animação
                animateFilterChange();
            });
        });
    }
    
    // Filtra as categorias do menu
    function filterMenuCategories(category) {
        menuCategories.forEach(categoryElement => {
            if (category === 'all') {
                categoryElement.style.display = 'block';
                categoryElement.classList.add('fade-in');
            } else {
                const categoryData = categoryElement.getAttribute('data-category');
                if (categoryData === category) {
                    categoryElement.style.display = 'block';
                    categoryElement.classList.add('fade-in');
                } else {
                    categoryElement.style.display = 'none';
                    categoryElement.classList.remove('fade-in');
                }
            }
        });
    }
    
    // Animação para mudança de filtro
    function animateFilterChange() {
        const visibleCategories = document.querySelectorAll('.menu-category[style*="block"]');
        visibleCategories.forEach((category, index) => {
            category.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Funcionalidade de busca
    function initSearch() {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Se a busca estiver vazia, mostra todas as categorias
                showAllCategories();
                return;
            }
            
            // Esconde todas as categorias primeiro
            menuCategories.forEach(category => {
                category.style.display = 'none';
            });
            
            // Busca em todos os itens do menu
            let hasResults = false;
            menuCategories.forEach(category => {
                const categoryItems = category.querySelectorAll('.menu-item');
                let categoryHasMatch = false;
                
                categoryItems.forEach(item => {
                    const itemName = item.querySelector('h4').textContent.toLowerCase();
                    const itemDescription = item.querySelector('p').textContent.toLowerCase();
                    
                    if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                        item.style.display = 'flex';
                        categoryHasMatch = true;
                        hasResults = true;
                        highlightSearchTerm(item, searchTerm);
                    } else {
                        item.style.display = 'none';
                        removeHighlight(item);
                    }
                });
                
                // Mostra a categoria se tiver pelo menos um item correspondente
                if (categoryHasMatch) {
                    category.style.display = 'block';
                    category.classList.add('fade-in');
                }
            });
            
            // Mostra mensagem se não houver resultados
            showNoResultsMessage(!hasResults);
        });
    }
    
    // Mostra todas as categorias
    function showAllCategories() {
        menuCategories.forEach(category => {
            category.style.display = 'block';
            const items = category.querySelectorAll('.menu-item');
            items.forEach(item => {
                item.style.display = 'flex';
                removeHighlight(item);
            });
        });
        hideNoResultsMessage();
    }
    
    // Destaca o termo de busca
    function highlightSearchTerm(item, term) {
        const title = item.querySelector('h4');
        const description = item.querySelector('p');
        
        highlightText(title, term);
        highlightText(description, term);
    }
    
    // Remove o destaque
    function removeHighlight(item) {
        const title = item.querySelector('h4');
        const description = item.querySelector('p');
        
        removeHighlightFromText(title);
        removeHighlightFromText(description);
    }
    
    // Destaca texto específico
    function highlightText(element, term) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
        element.innerHTML = highlightedText;
    }
    
    // Remove destaque do texto
    function removeHighlightFromText(element) {
        const text = element.textContent;
        element.innerHTML = text;
    }
    
    // Mostra/esconde mensagem de "nenhum resultado"
    function showNoResultsMessage(show) {
        let noResultsDiv = document.getElementById('noResults');
        
        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResults';
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum item encontrado</h3>
                    <p>Tente buscar por outro termo ou navegue pelas categorias.</p>
                </div>
            `;
            document.getElementById('menuGrid').appendChild(noResultsDiv);
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }
    
    // Esconde mensagem de "nenhum resultado"
    function hideNoResultsMessage() {
        const noResultsDiv = document.getElementById('noResults');
        if (noResultsDiv) {
            noResultsDiv.remove();
        }
    }
    
    // Navegação suave
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Efeito de scroll no header
    function initHeaderScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 215, 0, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, #FFA500 100%)';
                header.style.backdropFilter = 'none';
            }
            
            // Esconde/mostra header baseado na direção do scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Animações de entrada
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observa elementos para animação
        const elementsToAnimate = document.querySelectorAll('.menu-category, .contact-item');
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Funcionalidade de loading
    function showLoading() {
        document.body.classList.add('loading');
    }
    
    function hideLoading() {
        document.body.classList.remove('loading');
    }
    
    // Funcionalidade de favoritos (localStorage)
    function initFavorites() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        
        favoriteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.closest('.menu-item').querySelector('h4').textContent;
                toggleFavorite(itemName, this);
            });
        });
        
        // Carrega favoritos salvos
        loadFavorites();
    }
    
    function toggleFavorite(itemName, button) {
        let favorites = JSON.parse(localStorage.getItem('menuFavorites')) || [];
        
        if (favorites.includes(itemName)) {
            favorites = favorites.filter(fav => fav !== itemName);
            button.classList.remove('active');
        } else {
            favorites.push(itemName);
            button.classList.add('active');
        }
        
        localStorage.setItem('menuFavorites', JSON.stringify(favorites));
    }
    
    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('menuFavorites')) || [];
        
        favorites.forEach(itemName => {
            const item = Array.from(document.querySelectorAll('.menu-item h4'))
                .find(h4 => h4.textContent === itemName);
            
            if (item) {
                const button = item.closest('.menu-item').querySelector('.favorite-btn');
                if (button) {
                    button.classList.add('active');
                }
            }
        });
    }
    
    // Funcionalidade de compartilhamento
    function initSharing() {
        const shareButton = document.getElementById('shareMenu');
        
        if (shareButton) {
            shareButton.addEventListener('click', function() {
                if (navigator.share) {
                    navigator.share({
                        title: 'Barraca da Família - Cardápio',
                        text: 'Confira o delicioso cardápio da Barraca da Família!',
                        url: window.location.href
                    });
                } else {
                    // Fallback para navegadores que não suportam Web Share API
                    copyToClipboard(window.location.href);
                    showToast('Link copiado para a área de transferência!');
                }
            });
        }
    }
    
    // Copia texto para área de transferência
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Texto copiado com sucesso');
        }).catch(function(err) {
            console.error('Erro ao copiar texto: ', err);
        });
    }
    
    // Mostra toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Funcionalidade de modo escuro (opcional)
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
            });
            
            // Carrega preferência salva
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            if (savedDarkMode) {
                document.body.classList.add('dark-mode');
            }
        }
    }
    
    // Funcionalidade de acessibilidade
    function initAccessibility() {
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Fecha modais ou limpa busca
                searchInput.value = '';
                showAllCategories();
                hideNoResultsMessage();
            }
        });
        
        // Foco visível para navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    // Performance: Debounce para busca
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Aplica debounce na busca
    const debouncedSearch = debounce(function(searchTerm) {
        // Lógica de busca aqui
    }, 300);
    
    // Inicialização de todas as funcionalidades
    function init() {
        initMenuFilter();
        initSearch();
        initSmoothScrolling();
        initHeaderScroll();
        initScrollAnimations();
        initAccessibility();
        
        // Funcionalidades opcionais (se os elementos existirem)
        if (document.querySelector('.favorite-btn')) {
            initFavorites();
        }
        
        if (document.getElementById('shareMenu')) {
            initSharing();
        }
        
        if (document.getElementById('darkModeToggle')) {
            initDarkMode();
        }
        
        // Esconde loading após inicialização
        setTimeout(hideLoading, 500);
        
        console.log('Site da Barraca da Família carregado com sucesso!');
    }
    
    // Inicia a aplicação
    init();
    
    // Adiciona estilos CSS para elementos criados dinamicamente
    const dynamicStyles = `
        <style>
            .no-results {
                text-align: center;
                padding: 3rem;
                color: var(--text-light);
            }
            
            .no-results-content i {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: var(--primary-color);
            }
            
            .no-results-content h3 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: var(--secondary-color);
            }
            
            mark {
                background: var(--primary-color);
                color: var(--secondary-color);
                padding: 2px 4px;
                border-radius: 3px;
            }
            
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--secondary-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-hover);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 10000;
            }
            
            .toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .keyboard-navigation *:focus {
                outline: 2px solid var(--secondary-color) !important;
                outline-offset: 2px !important;
            }
            
            .dark-mode {
                --white: #1a1a1a;
                --light-gray: #2a2a2a;
                --text-dark: #ffffff;
                --text-light: #cccccc;
            }
            
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', dynamicStyles);
});

// Funcionalidades globais
window.barracaDaFamilia = {
    // API pública para interações externas
    filterMenu: function(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    },
    
    searchMenu: function(term) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = term;
            searchInput.dispatchEvent(new Event('input'));
        }
    },
    
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

