import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Archivo_Narrow } from "next/font/google";
import Consent from "@/components/Consent";
import { profile } from "@/lib/data";
import { siteName, siteUrl, adsenseClient } from "@/lib/site";
import "./globals.css";
import "./creative.css";
import "./glass.css";
import "./intro.css";
import "./shots.css";
import "./pages.css";
import "./labs.css";
import "./studio.css";

const font = Space_Grotesk({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const cond = Archivo_Narrow({
  variable: "--font-cond",
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Falls back to the hardcoded id if NEXT_PUBLIC_ADSENSE_CLIENT is not set in Vercel.
const adsense = adsenseClient || "ca-pub-8178245553308553";

const description =
  "Aadil is a web developer building fast, modern websites and web apps with React, Next.js, Node.js and Express. See live projects, skills and articles on Razorpay, Cloudinary and Shipmozo integrations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "web developer portfolio", "Next.js developer", "React developer", "Node.js", "Express.js",
    "Razorpay integration", "Cloudinary", "Shipmozo", "AWS", "e-commerce developer India", "freelance web developer",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: [
      "u2cOgeHWWJr0bOxIiUtTjzYiTTwUr-MULwYDonB_wcQ",
      "Ta1-l9HzhaAQEPVIq-3YOj8teG_mPHcGKthbRABfzl0",
      "ZLHPHgZ6LfXwn96x2Z-KUerFYSW-PbTEsRdT2cr51HY",
    ],
  },
  other: {
    "google-adsense-account": adsense,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteName,
    description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: siteName, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { themeColor: "#07070d", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${font.variable} ${cond.variable}`}>
      <body>
        {children}
        <Consent />
      </body>
    </html>
  );
}