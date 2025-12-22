"use client";

import { RefObject } from "react";

interface DescriptionCopyProps {
  cleanRef: RefObject<HTMLDivElement | null>;
  goRef: RefObject<HTMLDivElement | null>;
}

export function DescriptionCopy({ cleanRef, goRef }: DescriptionCopyProps) {
  return (
    <div className="max-w-5xl">
      <div ref={cleanRef} className="opacity-100 translate-y-0">
        <h2 className="text-4xl font-bold tracking-tight lg:text-[5rem] mb-6 text-center">
          <span className="text-primary">Eat Clean. Literally.</span>
        </h2>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground text-center">
          Forget chopsticks, soy sauce stains, and single-use plastic guilt. We&rsquo;ve replaced the messy balancing act of traditional takeout with a rigid, environmentally friendly push-tube that delivers a clean, perfect bite every time.
        </p>
      </div>

      <div ref={goRef} className="mt-16 opacity-0 translate-y-6">
        <h2 className="text-4xl font-bold tracking-tight lg:text-[5rem] mb-6 text-center">
          <span className="text-primary">Truly On The Go.</span>
        </h2>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground text-center">
          Built for commutes, meetings, and everything in between. Pop the cap, push your maki, and keep moving &mdash; no spills, no balancing act, no awkward mid-walk bites. It&rsquo;s sushi that fits your pace.
        </p>
      </div>
    </div>
  );
}
