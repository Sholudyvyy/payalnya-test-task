import type { Project } from '@/types/Project'
import { client, getData } from '../utils/httpClient'

export const getProjects = async () => {
  return await getData<Project[]>('api/projects.json')
}

export const createProject = async (project: Project): Promise<Project> => {
  return (await client.post<Project>('api/projects.json', project)).data;
};

export const updateProject = async (id: string, updatedProject: Project): Promise<Project> => {
  return (await client.put<Project>(`api/projects/${id}.json`, updatedProject)).data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await client.delete(`api/projects/${id}.json`);
};
