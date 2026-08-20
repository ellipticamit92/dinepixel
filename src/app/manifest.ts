import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dinepixel — Menus for cafes and restaurants",
    short_name: "Dinepixel",
    description: "Upload once, serve everywhere. AI-powered digital menus with QR codes.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4eee1",
    theme_color: "#f4eee1",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
