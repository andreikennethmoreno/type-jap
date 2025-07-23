// app/base/layout.tsx
import { BreadcrumbBar } from "@/components/breadcrumb-bar";
import { Metadata } from "next";

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

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Breadcrumb container */}
      <div className="max-w-7xl mx-auto px-4">
        <BreadcrumbBar />
      </div>

      {/* Page content container */}
      <section className="max-w-7xl mx-auto px-4 py-4">{children}</section>
    </>
  );
}
