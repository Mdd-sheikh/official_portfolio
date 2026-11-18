import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Aadil's portfolio website and blog.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Terms of Use</h1>
        <p className="meta">Last updated: 17 November 2026</p>
        <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>

        <h2>Content</h2>
        <p>
          The text, design and code on this site are the work of {profile.name} unless stated otherwise. You may link to
          any page. Please do not copy articles or designs without permission.
        </p>

        <h2>No professional advice</h2>
        <p>
          Articles are shared for general learning. Technology changes quickly, so check official documentation, such
          as Razorpay&apos;s, Cloudinary&apos;s and your shipping provider&apos;s, before using any code in production. I
          am not liable for losses that result from using this information.
        </p>

        <h2>Third-party websites and brands</h2>
        <p>
          Razorpay, Cloudinary, Shipmozo, AWS, Claude and other names are trademarks of their owners. Mentioning them
          does not mean they endorse this site.
        </p>

        <h2>Availability</h2>
        <p>I try to keep the site online and accurate but cannot promise it will always be available or error-free.</p>

        <h2>Changes</h2>
        <p>I may update these terms. The date above shows the latest version.</p>

        <h2>Contact</h2>
        <p>See the <Link href="/contact">contact page</Link>.</p>
      </article>
    </PageShell>
  );
}
