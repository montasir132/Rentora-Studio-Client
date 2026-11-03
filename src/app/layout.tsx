import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Use the Viewport configuration for theme-color
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7C0E44' },
    { media: '(prefers-color-scheme: dark)', color: '#F2DACE' },
  ],
};

export const metadata: Metadata = {
  title: "Rentora-Studio",
  description: "Rent. Create. Inspire. Rentora Studio is a creative studio rental marketplace that connects creators with inspiring spaces for photography, filmmaking, podcasting, music production, and creative workshops.",
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
