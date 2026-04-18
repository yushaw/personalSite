import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description: "Things I'm building.",
  path: "/projects",
});

const projects = [
  {
    name: "Sanqian",
    description:
      "Your desktop Agent orchestration hub. Vendor-neutral, local-first, extensible. One interface for every AI model and every tool you use.",
    url: "https://sanqian.ai",
  },
  {
    name: "Note",
    description:
      "A note-taking app for deep thinking. Immersive writing with AI chat, bi-directional links, and full-text + semantic search.",
    url: "https://sanqian.ai/note",
  },
  {
    name: "Todo",
    description:
      "Minimal todo with outline thinking. Unlimited nesting, forecast view, and AI-assisted task management.",
    url: "https://sanqian.ai/todo",
  },
  {
    name: "Sati",
    description:
      "AI agent for browser and Office. Web automation, Excel plugin, seamless sync with desktop.",
    url: "https://sanqian.ai/sati",
  },
];

export default function ProjectsPage() {
  return (
    <div className="py-12">
      <h1 className="font-heading text-[36px] font-normal mb-10">
        Projects
      </h1>

      <ul>
        {projects.map((project) => (
          <li key={project.name}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block -mx-3 px-3 py-3 rounded-md hover:bg-hover transition-colors duration-150"
            >
              <h2 className="text-[15px] font-medium text-text mb-1">
                {project.name}
              </h2>
              <p className="text-[14px] text-muted leading-relaxed">
                {project.description}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
