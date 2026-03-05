import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import PageLayout from "../components/PageLayout";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";

export const metadata = generatePageMetadata("/cookies");

export const dynamic = "force-dynamic";

export default function CookiesPage() {
  const pageData = loadPageJson("CookiesPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, sections, lastUpdated } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="default" pagePath="/cookies" />
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#fff",
          padding: "5rem 0 4rem",
        }}
      >
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-3xl">
          <div className="space-y-8">
            {sections.map((section: any, i: number) => (
              <div key={i}>
                <h2 className="text-2xl font-extrabold mb-4">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {section.body}
                  {section.contactEmail && (
                    <>{" "}<a href={`mailto:${section.contactEmail}`} className="text-brand hover:underline">{section.contactEmail}</a>{" "}or call{" "}<a href={`tel:${section.contactPhone?.replace(/\s/g, "")}`} className="text-brand hover:underline">{section.contactPhone}</a>.</>
                  )}
                </p>
                {section.cookieTypes && (
                  <div className="space-y-4">
                    {section.cookieTypes.map((cookie: any) => (
                      <div
                        key={cookie.title}
                        className="p-6 rounded-xl border"
                        style={{ borderColor: "var(--gray-200)", background: "var(--bg-primary)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{cookie.title}</h3>
                          {cookie.required && (
                            <span
                              className="text-xs font-semibold px-3 py-1 rounded-full"
                              style={{ background: "#e0f2fe", color: "#0284c7" }}
                            >
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{cookie.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <>
                    <ul className="space-y-2 text-gray-600">
                      {section.bullets.map((bullet: string, j: number) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-brand mt-1">•</span> {bullet}
                        </li>
                      ))}
                    </ul>
                    {section.afterBullets && (
                      <p className="text-gray-600 leading-relaxed mt-3">
                        {section.afterBullets}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}

            <div
              className="p-6 rounded-xl mt-8"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p className="text-sm text-gray-500">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
