document.addEventListener('DOMContentLoaded', function() {

    // --- VARIÁVEIS GLOBAIS DA PÁGINA ---
    const fotos = document.querySelectorAll('.foto-casal');
    const totalFotos = fotos.length;
    let indiceFotoAtual = 0; // Controla tanto o Slideshow quanto o Lightbox

    // Seletores do Lightbox (Movidos para escopo global do DCL)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const btnPrevLightbox = document.querySelector('.lightbox-prev');
    const btnNextLightbox = document.querySelector('.lightbox-next');


    // --- INICIALIZAÇÃO GERAL ---
    function init() {
        initParticles();
        initCronometro();
        initSlideshow();
        initMusicPlayer();
        initScrollAnimations();
        initLightboxEvents(); // Função renomeada para evitar confusão
    }

    // -----------------------------------------------------
    // --- FUNÇÕES DE ANIMAÇÃO E CRONÔMETRO (Mantidas) ---
    // -----------------------------------------------------

    // --- ANIMAÇÃO DE PARTÍCULAS NO HEADER ---
    function initParticles() {
        if (document.getElementById('header-particles')) {
            particlesJS('header-particles', {
                "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": false }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } },
                "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } } },
                "retina_detect": true
            });
        }
    }

    // --- CRONÔMETRO DO AMOR ---
    function initCronometro() {
        // CORRIGIDO: 31557600000 é um valor aproximado para 1 ano. 
        // O JS lida com meses e anos com base em 'new Date()' para maior precisão, mas seu cálculo simples está ok.
        const dataInicio = new Date('2025-09-07T00:00:00');
        const el = document.getElementById('cronometro');
        if (!el) return;

        setInterval(() => {
            const agora = new Date();
            const d = agora - dataInicio;
            
            // Verificação para garantir que a data de início não está no futuro (07 de Setembro de 2025 ainda não chegou)
            if (d < 0) { 
                el.innerHTML = 'Em contagem regressiva...';
                return; 
            }

            const anos = Math.floor(d / 31557600000); // 1 ano
            const restoAnos = d % 31557600000;
            const meses = Math.floor(restoAnos / 2629800000); // 1 mês
            const restoMeses = restoAnos % 2629800000;
            const dias = Math.floor(restoMeses / 86400000); // 1 dia
            const restoDias = restoMeses % 86400000;
            const h = Math.floor(restoDias / 3600000); // 1 hora
            const m = Math.floor((restoDias % 3600000) / 60000); // 1 minuto
            const s = Math.floor((restoDias % 60000) / 1000); // 1 segundo
            
            el.innerHTML = `${anos}a, ${meses}m, ${dias}d <br> ${h}h ${m}m ${s}s`;
        }, 1000);
    }
    
    // -----------------------------------------------------------------
    // --- SLIDESHOW E LIGHTBOX (Lógica Unificada) ---
    // -----------------------------------------------------------------

    function mostrarFotoSlideshow() {
        fotos.forEach((foto, index) => {
            foto.classList.toggle('visivel', index === indiceFotoAtual);
        });
    }

    function atualizarIndice(direcao) {
        indiceFotoAtual = (indiceFotoAtual + direcao + totalFotos) % totalFotos;
    }

    function mudarFoto(direcao) {
        atualizarIndice(direcao);
        mostrarFotoSlideshow();
    }
    
    function initSlideshow() {
        if (totalFotos === 0) return;
        
        const btnNextSlideshow = document.getElementById('botao-proximo');
        const btnPrevSlideshow = document.getElementById('botao-anterior');

        if (btnNextSlideshow) btnNextSlideshow.addEventListener('click', () => mudarFoto(1));
        if (btnPrevSlideshow) btnPrevSlideshow.addEventListener('click', () => mudarFoto(-1));
        
        mostrarFotoSlideshow();
    }
    
    // --- EVENTOS DO LIGHTBOX (Abertura e Navegação) ---
    function initLightboxEvents() {
        if (!lightbox) return;

        // 1. Abertura do Lightbox
        fotos.forEach(foto => foto.addEventListener('click', () => {
            indiceFotoAtual = parseInt(foto.dataset.index); // Usa o índice definido no HTML
            abrirOuAtualizarLightbox();
        }));

        // 2. Fechamento do Lightbox
        if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');

        // Fecha ao clicar no fundo
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.style.display = 'none';
            }
        });

        // 3. Navegação (Reutiliza a função de índice)
        if (btnNextLightbox) btnNextLightbox.addEventListener('click', (e) => {
            e.stopPropagation(); 
            mudarFotoLightbox(1);
        });
        
        if (btnPrevLightbox) btnPrevLightbox.addEventListener('click', (e) => {
            e.stopPropagation(); 
            mudarFotoLightbox(-1);
        });

        // 4. Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === "flex") { // Lightbox usa 'flex' para centralizar
                if (e.key === 'ArrowLeft') mudarFotoLightbox(-1); 
                else if (e.key === 'ArrowRight') mudarFotoLightbox(1); 
                else if (e.key === 'Escape') lightbox.style.display = "none";
            }
        });
    }

    function abrirOuAtualizarLightbox() {
        if (!lightboxImg || !lightbox) return;

        // Atualiza a imagem com base no índice atual
        lightboxImg.src = fotos[indiceFotoAtual].src; 
        
        // Abre o lightbox (se já não estiver aberto)
        lightbox.style.display = 'flex'; // Usamos 'flex' para centralizar, verifique seu CSS
    }

    function mudarFotoLightbox(direcao) {
        atualizarIndice(direcao); // Reutiliza a função de mudança de índice
        abrirOuAtualizarLightbox();
    }


    // -----------------------------------------------------
    // --- PLAYER DE MÚSICA E SCROLL (Mantidos) ---
    // -----------------------------------------------------

    // --- PLAYER DE MÚSICA COM BARRA DE PROGRESSO ---
    function initMusicPlayer() {
        const musica = document.getElementById('musica');
        const playBtn = document.getElementById('play-button');
        const progress = document.getElementById('progress-bar');
        const progressContainer = document.querySelector('.progress-bar-container');
        if (!musica || !playBtn) return;

        const icon = playBtn.querySelector('i');

        playBtn.addEventListener('click', () => {
            const isPlaying = !musica.paused;
            if (isPlaying) {
                musica.pause();
                // Alerta: Muitos navegadores impedem autoplay sem interação prévia
            } else {
                 // É importante silenciar a música se ela for reproduzida automaticamente
                musica.play().catch(error => {
                    console.error("Erro ao tentar reproduzir música:", error);
                    alert("Por favor, interaja com a página para reproduzir a música.");
                });
            }
        });

        musica.addEventListener('play', () => icon.className = 'fas fa-pause');
        musica.addEventListener('pause', () => icon.className = 'fas fa-play');
        
        musica.addEventListener('timeupdate', e => {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        });
        
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                const width = this.clientWidth;
                const clickX = e.offsetX;
                const duration = musica.duration;
                musica.currentTime = (clickX / width) * duration;
            });
        }
    }

    // --- ANIMAÇÕES DE SCROLL (ROLAGEM) ---
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Opcional: Para executar apenas uma vez
                    // observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    // --- RODA TUDO ---
    init();
}); 
// O código duplicado do Lightbox (que estava fora do DOMContentLoaded) foi removido!