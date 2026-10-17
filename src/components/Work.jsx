import React, { useRef, useEffect } from "react";
import { m, useSpring } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects } from "../data/projects";
import useMotionPreference from "../motion/useMotionPreference";
import MagneticControl from "../motion/MagneticControl";
function Project({ project, index }) {
  const ref = useRef(null),
    reduced = useMotionPreference();
  const rotateX = useSpring(0, { stiffness: 150, damping: 28 }),
    rotateY = useSpring(0, { stiffness: 150, damping: 28 });
  useEffect(() => {
    if (reduced) {
      rotateX.jump(0);
      rotateY.jump(0);
    }
  }, [reduced, rotateX, rotateY]);
  return (
    <article className={`project-card project-${index}`} data-project>
      <div className="project-surface">
        <div className="project-card-top micro">
          <span>0{index + 1} / SELECTED PROJECT</span>
          <span>
            {project.category}
            <Plus size={15} />
          </span>
        </div>
        <div className="project-card-grid">
          <div className="project-details">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-links">
              <MagneticControl
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                Explore the code <ArrowUpRight size={19} />
              </MagneticControl>
              {project.liveUrl && (
                <a
                  className="line-link"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LIVE DEMO <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
          <div
            className="project-visual"
            ref={ref}
            onPointerMove={(e) => {
              if (reduced || e.pointerType !== "mouse") return;
              const r = ref.current.getBoundingClientRect();
              rotateX.set((-(e.clientY - r.top - r.height / 2) / r.height) * 6);
              rotateY.set(((e.clientX - r.left - r.width / 2) / r.width) * 6);
            }}
            onPointerLeave={() => {
              rotateX.set(0);
              rotateY.set(0);
            }}
          >
            <span className="project-orbit" aria-hidden="true" />
            <m.a
              className="project-preview"
              href={project.liveUrl || project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Explore ${project.title}`}
              style={{ rotateX, rotateY }}
            >
              <div className="project-window">
                <i />
                <i />
                <i />
                <span>{project.title} / preview</span>
                <ArrowUpRight size={12} />
              </div>
              <div className="project-image">
                <img
                  src={project.image}
                  alt={`${project.title} project`}
                  width="720"
                  height="480"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="project-view">
                VIEW <ArrowUpRight size={20} />
              </span>
            </m.a>
          </div>
        </div>
        <div className="project-card-bottom micro">
          <span>INTELLIGENCE, PUT TO WORK.</span>
          <span>DESIGN / ENGINEERING / DEPLOYMENT</span>
        </div>
      </div>
    </article>
  );
}
export default function Work() {
  return (
    <section id="work" className="work-section section-pad">
      <div className="section-top micro">
        <span>02 / A FEW THINGS I’VE BUILT</span>
        <span>SELECTED WORK · 2024—2026</span>
      </div>
      <div className="work-heading">
        <h2 data-reveal>
          Less theory.
          <br />
          <em>More impact.</em>
        </h2>
        <p data-reveal>
          Real problems. Thoughtful systems.
          <br />A little ambition in every detail.
        </p>
      </div>
      <div className="project-stack">
        {projects.map((project, index) => (
          <Project key={project.id} project={project} index={index} />
        ))}
      </div>
      <div className="work-outro">
        <span>GOOD IDEAS DESERVE TO EXIST.</span>
        <a
          href="https://github.com/Gouravlohar"
          target="_blank"
          rel="noopener noreferrer"
        >
          More experiments on GitHub <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
