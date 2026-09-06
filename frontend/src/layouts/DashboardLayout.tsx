import {
  Link,
  Outlet,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const {
    user,
    logout
  } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="text-xl font-bold text-slate-900"
          >
            NexManage
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}