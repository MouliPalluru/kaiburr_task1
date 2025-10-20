import React from 'react';
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, PlayCircleOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Task, TaskExecution } from '../types';

interface TaskTableProps {
	tasks: Task[];
	loading?: boolean;
	onEdit: (task: Task) => void;
	onDelete: (id: string) => Promise<void> | void;
	onExecute: (id: string) => Promise<void> | void;
	onViewOutput: (executions: TaskExecution[]) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, loading, onEdit, onDelete, onExecute, onViewOutput }) => {
	const columns: ColumnsType<Task> = [
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Owner', dataIndex: 'owner', key: 'owner' },
		{ title: 'Command', dataIndex: 'command', key: 'command', ellipsis: true },
		{ 
			title: 'Runs', key: 'runs', render: (_, record) => {
				const count = record.taskExecutions?.length || 0;
				return <Tag color={count ? 'blue' : 'default'} aria-label={`Runs ${count}`}>{count}</Tag>;
			}
		},
		{ 
			title: 'Last Run', key: 'lastRun', render: (_, record) => {
				const last = record.taskExecutions && record.taskExecutions[record.taskExecutions.length - 1];
				return last?.startTime ? dayjs(last.startTime).format('YYYY-MM-DD HH:mm:ss') : '—';
			}
		},
		{
			title: 'Actions', key: 'actions', render: (_, record) => (
				<Space wrap>
					<Tooltip title="Execute">
						<Button icon={<PlayCircleOutlined />} aria-label={`Execute ${record.name}`} onClick={() => onExecute(record.id!)} />
					</Tooltip>
					<Tooltip title="View output">
						<Button icon={<EyeOutlined />} aria-label={`View output for ${record.name}`} onClick={() => onViewOutput(record.taskExecutions || [])} />
					</Tooltip>
					<Tooltip title="Edit">
						<Button icon={<EditOutlined />} aria-label={`Edit ${record.name}`} onClick={() => onEdit(record)} />
					</Tooltip>
					<Popconfirm title="Delete this task?" okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => onDelete(record.id!)}>
						<Button danger icon={<DeleteOutlined />} aria-label={`Delete ${record.name}`} />
					</Popconfirm>
				</Space>
			)
		}
	];

	return (
		<Table
			rowKey={(t) => t.id || t.name}
			columns={columns}
			dataSource={tasks}
			loading={loading}
			pagination={{ pageSize: 10, showSizeChanger: false }}
		/>
	);
};


