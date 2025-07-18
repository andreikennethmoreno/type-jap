import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeNihongo — Learn Japanese by Typing & Recall",
  description:
    "Master Japanese through active recall, typing in Romaji, Kana, and Kanji. TypeNihongo helps you reinforce grammar, vocab, and more — the smart, interactive way.",
  keywords: [
    "Japanese learning",
    "Romaji to Kana",
    "Active recall app",
    "JLPT practice",
    "Learn Japanese typing",
    "Spaced repetition",
    "Kana drills",
    "Type to learn",
    "Japanese e-learning",
    "Nihongo app",
  ],
  authors: [{ name: "Kenn", url: "https://your-portfolio-or-link.com" }],
  creator: "Kenn",
  openGraph: {
    title: "TypeNihongo — Learn Japanese by Typing",
    description:
      "Interactive Japanese e-learning with active recall, typing drills, and grammar guessing. Learn faster, smarter.",
    url: "https://your-app-url.com",
    siteName: "TypeNihongo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TypeNihongo — Learn Japanese Fast",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <Navbar />

            <main className="py-8">
              {/* container to center the content */}
              <div className="max-w-7xl mx-auto px-4">
                <div>{children}</div>
              </div>
            </main>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
