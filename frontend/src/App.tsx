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

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Clients */}
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

          {/* Projects */}
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

      {/* Default */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* 404 */}
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