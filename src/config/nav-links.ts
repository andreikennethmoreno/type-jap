import {
  LayoutDashboardIcon,
  BookOpenCheckIcon,
  LanguagesIcon,
} from "lucide-react";

export const navLinks = [
  {
    href: "/feature",
    label: "Feature",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/typing",
    label: "Typing",
    icon: BookOpenCheckIcon,
    children: [
      {
        href: "/typing/katakana",
        label: "Katakana → Romaji",
        icon: LanguagesIcon,
      },
      {
        href: "/typing/hiragana",
        label: "Hiragana → Romaji",
        icon: LanguagesIcon,
      },
      {
        href: "/typing/kanji",
        label: "Kanji → Romaji",
        icon: LanguagesIcon,
      },
    ],
  },
];
