import { Link } from "react-router-dom";

import type {
  Project,
  ProjectStatus,
} from "../types";

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
}

function StatusBadge({
  status,
}: {
  status: ProjectStatus;
}) {
  const styles: Record<ProjectStatus, string> = {
    Pending:
      "border-amber-200 bg-amber-50 text-amber-700",

    "In Progress":
      "border-blue-200 bg-blue-50 text-blue-700",

    Completed:
      "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

function ActionButton({
  children,
  onClick,
  variant = "default",
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProjectCard({
  project,
  onDelete,
}: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to={`/projects/${project._id}`}
            className="text-lg font-semibold text-slate-900 hover:underline"
          >
            {project.name}
          </Link>

          <p className="mt-1 text-sm text-slate-500">
            {project.client?.company ||
              project.client?.name ||
              "No client"}
          </p>
        </div>

        <StatusBadge status={project.status} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {project.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Created{" "}
          {new Date(
            project.createdAt
          ).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-1">
          <Link
            to={`/projects/${project._id}`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            View
          </Link>

          <Link
            to={`/projects/${project._id}/edit`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Edit
          </Link>

          <ActionButton
            variant="danger"
            onClick={() => onDelete(project)}
          >
            Delete
          </ActionButton>
        </div>
      </div>
    </article>
  );
}