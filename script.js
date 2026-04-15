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
window.addEventListener('scroll', () => {
    if (!navBar) return;
    if (window.scrollY > 50) {
        navBar.classList.add('shadow-lg', 'bg-white/80', 'dark:bg-[#030014]/80');
        navBar.classList.remove('bg-white/70', 'dark:bg-[#030014]/60');
    } else {
        navBar.classList.remove('shadow-lg', 'bg-white/80', 'dark:bg-[#030014]/80');
        navBar.classList.add('bg-white/70', 'dark:bg-[#030014]/60');
    }
    navBar.style.transform = 'translate(-50%, 0)'; // Keep shown at all times
});

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

// Check the theme in localStorage or the user's system preference
try {
    if (localStorage.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
} catch (error) {
    // localStorage can be blocked in some browser/privacy modes.
    document.documentElement.classList.remove('dark');
}

// Function to toggle the theme
function toggleTheme() {
    document.documentElement.classList.toggle('dark');

    try {
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    } catch (error) {
        // Ignore storage writes when storage is unavailable.
    }
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

// -------- About Me Text Reveal Scrub Effect (2026 Trend) -----------
document.addEventListener('DOMContentLoaded', () => {
    const aboutText = document.getElementById('about-text');
    
    if (aboutText) {
        // Split text into individual words
        const textContent = aboutText.textContent.trim();
        const words = textContent.split(/\s+/);
        aboutText.innerHTML = '';
        
        // Wrap each word in a span with initial low opacity
        words.forEach((word) => {
            const span = document.createElement('span');
            // Adding a small padding margin trick for spaces without layout shifts
            span.innerHTML = word + '&nbsp;';
            span.className = 'opacity-10 dark:opacity-20 text-gray-900 dark:text-white transition-opacity duration-300 inline-block';
            aboutText.appendChild(span);
        });

        const textSpans = aboutText.querySelectorAll('span');

        function updateReveal() {
            if(!aboutText) return;
            
            const rect = aboutText.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Adjust the reveal trigger zones
            // Start revealing when the element enters the bottom 80% of the viewport
            const startReveal = windowHeight * 0.85; 
            // the distance required to fully reveal the text
            const distanceToReveal = rect.height + windowHeight * 0.3;
            
            // Calculate progress (0 to 1) based on scroll position
            let progress = (startReveal - rect.top) / distanceToReveal;
            progress = Math.max(0, Math.min(1, progress));
            
            // Calculate how many words should be fully visible
            const wordsToReveal = Math.floor(progress * textSpans.length);
            
            textSpans.forEach((span, index) => {
                if (index < wordsToReveal) {
                    span.classList.remove('opacity-10', 'dark:opacity-20');
                    span.classList.add('opacity-100');
                    // Add subtle glow or highlight if you want:
                    // span.style.textShadow = "0 0 20px rgba(139, 92, 246, 0.4)";
                } else {
                    span.classList.remove('opacity-100');
                    span.classList.add('opacity-10', 'dark:opacity-20');
                    // span.style.textShadow = "none";
                }
            });
        }
        
        window.addEventListener('scroll', updateReveal);
        window.addEventListener('resize', updateReveal);
        updateReveal(); // Trigger immediately to check initial state
    }
});

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

        // Setup Project Cards Stack Animation
        const workCards = document.querySelectorAll('.work-card');
        workCards.forEach((card, index) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: `top ${15 + (index * 5)}vh`,
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                },
                scale: 0.95, // compress slightly as the next one stacks over it
                opacity: 0.5,
                transformOrigin: "top center"
            });
        });

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
        const blogCards = document.querySelectorAll('.blog-card');
        if(blogCards.length > 0) {
            gsap.from('.blog-card', {
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

        ScrollTrigger.refresh();
    }

    // 3. Fluid Hero Text Animation (smooth + lightweight)
    if (typeof gsap !== 'undefined' && document.querySelector('#hero-name-first') && document.querySelector('#hero-name-last')) {
        const firstNameEl = document.querySelector('#hero-name-first');
        const lastNameEl = document.querySelector('#hero-name-last');
        const heroLine = document.querySelector('#hero-line');
        const heroDeco = document.querySelector('#hero-deco');
        const heroContainer = document.querySelector('.hero-text-container');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobileView = window.matchMedia('(max-width: 767px)').matches;
        const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        let heroNameChars = [];
        if (typeof SplitType !== 'undefined') {
            const firstNameSplit = new SplitType(firstNameEl, { types: 'chars' });
            const lastNameSplit = new SplitType(lastNameEl, { types: 'chars' });
            heroNameChars = [...firstNameSplit.chars, ...lastNameSplit.chars];
            gsap.set(heroNameChars, { display: 'inline-block', willChange: 'transform, color, filter' });
        }

        if (reduceMotion || isMobileView) {
            gsap.set([firstNameEl, lastNameEl, '#hero-subtitle', '#hero-dock'], { autoAlpha: 1, y: 0, clearProps: 'all' });
            gsap.set([heroLine, heroDeco], { autoAlpha: 1, scaleX: 1, x: 0 });
        } else {
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            gsap.set([firstNameEl, lastNameEl], {
                y: 80,
                autoAlpha: 0,
                filter: 'blur(10px)',
                willChange: 'transform, opacity, filter'
            });
            gsap.set('#hero-subtitle', { y: 24, autoAlpha: 0 });
            gsap.set('#hero-dock', { y: 24, autoAlpha: 0 });
            gsap.set(heroLine, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set(heroDeco, { x: -16, autoAlpha: 0 });

            heroTl
                .to(firstNameEl, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.9 })
                .to(heroLine, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, '-=0.5')
                .to(lastNameEl, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.9 }, '-=0.55')
                .to(heroDeco, { x: 0, autoAlpha: 1, duration: 0.5 }, '-=0.4')
                .to(['#hero-subtitle', '#hero-dock'], { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12 }, '-=0.45')
                .add(() => {
                    gsap.set([firstNameEl, lastNameEl], { willChange: 'auto' });
                });

            // Subtle floating drift keeps the hero alive without causing overlap.
            gsap.to([firstNameEl, lastNameEl], {
                y: -3,
                duration: 3.8,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                stagger: 0.2
            });

            // Fluid per-character hover motion for hero name text.
            if (supportsHover && heroNameChars.length > 0) {
                heroNameChars.forEach((char) => {
                    const baseColor = window.getComputedStyle(char).color;

                    char.addEventListener('mouseenter', () => {
                        gsap.to(char, {
                            y: -12,
                            scale: 1.08,
                            rotationZ: (Math.random() - 0.5) * 6,
                            color: '#f97316',
                            duration: 0.28,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    });

                    char.addEventListener('mouseleave', () => {
                        gsap.to(char, {
                            y: 0,
                            scale: 1,
                            rotationZ: 0,
                            color: baseColor,
                            duration: 0.45,
                            ease: 'power3.out',
                            overwrite: 'auto'
                        });
                    });
                });
            }

            // Smooth pointer response with quickTo.
            if (heroContainer && supportsHover) {
                const xTo = gsap.quickTo(heroContainer, 'x', { duration: 0.5, ease: 'power3.out' });
                const yTo = gsap.quickTo(heroContainer, 'y', { duration: 0.5, ease: 'power3.out' });
                const rotateXTo = gsap.quickTo(heroContainer, 'rotationX', { duration: 0.5, ease: 'power3.out' });
                const rotateYTo = gsap.quickTo(heroContainer, 'rotationY', { duration: 0.5, ease: 'power3.out' });

                heroContainer.addEventListener('pointermove', (event) => {
                    const rect = heroContainer.getBoundingClientRect();
                    const x = (event.clientX - rect.left) / rect.width;
                    const y = (event.clientY - rect.top) / rect.height;
                    const centerX = (x - 0.5) * 2;
                    const centerY = (y - 0.5) * 2;

                    xTo(centerX * 8);
                    yTo(centerY * 4);
                    rotateYTo(centerX * 6);
                    rotateXTo(-centerY * 4);
                });

                heroContainer.addEventListener('pointerleave', () => {
                    xTo(0);
                    yTo(0);
                    rotateXTo(0);
                    rotateYTo(0);
                });
            }
        }
    }
});
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