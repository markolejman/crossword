import type { Metadata } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import "./globals.css";

const bubble = localFont({
  src: "./fonts/Starbim.ttf",
  variable: "--font-bubble",
  display: "swap",
  weight: "400",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "fun with words.",
  description: "Skapa professionella korsord enkelt och snabbt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${bubble.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
