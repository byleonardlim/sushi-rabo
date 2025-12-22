"use client";

import { useMemo, useRef } from "react";
import { ProductViewer } from "./ProductViewer";
import { DescriptionCopy } from "./DescriptionCopy";

export function DescriptionSection() {
  const cleanRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<HTMLDivElement>(null);

  const domRefs = useMemo(() => ({ cleanRef, goRef }), []);

  return (
    <section
      id="description-section"
      className="h-[100vh] relative z-10 bg-surface px-6 py-24 sm:py-32 overflow-hidden flex items-end justify-center"
    >
      <ProductViewer domRefs={domRefs} />
      <DescriptionCopy cleanRef={cleanRef} goRef={goRef} />
    </section>
  );
}
