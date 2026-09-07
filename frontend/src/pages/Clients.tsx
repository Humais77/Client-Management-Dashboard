import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Button from "../components/Button";
import Modal from "../components/Modal";
import api from "../services/api";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../utils/apiError";
import type { Client } from "../types";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clientToDelete, setClientToDelete] =
    useState<Client | null>(null);

  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    try {
      setError("");

      const response = await api.get("/clients");

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Unable to load clients"
        );
      }

      setClients(response.data.clients || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load clients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async () => {
  if (!clientToDelete) {
    return;
  }

  setDeleting(true);

  try {
    const response = await api.delete(
      `/clients/${clientToDelete._id}`
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
          "Unable to delete client"
      );
    }

    setClients((current) =>
      current.filter(
        (client) =>
          client._id !== clientToDelete._id
      )
    );

    setClientToDelete(null);

    toast.success("Client deleted successfully");
  } catch (error) {
    const message = getApiErrorMessage(
      error,
      "Unable to delete client"
    );

    setError(message);
    toast.error(message);
  } finally {
    setDeleting(false);
  }
};

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Clients
          </h1>

          <p className="mt-2 text-slate-500">
            Manage the clients associated with your projects.
          </p>
        </div>

        <Link to="/clients/new">
          <Button>Add Client</Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchClients}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Loading clients...
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No clients yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add your first client to start creating projects.
          </p>

          <Link
            to="/clients/new"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Client
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {client.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Added{" "}
                        {new Date(
                          client.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {client.company}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {client.email}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/clients/${client._id}/edit`}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setClientToDelete(client)
                          }
                          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(clientToDelete)}
        title="Delete client?"
        description="This action cannot be undone. Associated projects will also be removed."
        onClose={() =>
          !deleting && setClientToDelete(null)
        }
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              setClientToDelete(null)
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
            Delete Client
          </Button>
        </div>
      </Modal>
    </div>
  );
}