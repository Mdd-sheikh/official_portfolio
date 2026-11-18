import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Live websites built by Aadil: Humi's Fragrance (e-commerce), Accountune (invoicing) and Addelicius (food ordering).",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <PageShell>
      <h1>Projects</h1>
      <p className="doc-lead">Three live websites I designed and built. Each one opens in a new tab.</p>
      <div className="doc-grid">
        {projects.map((p) => (
          <article key={p.title} className="glass doc-card">
            <Image src={p.image} alt={`Screenshot of the ${p.title} website`} width={1440} height={900} sizes="(max-width: 800px) 90vw, 560px" />
            <div className="doc-card-body">
              <p className="proj-kind">{p.kind}</p>
              <h2>{p.title}</h2>
              <p>{p.blurb}</p>
              <p className="chips">{p.tags.map((t) => <span key={t}>{t}</span>)}</p>
              <a className="btn btn-solid" href={p.url} target="_blank" rel="noopener noreferrer">
                Visit {p.title} <span className="sr">(opens in new tab)</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
