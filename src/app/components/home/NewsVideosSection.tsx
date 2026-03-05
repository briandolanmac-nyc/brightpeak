"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface NewsItem {
  title: string;
  summary: string;
  date: string;
  url: string;
  content?: string;
}

interface VideoItem {
  title: string;
  summary: string;
  image: string;
  date: string;
  url: string;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function getVideoInfo(url: string): { type: "iframe" | "native" | "link"; src: string } | null {
  if (!url || !url.trim()) return null;
  const ytId = getYouTubeId(url);
  if (ytId) return { type: "iframe", src: `https://www.youtube.com/embed/${ytId}?autoplay=1` };
  if (url.match(/facebook\.com|fb\.watch|instagram\.com|tiktok\.com/i)) return { type: "link", src: url };
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return { type: "native", src: url };
  if (url.startsWith("/") || url.startsWith("http")) return { type: "iframe", src: url };
  return null;
}

function VideoCard({ item }: { item: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const videoInfo = item.url ? getVideoInfo(item.url) : null;
  const hasImage = item.image && item.image.trim() !== "";
  const thumbSrc = hasImage ? item.image : (getYouTubeThumbnail(item.url) || "/images/news/news-default-banner.webp");

  const handlePlay = () => {
    if (!videoInfo) return;
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: "video_play", video_title: item.title || "", video_url: item.url || "" });
    }
    if (videoInfo.type === "link") {
      window.open(videoInfo.src, "_blank", "noopener,noreferrer");
    } else {
      setPlaying(true);
    }
  };

  return (
    <div className="nv-card nv-card-video">
      <div className="nv-card-img nv-card-embed">
        {playing && videoInfo && videoInfo.type !== "link" ? (
          videoInfo.type === "native" ? (
            <video autoPlay controls playsInline>
              <source src={videoInfo.src} />
            </video>
          ) : (
            <iframe
              src={videoInfo.src}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <div
            className="nv-thumbnail"
            onClick={handlePlay}
            style={{ cursor: videoInfo ? "pointer" : "default" }}
          >
            <img src={thumbSrc} alt={item.title} loading="lazy" />
            {videoInfo && <div className="nv-play-btn"><span>▶</span></div>}
          </div>
        )}
        <span className="nv-badge nv-badge-video">▶ Video</span>
      </div>
      <div className="nv-card-body">
        <span className="nv-date">{formatDate(item.date)}</span>
        <h3 className="nv-card-title">{item.title}</h3>
        <p className="nv-card-summary">{item.summary}</p>
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const check = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [item.summary]);

  return (
    <div className="nv-card">
      <div className="nv-card-news-bar">
        <span className="nv-badge nv-badge-news">📰 News</span>
      </div>
      <div className="nv-card-body">
        <span className="nv-date">{formatDate(item.date)}</span>
        <h3 className="nv-card-title">{item.title}</h3>
        <p ref={summaryRef} className={`nv-card-summary${expanded ? " nv-card-summary-expanded" : ""}`}>{item.summary}</p>
        {(isTruncated || expanded) && (
          <span
            className="nv-read-more"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: "pointer" }}
          >
            {expanded ? "Show Less ↑" : "Read More →"}
          </span>
        )}
      </div>
    </div>
  );
}

function NvCarousel({ children, label, itemCount }: { children: React.ReactNode; label: string; itemCount: number }) {
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

  const maxIndex = Math.max(0, itemCount - visibleCount);

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clamped);
    if (trackRef.current) {
      const cardWidth = trackRef.current.scrollWidth / itemCount;
      trackRef.current.scrollTo({ left: cardWidth * clamped, behavior: "smooth" });
    }
  }, [maxIndex, itemCount]);

  return (
    <div className="nv-carousel-section">
      <h3 className="nv-carousel-label">{label}</h3>
      <div className="nv-carousel">
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={() => scrollTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label={`Previous ${label}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        <div className="nv-track-wrapper">
          <div className="nv-track" ref={trackRef}>
            {children}
          </div>
        </div>

        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={() => scrollTo(currentIndex + 1)}
          disabled={currentIndex >= maxIndex}
          aria-label={`Next ${label}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {maxIndex > 0 && (
        <div className="carousel-dots" style={{ position: "relative", bottom: "auto", left: "auto", transform: "none", justifyContent: "center", marginTop: "1.5rem" }}>
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

const NewsVideosSection = ({ data }: { data: Record<string, unknown> }) => {
  const nvData = data as any;
  if (!nvData.enabled) return null;

  const newsItems: NewsItem[] = nvData.newsItems || [];
  const videoItems: VideoItem[] = nvData.videoItems || [];

  if (newsItems.length === 0 && videoItems.length === 0) return null;

  return (
    <section className="section news-videos-section" id="news-videos">
      <div className="container">
        <p className="section-eyebrow">{nvData.eyebrow}</p>
        <h2 className="section-title">{nvData.title}</h2>
        <p className="section-sub">{nvData.subtitle}</p>

        {videoItems.length > 0 && (
          <NvCarousel label="Videos" itemCount={videoItems.length}>
            {videoItems.map((item, i) => (
              <VideoCard key={`video-${i}`} item={item} />
            ))}
          </NvCarousel>
        )}

        {newsItems.length > 0 && (
          <NvCarousel label="News" itemCount={newsItems.length}>
            {newsItems.map((item, i) => (
              <NewsCard key={`news-${i}`} item={item} />
            ))}
          </NvCarousel>
        )}

      </div>
    </section>
  );
};

export default NewsVideosSection;
