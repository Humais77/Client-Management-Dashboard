import { Request, Response } from "express";
import { Client } from "../models/Client";
import { Project } from "../models/Project";
import { clientSchema } from "../schemas/client.schema";
import mongoose from "mongoose";

export async function getClients(
  req: Request,
  res: Response
): Promise<void> {
  const clients = await Client.find({
    user: req.userId
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    clients
  });
}

export async function createClient(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = clientSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid client data",
      errors: parsed.error.flatten()
    });

    return;
  }

  const client = await Client.create({
    ...parsed.data,
    user: req.userId
  });

  res.status(201).json({
    success: true,
    client
  });
}

export async function getClient(
  req: Request,
  res: Response
): Promise<void> {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({
      success: false,
      message: "Invalid client ID"
    });

    return;
  }

  const client = await Client.findOne({
    _id: req.params.id,
    user: req.userId
  });

  if (!client) {
    res.status(404).json({
      success: false,
      message: "Client not found"
    });

    return;
  }

  res.json({
    success: true,
    client
  });
}

export async function updateClient(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = clientSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid client data",
      errors: parsed.error.flatten()
    });

    return;
  }

  const client = await Client.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId
    },
    parsed.data,
    {
      new: true,
      runValidators: true
    }
  );

  if (!client) {
    res.status(404).json({
      success: false,
      message: "Client not found"
    });

    return;
  }

  res.json({
    success: true,
    client
  });
}

export async function deleteClient(
  req: Request,
  res: Response
): Promise<void> {
  const client = await Client.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
  });

  if (!client) {
    res.status(404).json({
      success: false,
      message: "Client not found"
    });

    return;
  }

  await Project.deleteMany({
    client: client._id,
    user: req.userId
  });

  res.json({
    success: true,
    message: "Client and associated projects deleted"
  });
}