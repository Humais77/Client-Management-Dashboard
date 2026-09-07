export type ProjectStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  _id: string;
  user: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  user: string;
  client: Client;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  client: string;
  status: ProjectStatus;
}

export interface ClientFormData {
  name: string;
  email: string;
  company: string;
}