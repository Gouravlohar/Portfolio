const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const sideMenu = document.querySelector('#sideMenu');
const navBar = document.querySelector('#dynamic-navbar');
const menuTrigger = document.querySelector('[aria-controls="sideMenu"]');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);
let menuReturnFocus = null;
let menuBackdrop;

if (sideMenu) {
    // Keep the drawer outside the navbar's backdrop-filter containing block.
    document.body.appendChild(sideMenu);
    menuBackdrop = document.createElement('div');
    menuBackdrop.className = 'menu-backdrop';
    menuBackdrop.hidden = true;
    menuBackdrop.addEventListener('click', () => closeMenu());
    document.body.appendChild(menuBackdrop);
}

function openMenu() {
    if (!sideMenu) return;
    menuReturnFocus = document.activeElement;
    sideMenu.inert = false;
    sideMenu.dataset.open = 'true';
    menuTrigger?.setAttribute('aria-expanded', 'true');
    menuBackdrop.hidden = false;
    document.documentElement.classList.add('menu-open');
    requestAnimationFrame(() => {
        if (sideMenu.dataset.open === 'true') sideMenu.querySelector('button, a')?.focus({ preventScroll: true });
    });
}

function closeMenu(restoreFocus = true) {
    if (!sideMenu || sideMenu.dataset.open !== 'true') return;
    sideMenu.dataset.open = 'false';
    sideMenu.inert = true;
    menuTrigger?.setAttribute('aria-expanded', 'false');
    menuBackdrop.hidden = true;
    document.documentElement.classList.remove('menu-open');
    if (restoreFocus) menuReturnFocus?.focus({ preventScroll: true });
}

document.addEventListener('keydown', (event) => {
    if (sideMenu?.dataset.open !== 'true') return;
    if (event.key === 'Escape') closeMenu();
    if (event.key !== 'Tab') return;
    const items = [...sideMenu.querySelectorAll('button, a[href]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
    }
});
window.addEventListener('resize', () => {
    if (menuTrigger && getComputedStyle(menuTrigger).display === 'none') closeMenu(false);
}, { passive: true });

// Only update navigation styles when a threshold changes, at most once per frame.
let scrollFrame = 0;
let previousScrolled, previousTopVisible;
function updateScrollUI() {
    scrollFrame = 0;
    const scrolled = window.scrollY > 50;
    const topVisible = window.scrollY > 500;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.transform = `scaleX(${scrollRange > 0 ? Math.min(1, window.scrollY / scrollRange) : 0})`;
    if (scrolled !== previousScrolled) {
        navBar?.classList.toggle('shadow-lg', scrolled);
        previousScrolled = scrolled;
    }
    if (scrollToTopBtn && topVisible !== previousTopVisible) {
        ['opacity-0', 'translate-y-20', 'pointer-events-none'].forEach(name => scrollToTopBtn.classList.toggle(name, !topVisible));
        scrollToTopBtn.classList.toggle('opacity-100', topVisible);
        scrollToTopBtn.inert = !topVisible;
        previousTopVisible = topVisible;
    }
}
window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI);
}, { passive: true });
updateScrollUI();
scrollToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));

// Preserve the existing light-first theme, and expose the toggle state.
document.documentElement.classList.remove('dark');
function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    document.querySelectorAll('[onclick="toggleTheme()"]').forEach(button => button.setAttribute('aria-pressed', String(dark)));
    document.dispatchEvent(new Event('portfolio:theme'));
}

// One reveal per block. No text splitting, scroll hijacking, or hidden fallback content.
function reveal(element, keyframes, options = {}) {
    if (reducedMotion.matches || !element.animate) return;
    element.animate(keyframes, { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)', ...options });
}
const revealObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        reveal(entry.target, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { delay: Math.min(index * 65, 180), fill: 'backwards' });
        revealObserver.unobserve(entry.target);
    });
}, { threshold: .08 });
function observeSections() {
    document.querySelectorAll('#about h2, #timeline h2, #work-header, #blog h2, #contact h2, #about-info-col, #about .group.relative, #experience-col, #education-col, .project-card, .article-card, .blog-card, #contact form').forEach(element => revealObserver.observe(element));
}
if (window.portfolioIntro?.active) document.addEventListener('portfolio:intro-end', observeSections, { once: true });
else observeSections();

// Short overlapping entrances keep the headline and calls to action responsive.
function animateHero() {
    document.querySelectorAll('#hero-statement .hero-line > span').forEach((line, index) => {
        reveal(line, [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], { duration: 850, delay: index * 75, fill: 'backwards' });
    });
    document.querySelectorAll('#hero-eyebrow, #hero-identity, .hero-manifesto, #hero-description, #hero-actions, .hero-artwork, #hero-meta').forEach((element, index) => {
        reveal(element, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { delay: Math.min(index * 65, 260), fill: 'backwards' });
    });
}
document.addEventListener('portfolio:intro-reveal', animateHero);
if (!window.portfolioIntro?.active) animateHero();

