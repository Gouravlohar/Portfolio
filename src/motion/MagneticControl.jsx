import React from "react";
import { m } from "framer-motion";
import useMagnetic from "./useMagnetic";

export default function MagneticControl({
  children,
  href,
  disabled,
  ...props
}) {
  const magnetic = useMagnetic(disabled);
  const Tag = href ? m.a : m.button;
  return (
    <Tag {...props} {...magnetic} href={href} disabled={disabled}>
      {children}
    </Tag>
  );
}
