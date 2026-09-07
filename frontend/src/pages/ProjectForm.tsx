import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

import api from "../services/api";

import type {
  Client,
  ProjectStatus,
} from "../types";

const statuses: ProjectStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [clients, setClients] = useState<Client[]>(
    []
  );

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] =
    useState<ProjectStatus>("Pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsResponse =
          await api.get("/clients");

        if (!clientsResponse.data.success) {
          throw new Error(
            clientsResponse.data.message ||
              "Unable to load clients"
          );
        }

        setClients(
          clientsResponse.data.clients || []
        );

        if (id) {
          const projectResponse =
            await api.get(`/projects/${id}`);

          if (!projectResponse.data.success) {
            throw new Error(
              projectResponse.data.message ||
                "Unable to load project"
            );
          }

          const project =
            projectResponse.data.project;

          setName(project.name);
          setDescription(project.description);
          setClient(
            project.client?._id ||
              project.client ||
              ""
          );
          setStatus(project.status);
        }
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

    loadData();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!client) {
      setError("Please select a client.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        description,
        client,
        status,
      };

      if (isEditing) {
        await api.put(
          `/projects/${id}`,
          payload
        );
      } else {
        await api.post(
          "/projects",
          payload
        );
      }

      navigate("/projects");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save project"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Loading project...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          to="/projects"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Projects
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          {isEditing
            ? "Edit Project"
            : "Create Project"}
        </h1>

        <p className="mt-2 text-slate-500">
          {isEditing
            ? "Update project information and status."
            : "Create a project and associate it with a client."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {clients.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold text-amber-900">
              Add a client first
            </h2>

            <p className="mt-1 text-sm text-amber-700">
              Every project must be associated with a client.
            </p>

            <Link
              to="/clients/new"
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Client
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              id="name"
              label="Project Name"
              type="text"
              placeholder="Company Website"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              minLength={2}
              maxLength={150}
            />

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe the project..."
                required
                minLength={2}
                maxLength={2000}
                rows={6}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />

              <p className="text-right text-xs text-slate-400">
                {description.length}/2000
              </p>
            </div>

            <Select
              id="client"
              label="Client"
              value={client}
              onChange={(event) =>
                setClient(event.target.value)
              }
              required
            >
              <option value="">
                Select a client
              </option>

              {clients.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name} — {item.company}
                </option>
              ))}
            </Select>

            <Select
              id="status"
              label="Status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as ProjectStatus
                )
              }
            >
              {statuses.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </Select>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <Button
                type="submit"
                loading={saving}
              >
                {isEditing
                  ? "Save Changes"
                  : "Create Project"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}