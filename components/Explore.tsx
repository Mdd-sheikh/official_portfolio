"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { profile, projects, skills, extras } from "@/lib/data";

type Id = "projects" | "about" | "extra" | "contact";

const items: { id: Id; label: string; hint: string; icon: string }[] = [
  { id: "projects", label: "Projects", hint: "3 live sites", icon: "01" },
  { id: "about", label: "About", hint: "Skills & story", icon: "02" },
  { id: "extra", label: "Extra-curricular", hint: "Beyond code", icon: "03" },
  { id: "contact", label: "Contact", hint: "Say hello", icon: "04" },
];

const OUT_MS = 1100;

function tilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${(-py * 10).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${(px * 12).toFixed(2)}deg`);
  el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
  el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
}

function untilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

function Content({ id }: { id: Id }) {
  if (id === "projects")
    return (
      <>
        <h2 id="onion-title">Projects</h2>
        <p className="panel-lead">Three sites I designed and built. Open any to see it live.</p>
        <div className="proj-grid">
          {projects.map((p, i) => (
            <a key={p.title} className="proj" href={p.url} target="_blank" rel="noopener noreferrer" onMouseMove={tilt} onMouseLeave={untilt}>
              <span className="proj-shot">
                <span className="shot-bar" aria-hidden="true"><i /><i /><i /><em>{p.url.replace("https://", "")}</em></span>
                <Image src={p.image} alt={`Screenshot of the ${p.title} website`} width={1440} height={900} sizes="(max-width: 700px) 90vw, 340px" />
              </span>
              <span className="proj-num">0{i + 1}</span>
              <span className="proj-kind">{p.kind}</span>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <span className="chips">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
              <span className="proj-link">Visit live site <b aria-hidden="true">↗</b><span className="sr">(opens in new tab)</span></span>
            </a>
          ))}
        </div>
      </>
    );
  if (id === "about")
    return (
      <>
        <h2 id="onion-title">About</h2>
        <p className="panel-lead">
          I am {profile.name}, a {profile.role.toLowerCase()}. I like clean layouts, smooth motion and sites that
          load fast on every screen.
        </p>
        <h3 className="panel-sub">Skills</h3>
        <div className="chips chips-lg">{skills.map((s) => <span key={s}>{s}</span>)}</div>
      </>
    );
  if (id === "extra")
    return (
      <>
        <h2 id="onion-title">Extra-curricular</h2>
        <p className="panel-lead">What I do away from the keyboard.</p>
        <div className="proj-grid">
          {extras.map((e, i) => (
            <div key={e.title} className="proj proj-static">
              <span className="proj-num">0{i + 1}</span>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
            </div>
          ))}
        </div>
      </>
    );
  return (
    <>
      <h2 id="onion-title">Contact</h2>
      <p className="panel-lead">Have a project in mind? Let us build it.</p>
      <a className="big-mail" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="chips chips-lg">
        {profile.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}
      </div>
    </>
  );
}

export default function Explore() {
  const [active, setActive] = useState<Id | null>(null);
  const [shown, setShown] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const trigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRef = useRef<() => void>(() => {});

  const open = (id: Id, el: HTMLElement | null) => {
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin({
        x: ((r.left + r.width / 2) / window.innerWidth) * 100,
        y: ((r.top + r.height / 2) / window.innerHeight) * 100,
      });
      trigger.current = el;
    } else {
      setOrigin({ x: 50, y: 50 });
      trigger.current = document.activeElement as HTMLElement | null;
    }
    setActive(id);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  });

  // lets the command palette and terminal open a section
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<Id>).detail;
      if (items.some((i) => i.id === id)) openRef.current(id, null);
    };
    window.addEventListener("open-section", on);
    return () => window.removeEventListener("open-section", on);
  }, []);

  const close = () => {
    setShown(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setActive(null);
      trigger.current?.focus();
    }, OUT_MS);
  };

  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    if (!active) return;
    const root = document.getElementById("page-root");
    root?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const f = setTimeout(() => closeBtn.current?.focus(), 500);
    return () => {
      root?.removeAttribute("inert");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(f);
    };
  }, [active]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <section className="explore" id="explore" aria-labelledby="explore-title">
      <p className="eyebrow">Explore</p>
      <h2 id="explore-title" className="section-title explore-title">Pick a card to open</h2>
      <ul className="diamonds">
        {items.map((it, i) => (
          <li key={it.id} style={{ ["--i" as string]: i } as CSSProperties}>
            <button
              type="button"
              className="diamond"
              aria-haspopup="dialog"
              onClick={(e) => open(it.id, e.currentTarget)}
              onMouseMove={tilt}
              onMouseLeave={untilt}
            >
              <span className="diamond-in">
                <span className="diamond-num">{it.icon}</span>
                <span className="diamond-label">{it.label}</span>
                <span className="diamond-hint">{it.hint}</span>
                <span className="card-arrow" aria-hidden="true">→</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active &&
        createPortal(
          <div
            className={`onion ${shown ? "is-open" : ""}`}
            style={{ ["--ox" as string]: `${origin.x}%`, ["--oy" as string]: `${origin.y}%` } as CSSProperties}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onion-title"
          >
            <div className="layer l1" />
            <div className="layer l2" />
            <div className="layer l3" />
            <div className="layer l4">
              <div className="panel">
                <button ref={closeBtn} type="button" className="close" onClick={close} aria-label="Close section">
                  <span aria-hidden="true">✕</span>
                </button>
                <Content id={active} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
