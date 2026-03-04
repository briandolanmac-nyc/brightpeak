"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const VIDEO_RE = /\.(mp4|webm|ogg|mov)$/i;

function getEmbedUrl(url: string): string | null {
  if (!url || !url.trim()) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") {
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/shorts/")[1]?.split(/[/?]/)[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split(/[/?]/)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "www.youtube.com" && u.pathname.startsWith("/embed/")) {
      return url;
    }
    if (u.hostname === "player.vimeo.com") return url;
    if (u.hostname === "vimeo.com") {
      const id = u.pathname.slice(1).split(/[/?]/)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

const CaseStudiesSection = ({ data }: { data: Record<string, unknown> }) => {
  const caseStudiesData = data as any;
  if (!caseStudiesData.enabled) return null;

  const cards = caseStudiesData.cards;

  return (
    <section id="case-studies" className="section case-studies">
      <div className="container">
        <p className="section-eyebrow">{caseStudiesData.eyebrow}</p>
        <h2 className="section-title">{caseStudiesData.title}</h2>
        <p className="section-sub">{caseStudiesData.subtitle}</p>
        <CaseStudiesCarousel cards={cards} />
      </div>
    </section>
  );
};

interface CaseCard {
  image: { src: string; alt: string };
  images?: string[];
  video?: string;
  sub: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
}

function CaseImageSlideshow({ images, alt, hovering }: { images: string[]; alt: string; hovering: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hovering || images.length <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (!hovering) setActiveIndex(0);
      return;
    }
    setActiveIndex(1);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovering, images.length]);

  return (
    <div className="case-slideshow-wrap">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          className={`case-slide-img ${i === activeIndex ? "active" : ""}`}
        />
      ))}
      {images.length > 1 && hovering && (
        <div className="case-img-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`case-img-dot ${i === activeIndex ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCardItem({ card }: { card: CaseCard }) {
  const descRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const check = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
      setIsTruncated(el.scrollHeight > lineHeight * 4 + 2);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [card.description]);

  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, [expanded]);

  const handleCtaClick = (e: React.MouseEvent) => {
    if (isTruncated && !expanded) {
      e.preventDefault();
      e.stopPropagation();
      setExpanded(true);
    }
  };

  const embedUrl = getEmbedUrl(card.video || "");
  const validImages = (card.images || []).filter((s) => s && s.trim() !== "");
  const useSlideshow = !embedUrl && validImages.length > 0;
  const isNativeVideo = !embedUrl && !useSlideshow && VIDEO_RE.test(card.image.src);

  const inner = (
    <>
      <div
        className={`case-img${useSlideshow ? " case-img-slideshow" : ""}${embedUrl ? " case-img-video" : ""}`}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={card.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="case-embed-video"
          />
        ) : useSlideshow ? (
          <CaseImageSlideshow images={validImages} alt={card.image.alt} hovering={imgHovered} />
        ) : isNativeVideo ? (
          <>
            <video
              src={card.image.src}
              muted
              playsInline
              preload="metadata"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLVideoElement).play();
                const btn = e.currentTarget.nextElementSibling as HTMLElement;
                if (btn) btn.style.opacity = "0";
              }}
              onMouseLeave={(e) => {
                const v = e.currentTarget as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
                const btn = e.currentTarget.nextElementSibling as HTMLElement;
                if (btn) btn.style.opacity = "1";
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div className="case-play-btn">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
            </div>
          </>
        ) : (
          <img src={card.image.src} alt={card.image.alt} />
        )}
        <div className="case-overlay"></div>
        <div className="case-info">
          <span className="case-sub">{card.sub}</span>
          <h3>{card.title}</h3>
        </div>
      </div>
      <div className="case-body">
        {card.stats && card.stats.length > 0 && (
          <div className="case-stats">
            {card.stats.map((stat, i) => (
              <div key={i}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
        <div ref={descRef} className={`case-desc${expanded ? " case-desc-expanded" : ""}`}>
          {card.description.split(/\n\n|\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {isTruncated && !expanded && (
          <span className="case-cta" onClick={handleCtaClick}>More..</span>
        )}
      </div>
    </>
  );

  if (isTruncated && !expanded) {
    return (
      <div ref={cardRef} className={`case-card case-card-link${embedUrl ? " case-card-has-video" : ""}`} style={{ cursor: "pointer" }} onClick={handleCtaClick}>
        {inner}
      </div>
    );
  }

  return (
    <div ref={cardRef} className={`case-card case-card-link${embedUrl ? " case-card-has-video" : ""}`}>
      {inner}
    </div>
  );
}

function CaseStudiesCarousel({ cards }: { cards: CaseCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  const updateVisibleCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) setVisibleCount(1);
    else if (width < 768) setVisibleCount(2);
    else setVisibleCount(3);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  const maxIndex = Math.max(0, cards.length - visibleCount);

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clamped);
    if (trackRef.current) {
      const gap = 24;
      const trackWidth = trackRef.current.offsetWidth;
      const cardWidth = (trackWidth - gap * (visibleCount - 1)) / visibleCount;
      const scrollTarget = clamped * (cardWidth + gap);
      trackRef.current.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [maxIndex, visibleCount]);

  const prev = () => scrollTo(currentIndex - 1);
  const next = () => scrollTo(currentIndex + 1);

  return (
    <div className="case-carousel">
      <button
        className="carousel-arrow carousel-arrow-left"
        onClick={prev}
        disabled={currentIndex === 0}
        aria-label="Previous projects"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div className="case-track-wrapper">
        <div className="case-track" ref={trackRef}>
          {cards.map((card, i) => (
            <CaseCardItem key={i} card={card} />
          ))}
        </div>
      </div>

      <button
        className="carousel-arrow carousel-arrow-right"
        onClick={next}
        disabled={currentIndex >= maxIndex}
        aria-label="Next projects"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {maxIndex > 0 && (
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CaseStudiesSection;
