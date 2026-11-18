import { adsenseClient } from "@/lib/site";

// AdSense requires /ads.txt at the site root.
// Uses NEXT_PUBLIC_ADSENSE_CLIENT if set, otherwise the hardcoded publisher id.
const client = adsenseClient || "ca-pub-8178245553308553";

export function GET() {
  const pub = client.replace(/^ca-/, "");
  const body = `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}