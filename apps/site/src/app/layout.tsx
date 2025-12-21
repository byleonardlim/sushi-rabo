import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sushirabo.com",
  ),
  title: {
    default: "Sushi Rabo",
    template: "%s | Sushi Rabo",
  },
  description: "Engineer your perfect bite.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Sushi Rabo",
    description: "Engineer your perfect bite.",
    type: "website",
    siteName: "Sushi Rabo",
    url: "/",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushi Rabo",
    description: "Engineer your perfect bite.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sushirabo.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sushi Rabo",
    url: siteUrl,
    description: "Engineer your perfect bite.",
  };

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased overflow-x-hidden`}
      >
        <script
          defer
          src="https://cdn.overtracking.com/t/tSBhikuuVbm46HnIJ/"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
