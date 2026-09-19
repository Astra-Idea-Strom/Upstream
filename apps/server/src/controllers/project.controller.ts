import { Request, Response } from 'express';
import * as firebaseService from '../services/firebase.service';
import type { SaveProjectResponse } from '@upstream/shared';

export const saveProject = async (req: Request, res: Response): Promise<void> => {
  // Support both { project: { ... } } and direct { ... } payload format
  const projectData = req.body?.project || req.body;

  if (!projectData || typeof projectData !== 'object') {
    res.status(400).json({
      error: 'INVALID_PAYLOAD',
      message: 'Project data is required in request body',
      statusCode: 400,
    });
    return;
  }

  const id = await firebaseService.saveProject(projectData);

  const response: SaveProjectResponse = {
    id,
    message: 'Project saved successfully',
  };

  res.status(201).json(response);
};

export const getProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      error: 'INVALID_ID',
      message: 'Project id parameter is required',
      statusCode: 400,
    });
    return;
  }

  const project = await firebaseService.getProject(id);

  if (!project) {
    res.status(404).json({
      error: 'NOT_FOUND',
      message: `Project with ID ${id} was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json(project);
};

export const listProjects = async (req: Request, res: Response): Promise<void> => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const projects = await firebaseService.listProjects(limit);
  res.status(200).json(projects);
};
