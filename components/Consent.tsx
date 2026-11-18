"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { adsenseClient } from "@/lib/site";

type Choice = "yes" | "no" | null;

/** Cookie banner. Ads (Google AdSense) load only after the visitor accepts. */
export default function Consent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | "loading">("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const v = localStorage.getItem("cookie-consent");
        setChoice(v === "yes" || v === "no" ? v : null);
      } catch {
        setChoice(null);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // on the home page, wait until the intro has opened before showing the banner
  useEffect(() => {
    if (pathname !== "/") {
      const t = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      if (document.documentElement.dataset.ready === "1") { setReady(true); clearInterval(iv); }
    }, 400);
    return () => clearInterval(iv);
  }, [pathname]);

  const save = (v: "yes" | "no") => {
    setChoice(v);
    try { localStorage.setItem("cookie-consent", v); } catch { /* ignore */ }
  };

  return (
    <>
      {choice === "yes" && adsenseClient && (
        <Script
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      )}
      {choice === null && ready && (
        <div className="consent glass" role="region" aria-label="Cookie consent">
          <p>
            I use cookies to keep the site working and, if you agree, to show Google ads that help pay for hosting.
            Read the <Link href="/privacy">privacy policy</Link>.
          </p>
          <div className="consent-actions">
            <button type="button" className="btn btn-solid" onClick={() => save("yes")}>Accept</button>
            <button type="button" className="btn btn-ghost" onClick={() => save("no")}>Decline</button>
          </div>
        </div>
      )}
    </>
  );
}
