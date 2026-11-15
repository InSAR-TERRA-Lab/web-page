/**
 * InSAR-TERRA Lab — Interactive Scripts & Bilingual Engine
 * Handles:
 *  - Multilingual Switcher (ES / EN) with LocalStorage persistence
 *  - Dynamic Scene Counter & Live Telemetry Updates
 *  - Canvas Starfield Animation
 *  - Smooth Scroll & Active Nav Spy
 *  - Mobile Drawer Toggle
 *  - Form Submission Simulation
 *  - Scroll-triggered Animations (Intersection Observer)
 */

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initMobileMenu();
    initScrollHeader();
    initStarfield();
    initCounters();
    initTelemetryLiveTicks();
    initScrollAnimations();
    initProjectsCarousel();
    initNewsCarousel();
    initContactForm();
});

/* ============================================================
   1. BILINGUAL / MULTILINGUAL SYSTEM
   ============================================================ */
let currentLang = 'es';

function initLanguage() {
    const savedLang = localStorage.getItem('insar_terra_lang') || 'es';
    setLang(savedLang);
}

window.setLang = function(lang) {
    currentLang = lang;
    localStorage.setItem('insar_terra_lang', lang);
    document.documentElement.lang = lang;

    // Toggle active state in buttons
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    if (btnEs && btnEn) {
        if (lang === 'es') {
            btnEs.classList.add('active');
            btnEs.setAttribute('aria-pressed', 'true');
            btnEn.classList.remove('active');
            btnEn.setAttribute('aria-pressed', 'false');
        } else {
            btnEn.classList.add('active');
            btnEn.setAttribute('aria-pressed', 'true');
            btnEs.classList.remove('active');
            btnEs.setAttribute('aria-pressed', 'false');
        }
    }

    // Translate text contents
    const elements = document.querySelectorAll('[data-es][data-en]');
    elements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // Check if element contains HTML formatting or just text
            if (text.includes('<') && text.includes('>')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Translate input / textarea placeholders
    const placeholderElements = document.querySelectorAll(`[data-placeholder-${lang}]`);
    placeholderElements.forEach(el => {
        const ph = el.getAttribute(`data-placeholder-${lang}`);
        if (ph) {
            el.setAttribute('placeholder', ph);
        }
    });
};

/* ============================================================
   2. MOBILE NAV DRAWER
   ============================================================ */
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const header = document.getElementById('main-header');

    if (!toggle || !drawer) return;

    // Position drawer just below the real header height
    function updateDrawerTop() {
        const h = header ? header.offsetHeight : 70;
        drawer.style.top = h + 'px';
        drawer.style.maxHeight = 'calc(100vh - ' + h + 'px)';
    }

    toggle.addEventListener('click', () => {
        updateDrawerTop();
        const isOpen = drawer.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        toggle.querySelector('.menu-icon').textContent = isOpen ? '✕' : '☰';
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking nav links inside drawer
    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            toggle.querySelector('.menu-icon').textContent = '☰';
            document.body.style.overflow = '';
        });
    });

    // Close on outside click / ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            toggle.querySelector('.menu-icon').textContent = '☰';
            document.body.style.overflow = '';
        }
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        }
        updateDrawerTop();
    });
}

/* ============================================================
   3. SCROLL HEADER EFFECT
   ============================================================ */
function initScrollHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ============================================================
   4. CANVAS STARFIELD BACKGROUND (HERO)
   ============================================================ */
