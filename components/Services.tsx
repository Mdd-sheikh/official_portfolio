"use client";

import { useState } from "react";
import { Reveal } from "@/components/Fx";

const groups = [
  { name: "Design", note: "Layouts people remember", items: ["Web design", "UI / UX", "Branding & visuals", "Motion & micro-interactions"] },
  { name: "Build", note: "Fast, clean, responsive", items: ["Next.js & React", "Node.js & Express", "Performance & SEO", "Accessible, mobile-first"] },
  { name: "Integrate", note: "Real-world commerce", items: ["Razorpay payments", "Cloudinary media", "Shipmozo shipping", "AWS hosting"] },
];

const expertise = ["E-commerce", "Fragrance & beauty", "Invoicing & SaaS", "Portfolios", "Local business", "Events"];

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <Reveal>
        <p className="eyebrow">What I do</p>
        <h2 id="services-title" className="section-title">Design. Build. Integrate.</h2>
      </Reveal>

      <ul className="svc-list">
        {groups.map((g, i) => {
          const isOpen = open === i;
          return (
            <li key={g.name} data-open={isOpen}>
              <button
                type="button"
                className="svc-head"
                aria-expanded={isOpen}
                aria-controls={`svc-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="svc-n">0{i + 1}</span>
                <span className="svc-name">{g.name}</span>
                <span className="svc-note">{g.note}</span>
                <span className="svc-plus" aria-hidden="true" />
              </button>
              <div className="svc-body" id={`svc-${i}`} role="region" aria-hidden={!isOpen}>
                <ul>
                  {g.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <Reveal className="svc-ind">
        <p>And that&apos;s not all. I&apos;ve built for</p>
        <div className="chips chips-lg">{expertise.map((e) => <span key={e}>{e}</span>)}</div>
      </Reveal>
    </section>
  );
}
