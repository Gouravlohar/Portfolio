const sideMenu = document.querySelector('#sideMenu');
const navBar = document.querySelector('#dynamic-navbar');

function openMenu(){
    if (!sideMenu) return;
    sideMenu.style.transform = 'translateX(-16rem)';
}
function closeMenu(){
    if (!sideMenu) return;
    sideMenu.style.transform = 'translateX(16rem)';
}

// -------- 2026 Navbar Dynamic Scroll Logic -----------
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (navBar) {
        navBar.classList.toggle('shadow-[0_10px_30px_rgba(0,0,0,0.08)]', window.scrollY > 50);
        navBar.classList.toggle('dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]', window.scrollY > 50);
    }

    if (scrollToTopBtn) {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.remove('opacity-0', 'translate-y-20', 'pointer-events-none');
            scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'translate-y-20', 'pointer-events-none');
            scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// -------- Magnetic Hover Pill logic for Desktop Nav -----------
const navContainer = document.getElementById('nav-links-container');
const navHoverPill = document.getElementById('nav-hover-pill');
const navLinksItems = document.querySelectorAll('#nav-links-container li');

if (navContainer && navHoverPill) {
    navLinksItems.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const rect = link.getBoundingClientRect();
            const containerRect = navContainer.getBoundingClientRect();

            navHoverPill.style.width = `${rect.width}px`;
            navHoverPill.style.transform = `translateX(${rect.left - containerRect.left}px)`;
            navHoverPill.style.opacity = '1';
        });
    });

    navContainer.addEventListener('mouseleave', () => {
        navHoverPill.style.opacity = '0';
    });
}

// -------- light mode and dark mode -----------

// Always start in the portfolio's light theme. Visitors can still switch themes
// for their current visit using the toggle below.
document.documentElement.classList.remove('dark');

// Function to toggle the theme
function toggleTheme() {
    document.documentElement.classList.toggle('dark');

}

// -------- Drag to Scroll functionality -----------
const dragScrollContainers = document.querySelectorAll('.drag-scroll');

dragScrollContainers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        // Temporarily disable snapping while dragging
        container.classList.remove('snap-x', 'snap-mandatory');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('active');
        container.classList.add('snap-x', 'snap-mandatory');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('active');
        container.classList.add('snap-x', 'snap-mandatory');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Prevent text selection
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // The multiplier determines scroll speed
        container.scrollLeft = scrollLeft - walk;
    });
});

// About section animations will be initialized via GSAP ScrollTrigger below.

// -------- Initialize Lenis Smooth Scroll & GSAP 3D Hero Animations -----------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll Initialization
    let lenis = null;

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            lerp: 0.05, 
            wheelMultiplier: 1,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. Shared GSAP animations for all pages
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        // Project card reveal
        const workCards = document.querySelectorAll('.project-card');
        if (workCards.length > 0) {
            gsap.from(workCards, {
                scrollTrigger: {
                    trigger: '#work-cards-container',
                    start: 'top 78%',
                    toggleActions: 'play none none reverse'
                },
                y: 42,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out'
            });
        }

        // Project Title Reveal
        if (document.querySelector('.work-title') && document.querySelector('#work-header')) {
            gsap.from('.work-title', {
                scrollTrigger: {
                    trigger: '#work-header',
                    start: 'top 80%',
                },
                y: "100%",
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });
        }

        // Blog Section Animation
        const blogCards = document.querySelectorAll('.article-card');
        if(blogCards.length > 0) {
            gsap.from('.article-card', {
                scrollTrigger: {
                    trigger: '#blog',
                    start: 'top 70%',
                    toggleActions: "play none none reverse"
                },
                immediateRender: false,
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            });
        }

        // About Me Section Scroll Reveal Animation
        if (document.querySelector('#about') && document.querySelector('#about-info-col')) {
            gsap.fromTo('#about-info-col', 
                { y: 45, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '#about',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.0,
                    ease: 'power3.out'
                }
            );

            const portrait = document.querySelector('#about .group');
            if (portrait) {
                gsap.fromTo(portrait,
                    { y: 55, opacity: 0, scale: 0.95 },
                    {
                        scrollTrigger: {
                            trigger: '#about',
                            start: 'top 75%',
                            toggleActions: 'play none none reverse'
                        },
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1.1,
                        ease: 'power3.out'
                    }
                );
            }
        }

        // Timeline Section (Experience & Education) Scroll Reveal Animation
        if (document.querySelector('#timeline') && document.querySelector('#experience-col') && document.querySelector('#education-col')) {
            gsap.fromTo(['#experience-col', '#education-col'],
                { y: 45, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '#timeline',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.0,
                    stagger: 0.2,
                    ease: 'power3.out'
                }
            );
        }

        // Word-by-word reveals make the supporting copy feel responsive to scroll
        // without affecting controls, links, or the independently animated hero.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduceMotion && typeof SplitType !== 'undefined') {
            const textSelector = [
                '#about h2', '#about h3', '#about h4', '#about p',
                '#timeline h2', '#timeline h3', '#timeline h4', '#timeline h5', '#timeline p',
                '#work h2', '#work h3', '#work h4', '#work p',
                '#blog h2', '#blog h3', '#blog h4', '#blog p',
                '#contact h2', '#contact h3', '#contact h4', '#contact p',
                'footer p'
            ].join(', ');

            document.querySelectorAll(textSelector).forEach((element) => {
                if (element.closest('[aria-hidden="true"]')) return;

                const split = new SplitType(element, { types: 'words', tagName: 'span' });
                gsap.set(split.words, { yPercent: 110, autoAlpha: 0, willChange: 'transform, opacity' });
                gsap.to(split.words, {
                    scrollTrigger: { trigger: element, start: 'top 88%', once: true },
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: 0.62,
                    stagger: 0.014,
                    ease: 'power3.out',
                    onComplete: () => gsap.set(split.words, { willChange: 'auto' })
                });
            });
        }

        ScrollTrigger.refresh();
    }

    // 3. Signal / Systems hero entrance
    if (typeof gsap !== 'undefined' && document.querySelector('#hero-statement')) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const heroTargets = ['#hero-eyebrow', '#hero-identity', '#hero-description', '#hero-actions', '#hero-meta'];
        const heroLines = gsap.utils.toArray('#hero-statement .hero-line > span');

        if (reduceMotion) {
            gsap.set([...heroTargets, ...heroLines], { autoAlpha: 1, y: 0, clearProps: 'all' });
        } else {
            const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            gsap.set(heroTargets, {
                y: 28,
                autoAlpha: 0,
                filter: 'blur(6px)',
                willChange: 'transform, opacity, filter'
            });
            gsap.set(heroLines, { yPercent: 115, willChange: 'transform' });

            heroTl
                .to('#hero-eyebrow', { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.55 })
                .to('#hero-identity', { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.65 }, '-=0.25')
                .to(heroLines, { yPercent: 0, duration: 0.9, stagger: 0.11 }, '-=0.38')
                .to(['#hero-description', '#hero-actions', '#hero-meta'], { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.65, stagger: 0.08 }, '-=0.35')
                .add(() => {
                    gsap.set(heroTargets, { willChange: 'auto' });
                    gsap.set(heroLines, { willChange: 'auto' });
                });
        }
    }
});

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
