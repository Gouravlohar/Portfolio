import React, { useRef } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Toolkit from "../components/Toolkit";
import Work from "../components/Work";
import Timeline from "../components/Timeline";
import JournalPreview from "../components/JournalPreview";
import Contact from "../components/Contact";
import useSceneMotion from "../motion/useSceneMotion";
export default function Home({ ready, onSceneReady }) {
  const scene = useRef(null);
  useSceneMotion(scene, ready);
  return (
    <main id="main-content" ref={scene} tabIndex={-1}>
      <Hero ready={ready} onSceneReady={onSceneReady} />
      <About />
      <Toolkit />
      <Work />
      <div className="interlude" aria-hidden="true">
        <div className="type-marquee">
          <span>THINK DEEPLY. BUILD BOLDLY. ✳&nbsp;</span>
          <span>THINK DEEPLY. BUILD BOLDLY. ✳&nbsp;</span>
        </div>
      </div>
      <Timeline />
      <JournalPreview />
      <Contact />
    </main>
  );
}
