// Set these in a .env.local file (see .env.example) before you deploy.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://aadilportfolio-official.vercel.app").replace(/\/$/, "");

/** Google AdSense publisher id, like "ca-pub-1234567890123456". Leave empty until Google approves you. */
export const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export const siteName = "Aadil | Web Developer Portfolio";
