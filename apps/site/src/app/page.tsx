import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { HeroAnimation } from "@/components/HeroAnimation";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <main className="flex-1">
        <HeroAnimation>
          <h1 className="text-6xl font-bold tracking-relaxed lg:text-[10rem] text-center">
            <span className="block text-primary">Engineer Your Perfect Bite.</span>
          </h1>
          
          <p className="mt-6 max-w-3xl text-xl text-center leading-8 text-muted-foreground">
            Forget the chopsticks. Build your custom maki and experience the &quot;Push-Pop&quot; revolution. Zero mess, maximum flavor, designed for the Singapore hustle.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 w-full">
            <WaitlistForm />
            <p className="text-sm text-muted-foreground">
              Launching Early 2026. Be part of the journey.
            </p>
          </div>
        </HeroAnimation>

        {/* Description Section */}
        {/*
        <section className="bg-surface px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Reimagining the Roll
                </h2>
                <p className="text-lg leading-8 text-muted-foreground">
                  We believe that great sushi shouldn't be complicated. Our innovative packaging and roll design allow you to enjoy premium quality sushi anywhere, anytime, without the need for chopsticks or soy sauce packets. It's clean, simple, and ready when you are.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-background/50 border border-border flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-4xl mb-2">🍣</div>
                  <div className="text-sm font-medium text-muted-foreground">Product Preview</div>
                  <div className="text-xs text-muted-foreground/60 mt-1">Coming Soon</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        */}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sushi Rabo. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <Link 
              href="https://instagram.com" 
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://twitter.com" 
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">X (Twitter)</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link 
              href="https://linkedin.com" 
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
