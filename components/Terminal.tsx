"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { profile, projects, skillGroups } from "@/lib/data";
import { applyTheme, openSection, themes, type ThemeName } from "@/lib/theme";
import { Reveal } from "@/components/Fx";

type Line = { kind: "in" | "out"; text: string };

const HELP = [
  "help              show this list",
  "about             who I am",
  "skills            what I know",
  "projects          my live websites",
  "open <n>          open project n in a new tab",
  "contact           ways to reach me",
  "theme <name>      violet | ocean | sunset | mint",
  "whoami            who are you?",
  "clear             clean the screen",
].join("\n");

const chips = ["help", "about", "skills", "projects", "theme ocean", "sudo hire-me"];

function run(cmd: string): string | null {
  const [c, ...rest] = cmd.trim().split(/\s+/);
  const arg = rest.join(" ").toLowerCase();
  switch (c.toLowerCase()) {
    case "":
      return "";
    case "help":
      return HELP;
    case "about":
      return `${profile.name}: ${profile.role}.\n${profile.tagline}`;
    case "skills":
      return skillGroups.map((g) => `${g.name.padEnd(9)} ${g.items.map((i) => i.name).join(", ")}`).join("\n");
    case "projects":
      return projects.map((p, i) => `[${i + 1}] ${p.title} (${p.kind})\n    ${p.url}`).join("\n");
    case "open": {
      const p = projects[Number(arg) - 1];
      if (!p) return "usage: open <1-3>";
      window.open(p.url, "_blank", "noopener,noreferrer");
      return `opening ${p.url} …`;
    }
    case "contact":
      return `email   ${profile.email}\n` + profile.socials.map((s) => `${s.label.padEnd(8)}${s.href}`).join("\n");
    case "theme": {
      if (!(arg in themes)) return `usage: theme <${Object.keys(themes).join("|")}>`;
      applyTheme(arg as ThemeName);
      return `theme set to ${arg}`;
    }
    case "whoami": {
      let n = "";
      try { n = localStorage.getItem("visitor-name") ?? ""; } catch { /* ignore */ }
      return n ? `${n}, my favourite visitor` : "guest (tell me your name in the Hello, visitor section)";
    }
    case "sudo":
      if (arg === "hire-me") {
        setTimeout(() => openSection("contact"), 600);
        return "permission granted ✔  opening contact …";
      }
      return "nice try";
    case "clear":
      return null;
    default:
      return `command not found: ${c}. Type "help".`;
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `Welcome to ${profile.name}'s terminal.\nType "help" or tap a command below.` },
  ]);
  const [value, setValue] = useState("");
  const hist = useRef<string[]>([]);
  const idx = useRef(0);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  const exec = (cmd: string) => {
    const out = run(cmd);
    if (cmd.trim()) { hist.current.push(cmd); idx.current = hist.current.length; }
    setLines((l) => (out === null ? [] : [...l, { kind: "in", text: cmd }, ...(out ? [{ kind: "out" as const, text: out }] : [])]));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    exec(value);
    setValue("");
  };

  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      idx.current = Math.max(0, idx.current - 1);
      setValue(hist.current[idx.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      idx.current = Math.min(hist.current.length, idx.current + 1);
      setValue(hist.current[idx.current] ?? "");
    }
  };

  return (
    <section className="terminal-sec" id="terminal" aria-labelledby="terminal-title">
      <Reveal>
        <p className="eyebrow">Try it</p>
        <h2 id="terminal-title" className="section-title">Talk to my portfolio</h2>
        <p className="panel-lead">A working terminal. Type commands, use ↑ ↓ for history, or tap a chip.</p>
      </Reveal>

      <Reveal delay={0.1} className="term glass">
        <div className="term-bar" aria-hidden="true"><i /><i /><i /><span>guest@portfolio: ~</span></div>
        <div className="term-body" ref={body} onClick={() => input.current?.focus()} role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((l, i) => (
            <pre key={i} className={l.kind === "in" ? "t-in" : "t-out"}>{l.kind === "in" ? `$ ${l.text}` : l.text}</pre>
          ))}
        </div>
        <form className="term-form" onSubmit={submit}>
          <label htmlFor="term-input"><span aria-hidden="true">$</span><span className="sr">Command</span></label>
          <input
            id="term-input" ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={key}
            autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="type a command…"
          />
        </form>
        <div className="term-chips">
          {chips.map((c) => (<button key={c} type="button" onClick={() => exec(c)}>{c}</button>))}
        </div>
      </Reveal>
    </section>
  );
}
