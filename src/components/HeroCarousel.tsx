import React, { useEffect, useRef, useState } from 'react';

interface SlideItem {
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface HeroCarouselProps {
  slides?: SlideItem[];
  intervalMs?: number;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: `${import.meta.env.BASE_URL}hero-image-2.jpg`,
    alt: 'Learn flute hero 1',
    title: 'Learn Flute',
    subtitle: 'Find your breath and tunes',
  },
  {
    image: `${import.meta.env.BASE_URL}hero-image-3.jpg`,
    alt: 'Learn flute hero 2',
    title: 'Classical • Contemporary • Devotional',
    subtitle: 'Guided by experienced mentors',
  },
  {
    image: `${import.meta.env.BASE_URL}Toppic.jpg`,
    alt: 'Krishna Flute Academy',
    title: 'Krishna Flute Academy',
    subtitle: 'Start your musical journey today',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides = DEFAULT_SLIDES, intervalMs = 5000 }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, slides.length, isPaused]);

  // Keyboard accessibility
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % slides.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [slides.length]);

  // Touch swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const deltaX = e.touches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > 60) {
        if (deltaX < 0) setCurrent((c) => (c + 1) % slides.length);
        else setCurrent((c) => (c - 1 + slides.length) % slides.length);
        touchStartX.current = null;
      }
    };
    const onTouchEnd = () => {
      touchStartX.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart as EventListener);
      el.removeEventListener('touchmove', onTouchMove as EventListener);
      el.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [slides.length]);

  return (
    <section className="relative pt-16 md:pt-20 overflow-hidden">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative w-full flex-shrink-0">
              {/* The media box with responsive heights */}
              <div className="relative w-full h-[220px] sm:h-[340px] md:h-[460px] lg:h-[560px]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

                {(slide.title || slide.subtitle) && (
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
                    <div className="max-w-6xl mx-auto">
                      {slide.title && (
                        <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold drop-shadow">
                          {slide.title}
                        </h1>
                      )}
                      {slide.subtitle && (
                        <p className="mt-2 text-blue-50 text-sm sm:text-base md:text-xl drop-shadow">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                current === i ? 'w-6 bg-white' : 'w-2.5 bg-white/60'
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Prev/Next (visible on hover on desktop) */}
        <button
          aria-label="Previous slide"
          className="hidden md:flex absolute inset-y-0 left-2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/60"
          onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          className="hidden md:flex absolute inset-y-0 right-2 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/60"
          onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        >
          ›
        </button>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
    </section>
  );
};

export default HeroCarousel;
