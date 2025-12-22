"use client";

import { useRef } from "react";
import { ProductViewer } from "./ProductViewer";
import { DescriptionCopy } from "./DescriptionCopy";

export function DescriptionSection() {
  const cleanRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="description-section"
      className="min-h-screen relative bg-surface px-6 py-24 sm:py-32 overflow-hidden"
    >
      <ProductViewer domRefs={{ cleanRef, goRef }} />
      <div className="mx-auto max-w-7xl relative z-10 h-full flex items-end lg:items-center justify-center">
        <DescriptionCopy cleanRef={cleanRef} goRef={goRef} />
      </div>
    </section>
  );
}
