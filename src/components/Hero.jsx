import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import NeuralSculpture from "./NeuralSculpture";
import { scrollToTarget } from "../motion/scroll";
import useHeroPointer from "../motion/useHeroPointer";
import MagneticControl from "../motion/MagneticControl";
import InkButton from "../motion/InkButton";

export default function Hero({ ready, onSceneReady }) {
  const root = useRef(null);
  const pointer = useHeroPointer(root, ready);
  useLayoutEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        compact: "(max-width: 800px)",
      },
      (context) => {
        if (!context.conditions.motion) return;
        const ctx = gsap.context(() => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-name-inner", { yPercent: 105, duration: 1.15 }, 0.12)
            .from(
              ".neural-sculpture",
              { y: 65, scale: 0.88, opacity: 0, duration: 1.3 },
              0.18,
            )
            .from(
              ".hero-caption, .hero-note, .hero-bottom, .hero-index",
              { opacity: 0, duration: 0.8, stagger: 0.06 },
              0.5,
            );
          // Entrance and pointer transforms live on children. Scroll owns these
          // outer layers, so scrolling during the intro never fights a tween.
          const depth = context.conditions.compact ? 0.6 : 1;
          const travel = (ratio) => () =>
            -root.current.clientHeight * ratio * depth;
          const parallax = gsap.timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          });
          [
            [".hero-backdrop", 0.035],
            [".hero-grid", 0.07],
            [".hero-index", 0.09],
            [".hero-name", 0.18],
            [".hero-object", 0.3],
            [".hero-caption", 0.1],
            [".hero-note", 0.16],
            [".hero-bottom", 0.045],
          ].forEach(([selector, ratio]) => {
            parallax.fromTo(selector, { y: 0 }, { y: travel(ratio) }, 0);
          });
        }, root);
        return () => ctx.revert();
      },
    );
    return () => mm.revert();
  }, [ready]);
  return (
    <section
      id="top"
      className="hero-v3"
      ref={root}
      aria-labelledby="hero-heading"
    >
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div
        className="hero-pointer-light hero-pointer-light-back"
        aria-hidden="true"
      />
      <div
        className="hero-pointer-light hero-pointer-light-trail"
        aria-hidden="true"
      />
      <div className="hero-pointer-ring" aria-hidden="true" />
      <div className="hero-index micro">
        <span>APPLIED AI / MACHINE LEARNING / INTELLIGENT SYSTEMS</span>
        <span>BASED IN INDIA · AVAILABLE WORLDWIDE</span>
      </div>
      <h1 id="hero-heading" className="hero-name">
        <span className="hero-name-inner">
          <span className="hero-pointer-type">
            Human ideas.
            <br />
            <em>Intelligent</em>
            <br />
            outcomes<span className="hero-period">.</span>
          </span>
        </span>
      </h1>
      <div className="hero-object">
        <NeuralSculpture onReady={onSceneReady} pointer={pointer} />
      </div>
      <div className="hero-caption">
        <span className="micro">GOURAV LOHAR / AI & ML ENGINEER</span>
        <p>
          From raw data to useful intelligence.
          <br />
          AI built for real-world problems.
        </p>
        <InkButton
          className="resume-download hero-resume"
          href="/assets/cv/Gourav_Resume.pdf"
          download="Gourav_Lohar_Resume.pdf"
        >
          <Download size={18} aria-hidden="true" />
          Download résumé
          <span className="resume-format">PDF</span>
        </InkButton>
      </div>
      <div className="hero-note">
        <span className="status-dot" />
        <span>
          Data becomes understanding.
          <br />
          Move to explore the connections.
        </span>
      </div>
      <div className="hero-bottom">
        <span className="micro">MACHINE LEARNING / LLMs / APPLIED AI</span>
        <MagneticControl
          className="round-link"
          onClick={() => scrollToTarget("work")}
          aria-label="Explore selected work"
        >
          <ArrowDown size={22} />
        </MagneticControl>
        <MagneticControl
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("contact");
          }}
          className="line-link"
        >
          LET’S MAKE SOMETHING <ArrowUpRight size={16} />
        </MagneticControl>
      </div>
    </section>
  );
}
