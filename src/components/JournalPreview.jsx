import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { blogs } from "../data/blogs";
export default function JournalPreview() {
  return (
    <section id="blog" className="journal-section section-pad">
      <div className="section-top micro">
        <span>04 / NOTES FROM THE PROCESS</span>
        <span>LEARN SOMETHING. PASS IT ON.</span>
      </div>
      <div className="journal-heading">
        <h2 data-reveal>
          Thinking
          <br />
          <em>out loud.</em>
        </h2>
        <Link className="line-link" to="/blogs">
          ALL {blogs.length} ARTICLES <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="journal-grid">
        {blogs.slice(0, 3).map((blog, i) => (
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="journal-card"
            key={blog.id}
            data-reveal
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
              <span className="journal-number micro">0{i + 1}</span>
            </div>
            <div className="journal-meta micro">
              <span>{blog.category}</span>
              <span>{blog.readTime}</span>
            </div>
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <span className="journal-publisher micro">{blog.publisher} ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
