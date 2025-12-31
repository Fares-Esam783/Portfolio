import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fares Essam | Full Stack Developer",
    template: "%s | Fares Essam",
  },
  description:
    "Full Stack React & Django Developer crafting elegant, scalable web solutions. Based in Egypt, building for the world.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Django Developer",
    "PHP Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Egypt",
    "Fares Essam",
  ],
  authors: [{ name: "Fares Essam", url: "https://github.com/Fares-Esam783" }],
  creator: "Fares Essam",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Fares Essam | Full Stack Developer",
    description:
      "Full Stack React & Django Developer crafting elegant, scalable web solutions.",
    siteName: "Fares Essam Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fares Essam | Full Stack Developer",
    description:
      "Full Stack React & Django Developer crafting elegant, scalable web solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
