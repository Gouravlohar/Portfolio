# Gourav Lohar — Portfolio

A React/Vite portfolio with an editorial cobalt, graphite, and warm-white design.

## Experience

- Floating navigation dock and full-screen, keyboard-accessible menu.
- Asset-aware technical preloader with a skip action and timeout fallback.
- Responsive split hero with a lazy-loaded Three.js neural network showing data, learning layers, and predictions.
- Scroll-revealed biography, capability accordions, layered project cards, and experience/education tabs.
- A full-width, three-row toolkit marquee with 27 technologies, alternating directions, soft edge fades, and independent row pause on hover or keyboard focus. Reduced-motion users see a static grid; animation pauses offscreen and in background tabs.
- Searchable article library and a Web3Forms contact form with validation and status feedback.
- Persistent light/dark themes and responsive layouts.

## Motion and performance

GSAP and ScrollTrigger coordinate entrances and scroll effects. Framer Motion supplies spring interactions and state transitions. Lenis uses the shared GSAP clock on desktop; touch devices retain native scrolling.

The hero scrolls upward in separate depth layers: the neural network leads the headline, while the backdrop, grid, and captions drift more gently. Scroll progress is eased, travel is reduced on smaller screens, and reduced-motion mode disables the parallax. Entrance and pointer effects use separate transforms so they do not compete with scrolling.

The neural network uses a small procedural matcap, translucent layer planes, and animated signals. It has an SVG fallback, caps pixel density, and stops rendering offscreen or in a hidden tab. Three.js and the article route load separately. Fonts and imagery are served locally.

Primary controls use bounded magnetic springs with stable pointer coordinates. The contact button's ink fill uses a scaled layer. Route changes use a short fade, disable outgoing content, and restore keyboard focus and section positions once the destination mounts. Journal navigation preloads its route on pointer or keyboard focus.

The hero pointer loop sleeps after settling and wakes on new input. The neural network unregisters its rendering loop while hidden and can lower pixel density after sustained slow visible frames, without repeatedly raising and lowering quality.

Reduced-motion preferences are observed live. Animation contexts, listeners, observers, and WebGL resources are cleaned up on unmount. The navigation menu supports focus trapping, Escape, scroll locking, and focus restoration.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

Content lives in `src/data`; page components in `src/components` and `src/pages`; the shared animation system in `src/motion`; styles in `src/index.css`; static assets in `public/assets`.
