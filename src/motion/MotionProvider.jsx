import React, { useEffect, useRef } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollController } from "./scroll";
import useMotionPreference from "./useMotionPreference";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function MotionProvider({ children }) {
  const progressRef = useRef(null);
  const reduced = useMotionPreference();

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
      () => {
        const lenis = new Lenis({
          // Frame-rate-independent easing on the same clock as the parallax.
          lerp: 0.075,
          smoothWheel: true,
          syncTouch: false,
        });
        setScrollController(lenis);
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          setScrollController(null);
          lenis.destroy();
        };
      },
    );
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progressRef.current)
          progressRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => {
      media.revert();
      progress.kill();
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion={reduced ? "always" : "never"}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div
          ref={progressRef}
          className="reading-progress"
          aria-hidden="true"
        />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
