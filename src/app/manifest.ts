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
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
