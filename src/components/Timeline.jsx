import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experiences, educations } from "../data/timeline";
import useMotionPreference from "../motion/useMotionPreference";
export default function Timeline() {
  const [tab, setTab] = useState("experience");
  const reduced = useMotionPreference();
  const items = tab === "experience" ? experiences : educations;
  return (
    <section id="timeline" className="journey-section section-pad">
      <div className="section-top micro">
        <span>03 / ALWAYS IN PROGRESS</span>
        <span>THE JOURNEY SO FAR</span>
      </div>
      <div className="journey-layout">
        <div className="journey-heading">
          <h2 data-reveal>
            Made of
            <br />
            <em>experience.</em>
          </h2>
          <p data-reveal>
            Good work comes from showing up,
            <br />
            staying curious, and building again.
          </p>
          <div
            className="journey-tabs"
            role="tablist"
            aria-label="Career timeline"
          >
            {["experience", "education"].map((name) => (
              <button
                key={name}
                id={`${name}-tab`}
                role="tab"
                aria-selected={tab === name}
                aria-controls="journey-panel"
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <span className="journey-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
        <div
          className="journey-list"
          id="journey-panel"
          role="tabpanel"
          aria-labelledby={`${tab}-tab`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={tab}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -10 }}
              transition={{ duration: reduced ? 0 : 0.25, type: "tween" }}
            >
              {items.map((item, i) => (
                <article className="journey-row" key={item.period}>
                  <div className="journey-meta micro">
                    <span>{item.period}</span>
                    <span>
                      0{i + 1} <ArrowUpRight size={13} />
                    </span>
                  </div>
                  <h3>{item.role || item.degree}</h3>
                  <h4>{item.company || item.institution}</h4>
                  <p>{item.description}</p>
                  {item.skills ? (
                    <div className="journey-tags">
                      {item.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="education-metric">
                      <strong>{item.metricValue}</strong>
                      <span className="micro">{item.metricLabel}</span>
                    </div>
                  )}
                </article>
              ))}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
