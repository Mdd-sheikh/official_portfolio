import Hero from "@/components/Hero";
import Explore from "@/components/Explore";
import Visitor from "@/components/Visitor";
import Skills from "@/components/Skills";
import Pipeline from "@/components/Pipeline";
import Terminal from "@/components/Terminal";
import Dock from "@/components/Dock";
import Intro from "@/components/Intro";
import { Footer } from "@/components/PageShell";
import { Counter, Cursor, Reveal, ScrollProgress } from "@/components/Fx";
import { profile, projects } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const stats = [
  { to: 3, suffix: "", label: "Live projects" },
  { to: 100, suffix: "%", label: "Responsive builds" },
  { to: 15, suffix: "+", label: "Tools & skills" },
  { to: 24, suffix: "/7", label: "Curiosity" },
];

const steps = [
  { t: "Discover", d: "Understand the brand, the audience and the goal before drawing anything." },
  { t: "Design", d: "Sketch bold layouts, pick type and colour, and plan the motion." },
  { t: "Build", d: "Code clean, fast, responsive pages with smooth animation." },
  { t: "Launch", d: "Test on real devices, ship it live and keep improving." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      jobTitle: profile.role,
      url: siteUrl,
      description: profile.tagline,
      knowsAbout: ["React", "Next.js", "Node.js", "Express.js", "Razorpay", "Cloudinary", "Shipmozo", "AWS", "Web design"],
      sameAs: profile.socials.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: `${profile.name} Portfolio`,
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
    ...projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      url: p.url,
      description: p.blurb,
      creator: { "@id": `${siteUrl}/#person` },
    })),
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Intro />
      <Cursor />
      <ScrollProgress />
      <div id="page-root">
        <Hero />
        <main id="main">
          <Visitor />

          <section className="numbers" id="numbers" aria-labelledby="numbers-title">
            <h2 id="numbers-title" className="sr">Numbers</h2>
            <ul className="stats">
              {stats.map((s, i) => (
                <li key={s.label}>
                  <Reveal delay={i * 0.1} className="glass">
                    <strong><Counter to={s.to} suffix={s.suffix} /></strong>
                    <span>{s.label}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          <Skills />
          <Pipeline />
          <Terminal />

          <section className="process" id="process" aria-labelledby="process-title">
            <Reveal>
              <p className="eyebrow">How I work</p>
              <h2 id="process-title" className="section-title">From idea to live site</h2>
            </Reveal>
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={s.t}>
                  <Reveal delay={i * 0.12} className="glass step">
                    <span className="step-dia" aria-hidden="true">0{i + 1}</span>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>

          <Explore />
        </main>
        <Footer />
      </div>
      <Dock />
    </>
  );
}
