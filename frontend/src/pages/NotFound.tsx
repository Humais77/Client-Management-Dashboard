import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-semibold text-slate-500">
          ERROR 404
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>

        <p className="mt-4 text-slate-500">
          The page you're looking for doesn't exist or may
          have been moved.
        </p>

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}