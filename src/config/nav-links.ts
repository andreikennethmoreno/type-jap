import {
  LayoutDashboardIcon,
  SettingsIcon,
  ArrowRightLeft,
  TypeIcon,
  BookOpenCheckIcon,
  JapaneseYenIcon,
  LanguagesIcon,
} from "lucide-react";

export const navLinks = [
  {
    href: "/feature",
    label: "Feature",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/trainer",
    label: "Trainer",
    icon: BookOpenCheckIcon,
    children: [
      {
        href: "/trainer/katakana/english",
        label: "Katakana → English (Romaji)",
        icon: LanguagesIcon,
      },
      {
        href: "/trainer/katakana/meaning",
        label: "Katakana → English Meaning",
        icon: JapaneseYenIcon,
      },
      {
        href: "/trainer/hiragana/english",
        label: "Hiragana → English (Romaji)",
        icon: LanguagesIcon,
      },
      {
        href: "/trainer/kanji/recognition",
        label: "Kanji Recognition",
        icon: JapaneseYenIcon,
      },
    ],
  },
];
