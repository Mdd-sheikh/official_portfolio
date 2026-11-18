import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this website handles visitor information, cookies and Google AdSense advertising.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Privacy Policy</h1>
        <p className="meta">Last updated: 17 November 2026</p>
        <p>
          This policy explains what information {profile.name}&apos;s portfolio website collects and how it is used.
          By using the site you agree to this policy.
        </p>

        <h2>Information I collect</h2>
        <p>
          I do not ask you to create an account. The page can read basic details your browser already shares, such as
          device type, browser, screen size and language, to adapt the layout. This is processed in your browser and is
          not sent to my server. If you enter your name in the greeting box, it is saved only in your browser&apos;s
          local storage and you can remove it at any time.
        </p>
        <p>If you email me, I receive your email address and message and use them only to reply.</p>

        <h2>Cookies and local storage</h2>
        <p>
          The site stores your theme choice, your name (if you enter it) and your cookie choice in your browser. If you
          accept cookies, Google may also set cookies for advertising.
        </p>

        <h2>Advertising (Google AdSense)</h2>
        <p>
          This site may show ads from Google AdSense. Google and its partners may use cookies to serve ads based on your
          visits to this and other websites. Ads load only after you accept cookies. You can manage personalised
          advertising at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> and
          learn how Google uses data at{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.
        </p>

        <h2>Third-party links</h2>
        <p>
          The site links to other websites, including my project sites. I am not responsible for their privacy practices.
        </p>

        <h2>Your choices</h2>
        <p>
          You can decline cookies in the banner, clear your browser storage at any time, or block cookies in your
          browser settings. Under laws such as the GDPR and India&apos;s DPDP Act you may ask what data I hold about you
          and request that it be deleted.
        </p>

        <h2>Children</h2>
        <p>This site is not directed at children under 13 and I do not knowingly collect their information.</p>

        <h2>Contact</h2>
        <p>Questions about this policy? Use the <Link href="/contact">contact page</Link> or email <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
      </article>
    </PageShell>
  );
}
