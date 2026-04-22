import { createMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects-data";

export const metadata = createMetadata({
  title: "Projects",
  description: "Things I'm building.",
  path: "/projects",
});

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
