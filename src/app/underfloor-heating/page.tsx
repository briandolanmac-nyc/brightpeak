import PageLayout from "../components/PageLayout";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";
import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../lib/siteSettings";

export const metadata = generatePageMetadata("/underfloor-heating");

export const dynamic = "force-dynamic";

export default function UnderfloorHeatingPage() {
  const pageData = loadPageJson("UnderfloorHeatingPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, intro, floorTypes, variotherm, servicing, benefits, cta } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="service" pagePath="/underfloor-heating" serviceName="Underfloor Heating Installation" />

      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#fff",
          padding: "5rem 0 4rem",
        }}
      >
        <div className="container text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

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

      {floorTypes && (
        <section className="py-16 md:py-20" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold">{floorTypes.title}</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {(floorTypes.items || []).map((item: any, i: number) => (
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

      {variotherm && (
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <p className="page-eyebrow">{variotherm.eyebrow}</p>
              <h2 className="text-3xl font-extrabold">{variotherm.title}</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {variotherm.image && (
                <img
                  src={variotherm.image}
                  alt={variotherm.imageAlt || ""}
                  loading="lazy"
                  className="ufh-intro-image"
                />
              )}
              {(variotherm.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base" style={{ marginBottom: "1.25rem" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="page-eyebrow">{benefits.eyebrow}</p>
            <h2 className="text-3xl font-extrabold">{benefits.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {servicing && (
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <p className="page-eyebrow">{servicing.eyebrow}</p>
              <h2 className="text-3xl font-extrabold">{servicing.title}</h2>
            </div>
            <div className="max-w-4xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {(servicing.paragraphs || []).map((p: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
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
