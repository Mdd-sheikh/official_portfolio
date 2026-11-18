import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";
import "./creative.css";
import "./glass.css";
import "./intro.css";
import "./shots.css";

const font = Space_Grotesk({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: `${profile.name} | Portfolio`,
  description: profile.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
