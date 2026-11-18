"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const fine = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/** Glowing cursor follower (mouse devices only). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine()) return;
    let x = 0, y = 0, hx = 0, hy = 0, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const hot = (e.target as HTMLElement | null)?.closest("a, button");
      halo.current?.classList.toggle("is-hot", !!hot);
      dot.current?.classList.add("is-on");
      halo.current?.classList.add("is-on");
    };
    const loop = () => {
      hx += (x - hx) * 0.14; hy += (y - hy) * 0.14;
      if (halo.current) halo.current.style.transform = `translate(${hx}px, ${hy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={halo} className="cursor-halo" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/** Thin gradient bar showing scroll progress. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--p", String(h > 0 ? window.scrollY / h : 0));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div ref={bar} className="progress" aria-hidden="true" />;
}

/** Fades/slides children in when they scroll into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => { if (en.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ["--rd" as string]: `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Cycles through words with a flip animation. */
export function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="rot" aria-live="off">
      <span key={i} className="grad rot-word">{words[i]}</span>
      <span className="sr">{words[0]}</span>
    </span>
  );
}

/** Counts up to a number when visible. */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1400, 1);
        setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}
