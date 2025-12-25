"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { buttonBase, buttonSizes, buttonVariants } from "./ui/button";

interface WaitlistButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function WaitlistButton({ 
  onClick, 
  variant = "primary", 
  size = "sm",
  className = ""
}: WaitlistButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
    >
      <span>Be the first to know</span>
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

export function WaitlistForm({ 
  showButton = false, 
  onButtonClick, 
  buttonVariant = "primary", 
  buttonSize = "sm",
  buttonClassName = ""
}: {
  showButton?: boolean;
  onButtonClick?: () => void;
  buttonVariant?: "primary" | "secondary";
  buttonSize?: "sm" | "md" | "lg";
  buttonClassName?: string;
} = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("submitting");
    setErrorMessage(null);
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.";
        setErrorMessage(msg);
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-primary font-medium p-4 bg-surface rounded-lg animate-in fade-in slide-in-from-bottom-2">
        <Check className="w-5 h-5" />
        <span>You&apos;re on the list! We&apos;ll be in touch. <span className="text-2xl">🍣</span></span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-foreground">
          Launching Early 2026
        </h3>
        <p className="text-muted-foreground">
          Be part of the journey and get exclusive early access.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {status === "error" && errorMessage ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") {
                setStatus("idle");
              }
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            required
            disabled={status === "submitting"}
            className="flex-1 h-12 rounded-full border border-surface-foreground/20 bg-surface/50 px-6 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`${buttonBase} ${buttonVariants.primary} ${buttonSizes.md} disabled:opacity-50 h-12 px-8 min-w-[140px]`}
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>

      {showButton && onButtonClick && (
        <div className="w-full max-w-lg">
          <WaitlistButton 
            onClick={onButtonClick} 
            variant={buttonVariant} 
            size={buttonSize} 
            className={buttonClassName} 
          />
        </div>
      )}
    </div>
  );
}

// Export WaitlistButton for external use
export { WaitlistButton };
