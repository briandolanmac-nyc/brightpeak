import PageLayout from "../components/PageLayout";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";
import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../lib/siteSettings";

export const metadata = generatePageMetadata("/ev-chargers");

export const dynamic = "force-dynamic";

export default function EvChargersPage() {
  const pageData = loadPageJson("EvChargersPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, section1, section2, features, business, cta } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="service" pagePath="/ev-chargers" serviceName="EV Charger Installation" />
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
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            {hero.title}
          </h1>
          <p className="text-base md:text-xl max-w-2xl mx-auto opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container">
          <p className="page-eyebrow">
            {section1.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
            {section1.title1}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <div className="mb-5">
                {section1.subHeading && <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{section1.subHeading}</h3>}
                <p className="text-gray-600 leading-relaxed">{section1.paragraph}</p>
              </div>
              {section1.image && (
                <div className="rounded-xl overflow-hidden" style={{ width: "100%", maxWidth: "320px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={section1.image}
                    alt={section1.imageAlt}
                    className="w-full"
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4 md:space-y-6">
              {features.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-xl shadow-sm border"
                  style={{ borderColor: "var(--gray-200)", background: "var(--bg-primary)" }}
                >
                  <div className="text-2xl md:text-3xl flex-shrink-0">{item.icon}</div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base md:text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold mb-6" style={{ color: "var(--text-primary)", marginTop: "3rem" }}>
            {section2.title2}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              {section2.subHeading && <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{section2.subHeading}</h3>}
              <p className="text-gray-600 leading-relaxed">{section2.paragraph}</p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/services/zappi-charger.webp"
                alt="Zappi EV Charger"
                className="rounded-xl"
                style={{ maxWidth: "220px", width: "100%" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold">{business.title}</h2>
            <p className="text-gray-600 mt-2">{business.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {business.items.map((item: any) => (
              <div
                key={item.title}
                className="p-5 md:p-6 rounded-xl shadow-sm text-center"
                style={{ background: "var(--bg-primary)" }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#fff",
          padding: "4rem 0",
        }}
      >
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            {cta.title}
          </h2>
          <p className="text-base md:text-lg mb-8 opacity-90 max-w-xl mx-auto">
            {cta.subtitle}
          </p>
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
        </div>
      </section>
    </PageLayout>
  );
}
