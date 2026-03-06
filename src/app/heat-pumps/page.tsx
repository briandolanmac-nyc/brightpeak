import PageLayout from "../components/PageLayout";
import PageBanner from "../components/PageBanner";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";
import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../lib/siteSettings";

export const metadata = generatePageMetadata("/heat-pumps");

export const dynamic = "force-dynamic";

export default function HeatPumpsPage() {
  const pageData = loadPageJson("HeatPumpsPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, intro, pumpTypes, exhaustAir, geothermal, newBuild, retrofit, benefits, cta } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="service" pagePath="/heat-pumps" serviceName="Heat Pump Installation" />
      <PageBanner eyebrow={hero.eyebrow} title={hero.title} subtitle={hero.subtitle} bannerImage={hero.bannerImage} />

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="page-eyebrow">{intro.eyebrow}</p>
            <h2 className="text-3xl font-extrabold">{intro.title}</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {intro.image && (
              <img
                src={intro.image}
                alt={intro.imageAlt || ""}
                loading="lazy"
                className="ufh-intro-image"
              />
            )}
            {(intro.paragraphs || []).map((p: string, i: number) => (
              <p key={i} className="text-gray-600 leading-relaxed text-base" style={{ marginBottom: "1.25rem" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {pumpTypes && (
        <section className="py-16 md:py-20" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold">{pumpTypes.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(pumpTypes.items || []).map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-6 rounded-xl shadow-sm border text-center"
                  style={{ borderColor: "var(--gray-200)", background: "var(--bg-primary)" }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {exhaustAir && (
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <p className="page-eyebrow">{exhaustAir.eyebrow}</p>
              <h2 className="text-3xl font-extrabold">{exhaustAir.title}</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {exhaustAir.image && (
                <img
                  src={exhaustAir.image}
                  alt={exhaustAir.imageAlt || ""}
                  loading="lazy"
                  className="ufh-intro-image"
                />
              )}
              {(exhaustAir.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base" style={{ marginBottom: "1.25rem" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {geothermal && (
        <section className="py-16 md:py-20" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="text-center mb-12">
              <p className="page-eyebrow">{geothermal.eyebrow}</p>
              <h2 className="text-3xl font-extrabold">{geothermal.title}</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {geothermal.image && (
                <img
                  src={geothermal.image}
                  alt={geothermal.imageAlt || ""}
                  loading="lazy"
                  className="ufh-intro-image"
                />
              )}
              {(geothermal.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base" style={{ marginBottom: "1.25rem" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {newBuild && (
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <p className="page-eyebrow">{newBuild.eyebrow}</p>
              <h2 className="text-3xl font-extrabold">{newBuild.title}</h2>
            </div>
            <div className="max-w-4xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(newBuild.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {retrofit && (
        <section className="py-16 md:py-20" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="text-center mb-12">
              <p className="page-eyebrow">{retrofit.eyebrow}</p>
              <h2 className="text-3xl font-extrabold">{retrofit.title}</h2>
            </div>
            <div className="max-w-4xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(retrofit.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="page-eyebrow">{benefits.eyebrow}</p>
            <h2 className="text-3xl font-extrabold">{benefits.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(benefits.items || []).map((item: any, i: number) => (
              <div
                key={i}
                className="p-6 rounded-xl shadow-sm border"
                style={{ borderColor: "var(--gray-200)", background: "var(--bg-primary)" }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          background: "linear-gradient(135deg, var(--brand-banner-overlay) 0%, color-mix(in srgb, var(--brand-banner-overlay) 80%, #334155) 50%, var(--brand-banner-overlay) 100%)",
          color: "#fff",
          padding: "4rem 0",
        }}
      >
        <div className="container text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            {cta.title}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            {cta.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={getVoltfloUrl(siteSettings)}
              {...externalLinkProps(getVoltfloUrl(siteSettings))}
              style={{
                background: "#fff",
                color: "var(--teal)",
                padding: "0.875rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              {heroCta.label}
            </a>
            {cta.secondaryButton && (
              <a
                href={cta.secondaryButton.href}
                {...externalLinkProps(cta.secondaryButton.href)}
                style={{
                  border: "2px solid #fff",
                  color: "#fff",
                  padding: "0.875rem 2rem",
                  borderRadius: "0.5rem",
                  fontWeight: 700,
                  display: "inline-block",
                }}
              >
                {cta.secondaryButton.label}
              </a>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
