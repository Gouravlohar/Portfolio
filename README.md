# Portfolio

Static portfolio built with Tailwind CSS and native browser animations.

Serve the repository with any static server (for example, `python -m http.server 4173`). Both HTML pages use the committed `styles/utilities.css`; no JavaScript styling service is needed at runtime.

After changing Tailwind utility classes, run `npm ci` and `npm run build`. Use `npm run watch` while editing. Shared responsive styles and hero styling live in `site.css`; interactions live in `script.js`.

The hero uses a native canvas with fewer particles on touch devices, pauses outside the viewport, and respects reduced-motion preferences. Scrolling uses the browser's native behavior.

The light-theme neural-network intro (`intro.js` and `intro.css`) plays on every page load and reload, with a replay button in the hero. Its 0–100 counter represents the introductory animation sequence. Skip, Escape, reduced motion, and a timed fallback keep content accessible. Scroll reveals and the hero entrance are coordinated with the intro exit; section links retain their destination.
