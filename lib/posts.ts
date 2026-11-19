import { morePosts } from "./posts-more";

export type Section = { h: string; p: string[]; code?: string };
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  minutes: number;
  sections: Section[];
};

export const posts: Post[] = [
  {
    slug: "razorpay-express-payments-india",
    title: "Accepting payments in India with Razorpay and Express",
    description:
      "A practical, secure flow for taking online payments with Razorpay and a Node.js Express backend: create the order on the server, verify the signature, and confirm with webhooks.",
    date: "2026-11-17",
    minutes: 5,
    sections: [
      {
        h: "The golden rule: the server decides",
        p: [
          "Never trust the browser for amounts or payment status. A customer can edit anything that runs on their device. The safe pattern is to create the order on your Express server, let Razorpay Checkout collect the payment in the browser, then verify the result on the server before you mark anything as paid.",
        ],
      },
      {
        h: "Step 1: create the order on the server",
        p: [
          "Calculate the total from your own database, never from the request body. Razorpay amounts are in the smallest currency unit, so Rs. 499 is sent as 49900 paise. Save the returned order id against your own order record.",
        ],
        code: `const order = await razorpay.orders.create({
  amount: total * 100,      // paise
  currency: "INR",
  receipt: "order_" + myOrder.id,
});
res.json({ orderId: order.id, amount: order.amount });`,
      },
      {
        h: "Step 2: open Checkout in the browser",
        p: [
          "Pass the order id and your public key id to Razorpay Checkout. The key secret must never reach the front end. When the customer pays, Checkout returns a payment id and a signature to your handler.",
        ],
      },
      {
        h: "Step 3: verify the signature",
        p: [
          "Send the order id, payment id and signature to your server. Recompute an HMAC SHA256 of order_id|payment_id using your key secret and compare it with the signature. Only if they match is the payment genuine.",
        ],
        code: `const body = razorpay_order_id + "|" + razorpay_payment_id;
const expected = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest("hex");

if (expected !== razorpay_signature) {
  return res.status(400).json({ ok: false });
}
// mark the order as paid`,
      },
      {
        h: "Step 4: add a webhook as a safety net",
        p: [
          "Customers close tabs and lose signal. A Razorpay webhook tells your server about successful payments even when the browser never comes back. Verify the webhook signature the same way, and make your handler idempotent so a repeated event never ships an order twice.",
        ],
      },
      {
        h: "Checklist before you go live",
        p: [
          "Keep keys in environment variables. Use test mode until the whole flow works. Log every payment event. Handle failed and pending payments with clear messages. Finally, show a proper confirmation page so customers know the order went through.",
        ],
      },
    ],
  },
  {
    slug: "cloudinary-fast-product-images",
    title: "Faster product images with Cloudinary",
    description:
      "How to store, resize and deliver product photos quickly using Cloudinary: automatic formats, quality, responsive sizes and safe uploads from a Node.js backend.",
    date: "2026-11-17",
    minutes: 4,
    sections: [
      {
        h: "Why images decide your speed",
        p: [
          "On an online store, images are usually the heaviest part of every page. Large, unoptimized photos slow down the page, hurt your search ranking and cost you customers on mobile data. Cloudinary stores the original once and creates the right version for each visitor on the fly.",
        ],
      },
      {
        h: "Let Cloudinary pick the format and quality",
        p: [
          "Add f_auto and q_auto to the delivery URL. Cloudinary then serves modern formats such as WebP or AVIF to browsers that support them, and picks a sensible compression level.",
        ],
        code: `https://res.cloudinary.com/<cloud-name>/image/upload/f_auto,q_auto,w_800/products/perfume-01.jpg`,
      },
      {
        h: "Serve the right size",
        p: [
          "Request the width you actually display. A 400 pixel card does not need a 3000 pixel photo. Combine a few widths with the srcset attribute so phones download small files and large screens still look sharp.",
        ],
      },
      {
        h: "Upload safely from Express",
        p: [
          "Do uploads through your backend, or use signed upload requests, so your API secret never appears in front-end code. Validate the file type and size before sending it on, and store only the returned public id in your database.",
        ],
        code: `const result = await cloudinary.uploader.upload(file.path, {
  folder: "products",
});
await saveProduct({ imageId: result.public_id });`,
      },
      {
        h: "Small habits that add up",
        p: [
          "Always write meaningful alt text. Lazy-load images below the fold. Keep a consistent aspect ratio so the layout does not jump while images load. These steps improve both user experience and Core Web Vitals.",
        ],
      },
    ],
  },
  {
    slug: "shipping-orders-shipmozo-flow",
    title: "A clean order-to-shipment flow with Shipmozo",
    description:
      "How an Indian e-commerce backend can move from a paid order to a tracked shipment using a shipping aggregator like Shipmozo, with Node.js and Express.",
    date: "2026-11-17",
    minutes: 4,
    sections: [
      {
        h: "What a shipping aggregator does",
        p: [
          "Instead of integrating with every courier one by one, an aggregator such as Shipmozo gives you a single API and dashboard to book shipments with several courier partners. Always check the official Shipmozo API documentation for the exact endpoints and fields, because they can change.",
        ],
      },
      {
        h: "Only ship what is paid",
        p: [
          "Create the shipment after your server has verified the payment, never before. Your order should move through clear states: created, paid, packed, shipped, delivered. Store the state in your database so every screen shows the same truth.",
        ],
      },
      {
        h: "Create the shipment from Express",
        p: [
          "When an order becomes paid, your Express route collects the customer name, address, pincode, phone, package weight and size, then calls the shipping API. Save the tracking number (AWB) and courier name that come back.",
        ],
        code: `app.post("/api/orders/:id/ship", requireAdmin, async (req, res) => {
  const order = await getPaidOrder(req.params.id);
  const shipment = await createShipment(order); // call the shipping API
  await saveTracking(order.id, shipment.awb, shipment.courier);
  res.json({ awb: shipment.awb });
});`,
      },
      {
        h: "Keep customers informed",
        p: [
          "Show the tracking number on the order page and send it by email or message. Update the status either by polling the API on a schedule or, better, by receiving status webhooks when the courier scans the parcel.",
        ],
      },
      {
        h: "Plan for the messy cases",
        p: [
          "Addresses are sometimes wrong, pincodes are sometimes not serviceable, and parcels are sometimes returned. Validate the pincode at checkout, let admins edit an address before shipping, and record returns so refunds and stock stay accurate.",
        ],
      },
    ],
  },
  {
    slug: "how-many-blog-posts-adsense-approval",
    title: "How many blog posts do you need for Google AdSense approval?",
    description:
      "There is no official number. Here is what Google actually checks, a realistic target for a new site, and the mistakes that cause rejections.",
    date: "2026-11-17",
    minutes: 7,
    sections: [
      {
        h: "The honest answer: Google gives no minimum",
        p: [
          "Google does not publish a required number of posts, pages, visitors or months online. Anyone who promises a magic number is guessing. What Google reviews is whether your site is useful, original and ready for advertising.",
          "That said, a site with three articles rarely looks finished. A common rule of thumb in the publishing community is 15 to 30 solid articles before applying. Treat that as a practical target, not an official rule. Ten excellent, detailed posts usually beat thirty thin ones.",
        ],
      },
      {
        h: "What reviewers really look for",
        p: [
          "Original, helpful content written for people, not for search engines. Clear navigation so a visitor can find things. A working site on a domain you own. The standard trust pages: a privacy policy, an about page and a way to contact you. No placeholder text, no empty pages and no pages marked under construction.",
          "Your content must also follow the AdSense program policies. That means nothing copied from other sites, nothing illegal or adult, and nothing misleading.",
        ],
      },
      {
        h: "A realistic target for a new site",
        p: [
          "Aim for at least 15 articles of 800 words or more, each solving one real problem. Pick a clear topic area so the site feels focused. A developer site about payments, images and shipping is easier to trust than a site that covers everything.",
          "Add a short bio, real contact details and photos or screenshots of your own work. These small signals show a real person runs the site.",
        ],
      },
      {
        h: "Common reasons for rejection",
        p: [
          "Low value content: pages that are short, repetitive, copied or clearly mass-produced. Site not ready: broken links, empty sections or a site that is down when Google visits. Hard navigation: no menu, or pages that visitors cannot reach. Policy problems: copyrighted material or prohibited topics. Ownership: applying with a domain you do not control, such as a free subdomain on someone else's hosting.",
        ],
      },
      {
        h: "A note on AI-written content",
        p: [
          "Google does not ban AI-assisted writing, but it does penalise large amounts of low-value content made only to rank. If you use AI tools, add your own experience, check every fact, test every code sample and edit the result until it genuinely helps a reader.",
        ],
      },
      {
        h: "Your pre-application checklist",
        p: [
          "Own a custom domain with HTTPS. Publish 15 or more original articles. Have privacy, terms, about and contact pages. Make the site fast and mobile friendly. Fix every broken link. Submit your sitemap in Google Search Console and confirm your pages are indexed. Then apply, and if you are rejected, read the reason, improve the content and apply again after a few weeks.",
        ],
      },
    ],
  },
  {
    slug: "what-to-do-after-adsense-approval",
    title: "What to do after Google AdSense approves your site",
    description:
      "A step-by-step checklist for the days and weeks after approval: ads.txt, consent, ad placement, payments and how to keep your account healthy.",
    date: "2026-11-17",
    minutes: 6,
    sections: [
      {
        h: "Day one: connect the basics",
        p: [
          "Publish your ads.txt file at the root of your domain, so it opens at yourdomain.com/ads.txt. It lists your publisher id and tells advertisers that you are allowed to sell your ad space. Google may take some time to detect it, so do not panic if the warning stays for a day or two.",
          "Add the AdSense script to your site. On this portfolio the script loads only after a visitor accepts cookies.",
        ],
      },
      {
        h: "Handle consent properly",
        p: [
          "If you have visitors from the European Economic Area, the United Kingdom or Switzerland, Google requires a consent management platform that is certified by Google. A simple banner is a good start for learning, but check Google's current rules and use a certified tool when your traffic grows.",
        ],
      },
      {
        h: "Place ads without hurting readers",
        p: [
          "Start with Auto ads, then watch how they look. If you place units manually, keep them clearly separate from your content and never push buttons, menus or download links next to them. Reserve space for each ad so the page does not jump while it loads, because layout shift hurts your Core Web Vitals.",
        ],
      },
      {
        h: "Rules that protect your account",
        p: [
          "Never click your own ads and never ask friends or family to click them. Do not offer rewards for clicks. Do not place ads on pages with little content, error pages or pages that exist only to show ads. Check the Policy center in your account regularly, because violations can reduce or end your earnings.",
        ],
      },
      {
        h: "Set up payments and verification",
        p: [
          "Add your payment details and complete the tax information that Google asks for. When your earnings reach a small first threshold, Google sends a PIN by post to verify your address. Payments are made once your balance passes the payment threshold, which Google lists in your account, and they are normally paid around the third week of the following month. Check the exact amounts and dates in your own AdSense help centre.",
        ],
      },
      {
        h: "Keep growing",
        p: [
          "Approval is the start. Keep publishing useful articles on a regular schedule, update old posts, and watch Search Console for pages that get impressions but few clicks. Add Google Analytics or another privacy-friendly analytics tool to learn which articles earn visitors, then write more of what works.",
        ],
      },
      {
        h: "A simple monthly routine",
        p: [
          "Publish two to four new articles. Refresh one old article. Fix broken links. Check page speed. Review the Policy center. Look at which pages earn and which do not. This steady habit builds a site that Google and readers both trust.",
        ],
      },
    ],
  },
  {
    slug: "express-rest-api-structure",
    title: "How to structure an Express.js REST API that scales",
    description:
      "A clean folder layout for Node.js and Express projects: routes, controllers, services, validation and one central error handler.",
    date: "2026-11-17",
    minutes: 5,
    sections: [
      {
        h: "Why structure matters",
        p: [
          "A single index.js file works for a demo, but it turns into a tangle as soon as you add payments, uploads and shipping. A clear structure lets you find code quickly, test pieces on their own and add features without breaking old ones.",
        ],
      },
      {
        h: "A layout that works",
        p: [
          "Split code by responsibility. Routes map URLs to controllers. Controllers read the request and send the response. Services hold the real business logic and talk to the database or other APIs. Middleware handles shared work like authentication and errors.",
        ],
        code: `src/
  app.js              // creates the Express app
  server.js           // starts listening
  routes/orders.js
  controllers/orderController.js
  services/orderService.js
  middleware/auth.js
  middleware/errorHandler.js`,
      },
      {
        h: "Keep controllers thin",
        p: [
          "A controller should validate input, call a service and return JSON. If you find database queries or payment calls inside a controller, move them into a service. That makes the logic reusable, for example from both an API route and a webhook.",
        ],
      },
      {
        h: "Validate every input",
        p: [
          "Never trust data from the client. Use a schema validation library to check types, lengths and required fields before your code runs. Reject bad input early with a clear 400 response.",
        ],
      },
      {
        h: "One central error handler",
        p: [
          "Instead of repeating try and catch responses everywhere, pass errors to next() and handle them in one place at the end of your middleware chain. In Express 5, errors thrown inside async handlers reach this handler automatically.",
        ],
        code: `app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});`,
      },
      {
        h: "Configuration and versioning",
        p: [
          "Read secrets from environment variables and never commit them. Prefix your routes with a version, such as /api/v1, so you can change the API later without breaking existing apps.",
        ],
      },
    ],
  },
  {
    slug: "secure-express-api-best-practices",
    title: "Securing a Node.js Express API: essential practices",
    description:
      "Practical security steps for Express: Helmet, rate limiting, input validation, CORS, password hashing and secret handling.",
    date: "2026-11-17",
    minutes: 6,
    sections: [
      {
        h: "Security is a habit, not a feature",
        p: [
          "An online store handles real money and real addresses, so a weak API is a serious risk. The good news is that a handful of habits stop most common attacks.",
        ],
      },
      {
        h: "Add safe defaults with Helmet",
        p: [
          "Helmet sets several HTTP headers that reduce common risks such as clickjacking and content sniffing. It takes one line to add.",
        ],
        code: `import helmet from "helmet";
app.use(helmet());`,
      },
      {
        h: "Limit how often clients can call you",
        p: [
          "Rate limiting slows down password guessing and abusive scripts. Apply a general limit to the whole API and a stricter one to login and payment routes.",
        ],
        code: `import rateLimit from "express-rate-limit";
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json({ limit: "100kb" }));`,
      },
      {
        h: "Validate input and escape output",
        p: [
          "Validate every body, query and parameter. Use parameterised queries or a trusted ORM so user input is never joined into a database command. This is the main defence against injection attacks.",
        ],
      },
      {
        h: "Hash passwords, protect tokens",
        p: [
          "Never store plain passwords. Hash them with bcrypt or argon2. If you use JSON Web Tokens, keep them short-lived, store them in HTTP-only cookies when possible and verify the signature on every request.",
        ],
      },
      {
        h: "Configure CORS carefully",
        p: [
          "Allow only your own front-end origins instead of every origin. A wide-open CORS rule lets any website call your API from a visitor's browser.",
        ],
      },
      {
        h: "Guard your secrets",
        p: [
          "Keep API keys for Razorpay, Cloudinary, shipping and AWS in environment variables or a secrets manager. Never put a secret in front-end code or a public repository. Rotate any key that may have leaked.",
        ],
      },
      {
        h: "Keep dependencies fresh",
        p: [
          "Run npm audit regularly, update packages, and remove libraries you no longer use. Always serve the API over HTTPS and log security-relevant events so you can spot trouble early.",
        ],
      },
    ],
  },
  {
    slug: "nextjs-seo-checklist",
    title: "A practical Next.js SEO checklist for developers",
    description:
      "The technical SEO steps for a Next.js site: metadata, canonical URLs, sitemap, structured data, image optimisation and speed.",
    date: "2026-11-17",
    minutes: 5,
    sections: [
      {
        h: "SEO starts with crawlable content",
        p: [
          "Search engines need to read your content. Make sure important text is in the HTML that your server sends, and not hidden behind a click or loaded only after scripts run. Give every important topic its own URL.",
        ],
      },
      {
        h: "Set metadata on every page",
        p: [
          "Give each page a unique title and a clear description of around 150 characters. In the Next.js App Router, export a metadata object, or use generateMetadata for dynamic pages such as blog posts.",
        ],
        code: `export const metadata = {
  title: "Projects",
  description: "Live websites built by Aadil.",
  alternates: { canonical: "/projects" },
};`,
      },
      {
        h: "Canonical URLs, sitemap and robots",
        p: [
          "Set a canonical URL so duplicate versions of a page do not compete. Generate a sitemap.xml and a robots.txt, then submit the sitemap in Google Search Console. Next.js can create both from simple files in the app folder.",
        ],
      },
      {
        h: "Add structured data",
        p: [
          "JSON-LD tells search engines what a page is about, such as a person, an article or a product. Add it in a script tag and test it with Google's Rich Results Test.",
        ],
      },
      {
        h: "Optimise images and fonts",
        p: [
          "Use the Next.js Image component with width, height and meaningful alt text. It serves modern formats and the right size. Load fonts with next/font so text does not flash or shift.",
        ],
      },
      {
        h: "Measure what matters",
        p: [
          "Check Core Web Vitals in PageSpeed Insights and Search Console. Fix the slowest pages first. Internal links between related articles also help both readers and crawlers find your content.",
        ],
      },
      {
        h: "Final check before launch",
        p: [
          "Confirm each page returns a 200 status, has one h1, a unique title and description, a canonical URL and working links. Then request indexing for your most important pages in Search Console.",
        ],
      },
    ],
  },
  {
    slug: "deploy-nextjs-aws-options",
    title: "Deploying a Next.js app to AWS: the main options explained",
    description:
      "A plain-language comparison of AWS Amplify, containers on ECS or App Runner, and a virtual server, to help you pick a hosting path.",
    date: "2026-11-17",
    minutes: 5,
    sections: [
      {
        h: "There is no single best choice",
        p: [
          "AWS offers many ways to run a web app. The right one depends on your traffic, your budget and how much server work you want to manage. Always check the current AWS documentation and pricing, because services and prices change.",
        ],
      },
      {
        h: "Option 1: AWS Amplify Hosting",
        p: [
          "Amplify connects to your Git repository, builds your Next.js app and deploys it automatically on every push. It is the easiest start for portfolios and small stores because it handles builds, HTTPS and a content delivery network for you.",
        ],
      },
      {
        h: "Option 2: Containers with App Runner or ECS",
        p: [
          "Package your app in a Docker image and let AWS run it. App Runner is the simpler choice and scales for you. ECS gives more control for larger systems. This route suits apps with a custom Node.js and Express backend.",
        ],
      },
      {
        h: "Option 3: A virtual server on EC2",
        p: [
          "You rent a server and install Node.js yourself, usually with a process manager and a reverse proxy such as Nginx. This gives full control and a predictable setup, but you are responsible for updates, security and monitoring.",
        ],
      },
      {
        h: "Static assets and images",
        p: [
          "Store large files in Amazon S3 and serve them through CloudFront. For product photos, a service such as Cloudinary can also handle resizing and delivery.",
        ],
      },
      {
        h: "Before you go live",
        p: [
          "Use environment variables for secrets, turn on HTTPS, set up a custom domain, add monitoring and billing alerts, and test a full order in production mode. Billing alerts matter most for beginners, because they stop surprise bills.",
        ],
      },
    ],
  },
  {
    slug: "claude-coding-partner-workflow",
    title: "Using Claude as a coding partner: a developer workflow",
    description:
      "How to get better results from an AI assistant when you build web apps: clear prompts, small steps, code review and keeping secrets safe.",
    date: "2026-11-17",
    minutes: 5,
    sections: [
      {
        h: "Treat it like a fast junior teammate",
        p: [
          "An AI assistant can write boilerplate, explain errors and suggest approaches in seconds. It can also be confidently wrong. The best results come when you stay in charge: you decide the goal, the assistant helps, and you check the result.",
        ],
      },
      {
        h: "Write clear prompts",
        p: [
          "Say what you are building, which tools you use, what you expect and what happens instead. Include the exact error message and the relevant code. A prompt such as: I use Express and Razorpay, and signature verification fails with this code, gets a far better answer than: payment not working.",
        ],
      },
      {
        h: "Work in small steps",
        p: [
          "Ask for one function, one component or one fix at a time. Run it, then continue. Small steps are easier to review and make mistakes easy to spot.",
        ],
      },
      {
        h: "Always review and test",
        p: [
          "Read every line before you use it. Run the code. Write a test for anything involving money, security or data. Check official documentation for payment, shipping and cloud APIs, because AI answers can be outdated.",
        ],
      },
      {
        h: "Never paste secrets",
        p: [
          "Do not share API keys, passwords, customer data or private tokens in a prompt. Replace them with placeholders. If you pasted a real secret by mistake, rotate it immediately.",
        ],
      },
      {
        h: "Use it to learn, not just to copy",
        p: [
          "Ask the assistant to explain why a solution works and what the alternatives are. Over time you understand the code you ship, which makes you faster and safer than someone who only copies answers.",
        ],
      },
    ],
  },
  {
    slug: "core-web-vitals-ecommerce",
    title: "Core Web Vitals for e-commerce sites: LCP, INP and CLS explained",
    description:
      "What the three Core Web Vitals measure, the target numbers, and the most common fixes for online stores.",
    date: "2026-11-17",
    minutes: 5,
    sections: [
      {
        h: "Why speed pays",
        p: [
          "Slow stores lose customers before they see a single product. Google also uses page experience signals in search. Core Web Vitals are three measurements that describe how fast and stable a page feels.",
        ],
      },
      {
        h: "LCP: Largest Contentful Paint",
        p: [
          "LCP measures how long the biggest visible element, usually the hero image, takes to appear. A good score is 2.5 seconds or less. Compress and resize the hero image, serve modern formats, avoid lazy-loading the first image and use a fast host or CDN.",
        ],
      },
      {
        h: "INP: Interaction to Next Paint",
        p: [
          "INP measures how quickly the page responds when someone taps or clicks. A good score is 200 milliseconds or less. It replaced the older FID metric. Reduce heavy JavaScript, split large bundles, and avoid long tasks that block the main thread.",
        ],
      },
      {
        h: "CLS: Cumulative Layout Shift",
        p: [
          "CLS measures unexpected movement, such as a button jumping as an image loads. A good score is 0.1 or less. Always set width and height on images, reserve space for ads and banners, and load fonts without a visible swap.",
        ],
      },
      {
        h: "Store-specific fixes",
        p: [
          "Use a service like Cloudinary for automatic image formats and sizes. Defer third-party scripts such as chat widgets and analytics. Keep the product grid light and load more items as the visitor scrolls.",
        ],
      },
      {
        h: "How to measure",
        p: [
          "Test key pages in PageSpeed Insights, and check the Core Web Vitals report in Google Search Console to see real visitor data. Fix the worst page type first, then measure again.",
        ],
      },
    ],
  },
  ...morePosts,
];

export const getPost =(slug: string) => posts.find((p) => p.slug === slug);
