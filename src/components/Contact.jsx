import React, { useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import InkButton from "../motion/InkButton";
export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const change = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    if (status.state === "loading") return;
    setStatus({ state: "loading", message: "" });
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "47b16c88-0110-481f-98bc-8585b6ac4d1d",
          ...form,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Please try again.");
      setStatus({
        state: "success",
        message:
          "Message received. Thanks for reaching out — I’ll be in touch.",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus({
        state: "error",
        message:
          "That didn’t go through. Please try again or email me directly.",
      });
    }
  };
  return (
    <section id="contact" className="contact-section section-pad">
      <div className="section-top micro">
        <span>05 / NEXT, LET’S MAKE IT REAL.</span>
        <span>
          <i className="status-dot" /> OPEN TO MEANINGFUL WORK
        </span>
      </div>
      <div className="contact-heading">
        <h2 data-reveal>
          Something
          <br />
          <em>on your mind?</em>
        </h2>
        <ArrowUpRight className="contact-big-arrow" aria-hidden="true" />
      </div>
      <div className="contact-grid">
        <div className="contact-info" data-reveal>
          <p>
            An ambitious idea. A tricky problem.
            <br />
            Or just a good conversation.
            <br />
            I’m all ears.
          </p>
          <a className="contact-email" href="mailto:gouravlohar640@gmail.com">
            gouravlohar640@gmail.com <ArrowUpRight size={18} />
          </a>
          <div className="contact-socials">
            <a
              href="https://github.com/Gouravlohar"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/gouravlohar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="/assets/cv/Gourav_Resume.pdf"
              download="Gourav_Lohar_Resume.pdf"
            >
              Download résumé ↓
            </a>
          </div>
          <div className="contact-location micro">
            KOLKATA, INDIA
            <br />
            WORKING EVERYWHERE.
          </div>
        </div>
        <form onSubmit={submit} className="contact-form">
          <span className="micro">TELL ME A LITTLE ABOUT IT.</span>
          <div className="form-grid">
            <label>
              Your name
              <input
                autoComplete="name"
                name="name"
                value={form.name}
                onChange={change}
                required
                placeholder="How should I call you?"
              />
            </label>
            <label>
              Email address
              <input
                autoComplete="email"
                type="email"
                name="email"
                value={form.email}
                onChange={change}
                required
                placeholder="you@somewhere.com"
              />
            </label>
            <label className="form-wide">
              Phone / optional
              <input
                autoComplete="tel"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={change}
                placeholder="If you prefer a call"
              />
            </label>
            <label className="form-wide">
              Tell me about the project
              <textarea
                name="message"
                rows={3}
                value={form.message}
                onChange={change}
                required
                placeholder="I have this idea…"
              />
            </label>
          </div>
          <div className="form-bottom">
            <InkButton type="submit" disabled={status.state === "loading"}>
              {status.state === "loading" ? (
                <>
                  Sending <LoaderCircle size={16} />
                </>
              ) : (
                <>
                  Send message <ArrowUpRight size={17} />
                </>
              )}
            </InkButton>
            <span className="micro">
              STRAIGHT TO MY INBOX.
              <br />
              USUALLY BACK WITHIN 24H.
            </span>
          </div>
          {status.message && (
            <p
              className={`form-status ${status.state}`}
              role={status.state === "error" ? "alert" : "status"}
            >
              {status.state === "success" && <Check size={16} />}{" "}
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
