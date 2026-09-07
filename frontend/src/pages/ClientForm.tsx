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
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../utils/apiError";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(
    isEditing
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchClient = async () => {
      try {
        const response = await api.get(
          `/clients/${id}`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Unable to load client"
          );
        }

        const client = response.data.client;

        setName(client.name);
        setEmail(client.email);
        setCompany(client.company);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load client"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");
  setSaving(true);

  try {
    if (isEditing) {
      await api.put(`/clients/${id}`, {
        name,
        email,
        company,
      });

      toast.success("Client updated successfully");
    } else {
      await api.post("/clients", {
        name,
        email,
        company,
      });

      toast.success("Client created successfully");
    }

    navigate("/clients");
  } catch (error) {
    const message = getApiErrorMessage(
      error,
      "Unable to save client"
    );

    setError(message);
    toast.error(message);
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Loading client...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          to="/clients"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Clients
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          {isEditing
            ? "Edit Client"
            : "Add Client"}
        </h1>

        <p className="mt-2 text-slate-500">
          {isEditing
            ? "Update the client's information."
            : "Add a new client to your account."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            id="name"
            label="Client Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            minLength={2}
            maxLength={100}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="client@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <Input
            id="company"
            label="Company"
            type="text"
            placeholder="Acme Corporation"
            value={company}
            onChange={(event) =>
              setCompany(event.target.value)
            }
            required
            minLength={2}
            maxLength={150}
          />

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <Link
              to="/clients"
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
                : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}