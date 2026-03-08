"use client";
import { useState, useRef, useEffect } from "react";
import { sanitizeHtml } from "../../lib/sanitize";

interface NewsVideoPageItem {
  title: string;
  summary: string;
  image: string;
  date: string;
  url: string;
  content?: string;
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

export function VideoPageCard({ item }: { item: NewsVideoPageItem }) {
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
    <div className="nv-page-card">
      <div className={`nv-page-card-img${videoInfo ? " nv-page-card-embed" : ""}`}>
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
            className={videoInfo ? "nv-thumbnail" : undefined}
            onClick={handlePlay}
            style={videoInfo ? { cursor: "pointer", width: "100%", height: "100%" } : undefined}
          >
            <img src={thumbSrc} alt={item.title} loading="lazy" />
            {videoInfo && <div className="nv-play-btn"><span>▶</span></div>}
          </div>
        )}
        <span className="nv-badge nv-badge-video">▶ Video</span>
      </div>
      <div className="nv-page-card-body">
        <span className="nv-date">{formatDate(item.date)}</span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0.5rem 0", color: "var(--text-primary)" }}>
          {item.title}
        </h2>
        {item.summary && (
          <div className="nv-rich-content" style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: item.content ? "0.5rem" : "1rem", fontStyle: "italic" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.summary) }} />
        )}
        {item.content && (
          <div className="nv-rich-content" style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }} />
        )}
      </div>
    </div>
  );
}

export function NewsPageCard({ item }: { item: NewsVideoPageItem }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [item.content, item.summary]);

  return (
    <div className="nv-page-card">
      <div className="nv-card-news-bar">
        <span className="nv-badge nv-badge-news">📰 News</span>
      </div>
      <div className="nv-page-card-body">
        <span className="nv-date">{formatDate(item.date)}</span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0.5rem 0", color: "var(--text-primary)" }}>
          {item.title}
        </h2>
        {item.summary && (
          <div className="nv-rich-content" style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: item.content ? "0.5rem" : "1rem", fontStyle: "italic" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.summary) }} />
        )}
        {item.content && (
          <div ref={contentRef} className={`nv-card-content${expanded ? " nv-card-content-expanded" : ""}`} style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }} />
        )}
        {(isTruncated || expanded) && (
          <span
            className="nv-read-more"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: "pointer", display: "inline-block" }}
          >
            {expanded ? "Show Less ↑" : "Read More →"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function NewsVideoPageCard({ item, kind }: { item: NewsVideoPageItem; kind: "news" | "video" }) {
  if (kind === "video") return <VideoPageCard item={item} />;
  return <NewsPageCard item={item} />;
}
