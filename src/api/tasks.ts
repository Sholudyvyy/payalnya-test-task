import type { Task } from '@/types/Task'
import { client, getData } from '@/utils/httpClient'

export const getTasks = async () => {
  return await getData<Task[]>('api/tasks.json')
}

export const createTask = async (task: Task): Promise<Task> => {
  const response = await client.post<Task>('api/tasks.json', task);
  return response.data;
};

export const updateTask = async (id: number, updatedTask: Task): Promise<Task> => {
  const response = await client.put<Task>(`api/tasks/${id}.json`, updatedTask);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await client.delete(`api/tasks/${id}.json`);
};
