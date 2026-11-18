"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";

type Phase = "ask" | "welcome" | "leave" | "done";

const NOPE = [
  "Take your time. I will wait.",
  "Still here whenever you are.",
  "Okay, deep breath. Ready now?",
];

export default function Intro() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [typed, setTyped] = useState(0);
  const [nope, setNope] = useState(0);
  const yes = useRef<HTMLButtonElement>(null);
  const text = `${profile.name}'s portfolio`;

  const go = () => setPhase((p) => (p === "ask" ? "welcome" : p));

  // lock the page and keep it inert while the intro is showing
  useEffect(() => {
    if (phase === "done") return;
    const root = document.getElementById("page-root");
    root?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    return () => {
      root?.removeAttribute("inert");
      document.body.style.overflow = "";
    };
  }, [phase]);

  // focus the Yes button, and let "Y" answer too
  useEffect(() => {
    if (phase !== "ask") return;
    const f = setTimeout(() => yes.current?.focus({ preventScroll: true }), 400);
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "y" && !e.ctrlKey && !e.metaKey && !e.altKey) go();
    };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(f); window.removeEventListener("keydown", onKey); };
  }, [phase]);

  // type the welcome line
  useEffect(() => {
    if (phase !== "welcome") return;
    const iv = setInterval(() => setTyped((n) => Math.min(n + 1, text.length)), 75);
    return () => clearInterval(iv);
  }, [phase, text.length]);

  // when typing finishes, pause a beat, then open the site
  useEffect(() => {
    if (phase !== "welcome" || typed < text.length) return;
    const t = setTimeout(() => setPhase("leave"), 900);
    return () => clearTimeout(t);
  }, [phase, typed, text.length]);

  useEffect(() => {
    if (phase !== "leave") return;
    document.documentElement.dataset.ready = "1";
    const t = setTimeout(() => setPhase("done"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`intro ${phase === "leave" ? "leave" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="intro-rings" aria-hidden="true"><i /><i /><i /><i /></div>

      {phase === "ask" && (
        <div className="intro-box">
          <p className="eyebrow">Before we begin</p>
          <h1 id="intro-title" className="intro-title">Are you <span className="grad">ready?</span></h1>
          <p className="intro-sub">A quick tour of my skills, projects and a few surprises.</p>
          <div className="cta">
            <button ref={yes} type="button" className="btn btn-solid" onClick={go}>Yes, I am ready</button>
            <button type="button" className="btn btn-ghost" onClick={() => setNope((n) => n + 1)}>Not yet</button>
          </div>
          <p className="intro-nope" aria-live="polite">{nope > 0 ? NOPE[(nope - 1) % NOPE.length] : " "}</p>
          <p className="intro-key" aria-hidden="true">or press <kbd>Y</kbd></p>
        </div>
      )}

      {phase !== "ask" && (
        <div className="intro-box intro-welcome">
          <p className="eyebrow">Welcome to</p>
          <h1 id="intro-title" className="intro-title" aria-label={text}>
            <span aria-hidden="true">
              <span className="grad">{text.slice(0, typed)}</span>
              <span className="caret" />
            </span>
          </h1>
        </div>
      )}
    </div>
  );
}
