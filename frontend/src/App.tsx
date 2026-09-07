import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function Placeholder({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        This section will be implemented in the next phase.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          element={<DashboardLayout />}
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects"
            element={
              <Placeholder title="Projects" />
            }
          />

          <Route
            path="/projects/new"
            element={
              <Placeholder title="Create Project" />
            }
          />

          <Route
            path="/projects/:id"
            element={
              <Placeholder title="Project Details" />
            }
          />

          <Route
            path="/clients"
            element={
              <Placeholder title="Clients" />
            }
          />

          <Route
            path="/clients/new"
            element={
              <Placeholder title="Create Client" />
            }
          />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}