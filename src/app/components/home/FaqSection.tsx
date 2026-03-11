import { sanitizeHtml } from "../../lib/sanitize";

const FaqSection = ({ data }: { data: Record<string, unknown> }) => {
  const faqData = data as any;
  if (!faqData.enabled) return null;

  const categories = (faqData.categories || []) as { slug: string }[];
  const activeSlugs = new Set(categories.map((c) => c.slug));
  const items = ((faqData.items || []) as { question: string; answer: string; category: string }[])
    .filter((item) => item.category !== "_orphan" && activeSlugs.has(item.category));

  const displayItems = items.slice(0, 8);

  return (
    <section id="faq" className="section section-gray faq-section">
    <div className="container">
      <p className="section-eyebrow">{faqData.eyebrow}</p>
      <h2 className="section-title">{faqData.title}</h2>
      <p className="section-sub">{faqData.subtitle}</p>
      <div className="faq-list">
        {displayItems.map((item: any) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <div className="faq-answer" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.answer) }} />
          </details>
        ))}
      </div>
      {items.length > 8 && (
        <div className="text-center mt-8">
          <a
            href="/solar-guide"
            className="btn btn-primary"
          >
            View Full Solar Guide
          </a>
        </div>
      )}
    </div>
    </section>
  );
};

export default FaqSection;
