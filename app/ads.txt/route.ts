import { adsenseClient } from "@/lib/site";

// AdSense requires /ads.txt. It lists your publisher id once NEXT_PUBLIC_ADSENSE_CLIENT is set.
export function GET() {
  const pub = adsenseClient.replace(/^ca-/, "");
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# Add your AdSense publisher id in NEXT_PUBLIC_ADSENSE_CLIENT to publish this file.\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