function initStarfield() {
    const container = document.getElementById('hero-stars');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const STAR_COUNT = 90;

    function resize() {
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
        createStars();
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.2 + 0.4,
                alpha: Math.random() * 0.7 + 0.2,
                speed: Math.random() * 0.02 + 0.005,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (let star of stars) {
            star.phase += star.speed;
            const currentAlpha = star.alpha + Math.sin(star.phase) * 0.25;
            const finalAlpha = Math.max(0.1, Math.min(0.9, currentAlpha));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 235, 255, ${finalAlpha})`;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

/* ============================================================
   5. DYNAMIC SCENE COUNTER & METRICS
   ============================================================ */
function initCounters() {
    const counterEl = document.getElementById('scene-counter');
    if (!counterEl) return;

    const targetValue = 48520;
    let currentVal = 47800;
    let observerStarted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !observerStarted) {
                observerStarted = true;
                const duration = 2000;
                const startTime = performance.now();

                function animateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const val = Math.floor(currentVal + (targetValue - currentVal) * easeOut);
                    counterEl.textContent = val.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(animateCounter);
                    } else {
                        counterEl.textContent = targetValue.toLocaleString();
                        // Occasional live tick increment
                        setInterval(() => {
                            const add = Math.floor(Math.random() * 3) + 1;
                            const newVal = parseInt(counterEl.textContent.replace(/,/g, ''), 10) + add;
                            counterEl.textContent = newVal.toLocaleString();
                        }, 5000);
                    }
                }

                requestAnimationFrame(animateCounter);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(counterEl);
}

/* ============================================================
   6. REAL-TIME TELEMETRY STREAM SIMULATION
   ============================================================ */
function initTelemetryLiveTicks() {
    // Subtle realistic orbital micro-variations
    const altitudeEl = document.querySelector('.telemetry-item:nth-child(3) .telemetry-value');
    if (altitudeEl) {
        setInterval(() => {
            const base = 693.0;
            const variance = (Math.sin(Date.now() / 4000) * 0.4).toFixed(1);
            const val = (base + parseFloat(variance)).toFixed(1);
            altitudeEl.textContent = `${val} km`;
        }, 3000);
    }
}

/* ============================================================
   7. SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================================
   8. PROJECTS CAROUSEL (PROYECTOS)
   ============================================================ */
function initProjectsCarousel() {
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    const dotsContainer = document.getElementById('projects-dots');
    
    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.project-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1100) return 2;
        return 3; // 3 tarjetas visibles en pantallas estándar y grandes
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getVisibleCards());
    }

    function updateCarousel() {
        const visible = getVisibleCards();
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = 0; // loop back to start
        if (currentIndex < 0) currentIndex = maxIdx;

        const cardWidthPercent = 100 / visible;
        const offsetPercent = currentIndex * cardWidthPercent;
        const gapOffset = currentIndex * 24; // px
        track.style.transform = "translateX(calc(-" + offsetPercent + "% - " + gapOffset + "px))";

        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.project-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
    }

    function nextSlide() {
        const maxIdx = getMaxIndex();
        currentIndex = (currentIndex >= maxIdx) ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function prevSlide() {
        const maxIdx = getMaxIndex();
        currentIndex = (currentIndex <= 0) ? maxIdx : currentIndex - 1;
        updateCarousel();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 4500); // Se mueve solo cada 4.5s
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // reiniciar temporizador
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // reiniciar temporizador
    });

    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-dot')) {
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                if (!isNaN(idx)) {
                    currentIndex = idx;
                    updateCarousel();
                    startAutoplay();
                }
            }
        });
    }

    // Iniciar autoplay de inmediato
    startAutoplay();

    // Pausar si el usuario pasa el ratón encima para leer el contenido y reanudar al salir
    const wrapper = document.querySelector('.projects-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoplay);
        wrapper.addEventListener('mouseleave', startAutoplay);
        wrapper.addEventListener('touchstart', stopAutoplay, { passive: true });
        wrapper.addEventListener('touchend', startAutoplay, { passive: true });
    }

    window.addEventListener('resize', updateCarousel, { passive: true });
}

/* ============================================================
   9. NEWS CAROUSEL (DIFUSIÓN)
   ============================================================ */
function initNewsCarousel() {
    const track = document.getElementById('news-track');
    const prevBtn = document.getElementById('news-prev');
    const nextBtn = document.getElementById('news-next');
    const dotsContainer = document.getElementById('news-dots');
    
    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.news-card');
    const totalCards = cards.length;
    let currentIndex = 0;

    function getVisibleCards() {
        if (window.innerWidth <= 650) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getVisibleCards());
    }

    function updateCarousel() {
        const visible = getVisibleCards();
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const cardWidthPercent = 100 / visible;
        // Accounting for track gap (1.5rem = 24px)
        const offsetPercent = currentIndex * cardWidthPercent;
        const gapOffset = currentIndex * 24; // px
        track.style.transform = `translateX(calc(-${offsetPercent}% - ${gapOffset}px))`;

        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.news-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
    }

    prevBtn.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        currentIndex = (currentIndex <= 0) ? maxIdx : currentIndex - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        currentIndex = (currentIndex >= maxIdx) ? 0 : currentIndex + 1;
        updateCarousel();
    });

    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('news-dot')) {
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                if (!isNaN(idx)) {
                    currentIndex = idx;
                    updateCarousel();
                }
            }
        });
    }

    window.addEventListener('resize', updateCarousel, { passive: true });
}

/* ============================================================
   9. CONTACT FORM SUBMISSION
   ============================================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitText = submitBtn.querySelector('.submit-text');
        const originalText = submitText.textContent;

        submitBtn.disabled = true;
        submitText.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';

        setTimeout(() => {
            submitBtn.classList.add('sent');
            submitText.textContent = currentLang === 'es' ? '✓ Mensaje Enviado con Éxito' : '✓ Message Sent Successfully';

            form.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('sent');
                submitText.textContent = currentLang === 'es' ? 'Enviar Mensaje' : 'Send Message';
            }, 4000);
        }, 1200);
    });
}

/* ============================================================
   CONTROL DE AUDIO DEL VIDEO DEL LANDING (MUTE / UNMUTE)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('landing-video');
    const audioBtn = document.getElementById('video-audio-toggle');
    if (!video || !audioBtn) return;

    audioBtn.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
            audioBtn.querySelector('.audio-icon').textContent = '🔊';
            const textEl = audioBtn.querySelector('.audio-text');
            if (textEl) {
                textEl.textContent = (document.documentElement.lang === 'en') ? 'Audio: On' : 'Audio: Activado';
                textEl.setAttribute('data-es', 'Audio: Activado');
                textEl.setAttribute('data-en', 'Audio: On');
            }
        } else {
            video.muted = true;
            audioBtn.querySelector('.audio-icon').textContent = '🔇';
            const textEl = audioBtn.querySelector('.audio-text');
            if (textEl) {
                textEl.textContent = (document.documentElement.lang === 'en') ? 'Audio: Muted' : 'Audio: Desactivado';
                textEl.setAttribute('data-es', 'Audio: Desactivado');
                textEl.setAttribute('data-en', 'Audio: Muted');
            }
        }
    });
});

/* ============================================================
   PUBLICACIONES — RESUMEN DESPLEGABLE
   ============================================================ */
function initPapersExpand() {
    document.querySelectorAll('.paper-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrap   = btn.closest('.paper-item-wrap');
            const panelId = btn.getAttribute('aria-controls');
            const panel  = document.getElementById(panelId);
            if (!wrap || !panel) return;

            const isOpen = wrap.classList.contains('is-open');

            // Cerrar todos los demás
            document.querySelectorAll('.paper-item-wrap.is-open').forEach(w => {
                w.classList.remove('is-open');
                const b = w.querySelector('.paper-toggle');
                const p = w.querySelector('.paper-abstract-panel');
                if (b) b.setAttribute('aria-expanded', 'false');
                if (p) { p.classList.remove('is-open'); p.setAttribute('aria-hidden', 'true'); }
            });

            // Abrir/cerrar el actual
            if (!isOpen) {
                wrap.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
                panel.classList.add('is-open');
                panel.setAttribute('aria-hidden', 'false');
                setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initPapersExpand);