// A measured typewriter loop keeps the statement alive without shifting its layout.
(() => {
    const word = document.querySelector('#hero-rotating-word');
    if (!word || reducedMotion.matches) return;
    const words = ['useful.', 'reliable.', 'clear.', 'practical.'];
    let wordIndex = 0;
    let characterIndex = words[0].length;
    let deleting = false;
    let visible = true;
    let timer = 0;

    function schedule(delay) {
        clearTimeout(timer);
        if (visible && !document.hidden && !window.portfolioIntro?.active) timer = setTimeout(type, delay);
    }

    function type() {
        const current = words[wordIndex];
        if (deleting) {
            characterIndex--;
            word.textContent = current.slice(0, Math.max(0, characterIndex));
            if (characterIndex <= 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                schedule(260);
            } else schedule(48);
            return;
        }

        const next = words[wordIndex];
        characterIndex++;
        word.textContent = next.slice(0, characterIndex);
        if (characterIndex >= next.length) {
            deleting = true;
            schedule(1750);
        } else schedule(82);
    }

    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) schedule(900);
        else clearTimeout(timer);
    }, { threshold: .15 }).observe(word);
    document.addEventListener('visibilitychange', () => document.hidden ? clearTimeout(timer) : schedule(700));
    document.addEventListener('portfolio:intro-start', () => clearTimeout(timer));
    document.addEventListener('portfolio:intro-end', () => schedule(1100));
})();
reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    // Include CSS transitions already in progress when the OS preference changes.
    document.getAnimations().forEach(animation => {
        if (animation.effect?.getTiming().iterations !== Infinity) animation.finish();
    });
});

// Pause repeating CSS motion outside the viewport and while the tab is hidden.
const motionSections = [...document.querySelectorAll('#about, #timeline, #top')];
const visibleMotionSections = new Set();
const motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) visibleMotionSections.add(entry.target);
        else visibleMotionSections.delete(entry.target);
        entry.target.classList.toggle('motion-paused', !entry.isIntersecting || document.hidden);
    });
});
motionSections.forEach(section => motionObserver.observe(section));
document.addEventListener('visibilitychange', () => {
    motionSections.forEach(section => section.classList.toggle('motion-paused', document.hidden || !visibleMotionSections.has(section)));
});

