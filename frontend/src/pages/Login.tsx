import {type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../utils/apiError";
export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ||
    "/dashboard";

  const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");

  if (!email.trim() || !password) {
    const message =
      "Please enter your email and password.";

    setError(message);
    toast.error(message);
    return;
  }

  setLoading(true);

  try {
    await login(
      email.trim(),
      password
    );

    toast.success("Welcome back!");

    navigate(from, {
      replace: true,
    });
  } catch (error) {
    const message = getApiErrorMessage(
      error,
      "Invalid email or password"
    );

    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your NexManage account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-slate-900 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}