import PageLayout from "../components/PageLayout";
import PageBanner from "../components/PageBanner";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";
import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../lib/siteSettings";

export const metadata = generatePageMetadata("/battery-storage");

export const dynamic = "force-dynamic";

export default function BatteryStoragePage() {
  const pageData = loadPageJson("BatteryStoragePage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, about, benefits, cta } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="service" pagePath="/battery-storage" serviceName="Battery Storage Installation" />
      <PageBanner eyebrow={hero.eyebrow} title={hero.title} subtitle={hero.subtitle} bannerImage={hero.bannerImage} />

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="page-eyebrow">
                {about.eyebrow}
              </p>
              <h2 className="text-3xl font-extrabold mb-6">
                {about.title}
              </h2>
              {about.contentBlocks.map((block: any, i: number) => (
                <div key={i} className="mb-5">
                  <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{block.subHeading}</h3>
                  <p className="text-gray-600 leading-relaxed">{block.paragraph}</p>
                </div>
              ))}
            </div>
            <div>
              <img
                src={about.image.src}
                alt={about.image.alt}
                className="rounded-2xl shadow-lg w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">{benefits.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.items.map((item: any) => (
              <div
                key={item.title}
                className="p-6 rounded-xl shadow-sm text-center"
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
