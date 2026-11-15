import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Peter Eshak Abdo — Full-Stack Web Developer",
    short_name: "Peter Eshak",
    description: "Portfolio of Peter Eshak Abdo, full-stack web developer from Ismailia, Egypt.",
    start_url: "/",
    display: "standalone",
    background_color: "#141a24",
    theme_color: "#141a24",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
