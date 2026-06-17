import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cursorwebs.com";
  
  const staticPaths = [
    "",
    "/signin",
    "/signup",
    "/terms",
    "/privacy",
    "/cookies",
    "/refund",
    "/affiliate",
  ];

  return staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
