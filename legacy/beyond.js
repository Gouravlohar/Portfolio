// Native scrolling keeps the title pinned for the hero's remaining 20vh.
(() => {
    const hero = document.querySelector('.beyond-hero');
    const track = document.querySelector('.beyond-marquee-track');
    if (!hero) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function update() {
        frame = 0;
        const rect = hero.getBoundingClientRect();
        const range = hero.offsetHeight - window.innerHeight;
        const progress = preference.matches ? 1 : Math.max(0, Math.min(1, range > 0 ? -rect.top / range : 0));
        hero.style.setProperty('--scroll-progress', progress);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    preference.addEventListener('change', schedule);
    update();

    let marqueeVisible = true;
    function pauseMarquee() {
        if (track) track.style.animationPlayState = document.hidden || !marqueeVisible ? 'paused' : 'running';
    }
    if (track) new IntersectionObserver(entries => {
        marqueeVisible = entries[0].isIntersecting;
        pauseMarquee();
    }).observe(track.parentElement);
    document.addEventListener('visibilitychange', pauseMarquee);
})();
