/* A short, decorative initialization sequence; percentages describe the intro,
   not a model download. The page always unlocks if initialization fails. */
(() => {
    const root = document.documentElement;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initial = !preference.matches;
    const state = window.portfolioIntro = { active: initial, replay: () => {} };
    if (initial) root.classList.add('intro-pending');

    let overlay, frame = 0, exitTimer = 0, revealTimer = 0, watchdog = 0;
    let restoreFocus, locked = [], finishing = false;
    function release() {
        cancelAnimationFrame(frame);
        clearTimeout(exitTimer); clearTimeout(revealTimer); clearTimeout(watchdog);
        locked.forEach(([element, inert]) => { element.inert = inert; });
        locked = [];
        overlay?.remove(); overlay = null;
        root.classList.remove('intro-pending');
        state.active = false;
        document.dispatchEvent(new Event('portfolio:intro-end'));
        if (restoreFocus?.isConnected) restoreFocus.focus({ preventScroll: true });
        restoreFocus = null;
    }
    if (initial) watchdog = setTimeout(release, 5500);

    function finish(immediate = false) {
        if (!state.active || (finishing && !immediate)) return;
        finishing = true;
        cancelAnimationFrame(frame);
        if (immediate || preference.matches || !overlay) {
            document.dispatchEvent(new Event('portfolio:intro-reveal'));
            release();
            return;
        }
        overlay.querySelector('.intro-number').textContent = '100';
        overlay.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', '100');
        overlay.querySelector('.intro-progress-fill').style.transform = 'scaleX(1)';
        overlay.querySelector('.intro-phase').textContent = 'Ready to explore';
        overlay.classList.add('intro-connected');
        exitTimer = setTimeout(() => {
            if (!overlay) return;
            overlay.classList.add('intro-leaving');
            revealTimer = setTimeout(() => document.dispatchEvent(new Event('portfolio:intro-reveal')), 180);
            exitTimer = setTimeout(release, 760);
        }, 180);
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    function svgElement(name, attributes) {
        const element = document.createElementNS(svgNS, name);
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        return element;
    }
    function start() {
        if (overlay || preference.matches) return;
        state.active = true; finishing = false;
        document.dispatchEvent(new Event('portfolio:intro-start'));
        root.classList.add('intro-pending');
        clearTimeout(watchdog); watchdog = setTimeout(release, 5500);
        restoreFocus = document.activeElement === document.body ? null : document.activeElement;
        overlay = document.createElement('section');
        overlay.className = 'neural-intro';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Portfolio introduction');
        overlay.innerHTML = `
            <div class="intro-top"><span class="intro-brand">GL<span>.</span></span><span class="intro-edition">Independent engineer &nbsp; / &nbsp; Portfolio 2026</span><button class="intro-skip" type="button">Skip intro <span aria-hidden="true">↗</span></button></div>
            <div class="intro-center">
                <div class="intro-identity">
                    <p class="intro-kicker">AI &amp; machine learning</p>
                    <h2>Gourav<br><em>Lohar.</em></h2>
                    <p class="intro-description">Thoughtful engineering.<br>Intelligence with a purpose.</p>
                </div>
                <div class="intro-network" aria-hidden="true">
                    <div class="intro-diagram-caption"><span>01 / Neural architecture</span><span>40 nodes</span></div>
                    <svg class="neural-svg" viewBox="0 0 640 360" fill="none">
                        <defs><radialGradient id="neural-glow"><stop stop-color="#b5a05b" stop-opacity=".13"/><stop offset="1" stop-color="#b5a05b" stop-opacity="0"/></radialGradient></defs>
                        <ellipse cx="320" cy="180" rx="200" ry="175" fill="url(#neural-glow)"/>
                        <g class="neural-guides" stroke="#b5a05b" stroke-opacity=".13"><circle cx="320" cy="180" r="145"/><path d="M320 12V32 M320 328V348 M135 180H155 M485 180H505"/><path d="M304 86C293 53 266 45 243 63C211 53 183 79 187 106C158 126 155 156 175 179C157 208 175 239 205 247C217 277 254 284 276 263C300 265 307 242 306 220Z"/><path d="M336 86C347 53 374 45 397 63C429 53 457 79 453 106C482 126 485 156 465 179C483 208 465 239 435 247C423 277 386 284 364 263C340 265 333 242 334 220Z"/><path d="M304 236Q302 267 307 290H333Q329 266 336 236"/></g>
                        <g class="neural-feeds" stroke="#b5a05b" stroke-opacity=".25" stroke-dasharray="3 7"><path d="M100 98Q150 98 211 140"/><path d="M540 98Q490 98 429 140"/><path d="M100 262Q154 262 232 219"/><path d="M540 262Q486 262 408 219"/></g>
                        <g class="neural-structure" stroke="#151713" stroke-opacity=".075" stroke-width=".8"></g>
                        <g class="neural-edges" stroke="#897439" stroke-width="1"></g>
                        <g class="neural-nodes"></g>
                        <g class="neural-packets" fill="#e0cb88"><circle r="3"/><circle r="3"/><circle r="3"/><circle r="3"/></g>
                        <g class="intro-tool" transform="translate(42 62)"><rect width="64" height="64" rx="17"/><g transform="translate(12 11) scale(.85)"><path fill="#77aed1" d="M23 3C8 3 9 9 9 17H25V20H5C-2 20-2 41 7 41H13V33C13 26 18 25 24 25H35C42 25 42 19 42 11C42 4 35 3 23 3Z"/><circle cx="18" cy="10" r="2" fill="#101113"/><path fill="#ddc36d" d="M25 51C40 51 39 45 39 37H23V34H43C50 34 50 13 41 13H35V21C35 28 30 29 24 29H13C6 29 6 35 6 43C6 50 13 51 25 51Z"/><circle cx="30" cy="44" r="2" fill="#101113"/></g><text x="32" y="84">Python</text></g>
                        <g class="intro-tool" transform="translate(534 62)"><rect width="64" height="64" rx="17"/><path d="M34 13L21 26A15 15 0 1 0 43 27" stroke="#d48c6e" stroke-width="4" stroke-linecap="round"/><circle cx="44" cy="17" r="2.7" fill="#d48c6e"/><text x="32" y="84">PyTorch</text></g>
                        <g class="intro-tool" transform="translate(42 228)"><rect width="64" height="64" rx="17"/><path d="M32 13L49 23V42L32 52L15 42V23Z M15 23L32 33L49 23 M32 33V52 M23 18L41 28 M23 28V46" stroke="#83b5bd" stroke-width="2" stroke-linejoin="round"/><text x="32" y="84">NumPy</text></g>
                        <g class="intro-tool" transform="translate(534 228)"><rect width="64" height="64" rx="17"/><path d="M15 20L32 10L49 20V29L36 22V32L45 27V37L36 42V52L27 47V23L15 30Z" fill="#d4a366"/><text x="32" y="84">TensorFlow</text></g>
                    </svg>
                </div>
            </div>
            <div class="intro-bottom"><div><p class="intro-phase" role="status">Initializing</p><p class="intro-note">A few connections before we begin.</p></div><div class="intro-counter" aria-hidden="true"><span class="intro-number">0</span><span class="intro-percent">/ 100</span></div></div>
            <div class="intro-progress" role="progressbar" aria-label="Intro animation progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="intro-progress-fill"></div></div>`;
        [...document.body.children].forEach(element => {
            if (['SCRIPT', 'STYLE'].includes(element.tagName)) return;
            locked.push([element, element.inert]); element.inert = true;
        });
        document.body.appendChild(overlay);
        const skip = overlay.querySelector('.intro-skip');
        skip.addEventListener('click', () => finish(true));
        skip.focus({ preventScroll: true });
        overlay.addEventListener('keydown', event => {
            if (event.key === 'Escape') finish(true);
            if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
        });

        const left = [[300,86],[274,65],[245,70],[214,93],[196,123],[186,155],[192,186],[203,219],[227,245],[254,259],[281,245],[298,220],[287,190],[277,161],[297,134],[264,108],[232,118],[214,151],[229,186],[252,217]];
        const points = [...left, ...left.map(([x,y]) => [640-x,y])];
        const edges = [], nodes = [];
        const edgeGroup = overlay.querySelector('.neural-edges');
        const structure = overlay.querySelector('.neural-structure');
        const nodeGroup = overlay.querySelector('.neural-nodes');
        points.forEach(([x, y], index) => {
            points.slice(index + 1).forEach(([endX, endY], offset) => {
                const distance = Math.hypot(x-endX, y-endY);
                if (distance > 52 || distance < 24) return;
                const edge = svgElement('path', { d: `M${x} ${y}L${endX} ${endY}`, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, opacity: .55 });
                structure.appendChild(svgElement('path', { d: `M${x} ${y}L${endX} ${endY}` }));
                edgeGroup.appendChild(edge);
                edges.push({ element: edge, order: (index + offset * .25) / points.length });
            });
            const node = svgElement('circle', { cx: x, cy: y, r: index % 4 === 0 ? 3 : 2, fill: '#897439', opacity: .12 });
            nodeGroup.appendChild(node); nodes.push(node);
        });
        const number = overlay.querySelector('.intro-number');
        const bar = overlay.querySelector('.intro-progress-fill');
        const progressbar = overlay.querySelector('[role="progressbar"]');
        const phase = overlay.querySelector('.intro-phase');
        const packets = [...overlay.querySelectorAll('.neural-packets circle')];
        const tools = [...overlay.querySelectorAll('.intro-tool')];
        const feeds = [[100,98,150,98,211,140],[540,98,490,98,429,140],[100,262,154,262,232,219],[540,262,486,262,408,219]];
        const phases = ['Initializing', 'Connecting tools', 'Building the network', 'Ready to explore'];
        let previousNumber = -1, previousPhase = -1;
        const startTime = performance.now();
        function tick(now) {
            if (!state.active || finishing) return;
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / 2650);
            const value = Math.floor(progress * 100);
            if (value !== previousNumber) {
                number.textContent = value;
                progressbar.setAttribute('aria-valuenow', value);
                bar.style.transform = `scaleX(${progress})`;
                previousNumber = value;
                const step = progress < .22 ? 0 : progress < .55 ? 1 : progress < .94 ? 2 : 3;
                if (step !== previousPhase) { phase.textContent = phases[step]; previousPhase = step; }
            }
            edges.forEach(({ element, order }) => element.setAttribute('stroke-dashoffset', 1 - Math.min(1, Math.max(0, progress * 2.4 - order * 1.15))));
            nodes.forEach((node, index) => {
                const charge = Math.min(1, Math.max(0, progress * 2 - index / points.length));
                node.setAttribute('opacity', .12 + charge * .88);
            });
            packets.forEach((packet, index) => {
                const t = ((elapsed / 1050 + index * .24) % 1);
                const [x, y, controlX, controlY, endX, endY] = feeds[index];
                packet.setAttribute('cx', (1-t)**2*x+2*(1-t)*t*controlX+t*t*endX);
                packet.setAttribute('cy', (1-t)**2*y+2*(1-t)*t*controlY+t*t*endY);
                packet.setAttribute('opacity', Math.sin(t * Math.PI));
                tools[index].style.opacity = .4 + Math.min(1, progress * 3 - index * .2) * .6;
            });
            if (progress >= 1) finish();
            else frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
    }
    state.replay = () => {
        if (state.active || preference.matches) return;
        window.scrollTo({ top: 0, behavior: 'instant' });
        start();
    };
    document.addEventListener('DOMContentLoaded', () => {
        if (state.active) start();
        document.querySelectorAll('[data-replay-intro]').forEach(button => {
            button.hidden = preference.matches;
            button.addEventListener('click', state.replay);
        });
    }, { once: true });
    preference.addEventListener('change', () => {
        document.querySelectorAll('[data-replay-intro]').forEach(button => { button.hidden = preference.matches; });
        if (preference.matches) finish(true);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state.active) finish(true); });
    window.addEventListener('pagehide', () => { if (state.active) release(); });
})();
