import {
  Archivo_Black,
  Bricolage_Grotesque,
  Gaegu,
  JetBrains_Mono,
  Kalam,
  Mali,
  Ma_Shan_Zheng,
  Noto_Sans_Thai,
  Yomogi,
} from "next/font/google";
import type { Metadata, Viewport } from "next";
import { BackgroundBlobs } from "@/components/background-blobs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** Latin greetings (EN/ES/FR/DE/IT/PT) — upright hand (Caveat looked too italic) */
const handLatin = Kalam({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-hand-latin",
  display: "swap",
});

/** Thai — สวัสดี */
const handThai = Mali({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hand-thai",
  display: "swap",
});

/** Chinese — 你好 */
const handZh = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-zh",
  display: "swap",
});

/** Japanese — こんにちは */
const handJa = Yomogi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-ja",
  display: "swap",
});

/** Korean — 안녕하세요 */
const handKo = Gaegu({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-ko",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    absolute: "PUNtheerased",
  },
  description:
    "PUNtheerased — coming soon. Code, light, and a little chaos.",
  icons: {
    icon: [{ url: "/image/MeNoBG.png", type: "image/x-icon" }],
    shortcut: [{ url: "/image/MeNoBG.png", type: "image/x-icon" }],
    apple: [{ url: "/image/MeNoBG.png" }],
  },
  openGraph: {
    title: "PUNtheerased",
    description: "Coming soon — something new is taking shape.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF1F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1117" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${bricolage.variable} ${archivoBlack.variable} ${notoThai.variable} ${jetbrainsMono.variable} ${handLatin.variable} ${handThai.variable} ${handZh.variable} ${handJa.variable} ${handKo.variable} antialiased`}
      >
        <ThemeProvider>
          <BackgroundBlobs />
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
