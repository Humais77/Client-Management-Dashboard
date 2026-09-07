import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";

import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";
import ProjectDetails from "./pages/ProjectDetails";

import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

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
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/clients"
            element={<Clients />}
          />

          <Route
            path="/clients/new"
            element={<ClientForm />}
          />

          <Route
            path="/clients/:id/edit"
            element={<ClientForm />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/new"
            element={<ProjectForm />}
          />

          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="/projects/:id/edit"
            element={<ProjectForm />}
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
        element={<NotFound />}
      />
    </Routes>
  );
}