import Link from "next/link";
import { profile, marquee } from "@/lib/data";
import { RotatingWord } from "@/components/Fx";
import Globe from "@/components/Globe";

export default function Hero() {
  const loop = [...marquee, ...marquee];
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#top" aria-label={`${profile.name} home`}>
          <span className="brand-mark" aria-hidden="true" />
          {profile.name}
        </a>
        <nav className="topnav" aria-label="Sections">
          <a href="#skills">Skills</a>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <a className="pill" href="#explore">Explore</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-copy">
          <p className="eyebrow rise" style={{ ["--d" as string]: "0.1s" }}>
            <span className="live" /> {profile.role}
          </p>
          <h1 id="hero-title" className="rise" style={{ ["--d" as string]: "0.25s" }}>
            Crafting <RotatingWord words={["modern", "creative", "bold", "fast"]} /> <br />
            web experiences.
          </h1>
          <p className="lead rise" style={{ ["--d" as string]: "0.45s" }}>{profile.tagline}</p>
          <div className="cta rise" style={{ ["--d" as string]: "0.6s" }}>
            <a className="btn btn-solid" href="#explore">See my work</a>
            <a className="btn btn-ghost" href="#terminal">Try the terminal</a>
          </div>
          <p className="scroll-cue rise" style={{ ["--d" as string]: "0.9s" }} aria-hidden="true">
            <span /> Scroll
          </p>
        </div>

        <div className="hero-art">
          <div className="glow" aria-hidden="true" />
          <Globe />
          <span className="chip-float f1" aria-hidden="true">&lt;/&gt;</span>
          <span className="chip-float f2" aria-hidden="true">UI</span>
          <span className="chip-float f3" aria-hidden="true">✦</span>
          <p className="drag-hint" aria-hidden="true">Drag the sphere</p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {loop.map((w, i) => (
            <span key={i}>{w}<i /></span>
          ))}
        </div>
      </div>
    </>
  );
}
