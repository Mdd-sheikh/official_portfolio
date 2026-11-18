export const themes = {
  violet: { label: "Violet", dot: "#8b5cf6" },
  ocean: { label: "Ocean", dot: "#06b6d4" },
  sunset: { label: "Sunset", dot: "#f97316" },
  mint: { label: "Mint", dot: "#10b981" },
} as const;

export type ThemeName = keyof typeof themes;

export function applyTheme(name: ThemeName) {
  document.documentElement.dataset.theme = name;
  try {
    localStorage.setItem("theme", name);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent("theme-change", { detail: name }));
}

export function savedTheme(): ThemeName | null {
  try {
    const t = localStorage.getItem("theme");
    return t && t in themes ? (t as ThemeName) : null;
  } catch {
    return null;
  }
}

export function openSection(id: "projects" | "about" | "extra" | "contact") {
  window.dispatchEvent(new CustomEvent("open-section", { detail: id }));
}
