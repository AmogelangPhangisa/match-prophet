import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Match Prophet | AI Football Predictions",
  description: "AI-powered football match predictions. Get winner, score, first goal, corners, BTTS, cards and form analysis for Premier League, La Liga, Serie A, Bundesliga, Ligue 1 and Champions League.",
  keywords: "football predictions, soccer predictions, AI football, match predictions, premier league predictions, la liga predictions, champions league predictions, BTTS, over under, corners prediction",
  openGraph: {
    title: "Match Prophet | AI Football Predictions",
    description: "AI-powered football predictions — winner, score, corners, BTTS and more.",
    url: "https://footballprophet.vercel.app",
    siteName: "Match Prophet",
    type: "website",
    images: [
      {
        url: "https://footballprophet.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Match Prophet - AI Football Predictions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Match Prophet | AI Football Predictions",
    description: "AI-powered football predictions — winner, score, corners, BTTS and more.",
    images: ["https://footballprophet.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://footballprophet.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}