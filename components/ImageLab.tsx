"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/Fx";

const ORIGINAL = { w: 4000, h: 3000, bytes: 5.2 * 1024 * 1024 };
const devices = [
  { id: "phone", name: "Phone", css: 390, dpr: 3 },
  { id: "tablet", name: "Tablet", css: 768, dpr: 2 },
  { id: "laptop", name: "Laptop", css: 1280, dpr: 1.5 },
  { id: "tv", name: "4K screen", css: 1920, dpr: 2 },
];
const nets = [
  { id: "3g", name: "Slow 3G", kbps: 400, rtt: 400 },
  { id: "4g", name: "4G", kbps: 9000, rtt: 100 },
  { id: "fiber", name: "Fibre", kbps: 80000, rtt: 20 },
];
const formats = [
  { id: "jpg", name: "JPEG", k: 1 },
  { id: "webp", name: "WebP", k: 0.72 },
  { id: "avif", name: "AVIF", k: 0.5 },
  { id: "auto", name: "Auto (f_auto)", k: 0.5 },
];

const fmtBytes = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function ImageLab() {
  const [dev, setDev] = useState("phone");
  const [net, setNet] = useState("4g");
  const [fmt, setFmt] = useState("auto");
  const [q, setQ] = useState(70);
  const [smart, setSmart] = useState(true);

  const r = useMemo(() => {
    const d = devices.find((x) => x.id === dev)!;
    const n = nets.find((x) => x.id === net)!;
    const f = formats.find((x) => x.id === fmt)!;
    // Smart: resize to exactly what the screen can show. Naive: send the original width.
    const needed = Math.round(d.css * d.dpr);
    const w = smart ? Math.min(needed, ORIGINAL.w) : ORIGINAL.w;
    const h = Math.round((w / ORIGINAL.w) * ORIGINAL.h);
    // bits per pixel grows with quality; newer formats need fewer bits
    const bpp = (0.25 + q * 0.0145) * f.k;
    const bytes = Math.min(ORIGINAL.bytes, (w * h * bpp) / 8);
    const load = (n.rtt + (bytes * 8) / n.kbps) / 1000 + 0.05;
    const baseLoad = (n.rtt + (ORIGINAL.bytes * 8) / n.kbps) / 1000;
    const params = [fmt === "auto" ? "f_auto" : `f_${fmt}`, q >= 90 ? "q_90" : "q_auto", smart ? `w_${w},c_limit` : null].filter(Boolean).join(",");
    return {
      w, h, bytes, load, baseLoad,
      saved: Math.round((1 - bytes / ORIGINAL.bytes) * 100),
      url: `https://res.cloudinary.com/demo/image/upload/${params}/shop/product.jpg`,
      ok: load < 1.5,
    };
  }, [dev, net, fmt, q, smart]);

  return (
    <section className="lab" id="images" aria-labelledby="img-title">
      <Reveal>
        <p className="eyebrow">Image budget lab</p>
        <h2 id="img-title" className="section-title">What one photo costs your visitor</h2>
        <p className="panel-lead">A 5 MB product photo is fine on fibre and painful on a phone. Tune the delivery the way I do with Cloudinary and see the bytes, the wait and the exact URL. Sizes are modelled estimates, not live measurements.</p>
      </Reveal>

      <Reveal delay={0.1} className="glass lab-card img">
        <div className="img-ctl">
          <fieldset><legend>Device</legend><div className="opt-row">{devices.map((d) => <button key={d.id} type="button" className="opt" aria-pressed={dev === d.id} onClick={() => setDev(d.id)}>{d.name}</button>)}</div></fieldset>
          <fieldset><legend>Network</legend><div className="opt-row">{nets.map((d) => <button key={d.id} type="button" className="opt" aria-pressed={net === d.id} onClick={() => setNet(d.id)}>{d.name}</button>)}</div></fieldset>
          <fieldset><legend>Format</legend><div className="opt-row">{formats.map((d) => <button key={d.id} type="button" className="opt" aria-pressed={fmt === d.id} onClick={() => setFmt(d.id)}>{d.name}</button>)}</div></fieldset>
          <label className="range"><span>Quality <b>{q}</b></span><input type="range" min={20} max={100} value={q} onChange={(e) => setQ(+e.target.value)} /></label>
          <label className="switch"><input type="checkbox" checked={smart} onChange={(e) => setSmart(e.target.checked)} /><span>Resize to the screen (w_ and c_limit)</span></label>
        </div>

        <div className="img-out" aria-live="polite">
          <div className="img-bars">
            <div><span>Original upload</span><i><b style={{ width: "100%" }} className="bad" /></i><em>{fmtBytes(ORIGINAL.bytes)} · {r.baseLoad.toFixed(1)}s</em></div>
            <div><span>Delivered ({r.w}×{r.h})</span><i><b style={{ width: `${Math.max(2, (r.bytes / ORIGINAL.bytes) * 100)}%` }} className={r.ok ? "good" : "warn"} /></i><em>{fmtBytes(r.bytes)} · {r.load.toFixed(1)}s</em></div>
          </div>
          <div className="img-score" data-ok={r.ok}>
            <strong>{r.saved}%</strong><span>smaller · {r.ok ? "fast enough for a good score" : "still slow on this network, lower the quality or resize"}</span>
          </div>
          <code className="mono url">{r.url}</code>
        </div>
      </Reveal>
    </section>
  );
}
