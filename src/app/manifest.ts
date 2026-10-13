import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aduane — What should I eat today?",
    short_name: "Aduane",
    description: "A daily Ghanaian meal plan that fits your budget and goals.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ef",
    theme_color: "#0f7a3d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
