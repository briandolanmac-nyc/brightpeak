import { generatePageMetadata } from "../components/SeoHead";
import StructuredData from "../components/StructuredData";
import PageLayout from "../components/PageLayout";
import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../lib/siteSettings";
import { loadPageJson, loadNavFooterData } from "../lib/loadAllHomeData";

export const metadata = generatePageMetadata("/contact");

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const pageData = loadPageJson("ContactPage.json") as any;
  const { navigation, footer, headerSettings, siteSettings, heroCta } = loadNavFooterData();
  const { hero, form, contactInfo, certifications, quickQuote } = pageData;

  return (
    <PageLayout navData={navigation} footerData={footer} headerSettings={headerSettings} siteSettings={siteSettings} heroCta={heroCta}>
      <StructuredData pageType="contact" pagePath="/contact" />
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
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-extrabold mb-8">{form.title}</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {form.fields.filter((f: any) => f.half).map((field: any) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        style={{ borderColor: "var(--gray-300)", background: "var(--bg-primary)" }}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
                {form.fields.filter((f: any) => !f.half).map((field: any) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      style={{ borderColor: "var(--gray-300)", background: "var(--bg-primary)" }}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold mb-2">{form.serviceSelect.label}</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    style={{ borderColor: "var(--gray-300)", background: "var(--bg-primary)" }}
                  >
                    <option value="">{form.serviceSelect.placeholder}</option>
                    {form.serviceSelect.options.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{form.message.label}</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    style={{ borderColor: "var(--gray-300)", background: "var(--bg-primary)" }}
                    placeholder={form.message.placeholder}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-bold text-lg"
                  style={{ background: "var(--teal)" }}
                >
                  {form.submitButton}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold mb-8">{contactInfo.title}</h2>
                <div className="space-y-6">
                  {contactInfo.items.map((item: any) => (
                    <div key={item.title} className="flex gap-4 items-start">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "#e0f2fe" }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        {item.href ? (
                          <a href={item.href} className="text-brand hover:underline">
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-6 rounded-2xl"
                style={{ background: "var(--bg-secondary)" }}
              >
                <h3 className="font-bold text-lg mb-3">{certifications.title}</h3>
                <ul className="space-y-2">
                  {certifications.items.map((cert: string) => (
                    <li key={cert} className="flex items-center gap-2 text-gray-600">
                      <span className="text-brand">✓</span> {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-6 rounded-2xl"
                style={{ background: "#e0f2fe" }}
              >
                <h3 className="font-bold text-lg mb-2">{quickQuote.title}</h3>
                <p className="text-gray-600 mb-4">
                  {quickQuote.description}
                </p>
                <a
                  href={getVoltfloUrl(siteSettings)}
                  {...externalLinkProps(getVoltfloUrl(siteSettings))}
                  className="inline-block font-bold"
                  style={{
                    background: "var(--teal)",
                    color: "#fff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  {quickQuote.buttonLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
