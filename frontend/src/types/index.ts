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
  name: string;
  email: string;
  company: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  client: Client;
  createdAt: string;
  updatedAt: string;
}