'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function HeroAnimation({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if image is already loaded (e.g. from cache)
    if (logoRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Only run animation logic if window exists and image is loaded
    if (typeof window === "undefined" || !isLoaded) return;
    
    // Small timeout to ensure layout is settled after image load
    const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
            if (!logoRef.current || !containerRef.current) return;

            // Function to calculate the Y offset to center the logo
            // using offsetTop is safer as it's relative to the container and ignores scroll/transforms
            const getCenterOffset = () => {
                if (!logoRef.current || !containerRef.current) return 0;
                
                const windowHeight = window.innerHeight;
                const centerY = windowHeight / 2;
                
                // Calculate logo's top relative to the container by traversing offsetParents
                let logoTop = 0;
                let el = logoRef.current as HTMLElement | null;
                while (el && el !== containerRef.current) {
                    logoTop += el.offsetTop;
                    el = el.offsetParent as HTMLElement;
                }
                
                const logoHeight = logoRef.current.offsetHeight;
                const logoCenterY = logoTop + (logoHeight / 2);
                
                // The container is usually pinned at top:0, so container coordinates map well to viewport
                // However, we want the translation Y that moves the logo from Natural to Center.
                // Current pos: logoCenterY. Target pos: centerY.
                // Delta = Target - Current
                return centerY - logoCenterY;
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=100%", // 100vh scroll distance
                    scrub: 1, // Smooth scrubbing
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true, // Recalculate functional values on resize
                }
            });

            tl.fromTo(logoRef.current, 
                {
                    scale: 1.5, 
                    y: getCenterOffset, // Use function for dynamic calculation
                },
                {
                    scale: 0.6,
                    y: 0,
                    ease: "power2.inOut",
                    duration: 1
                }
            )
            .fromTo(overlayRef.current,
                { autoAlpha: 1, backdropFilter: "blur(20px)" },
                { autoAlpha: 0, backdropFilter: "blur(0px)", ease: "power2.inOut", duration: 0.8 },
                "<"
            )
            .fromTo(contentRef.current,
                { autoAlpha: 0, y: 50 },
                { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.8 },
                "-=0.6"
            );

        }, containerRef);

        return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded]); // Depend on isLoaded

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-10 z-10">
      {/* Background Gradient (revealed as overlay fades) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,var(--surface)_0%,transparent_100%)] opacity-30" />

      {/* Overlay for the 'blur fade' effect */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-0 bg-background/20 pointer-events-none" // Added slight tint for better blur visibility
        style={{ opacity: 1 }} // Initial state before hydration/GSAP takes over
      />

      <div className="z-10 flex flex-col items-center w-full max-w-7xl px-6 relative">
        {/* Logo Wrapper */}
        <div className="relative z-20 mb-8 sm:mb-12 origin-center">
             {/* Using simple img tag for GSAP compatibility and ref handling simplicity */}
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
                ref={logoRef}
                src="/assets/svg/sushi-rabo-brand.svg"
                alt="Sushi Rabo Logo"
                className="w-24 sm:w-36 md:w-[15vw] max-w-[240px] h-auto block" 
                style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.2s' }} 
                onLoad={() => setIsLoaded(true)}
             />
        </div>

        {/* Hero Content (passed as children) */}
        <div ref={contentRef} className="w-full flex flex-col items-center opacity-0">
            {children}
        </div>
      </div>
    </div>
  );
}
