import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { HeroAnimation } from "@/components/HeroAnimation";
import { DescriptionSection } from "@/components/DescriptionSection";

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
        <DescriptionSection />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border bg-background py-12">
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
