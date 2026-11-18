"use client";

import { useState, type CSSProperties } from "react";
import { skillGroups } from "@/lib/data";
import { Reveal } from "@/components/Fx";

export default function Skills() {
  const [tab, setTab] = useState(0);
  const [hot, setHot] = useState<string | null>(null);
  const group = skillGroups[tab];
  const avg = Math.round(group.items.reduce((a, b) => a + b.level, 0) / group.items.length);
  const hovered = group.items.find((i) => i.name === hot);

  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <Reveal>
        <p className="eyebrow">Skills lab</p>
        <h2 id="skills-title" className="section-title">What I work with</h2>
      </Reveal>

      <Reveal delay={0.1} className="glass skills-card">
        <div role="tablist" aria-label="Skill categories" className="tabs">
          {skillGroups.map((g, i) => (
            <button
              key={g.name}
              role="tab"
              id={`tab-${i}`}
              aria-selected={tab === i}
              aria-controls="skills-panel"
              tabIndex={tab === i ? 0 : -1}
              className="tab"
              onClick={() => { setTab(i); setHot(null); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { setTab((tab + 1) % skillGroups.length); setHot(null); }
                if (e.key === "ArrowLeft") { setTab((tab - 1 + skillGroups.length) % skillGroups.length); setHot(null); }
              }}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="skills-body">
          <ul className="bars" key={tab}>
            {group.items.map((s, i) => (
              <li
                key={s.name}
                onMouseEnter={() => setHot(s.name)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(s.name)}
                onBlur={() => setHot(null)}
                tabIndex={0}
                style={{ ["--lv" as string]: `${s.level}%`, ["--n" as string]: i } as CSSProperties}
                aria-label={`${s.name}, ${s.level} percent. ${s.note}`}
              >
                <span className="bar-top"><span>{s.name}</span><b>{s.level}%</b></span>
                <i className="bar"><b /></i>
              </li>
            ))}
          </ul>

          <div className="skill-side" aria-live="polite">
            <div className="ring-meter" style={{ ["--avg" as string]: `${avg * 3.6}deg` } as CSSProperties}>
              <strong>{hovered ? hovered.level : avg}<small>%</small></strong>
              <span>{hovered ? hovered.name : `${group.name} avg`}</span>
            </div>
            <p className="skill-note">{hovered ? hovered.note : "Hover or focus a skill to see what I use it for."}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
