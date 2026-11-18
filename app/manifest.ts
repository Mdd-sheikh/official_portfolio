import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aadil | Web Developer Portfolio",
    short_name: "Aadil",
    description: "Portfolio of Aadil, a web developer.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070d",
    theme_color: "#07070d",
  };
}
