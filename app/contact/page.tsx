import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aadil about a website, web app or e-commerce project.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Contact</h1>
        <p className="doc-lead">Tell me about your project. I usually reply within two business days.</p>
        <h2>Email</h2>
        <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
        <h2>Elsewhere</h2>
        <ul>
          {profile.socials.map((s) => (
            <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
          ))}
        </ul>
      </article>
    </PageShell>
  );
}
