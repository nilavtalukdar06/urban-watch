import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Urban Watch - Citizen",
    short_name: "Urban Watch",
    description:
      "An AI powered civic platform that helps user report & manage any issues in the city",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo2.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo2.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
