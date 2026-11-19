"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#skills", label: "Skills" },
  { href: "#stack", label: "Stack" },
  { href: "#services", label: "What I do" },
  { href: "#signature", label: "Labs" },
  { href: "#explore", label: "Work" },
  { href: "#sendmyform", label: "Contact" },
];

// Same idea as eng.dipsy.team: the menu is just the URL hash "#open".
// The URL is the single source of truth, so the browser back button closes it
// and the menu can be deep-linked.
export default function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === "#open");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="menu" id="open" data-open={open} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
      <a ref={closeBtn} className="menu-close" href="#top" tabIndex={open ? 0 : -1}>Close ✕</a>
      <nav>
        <ol>
          {links.map((l, i) => (
            <li key={l.href} style={{ ["--i" as string]: i }}>
              <a href={l.href} tabIndex={open ? 0 : -1}>
                <small>0{i + 1}</small>
                {l.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <p className="menu-foot">Press Esc to close</p>
    </div>
  );
}
