import { getContactFormUrl, getVoltfloUrl, externalLinkProps } from "../../lib/siteSettings";

const FinalCtaSection = ({ data, siteSettings, heroCta }: { data: Record<string, unknown>; siteSettings: Record<string, unknown>; heroCta?: { label: string; href: string } }) => {
  const finalCtaData = data as any;
  if (!finalCtaData.enabled) return null;

  const logo = finalCtaData.finalCtaLogo;

  return (
    <section className="final-cta" id="contact-section">
    {logo?.enabled !== false && (
    <div className="final-cta-portrait">
      <img src={logo?.image || "/images/brightpeak-energy-logo-v2.png"} alt={logo?.alt || "BrightPeak Energy"} />
      <span className="portrait-name">{logo?.name || "BrightPeak Energy"}</span>
      <span className="portrait-role">{logo?.role || ""}</span>
    </div>
    )}
    <div className="container">
      <h2 className="final-cta-title">{finalCtaData.title}</h2>
      <p className="final-cta-sub">{finalCtaData.subtitle}</p>
      <div className="final-cta-btns">
        {finalCtaData.buttons.map((button: any) => (
          <a
            key={button.label}
            href={button.variant === "primary" ? getVoltfloUrl(siteSettings) : getContactFormUrl(siteSettings)}
            className={button.variant === "primary" ? "btn btn-white" : "btn btn-outline-white"}
            {...externalLinkProps(button.variant === "primary" ? getVoltfloUrl(siteSettings) : getContactFormUrl(siteSettings))}
          >
            {button.variant === "primary" ? (heroCta?.label || button.label) : button.label}
          </a>
        ))}
      </div>
    </div>
    </section>
  );
};

export default FinalCtaSection;
