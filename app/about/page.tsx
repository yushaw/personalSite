import { createMetadata } from "@/lib/metadata";
import { socialLinks } from "@/lib/social-links";

export const metadata = createMetadata({
  title: "About",
  description: "About Yu Xiao.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="py-12">
      <h1 className="font-heading text-[36px] font-normal mb-8">About</h1>

      <div className="space-y-4 text-[15px] text-muted leading-relaxed mb-12">
        <p>
          I&apos;m Yu Xiao, but you can call me Charlie. I build AI products.
        </p>
        <p>
          I care about turning ideas into real, working software. Not decks, not
          wireframes -- shipping products that people actually use. I write about
          the decisions behind the product: what to build, how to build it, and
          why.
        </p>
        <p>
          Currently building{" "}
          <a
            href="https://sanqian.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text underline underline-offset-3 decoration-muted hover:decoration-text transition-colors duration-150"
          >
            Sanqian
          </a>
          , a local-first AI assistant for your desktop.
        </p>
      </div>

      <section>
        <h2 className="text-xs font-medium uppercase tracking-[0.05em] text-muted mb-6">
          Connect
        </h2>
        <ul className="space-y-2 text-sm">
          {socialLinks.map(({ href, display }) => (
            <li key={href}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="text-muted hover:text-text transition-colors duration-150"
              >
                {display}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
