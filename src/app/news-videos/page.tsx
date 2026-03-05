import PageLayout from "../components/PageLayout";
import { loadNavFooterData } from "../lib/loadAllHomeData";
import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import { VideoPageCard, NewsPageCard } from "../components/home/NewsVideoPageCard";
import NewsVideosScrollRow from "../components/home/NewsVideosScrollRow";
import fs from "fs";
import path from "path";

export const metadata = generatePageMetadata("/news-videos");

export const dynamic = "force-dynamic";

function loadNewsVideosData(): any {
  try {
    const filePath = path.join(process.cwd(), "data/home/NewsVideosSection.json");
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return { sectionTitle: "News & Videos", newsItems: [], videoItems: [] };
  }
}

export default function NewsVideosPage() {
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const nvData = loadNewsVideosData();
  const newsItems = (nvData.newsItems || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const videoItems = (nvData.videoItems || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="default" pagePath="/news-videos" />

      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#fff",
          padding: "6rem 0 4rem",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <p className="page-eyebrow" style={{ color: "var(--teal)" }}>{nvData.eyebrow || "Latest Updates"}</p>
          <h1 className="page-title" style={{ color: "#fff" }}>{nvData.sectionTitle || "News & Videos"}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto" }}>
            {nvData.subtitle || ""}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 0", background: "var(--bg-primary)" }}>
        <div className="container">
          {videoItems.length === 0 && newsItems.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              No news or videos yet. Check back soon!
            </p>
          ) : (
            <>
              {videoItems.length > 0 && (
                <NewsVideosScrollRow label="Videos" itemCount={videoItems.length}>
                  {videoItems.map((item: any, i: number) => (
                    <VideoPageCard key={`video-${i}`} item={item} />
                  ))}
                </NewsVideosScrollRow>
              )}

              {newsItems.length > 0 && (
                <NewsVideosScrollRow label="News" itemCount={newsItems.length}>
                  {newsItems.map((item: any, i: number) => (
                    <NewsPageCard key={`news-${i}`} item={item} />
                  ))}
                </NewsVideosScrollRow>
              )}
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
