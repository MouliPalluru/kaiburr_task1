import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ConfigProvider, App as AntApp, Layout, Typography, theme, Input, Button, Flex, message } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { listTasks, searchTasks, upsertTask, deleteTask as apiDeleteTask, executeTask } from './api';
import type { Task, TaskExecution } from './types';
import { TaskTable } from './components/TaskTable';
import { TaskForm } from './components/TaskForm';
import { ExecutionDrawer } from './components/ExecutionDrawer';

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Task | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerData, setDrawerData] = useState<TaskExecution[]>([]);

	const { token } = theme.useToken();

	const refresh = async () => {
		setLoading(true);
		try {
			const data = search ? await searchTasks(search) : await listTasks();
			setTasks(data);
		} catch (e) {
			message.error('Failed to load tasks');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onCreateOrUpdate = async (task: Task) => {
		try {
			await upsertTask(task);
			setFormOpen(false);
			setEditing(null);
			await refresh();
			message.success(task.id ? 'Task updated' : 'Task created');
		} catch (err: any) {
			const detail = err?.response?.data || err?.message || 'Unknown error';
			message.error(`Save failed: ${detail}`);
		}
	};

	const onDelete = async (id: string) => {
		await apiDeleteTask(id);
		setTasks(prev => prev.filter(t => t.id !== id));
		message.success('Task deleted');
	};

	const onExecute = async (id: string) => {
		if (!id) {
			message.warning('Please save the task before executing.');
			return;
		}
		setLoading(true);
		try {
			const exec = await executeTask(id);
			message.success('Task executed');
			await refresh();
			setDrawerData([exec, ...(tasks.find(t => t.id === id)?.taskExecutions || [])]);
			setDrawerOpen(true);
		} catch (err: any) {
			const detail = err?.response?.data || err?.message || 'Unknown error';
			message.error(`Execute failed: ${detail}`);
		} finally {
			setLoading(false);
		}
	};

	const headerActions = useMemo(() => (
		<Flex gap={8} wrap="wrap" align="center">
			<Input
				placeholder="Search by name"
				allowClear
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onPressEnter={refresh}
				aria-label="Search tasks by name"
				prefix={<SearchOutlined />}
				style={{ minWidth: 260 }}
			/>
			<Button icon={<ReloadOutlined />} onClick={refresh} aria-label="Reload" />
			<Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setFormOpen(true); }} aria-label="Create task">New</Button>
		</Flex>
	), [refresh, search]);

	return (
		<ConfigProvider theme={{ token: { colorPrimary: '#1677ff' }}}>
			<AntApp>
				<Layout style={{ minHeight: '100dvh' }}>
					<Layout.Header style={{ display: 'flex', alignItems: 'center', paddingInline: 24 }}>
						<Typography.Title level={4} style={{ color: token.colorWhite, margin: 0, flex: 1 }}>Task Manager</Typography.Title>
						{headerActions}
					</Layout.Header>
					<Layout.Content style={{ padding: 24 }}>
						<TaskTable
							tasks={tasks}
							loading={loading}
							onEdit={(t) => { setEditing(t); setFormOpen(true); }}
							onDelete={onDelete}
							onExecute={onExecute}
							onViewOutput={(execs) => { setDrawerData(execs); setDrawerOpen(true); }}
						/>
					</Layout.Content>
				</Layout>

				<TaskForm
					open={formOpen}
					initial={editing}
					onCancel={() => { setFormOpen(false); setEditing(null); }}
					onSubmit={onCreateOrUpdate}
				/>

				<ExecutionDrawer
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					executions={drawerData}
				/>
			</AntApp>
		</ConfigProvider>
	);
}

export default App;
