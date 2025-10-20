export interface TaskExecution {
	id: string;
	startTime: string; // ISO string
	endTime: string | null;
	output: string;
}

export interface Task {
	id?: string;
	name: string;
	owner: string;
	command: string;
	taskExecutions?: TaskExecution[];
}

export interface PagedResult<T> {
	items: T[];
	total: number;
}


