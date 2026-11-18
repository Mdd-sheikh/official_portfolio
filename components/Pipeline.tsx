"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Fx";

const steps = [
  { name: "Customer", short: "Browse", title: "The customer arrives", body: "A fast Next.js storefront loads in a blink. Products, cart and search all respond instantly, on phones and desktops.", tags: ["Next.js", "React", "Responsive"] },
  { name: "Cloudinary", short: "Images", title: "Images arrive optimized", body: "Product photos are stored once in Cloudinary and delivered in the best format and size for each device, so pages stay light.", tags: ["Cloudinary", "f_auto", "q_auto"] },
  { name: "Express API", short: "Server", title: "The server takes charge", body: "A Node.js and Express backend checks the cart, calculates the real total from the database and creates the order. The browser is never trusted with prices.", tags: ["Node.js", "Express.js", "REST"] },
  { name: "Razorpay", short: "Payment", title: "The payment is verified", body: "Razorpay Checkout collects the payment. The server then verifies the signature before marking the order paid, with a webhook as a safety net.", tags: ["Razorpay", "HMAC", "Webhooks"] },
  { name: "Shipmozo", short: "Shipping", title: "The parcel is booked", body: "Once paid, the order becomes a shipment through Shipmozo. The tracking number is saved and shown to the customer.", tags: ["Shipmozo", "Tracking", "AWB"] },
  { name: "AWS + Claude", short: "Cloud", title: "Cloud and AI behind it", body: "The system runs on AWS infrastructure, and Claude helps with research, code and content so features ship faster.", tags: ["AWS", "Claude", "Automation"] },
];

export default function Pipeline() {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % steps.length), 3200);
    return () => clearInterval(t);
  }, [play]);

  const s = steps[i];

  return (
    <section className="stack" id="stack" aria-labelledby="stack-title">
      <Reveal>
        <p className="eyebrow">The full stack</p>
        <h2 id="stack-title" className="section-title">From click to doorstep</h2>
        <p className="panel-lead">
          Follow one online order through the tools I build with. Select any step, or let it play.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="glass pipe">
        <ol className="pipe-nodes" style={{ ["--prog" as string]: i / (steps.length - 1) } as CSSProperties}>
          {steps.map((st, n) => (
            <li key={st.name}>
              <button
                type="button"
                className={`pipe-btn ${n < i ? "past" : ""}`}
                aria-pressed={n === i}
                onClick={() => { setI(n); setPlay(false); }}
              >
                <span className="pipe-dot" aria-hidden="true">{n + 1}</span>
                <span>{st.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="pipe-detail" aria-live="polite">
          <span className="pipe-step">Step {i + 1} of {steps.length} · {s.short}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          <span className="chips">{s.tags.map((t) => <span key={t}>{t}</span>)}</span>
        </div>

        <div className="pipe-tools">
          <span>Order journey</span>
          <button type="button" className="pipe-play" onClick={() => setPlay((p) => !p)} aria-pressed={play}>
            {play ? "Pause" : "Play"} animation
          </button>
        </div>
      </Reveal>
    </section>
  );
}
