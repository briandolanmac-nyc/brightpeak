"use client";

import seoData from "../../../data/seo.json";

interface StructuredDataProps {
  pageType?: "home" | "about" | "service" | "contact" | "faq" | "testimonials" | "default";
  pagePath?: string;
  faqItems?: { question: string; answer: string }[];
  reviews?: { quote: string; author: string; role: string }[];
  serviceName?: string;
  serviceDescription?: string;
}

export default function StructuredData({
  pageType = "default",
  pagePath = "/",
  faqItems,
  reviews,
  serviceName,
  serviceDescription,
}: StructuredDataProps) {
  const schemas: object[] = [];

  const biz = seoData.business;
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${seoData.siteUrl}/#organization`,
    name: biz.name,
    legalName: biz.legalName,
    url: biz.url,
    logo: `${seoData.siteUrl}${biz.logo}`,
    image: `${seoData.siteUrl}${seoData.defaultImage}`,
    description: biz.description,
    foundingDate: String(biz.foundingYear),
    telephone: biz.phone,
    email: biz.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: biz.address.street,
      addressLocality: biz.address.city,
      addressRegion: biz.address.region,
      addressCountry: biz.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: biz.geo.latitude,
      longitude: biz.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "16:00",
    },
    priceRange: biz.priceRange,
    areaServed: {
      "@type": "Country",
      name: biz.areaServed,
    },
    sameAs: biz.sameAs,
  };

  if (pageType === "home" || pageType === "about" || pageType === "contact") {
    schemas.push(localBusiness);
  }

  if (pageType === "home") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: seoData.siteName,
      url: seoData.siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${seoData.siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }

  if ((pageType === "service" || pageType === "home") && seoData.services) {
    const serviceItems = pageType === "service" && serviceName
      ? seoData.services.filter((s) => s.name === serviceName)
      : seoData.services;

    serviceItems.forEach((service) => {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: serviceDescription || service.description,
        url: `${seoData.siteUrl}${service.url}`,
        image: `${seoData.siteUrl}${service.image}`,
        areaServed: {
          "@type": "Country",
          name: service.areaServed,
        },
        provider: {
          "@type": "LocalBusiness",
          name: service.provider,
          "@id": `${seoData.siteUrl}/#organization`,
        },
      });
    });
  }

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  if (reviews && reviews.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${seoData.siteUrl}/#organization`,
      name: biz.name,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        bestRating: "5",
        worstRating: "1",
        ratingCount: String(reviews.length),
        reviewCount: String(reviews.length),
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: r.author,
        },
        reviewBody: r.quote,
      })),
    });
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: seoData.siteUrl,
      },
      ...(pagePath !== "/"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name:
                seoData.pages[pagePath as keyof typeof seoData.pages]?.title?.split("|")[0]?.trim() ||
                pagePath.replace("/", "").replace(/-/g, " "),
              item: `${seoData.siteUrl}${pagePath}`,
            },
          ]
        : []),
    ],
  };
  schemas.push(breadcrumbs);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
