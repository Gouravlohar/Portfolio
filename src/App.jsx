import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Preloader from "./components/Preloader";
import { lockScroll } from "./motion/scroll";
import RouteStage, { RouteArrival } from "./motion/RouteStage";
import { loadJournal } from "./pages/loadJournal";
const Blogs = lazy(loadJournal);
export default function App() {
  const location = useLocation();
  const lastPath = useRef(null);
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  const [ready, setReady] = useState(false),
    [sceneReady, setSceneReady] = useState(location.pathname !== "/");
  const onReady = useCallback(() => setReady(true), []),
    onSceneReady = useCallback(() => setSceneReady(true), []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);
  useEffect(() => {
    lockScroll(!ready);
    document.body.classList.toggle("is-loading", !ready);
    return () => document.body.classList.remove("is-loading");
  }, [ready]);
  return (
    <>
      <Preloader sceneReady={sceneReady} onReady={onReady} />
      <div
        className={`site-shell ${ready ? "is-ready" : ""}`}
        inert={ready ? undefined : ""}
      >
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar isDark={isDark} toggleTheme={() => setIsDark((v) => !v)} />
        <AnimatePresence mode="wait" initial={false}>
          <RouteStage key={location.pathname}>
            <Suspense
              fallback={
                <main id="main-content" className="route-loading" role="status">
                  Opening the notebook…
                </main>
              }
            >
              <RouteArrival
                location={location}
                ready={ready}
                lastPath={lastPath}
              >
                <Routes location={location}>
                  <Route
                    path="/"
                    element={<Home ready={ready} onSceneReady={onSceneReady} />}
                  />
                  <Route path="/blogs" element={<Blogs />} />
                </Routes>
              </RouteArrival>
            </Suspense>
            <Footer />
          </RouteStage>
        </AnimatePresence>
      </div>
    </>
  );
}
