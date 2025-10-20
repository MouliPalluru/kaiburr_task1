import axios from 'axios';
import type { Task, TaskExecution } from './types';

// With CRA proxy, use relative /api base in dev to avoid CORS/host issues
const isDev = process.env.NODE_ENV !== 'production';
const inferredBase = isDev ? '' : (() => {
    try {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        return `http://${host}:8080`;
    } catch {
        return 'http://localhost:8080';
    }
})();
const BASE_URL = process.env.REACT_APP_API_BASE_URL || inferredBase;

export const api = axios.create({
	baseURL: `${BASE_URL}/api/`, // ensure trailing slash for relative endpoint joins
});

export async function listTasks(id?: string): Promise<Task[]> {
	const params = id ? { id } : undefined;
	const res = await api.get<Task[]>('tasks', { params });
	return res.data;
}

export async function searchTasks(name: string): Promise<Task[]> {
	const res = await api.get<Task[]>('tasks/search', { params: { name } });
	return res.data;
}

export async function upsertTask(task: Task): Promise<Task> {
	const res = await api.put<Task>('tasks', task);
	return res.data;
}

export async function deleteTask(id: string): Promise<void> {
	await api.delete(`tasks/${id}`);
}

export async function executeTask(id: string): Promise<TaskExecution> {
	const res = await api.put<TaskExecution>(`tasks/${id}/execute`);
	return res.data;
}


