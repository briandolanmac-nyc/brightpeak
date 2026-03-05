"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(data: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }
}

const DataLayerTracker = () => {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
      const handler = () => {
        push({ event: "phone_click", phone_number: link.textContent?.trim() || link.href });
      };
      link.addEventListener("click", handler);
      cleanups.push(() => link.removeEventListener("click", handler));
    });

    document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach((link) => {
      const handler = () => {
        push({ event: "email_click", email_address: link.textContent?.trim() || link.href });
      };
      link.addEventListener("click", handler);
      cleanups.push(() => link.removeEventListener("click", handler));
    });

    document.querySelectorAll<HTMLAnchorElement>(".btn-primary, .btn-cta, .btn-white, .btn-footer-cta, .btn-outline, .btn-outline-white, .btn-teal").forEach((btn) => {
      const handler = () => {
        const section = btn.closest("section, footer, nav");
        const sectionId = section?.id || section?.className?.split(" ")[0] || "unknown";
        push({
          event: "cta_click",
          cta_text: btn.textContent?.trim() || "",
          cta_url: btn.href || "",
          cta_section: sectionId,
        });
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    document.querySelectorAll<HTMLDetailsElement>(".faq-item").forEach((item) => {
      const handler = () => {
        if (item.open) {
          const question = item.querySelector("summary")?.textContent?.trim() || "";
          push({ event: "faq_open", faq_question: question });
        }
      };
      item.addEventListener("toggle", handler);
      cleanups.push(() => item.removeEventListener("toggle", handler));
    });

    if ("IntersectionObserver" in window) {
      const sectionMap: Record<string, string> = {
        hero: "Hero",
        services: "Service Cards",
        "why-choose": "Why Choose Us",
        "case-studies": "Case Studies",
        how: "How It Works",
        video: "Video",
        testimonials: "Testimonials",
        impact: "Impact Stats",
        faq: "FAQ",
        "news-videos": "News & Videos",
        "final-cta": "Final CTA",
        "contact-section": "Contact CTA",
        "trust-bar": "Trust Bar",
        accreditations: "Accreditations",
      };

      const tracked = new Set<string>();
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = (entry.target as HTMLElement).id;
              if (id && !tracked.has(id)) {
                tracked.add(id);
                push({
                  event: "section_view",
                  section_name: sectionMap[id] || id,
                  section_id: id,
                });
              }
            }
          });
        },
        { threshold: 0.3 }
      );

      document.querySelectorAll<HTMLElement>("section[id], footer[id]").forEach((el) => {
        sectionObserver.observe(el);
      });

      const sections = document.querySelectorAll<HTMLElement>("section[class]");
      sections.forEach((section) => {
        const cls = section.className;
        for (const key of Object.keys(sectionMap)) {
          if (cls.includes(key) && !section.id) {
            section.id = key;
            sectionObserver.observe(section);
            break;
          }
        }
      });

      cleanups.push(() => sectionObserver.disconnect());
    }

    document.querySelectorAll<HTMLFormElement>("form").forEach((form) => {
      if (form.closest(".admin-sidebar, .admin-page")) return;
      const handler = () => {
        const page = window.location.pathname;
        push({ event: "form_submit", form_page: page });
      };
      form.addEventListener("submit", handler);
      cleanups.push(() => form.removeEventListener("submit", handler));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
};

export default DataLayerTracker;