// Deterministic Fibonacci particles create an organic, breathing neural sculpture.
(() => {
    const canvas = document.querySelector('#intelligence-canvas');
    const context = canvas?.getContext('2d', { alpha: true });
    if (!context) return;
    let width = 0, height = 0, frame = 0, time = 0, lastTime = 0;
    let visible = false, dark = false;
    let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
    let particles = [];
    const hero = document.querySelector('#top');
    function resize() {
        width = canvas.clientWidth; height = canvas.clientHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const count = desktopPointer.matches && width > 360 ? 850 : 380;
        particles = Array.from({ length: count }, (_, index) => {
            const y = 1 - (index / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = index * Math.PI * (3 - Math.sqrt(5));
            return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, phase: theta };
        });
        draw();
    }
    function draw() {
        context.clearRect(0, 0, width, height);
        const radius = Math.min(width, height) * .33;
        const rotation = time * .13 + tiltX;
        const cos = Math.cos(rotation), sin = Math.sin(rotation);
        const pitch = -.18 + tiltY, cp = Math.cos(pitch), sp = Math.sin(pitch);
        for (const point of particles) {
            const breathing = 1 + .075 * Math.sin(point.y * 5 + time * .65) + .035 * Math.cos(point.phase * 3 + time * .4);
            const x = (point.x * cos - point.z * sin) * breathing;
            const z = (point.z * cos + point.x * sin) * breathing;
            const y = point.y * cp - z * sp;
            const depth = point.y * sp + z * cp;
            const perspective = 3.5 / (3.5 - depth);
            const alpha = .18 + ((depth + 1.2) / 2.4) * .72;
            context.fillStyle = dark ? `rgba(213,190,112,${alpha})` : `rgba(133,109,43,${alpha})`;
            context.beginPath();
            context.arc(width / 2 + x * radius * perspective, height / 2 + y * radius * perspective, (.65 + (depth + 1) * .65) * perspective, 0, Math.PI * 2);
            context.fill();
        }
    }
    function tick(now) {
        frame = 0;
        if (!visible || document.hidden || reducedMotion.matches || window.portfolioIntro?.active) return;
        const interval = desktopPointer.matches ? 1000 / 60 : 1000 / 30;
        if (now - lastTime >= interval - 1) {
            const delta = Math.min((now - lastTime) / 1000, .05);
            time += delta;
            tiltX += (pointerX - tiltX) * .06;
            tiltY += (pointerY - tiltY) * .06;
            draw(); lastTime = now;
        }
        frame = requestAnimationFrame(tick);
    }
    function sync() {
        cancelAnimationFrame(frame); frame = 0; lastTime = performance.now();
        if (visible && !document.hidden && !reducedMotion.matches && !window.portfolioIntro?.active) frame = requestAnimationFrame(tick);
        else draw();
    }
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
    hero.addEventListener('pointermove', event => {
        if (!desktopPointer.matches || reducedMotion.matches) return;
        pointerX = (event.clientX / window.innerWidth - .5) * .55;
        pointerY = (event.clientY / window.innerHeight - .5) * .35;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('portfolio:intro-start', sync);
    document.addEventListener('portfolio:intro-end', sync);
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('portfolio:theme', () => { dark = document.documentElement.classList.contains('dark'); draw(); });
})();

// -------- Dev Terminal Simulation Engine -----------
let isTerminalTyping = false;

function runTerminalCmd(cmdName) {
    if (isTerminalTyping) return; // Prevent overlapping command runs
    
    const typedCmdEl = document.getElementById('terminal-typed-cmd');
    const screenEl = document.getElementById('terminal-screen');
    const inputLineEl = document.getElementById('terminal-input-line');
    
    if (!typedCmdEl || !screenEl || !inputLineEl) return;
    
    isTerminalTyping = true;
    typedCmdEl.textContent = '';
    
    // Command mapping and output content
    const commands = {
        profile: {
            text: './profile.sh',
            output: `
<span class="text-gray-500">-----------------------------------------------</span>
<span class="text-fuchsia-400 font-bold">Gourav Lohar - AI/ML & Python Developer</span>
<span class="text-gray-500">-----------------------------------------------</span>
<span class="text-indigo-400">Education:</span> B.Tech in AI & Machine Learning (Grad: 2025)
<span class="text-indigo-400">Institute:</span> NSHM Knowledge Campus
<span class="text-indigo-400">Focus Area:</span> Deep Learning, PyTorch, Scalable Backend Systems
<span class="text-indigo-400">Bio:</span> Building the future of intelligent web applications.
`
        },
        skills: {
            text: './skills.py',
            output: `
<span class="text-emerald-400 font-bold">Tech Stack Metrics & Skill Assessment:</span>
Python       [████████████████████] 100%
ML/DL        [██████████████████░░] 90%
Flask/Django [████████████████░░░░] 80%
MySQL/SQL    [██████████████░░░░░░] 70%
DevOps/Azure [████████████░░░░░░░░] 60%
`
        },
        certifications: {
            text: './certs.txt',
            output: `
<span class="text-yellow-400 font-bold">Certifications & Achievements:</span>
[✓] Machine Learning - IIT Kharagpur
[✓] Published Data Science Writer:
    - Analytics Vidhya
    - Geeks for Geeks
    - Medium / Towards AI
[✓] NPTEL Python & Data Analytics Certification
`
        },
        clear: {
            text: 'clear',
            output: null
        }
    };
    
    const selectedCmd = commands[cmdName];
    if (!selectedCmd) {
        isTerminalTyping = false;
        return;
    }
    
    // Typing simulation
    let charIndex = 0;
    const commandText = selectedCmd.text;
    
    const typingInterval = setInterval(() => {
        if (charIndex < commandText.length) {
            typedCmdEl.textContent += commandText.charAt(charIndex);
            charIndex++;
            // Scroll screen to keep input in view
            screenEl.scrollTop = screenEl.scrollHeight;
        } else {
            clearInterval(typingInterval);
            
            setTimeout(() => {
                if (cmdName === 'clear') {
                    // Clear all logs except welcome message and input line
                    screenEl.innerHTML = `
                        <div>
                            <span class="text-purple-400">gourav@portfolio</span>:<span class="text-indigo-400">~</span>$ ./welcome.sh
                        </div>
                        <div class="text-gray-400">
                            Welcome to Gourav's interactive portfolio terminal v1.2.0.<br>
                            Select a shortcut button below to run a command.
                        </div>
                    `;
                    screenEl.appendChild(inputLineEl);
                    typedCmdEl.textContent = '';
                } else {
                    // Print command result
                    const outputDiv = document.createElement('div');
                    outputDiv.className = 'text-gray-300 dark:text-gray-300 font-mono mt-1 leading-relaxed';
                    outputDiv.innerHTML = selectedCmd.output.trim().replace(/\n/g, '<br>');
                    
                    // Create wrapper with prompt history
                    const historyDiv = document.createElement('div');
                    historyDiv.innerHTML = `<div><span class="text-purple-400">gourav@portfolio</span>:<span class="text-indigo-400">~</span>$ ${selectedCmd.text}</div>`;
                    
                    // Append elements to terminal before input line
                    screenEl.insertBefore(historyDiv, inputLineEl);
                    screenEl.insertBefore(outputDiv, inputLineEl);
                    
                    // Clean input line
                    typedCmdEl.textContent = '';
                }
                
                isTerminalTyping = false;
                // Scroll to bottom
                screenEl.scrollTop = screenEl.scrollHeight;
            }, 250);
        }
    }, 50);
}

// Bind to window object to guarantee global accessibility for HTML onclick attributes
window.runTerminalCmd = runTerminalCmd;
// const showMoreButton = document.querySelector('.show-more-button'); 
// const hiddenBlogPosts = document.getElementById('hiddenBlogPosts');

// showMoreButton.addEventListener('click', () => {
//     hiddenBlogPosts.classList.toggle('hidden');

//     if (hiddenBlogPosts.classList.contains('hidden')) {
//         showMoreButton.textContent = 'Show More';
//     } else {
//         showMoreButton.textContent = 'Show Less';
//     }
// });
