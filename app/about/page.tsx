import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { profile, skillGroups } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "About Aadil, a web developer who builds e-commerce sites and web apps with React, Next.js, Node.js, Express, Razorpay, Cloudinary, Shipmozo and AWS.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <PageShell>
      <article className="prose">
        <h1>About {profile.name}</h1>
        <p className="doc-lead">{profile.tagline}</p>
        <h2>What I do</h2>
        <p>
          I am a web developer. I design and build complete websites, from the look and feel in the browser to the
          Node.js and Express backend behind it. My work includes online stores with payments through Razorpay, image
          delivery through Cloudinary, shipping through Shipmozo and hosting on AWS. I also use Claude to speed up
          research and writing code.
        </p>
        <h2>What I have built</h2>
        <p>
          My <Link href="/projects">projects</Link> include a perfume store, an invoicing web app and a food-ordering
          website. On the <Link href="/blog">blog</Link> I write down what I learn so other developers can save time.
        </p>
        <h2>Skills</h2>
        {skillGroups.map((g) => (
          <p key={g.name}><strong>{g.name}:</strong> {g.items.map((i) => i.name).join(", ")}.</p>
        ))}
        <h2>Work with me</h2>
        <p>Have a website in mind? Visit the <Link href="/contact">contact page</Link> and tell me about it.</p>
      </article>
    </PageShell>
  );
}
