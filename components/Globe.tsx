"use client";

import { useEffect, useRef } from "react";

/** Interactive 3D network sphere drawn on a canvas. Drag to spin, hover to light up nodes. */
export default function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = window.innerWidth < 700 ? 150 : 240;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
    });

    let w = 0, h = 0, raf = 0, frame = 0, visible = true;
    let rx = 0.35, ry = 0, vy = 0.004, tx = 0.35;
    let dragging = false, lastX = 0, lastY = 0;
    const mouse = { x: -9999, y: -9999 };
    let c1 = "#8b5cf6", c2 = "#22d3ee", c3 = "#f472b6";

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      c1 = s.getPropertyValue("--c1").trim() || c1;
      c2 = s.getPropertyValue("--c2").trim() || c2;
      c3 = s.getPropertyValue("--c3").trim() || c3;
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    };

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.36;
      const cx = w / 2, cy = h / 2;
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const cosX = Math.cos(rx), sinX = Math.sin(rx);

      const P = pts.map((p) => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const s = 2.6 / (2.6 + z2);
        return { x: x1, y: y2, z: z2, sx: cx + x1 * R * s, sy: cy + y2 * R * s, s };
      });

      ctx!.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, dz = P[i].z - P[j].z;
          if (dx * dx + dy * dy + dz * dz < 0.1) {
            const depth = (P[i].z + P[j].z + 2) / 4;
            ctx!.globalAlpha = 0.08 + depth * 0.32;
            ctx!.strokeStyle = c2;
            ctx!.beginPath();
            ctx!.moveTo(P[i].sx, P[i].sy);
            ctx!.lineTo(P[j].sx, P[j].sy);
            ctx!.stroke();
          }
        }
      }

      for (const p of P) {
        const depth = (p.z + 1) / 2;
        const md = Math.hypot(p.sx - mouse.x, p.sy - mouse.y);
        const near = md < 90 ? 1 - md / 90 : 0;
        ctx!.globalAlpha = 0.25 + (1 - depth) * 0.75;
        ctx!.fillStyle = near > 0.05 ? c3 : p.y > 0.2 ? c1 : c2;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, (1.1 + (1 - depth) * 1.8 + near * 4) * p.s, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (frame++ % 60 === 0) readColors();
      if (!dragging) {
        vy += (0.004 - vy) * 0.04;
        rx += (tx - rx) * 0.05;
      }
      ry += vy;
      draw();
    };

    const rectXY = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = rectXY(e);
      mouse.x = p.x; mouse.y = p.y;
      if (dragging) {
        vy = (e.clientX - lastX) * 0.006;
        rx = Math.max(-1.2, Math.min(1.2, rx + (e.clientY - lastY) * 0.006));
        tx = rx;
        lastX = e.clientX; lastY = e.clientY;
      }
      if (reduce) draw();
    };
    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      cv.setPointerCapture(e.pointerId);
      cv.classList.add("grabbing");
    };
    const onUp = () => { dragging = false; cv.classList.remove("grabbing"); };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(cv);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", onLeave);

    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="globe"
      role="img"
      aria-label="Interactive 3D sphere made of connected points. Drag to rotate it."
    />
  );
}
