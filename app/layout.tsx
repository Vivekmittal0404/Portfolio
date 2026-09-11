import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vivekmittalportfolio.netlify.app"),

  title: "Vivek Mittal | Full Stack Developer",

  description:
    "Vivek Mittal is a Full Stack Developer building modern web applications with React, Next.js, Node.js, TypeScript and MongoDB.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Vivek Mittal | Full Stack Developer",
    description: "Portfolio of Vivek Mittal — Full Stack Developer.",
    url: "https://vivekmittalportfolio.netlify.app",
    siteName: "Vivek Mittal",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vivek Mittal",
    url: "https://vivekmittalportfolio.netlify.app",
    jobTitle: "Full Stack Developer",
    description:
      "Full Stack Developer building modern web applications with React, Next.js, Node.js, TypeScript and MongoDB.",
    sameAs: [
      "https://github.com/Vivekmittal0404",
      "https://www.linkedin.com/in/vivek-mittal-1413a7430/",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {children}
      </body>
    </html>
  );
}
