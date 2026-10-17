import React from "react";
import { m } from "framer-motion";
import useMotionPreference from "./useMotionPreference";
import useMagnetic from "./useMagnetic";

export default function InkButton({
  children,
  className = "",
  href,
  ...props
}) {
  const reduced = useMotionPreference();
  const magnetic = useMagnetic(props.disabled);
  const Tag = href ? m.a : m.button;
  return (
    <Tag
      {...magnetic}
      href={href}
      className={`ink-button ${className}`}
      onPointerEnter={(event) => {
        if (reduced || event.pointerType !== "mouse" || props.disabled) return;
        const box = event.currentTarget.getBoundingClientRect();
        const px = event.clientX - box.left;
        const py = event.clientY - box.top;
        event.currentTarget.style.setProperty("--ink-x", `${px}px`);
        event.currentTarget.style.setProperty("--ink-y", `${py}px`);
      }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      {...props}
    >
      <span className="ink-button-content">{children}</span>
    </Tag>
  );
}
