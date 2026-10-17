import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Plus, Download } from "lucide-react";
import useMotionPreference from "../motion/useMotionPreference";
const capabilities = [
  [
    "01",
    "Applied AI & ML",
    "From experimentation to models that solve real problems. Machine learning, predictive analytics, and explainable AI.",
  ],
  [
    "02",
    "Intelligent applications",
    "Thoughtful interfaces connected to reliable Python services. FastAPI, Flask, Streamlit, and cloud deployment.",
  ],
  [
    "03",
    "Agents & language models",
    "Useful conversations, grounded answers, and automated workflows with LLMs, RAG, and agentic systems.",
  ],
];
export default function About() {
  const [open, setOpen] = useState(0);
  const reduced = useMotionPreference();
  return (
    <section id="about" className="about-section section-pad">
      <div className="section-top micro">
        <span>01 / THE PERSON BEHIND THE PIXELS</span>
        <span>CURIOUS BY DEFAULT.</span>
      </div>
      <div
        className="about-statement"
        data-word-reveal
        aria-label="I make complex things feel surprisingly simple."
      >
        {"I make complex things feel surprisingly simple."
          .split(" ")
          .map((word, i) => (
            <span aria-hidden="true" className="about-word" key={i}>
              {word}{" "}
            </span>
          ))}
        <span className="statement-star" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="about-grid">
        <div className="about-portrait" data-reveal>
          <div className="portrait-image">
            <img
              src="/assets/profile/Pic.jpeg"
              alt="Gourav Lohar"
              width="640"
              height="800"
              loading="lazy"
              decoding="async"
              data-parallax
            />
            <span className="portrait-stamp">
              HUMAN
              <br />
              AFTER ALL.
            </span>
          </div>
          <div className="portrait-label micro">
            <span>GOURAV LOHAR</span>
            <span>KOLKATA, INDIA ↗</span>
          </div>
        </div>
        <div className="about-copy">
          <span className="micro" data-reveal>
            ENGINEERING WITH INTENTION.
          </span>
          <h2 data-reveal>
            A builder’s mind.
            <br />
            <em>A curious soul.</em>
          </h2>
          <p data-reveal>
            I’m Gourav, an AI & ML engineer connecting thoughtful
            experimentation with real-world engineering. I turn data, models,
            and a lot of curiosity into products people can actually use.
          </p>
          <p data-reveal>
            A B.Tech in AI & ML from NSHM Knowledge Campus, specialist training
            at IIT Kharagpur, and a habit of asking “what if?” keep me moving
            forward.
          </p>
          <a
            href="/assets/cv/Gourav_Resume.pdf"
            className="line-link"
            download="Gourav_Lohar_Resume.pdf"
          >
            DOWNLOAD RÉSUMÉ / PDF <Download size={16} aria-hidden="true" />
          </a>
          <div className="capabilities">
            {capabilities.map(([number, title, description], i) => (
              <div className="capability" key={number}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`capability-${i}`}
                >
                  <span className="micro">{number}</span>
                  <span>{title}</span>
                  <Plus className={open === i ? "is-open" : ""} size={20} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <m.div
                      id={`capability-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "tween",
                        duration: reduced ? 0 : 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p>{description}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
