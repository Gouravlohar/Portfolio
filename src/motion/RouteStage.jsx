import React, { useLayoutEffect } from "react";
import { m, useIsPresent } from "framer-motion";
import useMotionPreference from "./useMotionPreference";
import { scrollToTarget } from "./scroll";

export function RouteArrival({ children, location, ready, lastPath }) {
  useLayoutEffect(() => {
    if (!ready) return;
    const changed =
      lastPath.current !== null && lastPath.current !== location.pathname;
    const frame = requestAnimationFrame(() => {
      lastPath.current = location.pathname;
      if (changed)
        document.getElementById("main-content")?.focus({ preventScroll: true });
      scrollToTarget(location.hash || 0, {
        immediate: changed || !location.hash,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, ready, lastPath]);
  return children;
}

export default function RouteStage({ children }) {
  const present = useIsPresent();
  const reduced = useMotionPreference();
  return (
    <m.div
      className="route-stage"
      inert={present ? undefined : ""}
      initial={{ opacity: reduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: reduced ? 1 : 0 }}
      transition={{
        type: "tween",
        duration: reduced ? 0 : present ? 0.3 : 0.16,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
