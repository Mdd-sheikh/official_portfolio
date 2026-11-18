"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Reveal } from "@/components/Fx";

type Info = { device: string; os: string; browser: string; screen: string; lang: string; tz: string; scheme: string; cores: string; input: string; motion: string };
type Live = { time: string; secs: number; scroll: number; x: number; y: number; online: boolean };

function detect(): Info {
  const ua = navigator.userAgent;
  const device = /iPad|Tablet/i.test(ua) ? "Tablet" : /Mobi|iPhone|Android/i.test(ua) ? "Phone" : "Desktop or laptop";
  const os = /Windows/i.test(ua) ? "Windows" : /iPhone|iPad|iOS/i.test(ua) ? "iOS" : /Android/i.test(ua) ? "Android" : /Mac/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "Unknown OS";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "your browser";
  const m = (q: string) => window.matchMedia(q).matches;
  return {
    device, os, browser,
    screen: `${window.screen.width}×${window.screen.height} @${window.devicePixelRatio}x`,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    scheme: m("(prefers-color-scheme: light)") ? "Light" : "Dark",
    cores: String(navigator.hardwareConcurrency ?? "?"),
    input: navigator.maxTouchPoints > 0 ? "Touch" : "Mouse & keyboard",
    motion: m("(prefers-reduced-motion: reduce)") ? "Reduced" : "Full",
  };
}

function greeting(): string {
  const h = new Date().getHours();
  return h < 5 ? "Burning the midnight oil" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 21 ? "Good evening" : "Good night";
}

export default function Visitor() {
  const [info, setInfo] = useState<Info | null>(null);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [live, setLive] = useState<Live | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const start = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setInfo(detect());
      try { setName(localStorage.getItem("visitor-name") ?? ""); } catch { /* ignore */ }
    }, 0);
    start.current = Date.now();
    const move = (e: PointerEvent) => { pointer.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointermove", move);
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setLive({
        time: new Date().toLocaleTimeString(),
        secs: Math.round((Date.now() - start.current) / 1000),
        scroll: h > 0 ? Math.round((window.scrollY / h) * 100) : 0,
        x: pointer.current.x, y: pointer.current.y,
        online: navigator.onLine,
      });
    };
    const iv = setInterval(tick, 400);
    const first = setTimeout(tick, 0);
    return () => { clearTimeout(t); clearTimeout(first); clearInterval(iv); window.removeEventListener("pointermove", move); };
  }, []);

  const save = (e: FormEvent) => {
    e.preventDefault();
    const n = draft.trim().slice(0, 30);
    if (!n) return;
    setName(n); setDraft("");
    try { localStorage.setItem("visitor-name", n); } catch { /* ignore */ }
  };
  const forget = () => {
    setName("");
    try { localStorage.removeItem("visitor-name"); } catch { /* ignore */ }
  };

  const rows: [string, string][] = info && live ? [
    ["Device", info.device], ["System", info.os], ["Browser", info.browser], ["Screen", info.screen],
    ["Language", info.lang], ["Time zone", info.tz], ["Theme pref", info.scheme], ["CPU threads", info.cores],
    ["Input", info.input], ["Motion", info.motion], ["Connection", live.online ? "Online" : "Offline"], ["Local time", live.time],
  ] : [];

  return (
    <section className="visitor" id="visitor" aria-labelledby="visitor-title">
      <Reveal>
        <p className="eyebrow">Hello, visitor</p>
        <h2 id="visitor-title" className="section-title">
          {live ? greeting() : "Hello"}{name ? <>, <span className="grad">{name}</span></> : ""}. <br />I can see you.
        </h2>
        <p className="panel-lead">
          Not in a creepy way. Your browser tells every site a little about itself, so this page reads it live to adapt.
          Everything stays on your device and nothing is sent or stored anywhere else.
        </p>
      </Reveal>

      <div className="visitor-grid">
        <Reveal delay={0.1} className="glass visitor-card">
          <h3>What your browser says</h3>
          {info ? (
            <p className="tell">
              You are on a <b>{info.device.toLowerCase()}</b> running <b>{info.os}</b> with <b>{info.browser}</b>, in{" "}
              <b>{info.tz.replace("_", " ")}</b>. {info.input === "Touch" ? "I will keep things tap-friendly." : "Move your mouse over the sphere above and the cards below."}
            </p>
          ) : <p className="tell">Reading your browser…</p>}
          <dl className="facts">
            {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
        </Reveal>

        <Reveal delay={0.2} className="glass visitor-card">
          <h3>Live from this visit</h3>
          <div className="meters">
            <div className="meter"><span>Time on page</span><strong>{live ? `${live.secs}s` : "–"}</strong></div>
            <div className="meter"><span>Scrolled</span><strong>{live ? `${live.scroll}%` : "–"}</strong>
              <i className="bar"><b style={{ width: `${live?.scroll ?? 0}%` }} /></i></div>
            <div className="meter"><span>Pointer</span><strong>{live ? `${live.x}, ${live.y}` : "–"}</strong></div>
          </div>

          <form className="name-form" onSubmit={save}>
            <label htmlFor="vname">{name ? `Welcome, ${name}!` : "Tell me your name"}</label>
            {name ? (
              <button type="button" className="btn btn-ghost" onClick={forget}>Forget my name</button>
            ) : (
              <span className="name-row">
                <input id="vname" className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Your name" maxLength={30} autoComplete="given-name" />
                <button className="btn btn-solid" type="submit">Say hi</button>
              </span>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
