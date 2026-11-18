import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getPost, posts } from "@/lib/posts";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, authors: [profile.name] },
  };
}

export default async function Post(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: profile.name },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <article className="prose">
        <p><Link href="/blog">← All articles</Link></p>
        <h1>{post.title}</h1>
        <p className="meta">By {profile.name} · <time dateTime={post.date}>{post.date}</time> · {post.minutes} min read</p>
        <p className="doc-lead">{post.description}</p>
        {post.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((t, i) => <p key={i}>{t}</p>)}
            {s.code && <pre><code>{s.code}</code></pre>}
          </section>
        ))}
      </article>

      <aside className="more" aria-labelledby="more-title">
        <h2 id="more-title">More articles</h2>
        <ul className="post-list">
          {posts.filter((p) => p.slug !== post.slug).slice(0, 3).map((p) => (
            <li key={p.slug} className="glass">
              <Link href={`/blog/${p.slug}`}>
                <h3>{p.title}</h3>
                <span className="proj-link">Read article →</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </PageShell>
  );
}
