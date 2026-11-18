import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import Consent from "@/components/Consent";
import { profile } from "@/lib/data";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";
import "./creative.css";
import "./glass.css";
import "./intro.css";
import "./shots.css";
import "./pages.css";

const font = Space_Grotesk({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

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
  verification: { google: "u2cOgeHWWJr0bOxIiUtTjzYiTTwUr-MULwYDonB_wcQ" },
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
    <html lang="en" className={font.variable}>
      <body>
        {children}
        <Consent />
      </body>
    </html>
  );
}
