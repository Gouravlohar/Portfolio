import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "../motion/scroll";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollToTarget(0);
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#151713] text-[#f5f4ef] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#a18b3f] hover:text-[#151713] dark:bg-[#f5f4ef] dark:text-[#151713] dark:hover:bg-[#a18b3f] dark:hover:text-[#151713] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
