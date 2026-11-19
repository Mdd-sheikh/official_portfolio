"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Fx";
import { profile } from "@/lib/data";

const types = [
  { id: "portfolio", name: "Portfolio / landing", base: 4, risk: 1 },
  { id: "business", name: "Business website", base: 8, risk: 2 },
  { id: "store", name: "E-commerce store", base: 18, risk: 4 },
  { id: "webapp", name: "Custom web app", base: 24, risk: 5 },
];

const features = [
  { id: "pay", name: "Razorpay payments", days: 4, risk: 2, needs: ["store", "webapp", "business"] },
  { id: "ship", name: "Shipmozo shipping", days: 3, risk: 1, needs: ["store"] },
  { id: "img", name: "Cloudinary media", days: 2, risk: 0, needs: ["portfolio", "business", "store", "webapp"] },
  { id: "admin", name: "Admin dashboard", days: 6, risk: 2, needs: ["business", "store", "webapp"] },
  { id: "auth", name: "User accounts & login", days: 4, risk: 2, needs: ["store", "webapp", "business"] },
  { id: "seo", name: "SEO & analytics setup", days: 2, risk: 0, needs: ["portfolio", "business", "store", "webapp"] },
];

const speeds = [
  { id: "relaxed", name: "Relaxed", mult: 1 },
  { id: "normal", name: "Standard", mult: 0.9 },
  { id: "rush", name: "Rush", mult: 0.7 },
];

export default function Estimator() {
  const [type, setType] = useState("business");
  const [pages, setPages] = useState(6);
  const [picked, setPicked] = useState<string[]>(["img", "seo"]);
  const [speed, setSpeed] = useState("normal");

  // Logic: a feature only counts if it makes sense for the chosen project type.
  const active = useMemo(
    () => picked.filter((id) => features.find((f) => f.id === id)?.needs.includes(type)),
    [picked, type],
  );

  const r = useMemo(() => {
    const t = types.find((x) => x.id === type)!;
    const sp = speeds.find((x) => x.id === speed)!;
    const featDays = active.reduce((a, id) => a + features.find((f) => f.id === id)!.days, 0);
    // extra pages get cheaper each time (templates are reused): diminishing returns
    const pageDays = Math.round(Math.sqrt(pages) * 1.6 * (t.base > 10 ? 1.4 : 1));
    // features interact: every feature past three adds 8% integration overhead
    const overhead = 1 + Math.max(0, active.length - 3) * 0.08;
    const work = (t.base + pageDays + featDays) * overhead;
    // rushing compresses the calendar but needs more parallel work, so risk rises
    const days = Math.max(3, Math.round(work * sp.mult));
    const risk = t.risk + active.reduce((a, id) => a + features.find((f) => f.id === id)!.risk, 0) + (sp.id === "rush" ? 3 : 0);
    const level = risk <= 4 ? "Low" : risk <= 9 ? "Medium" : "High";
    return {
      min: Math.max(2, Math.round(days * 0.85)),
      max: Math.round(days * 1.25),
      days,
      risk,
      level,
      weeks: Math.max(1, Math.round(days / 5)),
      phases: [
        { n: "Discover + design", p: 0.28 },
        { n: "Build", p: 0.5 },
        { n: "Test + launch", p: 0.22 },
      ],
    };
  }, [type, pages, active, speed]);

  const brief = encodeURIComponent(
    `Project: ${types.find((t) => t.id === type)!.name}\nPages: ${pages}\nFeatures: ${active.map((id) => features.find((f) => f.id === id)!.name).join(", ") || "none"}\nSpeed: ${speed}\nEstimate: ${r.min}-${r.max} working days (risk: ${r.level})`,
  );

  return (
    <section className="lab" id="estimator" aria-labelledby="est-title">
      <Reveal>
        <p className="eyebrow">Scope estimator</p>
        <h2 id="est-title" className="section-title">How long would your project take?</h2>
        <p className="panel-lead">Shape a project and watch the timeline and risk react. The numbers follow real rules: extra pages get cheaper, too many integrations add overhead, and rushing raises risk.</p>
      </Reveal>

      <Reveal delay={0.1} className="glass lab-card est">
        <div className="est-form">
          <fieldset>
            <legend>Project type</legend>
            <div className="opt-row">
              {types.map((t) => (
                <button key={t.id} type="button" className="opt" aria-pressed={type === t.id} onClick={() => setType(t.id)}>{t.name}</button>
              ))}
            </div>
          </fieldset>

          <label className="range">
            <span>Pages / screens <b>{pages}</b></span>
            <input type="range" min={1} max={30} value={pages} onChange={(e) => setPages(+e.target.value)} />
          </label>

          <fieldset>
            <legend>Features</legend>
            <div className="opt-row">
              {features.map((f) => {
                const ok = f.needs.includes(type);
                return (
                  <button
                    key={f.id}
                    type="button"
                    className="opt"
                    disabled={!ok}
                    title={ok ? "" : "Not needed for this project type"}
                    aria-pressed={active.includes(f.id)}
                    onClick={() => setPicked((p) => (p.includes(f.id) ? p.filter((x) => x !== f.id) : [...p, f.id]))}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Delivery speed</legend>
            <div className="opt-row">
              {speeds.map((s) => (
                <button key={s.id} type="button" className="opt" aria-pressed={speed === s.id} onClick={() => setSpeed(s.id)}>{s.name}</button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="est-out" aria-live="polite">
          <span className="lab-k">Estimated delivery</span>
          <strong className="est-big">{r.min}–{r.max}<small> working days</small></strong>
          <span className="lab-sub">about {r.weeks} {r.weeks === 1 ? "week" : "weeks"}</span>

          <div className="phase" aria-hidden="true">
            {r.phases.map((p) => <i key={p.n} style={{ flex: p.p } as CSSProperties} />)}
          </div>
          <ul className="phase-list">
            {r.phases.map((p) => <li key={p.n}><span>{p.n}</span><b>{Math.max(1, Math.round(r.days * p.p))}d</b></li>)}
          </ul>

          <div className="risk" data-level={r.level}>
            <span>Complexity risk</span>
            <i><b style={{ width: `${Math.min(100, r.risk * 7)}%` }} /></i>
            <em>{r.level}</em>
          </div>

          <a className="pill lab-cta" href={`mailto:${profile.email}?subject=${encodeURIComponent("Project enquiry")}&body=${brief}`}>Send this brief to me</a>
        </div>
      </Reveal>
    </section>
  );
}
