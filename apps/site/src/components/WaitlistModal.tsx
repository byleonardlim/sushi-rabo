"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { WaitlistForm } from "./WaitlistForm";
import { X } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEvents";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current || !overlayRef.current || !contentRef.current) return;

    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (isOpen) {
      // Show modal
      modal.style.display = "flex";
      
      // Set initial states
      gsap.set(overlay, { opacity: 0 });
      gsap.set(content, { 
        opacity: 0,
        scale: 0.8,
        y: 50
      });

      // Animate in
      const tl = gsap.timeline();
      tl.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(content, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Animate out
      const tl = gsap.timeline();
      tl.to(content, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          modal.style.display = "none";
          // Restore body scroll
          document.body.style.overflow = "";
        }
      }, "-=0.2");
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEscapeKey(onClose, isOpen);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 hidden items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        ref={contentRef}
        className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Modal content */}
        <div className="w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/svg/sushi-rabo-brand.svg"
              alt="Sushi Rabo Logo"
              className="w-16 h-auto"
            />
          </div>
          
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
