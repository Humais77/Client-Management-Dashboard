import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import type {
  Project,
  ProjectStatus,
} from "../types";
import { useAuth } from "../context/AuthContext";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
}

function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ProjectStatus;
}) {
  const styles: Record<ProjectStatus, string> = {
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    "In Progress":
      "bg-blue-50 text-blue-700 border-blue-200",
    Completed:
      "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");

        if (response.data.success) {
          setProjects(response.data.projects || []);
        }
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

    fetchProjects();
  }, []);

  const pending = projects.filter(
    (project) => project.status === "Pending"
  ).length;

  const inProgress = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completed = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your projects.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={projects.length}
          description="All your projects"
        />

        <StatCard
          title="Pending"
          value={pending}
          description="Waiting to start"
        />

        <StatCard
          title="In Progress"
          value={inProgress}
          description="Currently active"
        />

        <StatCard
          title="Completed"
          value={completed}
          description="Successfully completed"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest project activity
            </p>
          </div>

          <Link
            to="/projects"
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            View all projects →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading projects...
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-medium text-slate-900">
              No projects yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first project to get started.
            </p>

            <Link
              to="/projects/new"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentProjects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="flex flex-col gap-3 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium text-slate-900">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {project.client?.company ||
                      project.client?.name ||
                      "No client"}
                  </p>
                </div>

                <StatusBadge status={project.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}