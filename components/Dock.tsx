"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/lib/data";
import { applyTheme, openSection, savedTheme, themes, type ThemeName } from "@/lib/theme";

type Action = { id: string; label: string; hint: string; run: () => void };

const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Dock() {
  const [theme, setTheme] = useState<ThemeName>("violet");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const back = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const s = savedTheme();
      if (s) { applyTheme(s); setTheme(s); }
    }, 0);
    const on = (e: Event) => setTheme((e as CustomEvent<ThemeName>).detail);
    window.addEventListener("theme-change", on);
    return () => { clearTimeout(t); window.removeEventListener("theme-change", on); };
  }, []);

  const actions = useMemo<Action[]>(() => [
    { id: "top", label: "Go to top", hint: "Section", run: go("top") },
    { id: "visitor", label: "Hello, visitor", hint: "Section", run: go("visitor") },
    { id: "skills", label: "Skills lab", hint: "Section", run: go("skills") },
    { id: "terminal", label: "Terminal", hint: "Section", run: go("terminal") },
    { id: "process", label: "How I work", hint: "Section", run: go("process") },
    { id: "explore", label: "Explore cards", hint: "Section", run: go("explore") },
    { id: "p", label: "Open Projects panel", hint: "Panel", run: () => openSection("projects") },
    { id: "a", label: "Open About panel", hint: "Panel", run: () => openSection("about") },
    { id: "x", label: "Open Extra-curricular panel", hint: "Panel", run: () => openSection("extra") },
    { id: "c", label: "Open Contact panel", hint: "Panel", run: () => openSection("contact") },
    ...projects.map((p) => ({ id: p.url, label: `Visit ${p.title}`, hint: "Live site ↗", run: () => { window.open(p.url, "_blank", "noopener,noreferrer"); } })),
    ...(Object.keys(themes) as ThemeName[]).map((t) => ({ id: `t-${t}`, label: `Theme: ${themes[t].label}`, hint: "Colour", run: () => applyTheme(t) })),
  ], []);

  const list = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  const show = () => {
    back.current = document.activeElement as HTMLElement | null;
    setQ(""); setSel(0); setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    back.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) { setOpen(false); back.current?.focus(); }
        else { back.current = document.activeElement as HTMLElement | null; setQ(""); setSel(0); setOpen(true); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.getElementById("page-root");
    root?.setAttribute("inert", "");
    const f = setTimeout(() => input.current?.focus(), 30);
    return () => { root?.removeAttribute("inert"); clearTimeout(f); };
  }, [open]);

  const choose = (a?: Action) => {
    if (!a) return;
    setOpen(false);
    setTimeout(() => a.run(), 60);
  };

  return (
    <>
      <div className="dock glass" role="toolbar" aria-label="Quick controls">
        {(Object.keys(themes) as ThemeName[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`swatch ${theme === t ? "on" : ""}`}
            style={{ background: themes[t].dot }}
            aria-label={`${themes[t].label} theme`}
            aria-pressed={theme === t}
            onClick={() => applyTheme(t)}
          />
        ))}
        <span className="dock-sep" aria-hidden="true" />
        <button type="button" className="dock-search" onClick={show} aria-haspopup="dialog">
          Search <kbd>Ctrl K</kbd>
        </button>
      </div>

      {open && (
        <div className="palette-back" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
          <div className="palette glass" role="dialog" aria-modal="true" aria-label="Command palette">
            <input
              ref={input}
              value={q}
              onChange={(e) => { setQ(e.target.value); setSel(0); }}
              onKeyDown={(e) => {
                if (e.key === "Escape") hide();
                else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(list.length - 1, s + 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
                else if (e.key === "Enter") { e.preventDefault(); choose(list[sel]); }
              }}
              placeholder="Jump to a section, open a project, change theme…"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={list[sel] ? `pal-${sel}` : undefined}
              aria-label="Search commands"
            />
            <ul id="palette-list" role="listbox">
              {list.length === 0 && <li className="pal-empty">No matches</li>}
              {list.map((a, i) => (
                <li
                  key={a.id}
                  id={`pal-${i}`}
                  role="option"
                  aria-selected={i === sel}
                  className={i === sel ? "on" : ""}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => choose(a)}
                >
                  <span>{a.label}</span><small>{a.hint}</small>
                </li>
              ))}
            </ul>
            <p className="pal-foot">↑ ↓ to move · Enter to run · Esc to close</p>
          </div>
        </div>
      )}
    </>
  );
}
