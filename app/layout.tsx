import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korsordsgenerator",
  description: "Skapa professionella korsord enkelt och snabbt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
