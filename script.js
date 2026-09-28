
const navigationType = performance.getEntriesByType('navigation')[0]?.type;
if (navigationType !== 'back_forward' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
if (navigationType !== 'back_forward') {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
