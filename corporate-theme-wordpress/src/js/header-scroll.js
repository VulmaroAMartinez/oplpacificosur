document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.js-site-header');
    if (!header) return;

    // WordPress añade nativamente la clase 'home' al <body> cuando estás en la página principal
    const isHome = document.body.classList.contains('home');
    
    // Si NO es la página de inicio, el navbar siempre tiene fondo oscuro (tu lógica original)
    if (!isHome) {
        header.classList.remove('bg-transparent', 'py-6');
        header.classList.add('bg-slate-900', 'shadow-lg', 'py-4');
        return;
    }

    // Si es el inicio, aplicamos la lógica de scroll
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.remove('bg-transparent', 'py-6');
            header.classList.add('bg-slate-900', 'shadow-lg', 'py-4');
        } else {
            header.classList.add('bg-transparent', 'py-6');
            header.classList.remove('bg-slate-900', 'shadow-lg', 'py-4');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
});