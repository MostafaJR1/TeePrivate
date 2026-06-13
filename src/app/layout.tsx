import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configure display font centrally to prevent layout flashes [1.1.9]
const spaceGrotesk = Nunito({
  variable: "--font-space-nunito",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "TeePrivate - Morocco Print On Demand",
  description: "Create, automate, and sell premium merchandise without inventory across Morocco.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} black-bg h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
          {children}
      </body>
    </html>
  );
}