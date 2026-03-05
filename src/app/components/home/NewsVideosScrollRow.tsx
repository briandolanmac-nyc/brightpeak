"use client";
import { useState, useRef, useEffect, useCallback } from "react";

export default function NewsVideosScrollRow({ children, label, itemCount }: { children: React.ReactNode; label: string; itemCount: number }) {
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
