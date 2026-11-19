"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Fx";
import { profile } from "@/lib/data";

const topics = ["Website", "Online store", "Web app", "Something else"];

export default function SendForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const valid = name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(from) && msg.trim().length > 9;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const body = `${msg}\n\n— ${name} (${from})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`${topic} enquiry`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="sendform" id="sendmyform" aria-labelledby="send-title">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h2 id="send-title" className="section-title">Let&apos;s make something.</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <form className="send" onSubmit={submit} noValidate>
          <fieldset>
            <legend>I need a…</legend>
            <div className="opt-row">
              {topics.map((t) => (
                <button key={t} type="button" className="opt" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
              ))}
            </div>
          </fieldset>
          <label>Your name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label>Your email<input type="email" value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="email" /></label>
          <label>Tell me about it<textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} /></label>
          <button className="send-btn" type="submit" disabled={!valid}>Send</button>
          <p className="send-hint" role="status">
            {sent ? "Your email app should open with the message ready to send." : valid ? "Opens your email app with everything filled in." : "Fill in your name, a valid email and a few words."}
          </p>
        </form>
      </Reveal>
    </section>
  );
}
