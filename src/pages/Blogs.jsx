import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { blogs } from "../data/blogs";
import useSceneMotion from "../motion/useSceneMotion";
import useMotionPreference from "../motion/useMotionPreference";
export default function Blogs() {
  const [query, setQuery] = useState("");
  const root = useRef(null);
  useSceneMotion(root);
  const reduced = useMotionPreference();
  const filtered = blogs.filter((blog) =>
    `${blog.title} ${blog.category} ${blog.excerpt}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main
      className="journal-page section-pad"
      id="main-content"
      ref={root}
      tabIndex={-1}
    >
      <div className="section-top micro">
        <span>THE OPEN NOTEBOOK</span>
        <Link to="/">
          <ArrowLeft size={14} /> BACK TO THE PORTFOLIO
        </Link>
      </div>
      <div className="journal-page-heading">
        <h1>
          Field
          <br />
          <em>notes.</em>
          <sup>{blogs.length}</sup>
        </h1>
        <div>
          <p>
            Things I learn. Things I build.
            <br />
            Ideas worth putting into words.
          </p>
          <label className="journal-search">
            <Search size={18} />
            <input
              aria-label="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find something interesting…"
            />
          </label>
        </div>
      </div>
      <p className="search-count micro" role="status">
        {filtered.length} {filtered.length === 1 ? "NOTE" : "NOTES"} IN THE
        COLLECTION
      </p>
      <div className="journal-grid journal-all">
        {filtered.map((blog, index) => (
          <m.a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="journal-card blog-card"
            key={blog.id}
            initial={reduced ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 50px 0px" }}
            transition={{
              duration: reduced ? 0 : 0.55,
              type: "tween",
              delay: (index % 3) * 0.035,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="journal-image">
              <img
                src={blog.image}
                alt=""
                width="600"
                height="450"
                loading="lazy"
                decoding="async"
              />
              <span className="journal-arrow">
                <ArrowUpRight size={24} />
              </span>
            </div>
            <div className="journal-meta micro">
              <span>{blog.category}</span>
              <span>{blog.readTime}</span>
            </div>
            <h2>{blog.title}</h2>
            <p>{blog.excerpt}</p>
            <span className="journal-publisher micro">{blog.publisher} ↗</span>
          </m.a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="journal-empty">
          <p>No notes on that subject yet.</p>
          <button className="line-link" onClick={() => setQuery("")}>
            Clear search <ArrowUpRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
