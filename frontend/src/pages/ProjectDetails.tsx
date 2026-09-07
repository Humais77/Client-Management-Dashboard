import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Button from "../components/Button";
import Modal from "../components/Modal";

import api from "../services/api";

import type {
  Project,
  ProjectStatus,
} from "../types";

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
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await api.get(
          `/projects/${id}`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Unable to load project"
          );
        }

        setProject(response.data.project);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!project) {
      return;
    }

    setDeleting(true);

    try {
      const response = await api.delete(
        `/projects/${project._id}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Unable to delete project"
        );
      }

      navigate("/projects");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete project"
      );

      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">
            Unable to load project
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error || "Project not found."}
          </p>

          <Link
            to="/projects"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/projects"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Projects
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  {project.name}
                </h1>

                <StatusBadge
                  status={project.status}
                />
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Created{" "}
                {new Date(
                  project.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/projects/${project._id}/edit`}
              >
                <Button variant="secondary">
                  Edit
                </Button>
              </Link>

              <Button
                variant="danger"
                onClick={() =>
                  setDeleteOpen(true)
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Description
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {project.description}
            </p>
          </section>

          <aside className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Client
            </h2>

            {project.client ? (
              <div className="mt-4">
                <p className="font-semibold text-slate-900">
                  {project.client.name}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {project.client.company}
                </p>

                <a
                  href={`mailto:${project.client.email}`}
                  className="mt-3 block break-all text-sm text-slate-600 hover:text-slate-900 hover:underline"
                >
                  {project.client.email}
                </a>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No client information available.
              </p>
            )}
          </aside>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        title="Delete project?"
        description="This action cannot be undone. The project will be permanently removed."
        onClose={() =>
          !deleting && setDeleteOpen(false)
        }
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              setDeleteOpen(false)
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <Button
            variant="danger"
            loading={deleting}
            onClick={handleDelete}
          >
            Delete Project
          </Button>
        </div>
      </Modal>
    </div>
  );
}