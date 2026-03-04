import fs from "fs";
import path from "path";

const DATA_BASE = path.join(process.cwd(), "data");

function readJson(filePath: string): Record<string, unknown> {
  try {
    const content = fs.readFileSync(path.join(DATA_BASE, filePath), "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export function loadAllHomeData() {
  return {
    homePage: readJson("home/HomePage.json"),
    hero: readJson("home/HeroSection.json"),
    serviceCards: readJson("home/ServiceCardsSection.json"),
    trustBar: readJson("home/TrustBarSection.json"),
    video: readJson("home/VideoSection.json"),
    whyChoose: readJson("home/WhyChooseSection.json"),
    impact: readJson("home/ImpactSection.json"),
    caseStudies: readJson("home/CaseStudiesSection.json"),
    how: readJson("home/HowSection.json"),
    testimonials: readJson("home/TestimonialsSection.json"),
    faq: readJson("home/FaqSection.json"),
    accreditations: readJson("home/AccreditationsSection.json"),
    newsVideos: readJson("home/NewsVideosSection.json"),
    finalCta: readJson("home/FinalCtaSection.json"),
    testimonialsPage: readJson("pages/TestimonialsPage.json"),
    navigation: readJson("home/Navigation.json"),
    footer: readJson("home/Footer.json"),
    headerSettings: readJson("home/HeaderSettings.json"),
    siteSettings: readJson("home/SiteSettings.json"),
    heroCta: loadHeroCta(),
  };
}

export type HomeData = ReturnType<typeof loadAllHomeData>;

export function loadPageJson(fileName: string): Record<string, unknown> {
  return readJson(`pages/${fileName}`);
}

export function loadHeroCta(): { label: string; href: string } {
  const hero = readJson("home/HeroSection.json");
  const cta = (hero.cta as any[])?.[0];
  return { label: cta?.label || "Get a Free Quote", href: cta?.href || "/contact" };
}

export function loadNavFooterData() {
  return {
    navigation: readJson("home/Navigation.json"),
    footer: readJson("home/Footer.json"),
    headerSettings: readJson("home/HeaderSettings.json"),
    siteSettings: readJson("home/SiteSettings.json"),
    heroCta: loadHeroCta(),
  };
}
