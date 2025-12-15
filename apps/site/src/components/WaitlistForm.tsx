"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function WaitlistForm() {
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg flex-col gap-2">
      {status === "error" && errorMessage ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
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
        className="flex-1 rounded-full border border-surface-foreground/20 bg-surface/50 px-6 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="group flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        <span>Be the first to know</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
      </div>
    </form>
  );
}
