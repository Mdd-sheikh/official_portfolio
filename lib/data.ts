// Edit this file to change everything shown on the portfolio.

export const profile = {
  name: "Aadil",
  role: "Web Developer & Designer",
  tagline: "I design and build fast, modern web experiences that people remember.",
  email: "you@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
};

export const projects = [
  {
    title: "Humi's Fragrance",
    kind: "E-commerce",
    url: "https://humisfragrance.com",
    image: "/projects/humis.png",
    blurb: "A premium perfume store with a hero slider, featured fragrances, wishlist, cart and login.",
    tags: ["Storefront", "Cart & wishlist", "Responsive"],
  },
  {
    title: "Accountune",
    kind: "Web app",
    url: "https://accountune.netlify.app",
    image: "/projects/accountune.png",
    blurb: "A modern invoicing landing page and dashboard preview for creating invoices and tracking payments.",
    tags: ["Dashboard", "Invoicing", "UI design"],
  },
  {
    title: "Addelicius",
    kind: "Food ordering",
    url: "https://addelicius.netlify.app",
    image: "/projects/addelicius.png",
    blurb: "A bold food-ordering site with a menu explorer, cart and a vibrant orange brand look.",
    tags: ["Food", "Menu", "Landing page"],
  },
];

export const skills = [
  "HTML", "CSS", "JavaScript", "React", "Next.js", "Responsive Design", "UI Design", "Animation", "Git",
];

// Levels (0-100) are placeholders. Set them to what you honestly feel.
export const skillGroups = [
  {
    name: "Frontend",
    items: [
      { name: "HTML & CSS", level: 90, note: "Semantic, accessible, responsive layouts" },
      { name: "JavaScript", level: 80, note: "Modern ES, DOM, async code" },
      { name: "React", level: 80, note: "Components, hooks, state" },
      { name: "Next.js", level: 75, note: "App Router, SSR and static builds" },
    ],
  },
  {
    name: "Design",
    items: [
      { name: "UI Design", level: 80, note: "Layout, type and colour systems" },
      { name: "Animation", level: 75, note: "CSS motion, canvas, micro-interactions" },
      { name: "Branding", level: 70, note: "Visual identity for small businesses" },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Git & GitHub", level: 70, note: "Branches, commits, collaboration" },
      { name: "Netlify", level: 75, note: "Deploying and hosting sites" },
      { name: "VS Code", level: 85, note: "Daily editor and workflow" },
    ],
  },
];

export const extras = [
  { title: "Club & community", body: "Add the clubs, teams or societies you take part in." },
  { title: "Sports & fitness", body: "Add any sports, tournaments or fitness achievements." },
  { title: "Volunteering", body: "Add events, drives or causes you have helped with." },
  { title: "Creative hobbies", body: "Add design, photography, music or writing you do on the side." },
];

export const marquee = [
  "Design", "Development", "Animation", "Responsive", "Performance", "Branding", "Web Apps", "E-commerce",
];
