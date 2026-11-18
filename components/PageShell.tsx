import Link from "next/link";
import type { ReactNode } from "react";
import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 {profile.name}</span>
      <nav aria-label="Footer" className="footer-nav">
        <Link href="/projects">Projects</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="shell-top">
        <Link className="brand" href="/" aria-label={`${profile.name} home`}>
          <span className="brand-mark" aria-hidden="true" />
          {profile.name}
        </Link>
        <nav className="topnav" aria-label="Main">
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link className="pill" href="/contact">Contact</Link>
        </nav>
      </header>
      <main className="doc" id="main">{children}</main>
      <Footer />
    </>
  );
}
