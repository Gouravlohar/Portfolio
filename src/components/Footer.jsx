import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { scrollToTarget } from "../motion/scroll";
import MagneticControl from "../motion/MagneticControl";
import { warmJournal } from "../pages/loadJournal";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top micro">
        <span>HUMAN CURIOSITY. MACHINE POSSIBILITY.</span>
        <MagneticControl onClick={() => scrollToTarget(0)}>
          BACK TO TOP <ArrowUp size={14} />
        </MagneticControl>
      </div>
      <a
        href="mailto:gouravlohar640@gmail.com"
        className="footer-wordmark"
        aria-label="Email Gourav Lohar"
      >
        LET’S BUILD
        <ArrowUpRight />
      </a>
      <div className="footer-bottom">
        <span className="micro">© 2026 GOURAV LOHAR</span>
        <nav aria-label="Footer navigation">
          <Link to="/#about">About</Link>
          <Link to="/#timeline">Journey</Link>
          <Link to="/#work">Work</Link>
          <Link to="/blogs" onPointerEnter={warmJournal} onFocus={warmJournal}>
            Journal
          </Link>
          <Link to="/#contact">Contact</Link>
        </nav>
        <span className="micro">MADE WITH INTENTION. ALWAYS.</span>
      </div>
    </footer>
  );
}
