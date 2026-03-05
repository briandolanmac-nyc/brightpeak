import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function loadSeoData(): any {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), "data/seo.json"), "utf-8");
    return JSON.parse(content);
  } catch {
    return { siteUrl: "", pages: {} };
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const seoData = loadSeoData();
  const baseUrl = seoData.siteUrl;
  const now = new Date();

  const pages = Object.keys(seoData.pages || {});

  return pages.map((p) => {
    let changeFrequency: "daily" | "weekly" | "monthly" | "yearly" = "monthly";
    let priority = 0.7;

    if (p === "/") {
      changeFrequency = "weekly";
      priority = 1.0;
    } else if (["/solar-panels", "/battery-storage", "/ev-chargers", "/commercial-solar"].includes(p)) {
      changeFrequency = "weekly";
      priority = 0.9;
    } else if (["/grants", "/finance", "/funding-options", "/contact"].includes(p)) {
      changeFrequency = "monthly";
      priority = 0.8;
    } else if (["/privacy-policy", "/cookies"].includes(p)) {
      changeFrequency = "yearly";
      priority = 0.3;
    }

    return {
      url: `${baseUrl}${p === "/" ? "" : p}`,
      lastModified: now,
      changeFrequency,
      priority,
    };
  });
}
