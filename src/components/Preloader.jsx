import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useMotionPreference from "../motion/useMotionPreference";

export default function Preloader({ sceneReady, onReady }) {
  const root = useRef(null),
    number = useRef(null),
    bar = useRef(null);
  const meter = useRef({ value: 0 });
  const [fontsReady, setFontsReady] = useState(false);
  const [timeout, setTimedOut] = useState(false);
  const [finished, setFinished] = useState(false);
  const reduced = useMotionPreference();
  const leaving = useRef(false);
  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      document.fonts.load("600 16px Inter"),
      document.fonts.load("400 16px Inter"),
    ]).then(() => {
      if (alive) setFontsReady(true);
    });
    const fallback = window.setTimeout(() => {
      if (alive) setTimedOut(true);
    }, 4500);
    return () => {
      alive = false;
      window.clearTimeout(fallback);
    };
  }, []);
  useEffect(() => {
    if (finished || leaving.current) return;
    const value = (fontsReady ? 65 : 0) + (sceneReady ? 35 : 0);
    const tween = gsap.to(meter.current, {
      value,
      duration: reduced ? 0 : 0.45,
      ease: "power2.out",
      onUpdate: () => {
        if (number.current)
          number.current.textContent = String(
            Math.round(meter.current.value),
          ).padStart(3, "0");
        if (bar.current)
          bar.current.style.transform = `scaleX(${meter.current.value / 100})`;
      },
    });
    return () => tween.kill();
  }, [fontsReady, sceneReady, reduced, finished]);
  useEffect(() => {
    if (finished || (!timeout && !(fontsReady && sceneReady))) return;
    leaving.current = true;
    const tl = gsap.timeline();
    tl.to(meter.current, {
      value: 100,
      duration: reduced ? 0 : 0.3,
      onUpdate: () => {
        if (number.current)
          number.current.textContent = String(
            Math.round(meter.current.value),
          ).padStart(3, "0");
        if (bar.current)
          bar.current.style.transform = `scaleX(${meter.current.value / 100})`;
      },
    })
      .call(onReady)
      .to(root.current, {
        yPercent: -101,
        duration: reduced ? 0 : 0.85,
        ease: "power4.inOut",
        onComplete: () => setFinished(true),
      });
    return () => {
      tl.kill();
      leaving.current = false;
    };
  }, [fontsReady, sceneReady, timeout, reduced, onReady, finished]);
  if (finished) return null;
  return (
    <div
      className="system-loader"
      ref={root}
      role="status"
      aria-label="Preparing portfolio"
    >
      <div className="loader-header">
        <span>GOURAV / DIGITAL SYSTEMS</span>
        <span>PORTFOLIO — 2026</span>
      </div>
      <div className="loader-center">
        <div className="loader-glyph" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="loader-word">
          HELLO<span>_</span>
        </div>
        <p>Ideas are coming together.</p>
      </div>
      <div className="loader-footer">
        <div>
          <span className="loader-code">[ INITIALIZING EXPERIENCE ]</span>
          <button onClick={() => setTimedOut(true)}>Skip intro ↗</button>
        </div>
        <span className="loader-number" ref={number} aria-hidden="true">
          000
        </span>
      </div>
      <div className="loader-track">
        <div ref={bar} />
      </div>
    </div>
  );
}
