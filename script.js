
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
