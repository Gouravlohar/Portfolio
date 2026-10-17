import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function useSceneMotion(ref, ready = true) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !ready) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray("[data-reveal]", root).forEach((el) =>
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
            clearProps: "transform,opacity",
          }),
        );
        gsap.utils.toArray("[data-word-reveal]", root).forEach((el) =>
          gsap.fromTo(
            el.querySelectorAll(".about-word"),
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: 0.16,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "bottom 40%",
                scrub: 0.4,
              },
            },
          ),
        );
        gsap.utils.toArray("[data-parallax]", root).forEach((el) =>
          gsap.fromTo(
            el,
            { yPercent: 5 },
            {
              yPercent: -5,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
              },
            },
          ),
        );
        gsap.utils.toArray(".journey-asterisk", root).forEach((el) =>
          gsap.to(el, {
            rotation: 120,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }),
        );
      }, root);
      return () => ctx.revert();
    });
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 1000px)",
      () => {
        const ctx = gsap.context(() => {
          const cards = gsap.utils.toArray("[data-project]", root);
          cards.slice(0, -1).forEach((card, i) =>
            gsap.to(card.querySelector(".project-surface"), {
              scale: 0.94,
              y: -18,
              transformOrigin: "top center",
              ease: "none",
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top 85%",
                end: "top 120px",
                scrub: 0.5,
              },
            }),
          );
        }, root);
        return () => ctx.revert();
      },
    );
    const loops = [...root.querySelectorAll(".type-marquee")],
      visible = new Set();
    const sync = () =>
      loops.forEach(
        (el) =>
          (el.style.animationPlayState =
            visible.has(el) && !document.hidden ? "running" : "paused"),
      );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) =>
        e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
      );
      sync();
    });
    loops.forEach((el) => observer.observe(el));
    document.addEventListener("visibilitychange", sync);
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh(true));
    };
    const resize = new ResizeObserver(refresh);
    resize.observe(root);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      mm.revert();
    };
  }, [ref, ready]);
}
