import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ADNEO - Premium Domain Finder",
  description:
    "Find premium available domains faster than anywhere else. Generate, filter, and discover available domain names with AI-powered suggestions.",
  keywords: [
    "domain finder",
    "domain search",
    "premium domains",
    "domain generator",
    "available domains",
  ],
  authors: [{ name: "ADNEO" }],
  openGraph: {
    title: "ADNEO - Premium Domain Finder",
    description: "Find premium available domains faster than anywhere else.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
