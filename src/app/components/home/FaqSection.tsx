const FaqSection = ({ data }: { data: Record<string, unknown> }) => {
  const faqData = data as any;
  if (!faqData.enabled) return null;

  return (
    <section id="faq" className="section section-gray faq-section">
    <div className="container">
      <p className="section-eyebrow">{faqData.eyebrow}</p>
      <h2 className="section-title">{faqData.title}</h2>
      <p className="section-sub">{faqData.subtitle}</p>
      <div className="faq-list">
        {faqData.items.map((item: any) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
    </section>
  );
};

export default FaqSection;
