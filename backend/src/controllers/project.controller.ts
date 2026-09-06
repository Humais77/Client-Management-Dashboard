import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { Client } from "../models/Client";
import { projectSchema } from "../schemas/project.schema";

export async function getProjects(
  req: Request,
  res: Response
): Promise<void> {
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : "";

  const status =
    typeof req.query.status === "string"
      ? req.query.status
      : "";

  const filter: Record<string, unknown> = {
    user: req.userId
  };

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      },
      {
        description: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  if (
    status === "Pending" ||
    status === "In Progress" ||
    status === "Completed"
  ) {
    filter.status = status;
  }

  const projects = await Project.find(filter)
    .populate("client", "name email company")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    projects
  });
}

export async function getProject(
  req: Request,
  res: Response
): Promise<void> {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID"
    });

    return;
  }

  const project = await Project.findOne({
    _id: req.params.id,
    user: req.userId
  }).populate(
    "client",
    "name email company"
  );

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found"
    });

    return;
  }

  res.json({
    success: true,
    project
  });
}

export async function createProject(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = projectSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid project data",
      errors: parsed.error.flatten()
    });

    return;
  }

  const client = await Client.findOne({
    _id: parsed.data.client,
    user: req.userId
  });

  if (!client) {
    res.status(404).json({
      success: false,
      message: "Client not found"
    });

    return;
  }

  const project = await Project.create({
    ...parsed.data,
    user: req.userId
  });

  await project.populate(
    "client",
    "name email company"
  );

  res.status(201).json({
    success: true,
    project
  });
}

export async function updateProject(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = projectSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid project data",
      errors: parsed.error.flatten()
    });

    return;
  }

  const client = await Client.findOne({
    _id: parsed.data.client,
    user: req.userId
  });

  if (!client) {
    res.status(404).json({
      success: false,
      message: "Client not found"
    });

    return;
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId
    },
    parsed.data,
    {
      new: true,
      runValidators: true
    }
  ).populate(
    "client",
    "name email company"
  );

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found"
    });

    return;
  }

  res.json({
    success: true,
    project
  });
}

export async function deleteProject(
  req: Request,
  res: Response
): Promise<void> {
  const project =
    await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found"
    });

    return;
  }

  res.json({
    success: true,
    message: "Project deleted successfully"
  });
}