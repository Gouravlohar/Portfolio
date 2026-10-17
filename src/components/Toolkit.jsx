import React, { useEffect, useRef, useState } from "react";
import { Database, MoveRight } from "lucide-react";
import { tools } from "../data/tools";
import useMotionPreference from "../motion/useMotionPreference";

const rows = [
  { label: "DATA & MACHINE LEARNING", tools: tools.slice(0, 9) },
  { label: "LANGUAGE MODELS & APPLICATIONS", tools: tools.slice(9, 18) },
  { label: "CLOUD & DEVELOPER TOOLS", tools: tools.slice(18) },
];

function ToolBadge({ tool }) {
  return (
    <li className="tool-marquee-card">
      <span className="tool-marquee-icon">
        {tool.image ? (
          <img
            src={`/assets/icons/${tool.image}`}
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Database size={36} aria-hidden="true" />
        )}
      </span>
      <span className="tool-marquee-name">{tool.name}</span>
      <span className="tool-marquee-star" aria-hidden="true">
        ✳
      </span>
    </li>
  );
}

export default function Toolkit() {
  const root = useRef(null);
  const reduced = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const staticLayout = reduced;
  const playing = !reduced && visible && pageVisible;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(root.current);
    const sync = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <section
      className="tool-belt"
      id="toolkit"
      ref={root}
      aria-labelledby="toolkit-heading"
    >
      <div className="toolkit-heading micro">
        <span>THE EVERYDAY TOOLKIT</span>
        <span>{tools.length} TECHNOLOGIES / ENDLESS POSSIBILITIES</span>
      </div>
      <div className="toolkit-intro">
        <h3 id="toolkit-heading">
          Curiosity is constant.
          <br />
          <em>So is the learning.</em>
        </h3>
        <div className="toolkit-intro-note">
          <span className="toolkit-asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            The tools behind the thinking.
            <br />
            From the first experiment to the final build.
          </p>
        </div>
      </div>
      <div
        className={`toolkit-marquee-stage ${staticLayout ? "is-static" : ""}`}
        style={{ "--marquee-play-state": playing ? "running" : "paused" }}
      >
        <div className="toolkit-stage-top micro">
          <span>
            <i /> MY WORKING STACK
          </span>
          <span>EXPERIMENT. LEARN. BUILD.</span>
        </div>
        {rows.map((row, index) => (
          <div
            className={`tool-marquee-row tool-marquee-row-${index}`}
            key={row.label}
            tabIndex={reduced ? undefined : 0}
            role="group"
            aria-label={row.label}
          >
            <div className="tool-marquee-label micro">
              <span>0{index + 1}</span>
              {row.label}
              <MoveRight size={14} aria-hidden="true" />
            </div>
            <div className="tool-marquee-window">
              <div className="tool-marquee-track">
                <ul className="tool-marquee-set" aria-label={row.label}>
                  {row.tools.map((tool) => (
                    <ToolBadge key={tool.name} tool={tool} />
                  ))}
                </ul>
                {!staticLayout && (
                  <ul className="tool-marquee-set" aria-hidden="true">
                    {row.tools.map((tool) => (
                      <ToolBadge key={tool.name} tool={tool} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="toolkit-stage-bottom">
          <span className="micro">
            A TOOLKIT THAT KEEPS GROWING<span aria-hidden="true"> ↗</span>
          </span>
          <span className="toolkit-stage-count">
            {tools.length}
            <span> & counting</span>
          </span>
        </div>
      </div>
    </section>
  );
}
