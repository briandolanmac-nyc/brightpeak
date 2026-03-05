import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import PageLayout from "../components/PageLayout";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";

export const metadata = generatePageMetadata("/privacy-policy");

export const dynamic = "force-dynamic";

export default function PrivacyPolicyPage() {
  const pageData = loadPageJson("PrivacyPolicyPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, sections, lastUpdated } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="default" pagePath="/privacy-policy" />
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#fff",
          padding: "5rem 0 4rem",
        }}
      >
        <div className="container text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">
            Legal
          </p>
          <h1 className="page-title" style={{ color: "#fff" }}>
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-3xl">
          <div className="space-y-10">
            {sections.map((section: any, i: number) => (
              <div key={i}>
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{section.title}</h2>
                <p className="leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                  {section.body}
                  {section.contactEmail && (
                    <>{" "}<a href={`mailto:${section.contactEmail}`} className="text-brand hover:underline">{section.contactEmail}</a>{" "}or call{" "}<a href={`tel:${section.contactPhone?.replace(/\s/g, "")}`} className="text-brand hover:underline">{section.contactPhone}</a>.</>
                  )}
                </p>
                {section.bullets && (
                  <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                    {section.bullets.map((bullet: string, j: number) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-brand mt-1">•</span> {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div
              className="p-6 rounded-xl mt-8"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
