import { useEffect } from "react";
import { useSpring } from "framer-motion";
import useMotionPreference from "./useMotionPreference";

export default function useMagnetic(disabled = false) {
  const reduced = useMotionPreference();
  const x = useSpring(0, { stiffness: 210, damping: 21, mass: 0.45 });
  const y = useSpring(0, { stiffness: 210, damping: 21, mass: 0.45 });
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  useEffect(() => {
    if (reduced || disabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [reduced, disabled, x, y]);
  useEffect(() => {
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
    };
  }, [x, y]);
  return {
    style: { x, y },
    onPointerMove(event) {
      if (
        reduced ||
        disabled ||
        event.pointerType !== "mouse" ||
        !matchMedia("(hover: hover)").matches
      )
        return;
      const box = event.currentTarget.getBoundingClientRect();
      // Remove our own translation so the target never chases its moving bounds.
      const dx = event.clientX - (box.left - x.get()) - box.width / 2;
      const dy = event.clientY - (box.top - y.get()) - box.height / 2;
      x.set(Math.max(-8, Math.min(8, dx * 0.16)));
      y.set(Math.max(-6, Math.min(6, dy * 0.2)));
    },
    onPointerLeave: reset,
    onPointerCancel: reset,
    onBlur: reset,
  };
}
