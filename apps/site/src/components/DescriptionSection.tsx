"use client";

import { useMemo, useRef } from "react";
import { ProductViewer } from "./ProductViewer";

export function DescriptionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cleanRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<HTMLDivElement>(null);

  const domRefs = useMemo(() => ({ cleanRef, goRef }), []);

  return (
    <section
      ref={sectionRef}
      id="description-section"
      className="h-screen relative z-10 bg-surface px-6 py-24 sm:py-32 overflow-hidden flex items-end justify-center"
    >
      <ProductViewer domRefs={domRefs} triggerRef={sectionRef} />
      <div className="max-w-6xl mx-auto grid relative z-20 pointer-events-none">
        <div ref={cleanRef} className="opacity-100 translate-y-0 col-start-1 row-start-1 pointer-events-auto">
          <h2 className="text-4xl font-bold tracking-tight lg:text-[5rem] mb-6 text-center">
            <span className="text-primary">Eat Clean. Literally.</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg leading-8 text-muted-foreground text-center">
            Forget chopsticks and soy sauce smears. We&rsquo;ve replaced the messy balancing act of traditional takeout with a rigid, hustle-friendly push-tube that delivers a clean, perfect bite every time.
          </p>
        </div>

        <div ref={goRef} className="opacity-0 translate-y-6 col-start-1 row-start-1 pointer-events-auto">
          <h2 className="text-4xl font-bold tracking-tight lg:text-[5rem] mb-6 text-center">
            <span className="text-primary">Truly On The Go.</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg leading-8 text-muted-foreground text-center">
            Built for commutes, meetings, and everything in between. Pop the cap, push your maki, and keep moving &mdash; no spills, no balancing act, no awkward mid-walk bites. It&rsquo;s the sushi that fits your pace.
          </p>
        </div>
      </div>
    </section>
  );
}
