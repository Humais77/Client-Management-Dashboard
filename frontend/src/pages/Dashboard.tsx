import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import { api } from "../services/api";
import {
  type Project
} from "../types";

export default function Dashboard() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const response =
        await api.get("/projects");

      setProjects(
        response.data.projects
      );
    } finally {
      setLoading(false);
    }
  }

  const total =
    projects.length;

  const pending =
    projects.filter(
      (project) =>
        project.status === "Pending"
    ).length;

  const inProgress =
    projects.filter(
      (project) =>
        project.status === "In Progress"
    ).length;

  const completed =
    projects.filter(
      (project) =>
        project.status === "Completed"
    ).length;

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your projects.
          </p>
        </div>

        <Link
          to="/projects/new"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white"
        >
          + New Project
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={total}
        />

        <StatCard
          label="Pending"
          value={pending}
        />

        <StatCard
          label="In Progress"
          value={inProgress}
        />

        <StatCard
          label="Completed"
          value={completed}
        />
      </div>

      <div className="mt-8 rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-semibold">
            Recent Projects
          </h2>

          <Link
            to="/projects"
            className="text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No projects yet.
          </div>
        ) : (
          <div className="divide-y">
            {projects
              .slice(0, 5)
              .map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-5 hover:bg-slate-50"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <h3 className="font-medium">
                        {project.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {project.client.company}
                      </p>
                    </div>

                    <StatusBadge
                      status={project.status}
                    />
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status
}: {
  status: string;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
      {status}
    </span>
  );
}