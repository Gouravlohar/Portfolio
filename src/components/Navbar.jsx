import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import { Sun, Moon, ArrowUpRight, Plus, X, Download } from "lucide-react";
import useMotionPreference from "../motion/useMotionPreference";
import { scrollToTarget, lockScroll } from "../motion/scroll";
import MagneticControl from "../motion/MagneticControl";
import InkButton from "../motion/InkButton";
import { warmJournal } from "../pages/loadJournal";
const links = [
  ["work", "Selected work"],
  ["about", "The person"],
  ["timeline", "The journey"],
  ["blogs", "Field notes"],
  ["contact", "Let’s talk"],
];

export default function Navbar({ isDark, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(),
    navigate = useNavigate(),
    dialog = useRef(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockScroll(true);
    dialog.current?.querySelector("button")?.focus();
    const key = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key !== "Tab") return;
      const items = dialog.current?.querySelectorAll(
        "a[href],button:not([disabled])",
      );
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      lockScroll(false);
      document.removeEventListener("keydown", key);
      previous?.focus({ preventScroll: true });
    };
  }, [menuOpen]);
  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    lockScroll(false);
    if (location.pathname !== "/") navigate(`/#${id}`);
    else requestAnimationFrame(() => scrollToTarget(id));
  };
  return (
    <>
      <header className="site-nav" id="dynamic-navbar">
        <Link
          className="nav-brand"
          to="/"
          onClick={(e) => go(e, "top")}
          aria-label="Gourav Lohar home"
        >
          <span className="brand-star">✳</span>
          <span>
            GOURAV
            <br />
            LOHAR
          </span>
        </Link>
        <nav className="nav-dock" aria-label="Main navigation">
          <a href="/#work" onClick={(e) => go(e, "work")}>
            Work<span>03</span>
          </a>
          <a href="/#about" onClick={(e) => go(e, "about")}>
            About
          </a>
          <Link
            to="/blogs"
            onPointerEnter={warmJournal}
            onFocus={warmJournal}
            aria-current={location.pathname === "/blogs" ? "page" : undefined}
          >
            Journal
          </Link>
          <a
            href="/#contact"
            onClick={(e) => go(e, "contact")}
            className="dock-contact"
          >
            Let’s talk <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="nav-controls">
          <InkButton
            className="resume-download nav-resume"
            href="/assets/cv/Gourav_Resume.pdf"
            download="Gourav_Lohar_Resume.pdf"
            aria-label="Download résumé (PDF)"
          >
            <span>Résumé</span>
            <Download size={15} aria-hidden="true" />
          </InkButton>
          <MagneticControl
            className="theme-control"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            aria-pressed={isDark}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </MagneticControl>
          <MagneticControl
            className="menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <span>MENU</span>
            <Plus size={22} />
          </MagneticControl>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <m.div
            className="menu-overlay"
            initial={reduced ? false : { y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "tween",
              duration: reduced ? 0 : 0.65,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div
              ref={dialog}
              id="site-menu"
              className="menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              data-lenis-prevent
            >
              <div className="menu-top micro">
                <span>GOOD THINGS START WITH A CONVERSATION.</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={28} />
                </button>
              </div>
              <nav className="menu-links" aria-label="Expanded navigation">
                {links.map(([id, label], index) => (
                  <m.div
                    key={id}
                    initial={reduced ? false : { y: 35, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: reduced ? 0 : 0.15 + index * 0.045,
                      duration: 0.55,
                    }}
                  >
                    <span className="micro">0{index + 1}</span>
                    {id === "blogs" ? (
                      <Link
                        to="/blogs"
                        onPointerEnter={warmJournal}
                        onFocus={warmJournal}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                        <ArrowUpRight />
                      </Link>
                    ) : (
                      <a href={`/#${id}`} onClick={(e) => go(e, id)}>
                        {label}
                        <ArrowUpRight />
                      </a>
                    )}
                  </m.div>
                ))}
              </nav>
              <div className="menu-bottom">
                <a className="line-link" href="mailto:gouravlohar640@gmail.com">
                  gouravlohar640@gmail.com <ArrowUpRight size={16} />
                </a>
                <a
                  className="micro"
                  href="/assets/cv/Gourav_Resume.pdf"
                  download="Gourav_Lohar_Resume.pdf"
                >
                  DOWNLOAD RÉSUMÉ ↓
                </a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
