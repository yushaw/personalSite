"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/writing", label: "writing" },
  { href: "/projects", label: "projects" },
  { href: "/play", label: "play" },
  { href: "/about", label: "about" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium text-text hover:text-text transition-colors duration-150"
      >
        <Image
          src="/avatar-64.png"
          alt="Charlie"
          width={28}
          height={28}
          className="rounded-full avatar-bg"
        />
        charlie
      </Link>
      <div className="flex items-center gap-6">
        {links.map(({ href, label }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors duration-150 ${
                isActive
                  ? "text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <ThemeToggle />
      </div>
    </nav>
  );
}
