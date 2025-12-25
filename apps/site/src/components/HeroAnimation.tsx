'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroAnimation({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const introLogoRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [assetsProgress, setAssetsProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const isIntro = !animationComplete;

  const setLogoNode = useCallback((node: HTMLImageElement | null) => {
    logoRef.current = node;
    if (node?.complete) setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reset scroll position and disable browser scroll restoration to ensure
    // the intro animation starts from the top and calculations are correct.
    window.scrollTo(0, 0);
    if (window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const onAssetsLoaded = () => setAssetsLoaded(true);
    
    // Check if assets already loaded and set state in callback
    if ((window as unknown as { sushiRaboAssetsLoaded?: boolean }).sushiRaboAssetsLoaded) {
      // Use setTimeout to defer setState until after effect execution
      setTimeout(() => setAssetsLoaded(true), 0);
    }
    
    window.addEventListener('sushi-rabo-assets-loaded', onAssetsLoaded);

    const onAssetsProgress = (e: Event) => {
      const customEvent = e as CustomEvent<{ progress?: number }>;
      const p = customEvent.detail?.progress;
      if (typeof p === 'number') setAssetsProgress(p);
    };
    window.addEventListener('sushi-rabo-assets-progress', onAssetsProgress);

    return () => {
      window.removeEventListener('sushi-rabo-assets-loaded', onAssetsLoaded);
      window.removeEventListener('sushi-rabo-assets-progress', onAssetsProgress);
      if (window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    if (!animationComplete) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      // Refresh ScrollTrigger to ensure positions are correct after scroll unlock
      // Small timeout to allow layout to settle
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [animationComplete]);

  useEffect(() => {
    // Only run animation logic if window exists and required assets are loaded
    if (typeof window === "undefined" || !isLoaded || !assetsLoaded) return;
    
    // Small timeout to ensure layout is settled after image load
    const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
            if (!introLogoRef.current || !logoRef.current || !containerRef.current) return;

            const introEl = introLogoRef.current;
            const targetEl = logoRef.current;

            gsap.set(targetEl, { autoAlpha: 0, scale: 0.6, transformOrigin: 'center center' });

            const introRect = introEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();

            const dx = targetRect.left - introRect.left;
            const dy = targetRect.top - introRect.top;
            const scale = introRect.width ? targetRect.width / introRect.width : 1;

            gsap.set(introEl, {
                position: 'fixed',
                left: introRect.left,
                top: introRect.top,
                margin: 0,
                transformOrigin: 'top left',
                willChange: 'transform, opacity',
                zIndex: 30,
            });

            const tl = gsap.timeline();

            tl.to(introEl, {
                x: dx,
                y: dy,
                scale,
                ease: 'power3.inOut',
                duration: 1.1,
            })
            .fromTo(
                overlayRef.current,
                { autoAlpha: 1, backdropFilter: 'blur(20px)' },
                { autoAlpha: 0, backdropFilter: 'blur(0px)', ease: 'power2.inOut', duration: 0.9 },
                '<'
            )
            .fromTo(
                contentRef.current,
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.8 },
                '-=0.55'
            )
            .add(() => {
                gsap.set(targetEl, { autoAlpha: 1, scale: 0.6, transformOrigin: 'center center' });
                gsap.set(introEl, { autoAlpha: 0 });
            })
            .eventCallback('onComplete', () => setAnimationComplete(true));

        }, containerRef);

        return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded, assetsLoaded]); // Depend on loading signals

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-24 lg:pt-16 pb-10 z-10">
      {/* Background Gradient (revealed as overlay fades) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,var(--surface)_0%,transparent_100%)] opacity-30" />

      {/* Overlay for the 'blur fade' effect */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-0 bg-background/20 pointer-events-none backdrop-blur-sm" // Added slight tint for better blur visibility
        style={{ opacity: 1 }} // Initial state before hydration/GSAP takes over
      >
      </div>

      {isIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Gradient Loader Indicator */}
          <div 
            className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle,var(--color-primary)_0%,transparent_100%)] rounded-full blur-3xl transition-all duration-300 ease-out -z-10"
            style={{ 
              opacity: assetsLoaded ? 0 : Math.max(0.1, assetsProgress / 100 * 0.3), // Max opacity 0.3 to keep it subtle
              transform: `scale(${0.5 + (assetsProgress / 100) * 0.5})` 
            }}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={introLogoRef}
            src="/assets/svg/sushi-rabo-brand.svg"
            alt="Sushi Rabo Logo"
            className="w-24 sm:w-36 md:w-[15vw] max-w-[240px] h-auto block"
          />
        </div>
      )}

      <div className="z-10 flex flex-col items-center w-full max-w-7xl px-6 relative">
        {/* Logo Wrapper */}
        <div className="relative z-20 mb-8 sm:mb-12 origin-center">
             {/* Using simple img tag for GSAP compatibility and ref handling simplicity */}
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
                ref={setLogoNode}
                src="/assets/svg/sushi-rabo-brand.svg"
                alt="Sushi Rabo Logo"
                className="w-24 sm:w-36 md:w-[15vw] max-w-[240px] h-auto block invisible" 
                onLoad={() => setIsLoaded(true)}
             />
        </div>

        {/* Hero Content (passed as children) */}
        <div ref={contentRef} className="w-full flex flex-col justify-center items-center opacity-0">
            {children}
        </div>
      </div>
    </div>
  );
}
