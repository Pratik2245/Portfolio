import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "John Doe - Full Stack Developer Portfolio",
  description:
    "Passionate full-stack developer crafting digital experiences with modern technologies. Specializing in React, Next.js, Node.js, and cloud solutions.",
  keywords:
    "full stack developer, react developer, next.js, node.js, portfolio, web development",
  authors: [{ name: "Pratik Paithankar" }],
  creator: "Pratik Paithankar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johndoe.dev",
    title: "John Doe - Full Stack Developer Portfolio",
    description:
      "Passionate full-stack developer crafting digital experiences with modern technologies.",
    siteName: "John Doe Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratik Paithankar - Full Stack Developer Portfolio",
    description:
      "Passionate full-stack developer crafting digital experiences with modern technologies.",
    creator: "@pratikpaithankar",
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
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
