import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Button from "../components/Button";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";

import api from "../services/api";

import type {
  Project,
  ProjectStatus,
} from "../types";

const statuses: Array<
  "All" | ProjectStatus
> = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
];

export default function Projects() {
  const [projects, setProjects] = useState<
    Project[]
  >([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "All" | ProjectStatus
  >("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [projectToDelete, setProjectToDelete] =
    useState<Project | null>(null);

  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setError("");

      setLoading(true);

      const params: Record<string, string> = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== "All") {
        params.status = status;
      }

      const response = await api.get(
        "/projects",
        { params }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Unable to load projects"
        );
      }

      setProjects(
        response.data.projects || []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search, status]);

  const handleDelete = async () => {
    if (!projectToDelete) {
      return;
    }

    setDeleting(true);

    try {
      const response = await api.delete(
        `/projects/${projectToDelete._id}`
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Unable to delete project"
        );
      }

      setProjects((current) =>
        current.filter(
          (project) =>
            project._id !==
            projectToDelete._id
        )
      );

      setProjectToDelete(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete project"
      );
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Projects
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your projects, clients and project status.
          </p>
        </div>

        <Link to="/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <label
              htmlFor="project-search"
              className="sr-only"
            >
              Search projects
            </label>

            <input
              id="project-search"
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="project-status"
              className="sr-only"
            >
              Filter by status
            </label>

            <select
              id="project-status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "All"
                    | ProjectStatus
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              {statuses.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All statuses"
                    : item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchProjects}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No projects found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {search || status !== "All"
              ? "Try changing your search or filters."
              : "Create your first project to get started."}
          </p>

          {search || status !== "All" ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/projects/new"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create Project
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {projects.length}{" "}
              {projects.length === 1
                ? "project"
                : "projects"}{" "}
              found
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={setProjectToDelete}
              />
            ))}
          </div>
        </>
      )}

      <Modal
        open={Boolean(projectToDelete)}
        title="Delete project?"
        description="This action cannot be undone. The project will be permanently removed."
        onClose={() =>
          !deleting &&
          setProjectToDelete(null)
        }
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              setProjectToDelete(null)
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
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