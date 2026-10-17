import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// One shared, frame-rate-independent pointer signal for DOM and WebGL motion.
// Pointer events only update targets; rendering runs on the existing GSAP clock.
export default function useHeroPointer(root, ready) {
  const motion = useRef({ x: 0, y: 0, energy: 0 });
  useLayoutEffect(() => {
    if (!ready || !root.current) return;
    const host = root.current;
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const type = host.querySelector(".hero-pointer-type");
        const lights = [...host.querySelectorAll(".hero-pointer-light")];
        const ring = host.querySelector(".hero-pointer-ring");
        const target = { x: 0, y: 0, px: 0, py: 0, active: 0 };
        const spring = { x: 0, y: 0, vx: 0, vy: 0 };
        const followers = [0, 1, 2].map(() => ({ x: 0, y: 0 }));
        let visible = false,
          running = false,
          dirty = false,
          initialized = false,
          opacity = 0;
        const move = (event) => {
          if (event.pointerType !== "mouse") return;
          const rect = host.getBoundingClientRect();
          target.px = event.clientX - rect.left;
          target.py = event.clientY - rect.top;
          target.x = gsap.utils.clamp(-1, 1, (target.px / rect.width) * 2 - 1);
          target.y = gsap.utils.clamp(-1, 1, (target.py / rect.height) * 2 - 1);
          target.active = 1;
          dirty = true;
          if (!initialized) {
            followers.forEach((p) => {
              p.x = target.px;
              p.y = target.py;
            });
            initialized = true;
          }
          sync();
        };
        const leave = () => {
          target.x = target.y = target.active = 0;
          dirty = true;
          sync();
        };
        const tick = (_time, delta) => {
          const dt = Math.min(delta / 1000, 0.032);
          // Small substeps keep the spring stable after a busy frame.
          for (let i = 0; i < 2; i++) {
            const step = dt / 2;
            spring.vx += ((target.x - spring.x) * 95 - spring.vx * 19) * step;
            spring.vy += ((target.y - spring.y) * 95 - spring.vy * 19) * step;
            spring.x += spring.vx * step;
            spring.y += spring.vy * step;
          }
          motion.current.x = spring.x;
          motion.current.y = spring.y;
          motion.current.energy = Math.min(
            Math.hypot(spring.vx, spring.vy) * 0.12,
            1,
          );
          opacity += (target.active - opacity) * (1 - Math.exp(-7 * dt));
          type.style.transform = `translate3d(${-spring.x * 9}px,${-spring.y * 6}px,0) rotate(${spring.x * -0.35}deg)`;
          followers.forEach((point, index) => {
            const follow = 1 - Math.exp(-[7, 3.5, 15][index] * dt);
            point.x += (target.px - point.x) * follow;
            point.y += (target.py - point.y) * follow;
            const element = index < 2 ? lights[index] : ring;
            const stretch = index < 2 ? motion.current.energy * 0.35 : 0;
            element.style.transform = `translate3d(${point.x}px,${point.y}px,0) scale(${1 + stretch},${1 - stretch * 0.35})`;
            element.style.opacity = opacity;
          });
          const settled =
            Math.abs(target.x - spring.x) +
              Math.abs(target.y - spring.y) +
              Math.abs(spring.vx) +
              Math.abs(spring.vy) <
              0.001 &&
            Math.abs(target.active - opacity) < 0.001 &&
            followers.every(
              (point) =>
                Math.hypot(target.px - point.x, target.py - point.y) < 0.05,
            );
          if (settled) {
            motion.current.energy = 0;
            dirty = false;
            sync();
          }
        };
        const sync = () => {
          const shouldRun = visible && !document.hidden && dirty;
          if (shouldRun === running) return;
          running = shouldRun;
          if (running) gsap.ticker.add(tick);
          else {
            gsap.ticker.remove(tick);
          }
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (!visible) leave();
          sync();
        });
        observer.observe(host);
        host.addEventListener("pointermove", move, { passive: true });
        host.addEventListener("pointerleave", leave);
        host.addEventListener("pointercancel", leave);
        window.addEventListener("blur", leave);
        window.addEventListener("scroll", leave, { passive: true });
        document.addEventListener("visibilitychange", sync);
        return () => {
          gsap.ticker.remove(tick);
          observer.disconnect();
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
          host.removeEventListener("pointercancel", leave);
          window.removeEventListener("blur", leave);
          window.removeEventListener("scroll", leave);
          document.removeEventListener("visibilitychange", sync);
          type.style.removeProperty("transform");
          [...lights, ring].forEach((el) => {
            el.style.removeProperty("transform");
            el.style.removeProperty("opacity");
          });
          motion.current = { x: 0, y: 0, energy: 0 };
        };
      },
    );
    return () => media.revert();
  }, [root, ready]);
  return motion;
}
