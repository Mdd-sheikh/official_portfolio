import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides on Razorpay, Cloudinary, Shipmozo, Node.js and Express for e-commerce developers.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <PageShell>
      <h1>Blog</h1>
      <p className="doc-lead">Practical notes from building online stores: payments, images and shipping.</p>
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug} className="glass">
            <Link href={`/blog/${p.slug}`}>
              <time dateTime={p.date}>{p.date}</time> · {p.minutes} min read
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <span className="proj-link">Read article →</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
