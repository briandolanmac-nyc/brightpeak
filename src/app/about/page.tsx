import PageLayout from "../components/PageLayout";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";
import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../lib/siteSettings";

export const metadata = generatePageMetadata("/about");

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const aboutData = loadPageJson("AboutPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="about" pagePath="/about" />
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "#fff",
          padding: "5rem 0 4rem",
        }}
      >
        <div className="container text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">
            {aboutData.hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {aboutData.hero.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {aboutData.hero.description}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="page-eyebrow">
                {aboutData.story.eyebrow}
              </p>
              <h2 className="text-3xl font-extrabold mb-6">
                {aboutData.story.title}
              </h2>
              {aboutData.story.paragraphs.map((p: string, i: number) => (
                <p key={i} className={`text-gray-600 leading-relaxed ${i < aboutData.story.paragraphs.length - 1 ? "mb-4" : ""}`}>
                  {p}
                </p>
              ))}
            </div>
            <div className="relative">
              <img
                src={aboutData.story.image.src}
                alt={aboutData.story.image.alt}
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
            <p className="page-eyebrow">
              {aboutData.values.eyebrow}
            </p>
            <h2 className="text-3xl font-extrabold">{aboutData.values.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.values.items.map((item: any) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 shadow-md text-center"
                style={{ background: "var(--bg-primary)" }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="page-eyebrow">
              {aboutData.credentials.eyebrow}
            </p>
            <h2 className="text-3xl font-extrabold">{aboutData.credentials.title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutData.credentials.items.map((cert: any) => (
              <div
                key={cert.label}
                className="rounded-xl p-6 text-center shadow-sm border"
                style={{ borderColor: "var(--gray-200)", background: "var(--bg-primary)" }}
              >
                <div className="text-3xl mb-3">{cert.icon}</div>
                <p className="font-semibold text-sm">{cert.label}</p>
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
          <h2 className="text-3xl font-extrabold mb-4">
            {aboutData.cta.title}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            {aboutData.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={getVoltfloUrl(siteSettings)}
              {...externalLinkProps(getVoltfloUrl(siteSettings))}
              className="btn btn-cta"
              style={{
                background: "#fff",
                color: "var(--teal)",
                padding: "0.875rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: 700,
              }}
            >
              {heroCta.label}
            </a>
            <a
              href={getContactFormUrl(siteSettings)}
              {...externalLinkProps(getContactFormUrl(siteSettings))}
              style={{
                border: "2px solid #fff",
                color: "#fff",
                padding: "0.875rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: 700,
              }}
            >
              {aboutData.cta.secondaryButton.label}
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
