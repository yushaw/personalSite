import { socialLinks } from "@/lib/social-links";

export function Footer() {
  return (
    <footer className="py-16 mt-auto">
      <div className="flex items-center gap-3 text-sm text-muted">
        {socialLinks.map(({ href, label }, i) => (
          <span key={label} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden>·</span>}
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="hover:text-text transition-colors duration-150"
            >
              {label}
            </a>
          </span>
        ))}
      </div>
    </footer>
  );
}
