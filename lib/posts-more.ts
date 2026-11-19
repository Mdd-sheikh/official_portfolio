import type { Post } from "./posts";

export const morePosts: Post[] = [
  {
    slug: "nextjs-image-optimization-guide",
    title: "Next.js image optimization: a complete guide to next/image",
    description:
      "How the Next.js Image component works, which props matter for speed and layout stability, and the mistakes that quietly hurt LCP and bandwidth on real websites.",
    date: "2026-11-18",
    minutes: 7,
    sections: [
      {
        h: "Why images decide your page speed",
        p: [
          "On most websites, images are the heaviest part of the page. A single uncompressed photo can weigh more than all your JavaScript and CSS together. Because the largest visible element is usually an image, it also controls Largest Contentful Paint, one of the Core Web Vitals that Google uses as a ranking signal.",
          "The next/image component exists to solve this once, in one place. It resizes images, serves modern formats, lazy loads them and reserves space so the layout does not jump. Used well, it removes most of the manual work from image performance.",
        ],
      },
      {
        h: "What next/image does for you",
        p: [
          "It generates several sizes of each image and picks the right one for the visitor's screen using the srcset attribute. A phone receives a small file and a large monitor receives a bigger one, instead of everyone downloading the original.",
          "It converts images to WebP or AVIF when the browser supports them, which is often 30 to 50 percent smaller than JPEG at similar quality. It also lazy loads images below the fold by default, so the browser does not waste bandwidth on pictures nobody has scrolled to yet.",
        ],
      },
      {
        h: "Always give width and height",
        p: [
          "The most common cause of layout shift is an image that loads after the text and pushes everything down. When you pass width and height, Next.js can reserve the exact space before the file arrives, which keeps Cumulative Layout Shift near zero.",
          "For images that fill a container of unknown size, use the fill prop inside a parent with position relative and a fixed aspect ratio. Never leave an image with no size information at all.",
        ],
        code: `import Image from "next/image";

<Image
  src="/projects/store.png"
  alt="Online perfume store homepage with a hero slider"
  width={1200}
  height={750}
  sizes="(max-width: 768px) 100vw, 50vw"
/>`,
      },
      {
        h: "Use the priority prop only where it counts",
        p: [
          "Lazy loading is great for most images, but it is wrong for the main image at the top of the page. That image should start downloading immediately. Mark only the above-the-fold hero image with priority, so the browser fetches it first.",
          "Do not add priority to every image. If everything is high priority, nothing is, and you lose the benefit. One or two images per page is a sensible limit.",
        ],
      },
      {
        h: "Write the sizes prop honestly",
        p: [
          "The sizes prop tells the browser how wide the image will actually be on screen at each breakpoint. If you leave it out, the browser assumes the image is as wide as the whole viewport and may download a file far larger than needed.",
          "A card that takes half the screen on desktop and the full width on mobile should say exactly that. Getting sizes right is the single biggest saving most developers miss.",
        ],
      },
      {
        h: "Alt text is for people and for search",
        p: [
          "Good alt text describes what the image shows in a short, plain sentence. It helps people using screen readers and it helps search engines understand the page. Avoid stuffing keywords, and use an empty alt attribute only for purely decorative images.",
        ],
      },
      {
        h: "Remote images and Cloudinary",
        p: [
          "If your images live on another host, such as Cloudinary, you must allow that host in the images configuration of next.config. You can then pass the remote URL directly, or let Cloudinary handle the transformation with f_auto and q_auto while Next.js handles layout and lazy loading.",
          "Pick one place to do the resizing so you do not transform the same image twice, which wastes build and request time.",
        ],
      },
      {
        h: "A quick checklist",
        p: [
          "Every image has width and height or fill. The hero image has priority. Every image has a truthful sizes value and useful alt text. Source files are not absurdly large to begin with, ideally under 2000 pixels wide. Test the result in PageSpeed Insights and watch the LCP element in the report.",
        ],
      },
    ],
  },
  {
    slug: "json-ld-structured-data-developer-portfolio",
    title: "JSON-LD structured data for a developer portfolio, step by step",
    description:
      "What structured data is, why it helps search engines understand your site, and how to add Person, WebSite and Article schema to a Next.js portfolio and test it.",
    date: "2026-11-18",
    minutes: 7,
    sections: [
      {
        h: "What structured data actually is",
        p: [
          "Search engines read your page text, but text is ambiguous. Is Aadil a person, a company or a product? Structured data removes the guesswork by describing your content in a standard vocabulary called schema.org. You add it as a small block of JSON in the page, and it is invisible to visitors.",
          "Google recommends the JSON-LD format because it sits in one script tag and does not need changes to your visible HTML. It does not directly boost rankings, but it can make results richer and helps search engines trust what your page is about.",
        ],
      },
      {
        h: "Start with Person and WebSite",
        p: [
          "For a portfolio, the home page should describe the person behind the site and the website itself. A Person entry can include your name, job title, description, the skills you know about and links to your social profiles. A WebSite entry names the site and points to its publisher.",
          "Connecting the two with the @id field tells search engines that this person published this site, which builds a clear identity across the web.",
        ],
        code: `const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://example.com/#person",
      name: "Aadil",
      jobTitle: "Web Developer",
      url: "https://example.com",
      knowsAbout: ["React", "Next.js", "Node.js"],
      sameAs: ["https://github.com/your-name"],
    },
    {
      "@type": "WebSite",
      url: "https://example.com",
      name: "Aadil Portfolio",
      publisher: { "@id": "https://example.com/#person" },
    },
  ],
};`,
      },
      {
        h: "Add Article schema to blog posts",
        p: [
          "Each blog post can describe itself as an Article with a headline, description, publish date and author. This helps search engines connect the post to you and understand when it was written.",
          "Only describe what is actually on the page. Marking up content that visitors cannot see, or inventing ratings and reviews, goes against Google's guidelines and can lead to a manual action.",
        ],
      },
      {
        h: "Render it safely in Next.js",
        p: [
          "In the App Router, render the JSON inside a script tag with type application/ld+json. Because you are injecting a string, escape the less-than character so that a stray closing script tag inside your data can never break out of the block.",
        ],
        code: `<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, "\\\\u003c"),
  }}
/>`,
      },
      {
        h: "Add breadcrumbs for clearer navigation",
        p: [
          "A BreadcrumbList entry shows search engines how a page fits into your site, for example Home, Blog, then the article title. Google can display this trail under your result, which makes the listing easier to understand and click.",
        ],
      },
      {
        h: "Test before you publish",
        p: [
          "Use Google's Rich Results Test and the Schema Markup Validator to paste a URL or code and see errors and warnings. Fix errors first, because they can make the markup ignored. Warnings about optional fields are not urgent.",
          "After deploying, open the Enhancements section of Google Search Console. It reports which structured data was found on your live pages and flags problems over time.",
        ],
      },
      {
        h: "Keep it accurate",
        p: [
          "Structured data should always match the visible page. When you change your job title, add a skill or publish a new post, update the markup too. Keeping it in one shared data file, as this portfolio does, makes that easy.",
        ],
      },
    ],
  },
  {
    slug: "webhooks-idempotency-retries-payments",
    title: "Webhooks done right: signatures, idempotency and retries",
    description:
      "Why payment and shipping webhooks can arrive twice, late or out of order, and how to design an Express handler that stays correct in all three cases.",
    date: "2026-11-19",
    minutes: 8,
    sections: [
      {
        h: "What a webhook is and why you need it",
        p: [
          "A webhook is a request that another service sends to your server when something happens, such as a payment succeeding or a parcel being delivered. You need them because the browser is not reliable. A customer can close the tab right after paying, lose network or never return to your success page.",
          "If your order only becomes paid when the browser says so, some paid orders will be stuck as unpaid forever. A webhook lets the payment provider tell your server directly, whatever the customer does.",
        ],
      },
      {
        h: "Webhooks are delivered at least once",
        p: [
          "Providers retry when your server does not answer quickly with a success code. That means the same event can reach you two or three times. It can also arrive after a later event, because networks do not guarantee order.",
          "Your handler must therefore be safe to run many times with the same input. This property is called idempotency, and it is the most important idea in this article.",
        ],
      },
      {
        h: "Verify the signature on the raw body",
        p: [
          "Anyone who knows your webhook URL can send fake requests to it. Providers sign each request with a secret so you can prove it is genuine. You compute an HMAC of the exact bytes you received and compare it to the signature header.",
          "The key detail is the raw body. If a JSON parser runs first and you re-stringify the object, the bytes can change and the signature will never match. In Express, capture the raw body for the webhook route.",
        ],
        code: `import crypto from "crypto";
import express from "express";

app.post("/webhooks/payments", express.raw({ type: "application/json" }), (req, res) => {
  const signature = req.header("x-signature") || "";
  const expected = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(req.body)           // raw Buffer
    .digest("hex");

  const ok =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!ok) return res.status(400).send("invalid signature");

  const event = JSON.parse(req.body.toString("utf8"));
  // ...handle the event
  res.sendStatus(200);
});`,
      },
      {
        h: "Make the handler idempotent",
        p: [
          "Every event has a unique id. Store the ids you have processed in a table with a unique constraint. When an event arrives, try to insert its id first. If the insert fails because the id already exists, you have seen this event before, so return success and do nothing else.",
          "Also make the action itself safe. Marking an order as paid only when its current status is pending means a repeated event changes nothing the second time.",
        ],
        code: `const inserted = await db.processedEvents.insertIfNew(event.id);
if (!inserted) return res.sendStatus(200); // duplicate, already handled

await db.orders.updateOne(
  { paymentId: event.payment.id, status: "pending" },
  { $set: { status: "paid", paidAt: new Date() } }
);`,
      },
      {
        h: "Answer fast, work later",
        p: [
          "Providers wait only a few seconds for a response. If you book shipping, send emails and update stock before replying, you may time out and trigger a retry while the first attempt is still running.",
          "Verify the signature, save the event, reply with a 200 status, and do the slower work in a background job. This keeps the endpoint quick and gives you a record to replay if something fails.",
        ],
      },
      {
        h: "Handle out-of-order events",
        p: [
          "A refund event might arrive before the payment event you expected. Do not assume order. Look at the current state of the order and decide whether the event still makes sense, or fetch the latest state from the provider API when in doubt.",
        ],
      },
      {
        h: "Test it properly",
        p: [
          "Send the same event twice and confirm that only one order changes. Send an event with a bad signature and confirm it is rejected. Use your provider's test mode and a tunnel tool during development so the real service can reach your local server. Log every event id so you can trace problems later.",
        ],
      },
    ],
  },
  {
    slug: "environment-variables-secrets-nextjs-vercel",
    title: "Environment variables and secrets in Next.js and Vercel",
    description:
      "Which variables are exposed to the browser, how to keep API keys and payment secrets private, and a safe workflow for local, preview and production environments.",
    date: "2026-11-19",
    minutes: 6,
    sections: [
      {
        h: "Why this matters",
        p: [
          "Almost every real project uses secrets: a payment gateway key, a database connection string, an email service token. If one of them leaks, someone else can charge, read or delete things in your name. Most leaks are not clever attacks. They are mistakes, such as a key committed to a public repository or sent to the browser by accident.",
        ],
      },
      {
        h: "The NEXT_PUBLIC_ rule",
        p: [
          "Next.js treats environment variables differently depending on their name. A variable that starts with NEXT_PUBLIC_ is copied into the JavaScript that runs in the browser, so anyone can read it. A variable without that prefix is only available on the server.",
          "This means public values, like your site URL or a publishable key, can use the prefix. Anything secret must never use it. A payment secret named NEXT_PUBLIC_SECRET would be visible to every visitor.",
        ],
        code: `# .env.local
NEXT_PUBLIC_SITE_URL=https://example.com   # safe, public
RAZORPAY_KEY_ID=rzp_test_xxxxx            # fine on the server
RAZORPAY_KEY_SECRET=never_in_the_browser  # server only`,
      },
      {
        h: "Keep secret files out of Git",
        p: [
          "Files such as .env.local should be listed in .gitignore, and Next.js projects ignore them by default. Commit an example file, such as .env.example, that lists the variable names with empty or fake values. This documents what the project needs without exposing anything.",
          "If a secret is ever committed, deleting it in a later commit is not enough because the history keeps it. Treat it as leaked and rotate it by creating a new key and disabling the old one.",
        ],
      },
      {
        h: "Use server code for anything sensitive",
        p: [
          "Calls that need a secret should run in route handlers, server actions or server components, never in client components. The browser asks your server to do the sensitive work, and your server uses the secret and returns only the result.",
          "For payments, this is the same principle as creating the order on the server. The browser never needs your key secret to do its part.",
        ],
      },
      {
        h: "Environments on Vercel",
        p: [
          "Vercel lets you set variables separately for Production, Preview and Development. Use test keys for Preview and Development and live keys only for Production. That way a pull request preview can never take a real payment or touch real customer data.",
          "Remember that variables are read at build time for public values. After changing a NEXT_PUBLIC_ variable, trigger a new deployment so the new value is actually included.",
        ],
      },
      {
        h: "Validate variables at startup",
        p: [
          "A missing variable often fails in confusing ways, long after deployment. Check the required variables when the app starts and throw a clear error if one is absent. A small helper that reads and validates them in one place also stops typos from spreading through the code.",
        ],
        code: `function need(name: string) {
  const value = process.env[name];
  if (!value) throw new Error("Missing environment variable: " + name);
  return value;
}

export const razorpaySecret = need("RAZORPAY_KEY_SECRET");`,
      },
      {
        h: "A simple security routine",
        p: [
          "Use different keys for test and live. Give each key only the permissions it needs. Rotate keys when a teammate leaves or when you suspect exposure. Turn on secret scanning in your Git host so accidental commits are flagged early. Never paste secrets into chats, screenshots or issue trackers.",
        ],
      },
    ],
  },
];
