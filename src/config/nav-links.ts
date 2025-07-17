import {
  LayoutDashboardIcon,
  SettingsIcon,
  ArrowRightLeft,
  TypeIcon,
} from "lucide-react";

export const navLinks = [
  {
    href: "/feature",
    label: "Feature",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/convert",
    label: "Convert",
    icon: ArrowRightLeft,
    children: [
      {
        href: "/convert/uppercase-text",
        label: "Uppercase",
        icon: TypeIcon,
      },
      {
        href: "/convert/reverse-text",
        label: "Reverse Text",
        icon: TypeIcon,
      },
    ],
  },
];
