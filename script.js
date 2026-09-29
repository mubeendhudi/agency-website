
const navigationType = performance.getEntriesByType('navigation')[0]?.type;
if (navigationType !== 'back_forward' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
if (navigationType !== 'back_forward') {
    window.scrollTo({ top: 0, behavior: 'instant' });
}

const heroStats = document.querySelector('.hero-stats');
const heroCounters = heroStats?.querySelectorAll('strong[data-count-target]') ?? [];

if (heroStats && heroCounters.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroCounters.forEach((counter) => {
        counter.textContent = `0${counter.textContent.replace(/[0-9]/g, '')}`;
    });

    const animateHeroCounters = () => {
        heroCounters.forEach((counter) => {
            const target = Number(counter.dataset.countTarget);
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            const duration = 1400;
            let startTime;

            const updateCounter = (currentTime) => {
                startTime ??= currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = 1 - (1 - progress) ** 3;
                counter.textContent = `${Math.round(target * easedProgress)}${suffix}`;

                if (progress < 1) requestAnimationFrame(updateCounter);
            };

            requestAnimationFrame(updateCounter);
        });
    };

    const heroStatsObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            animateHeroCounters();
            observer.disconnect();
        }
    }, { threshold: 0.25 });

    heroStatsObserver.observe(heroStats);
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const serviceCards = document.querySelectorAll('.service-card');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (finePointer && !prefersReducedMotion) {
    serviceCards.forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const bounds = card.getBoundingClientRect();
            const pointerX = (event.clientX - bounds.left) / bounds.width;
            const pointerY = (event.clientY - bounds.top) / bounds.height;
            const maxTilt = 7;

            card.style.setProperty('--card-tilt-x', `${(pointerY - .5) * maxTilt}deg`);
            card.style.setProperty('--card-tilt-y', `${(.5 - pointerX) * maxTilt}deg`);
        });

        card.addEventListener('pointerleave', () => {
            card.style.removeProperty('--card-tilt-x');
            card.style.removeProperty('--card-tilt-y');
        });
    });
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');

const updateHeaderState = () => {
    siteHeader.classList.toggle('is-sticky', window.scrollY > 0);
};

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

const setMenuOpen = (isOpen) => {
    nav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
};

menuToggle.addEventListener('click', () => {
    setMenuOpen(!nav.classList.contains('open'));
});

nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
});

document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) setMenuOpen(false);
});

document.querySelectorAll('.faq-question').forEach((question) => {
    const answer = document.getElementById(question.getAttribute('aria-controls'));

    question.addEventListener('click', () => {
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', String(!isOpen));
        answer.setAttribute('aria-hidden', String(isOpen));
        answer.toggleAttribute('inert', isOpen);
        question.closest('.faq-item').classList.toggle('is-open', !isOpen);
    });
});
