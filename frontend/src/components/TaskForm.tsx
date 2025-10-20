import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import type { Task } from '../types';

interface TaskFormProps {
	open: boolean;
	initial?: Task | null;
	onCancel: () => void;
	onSubmit: (task: Task) => Promise<void> | void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ open, initial, onCancel, onSubmit }) => {
	const [form] = Form.useForm<Task>();

	useEffect(() => {
		if (initial) {
			form.setFieldsValue(initial);
		} else {
			form.resetFields();
		}
	}, [initial, form]);

	return (
		<Modal
			open={open}
			title={initial?.id ? 'Edit Task' : 'Create Task'}
			onCancel={onCancel}
			onOk={async () => {
				const values = await form.validateFields();
				await onSubmit({ ...initial, ...values });
			}}
			okText={initial?.id ? 'Save' : 'Create'}
			okButtonProps={{ 'aria-label': initial?.id ? 'Save task' : 'Create task' }}
			cancelButtonProps={{ 'aria-label': 'Cancel' }}
			maskClosable={false}
			forceRender
		>
			<Form
				form={form}
				layout="vertical"
				name="taskForm"
				aria-label="Task form"
			>
				<Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}> 
					<Input placeholder="Enter task name" allowClear autoFocus/>
				</Form.Item>
				<Form.Item name="owner" label="Owner" rules={[{ required: true, message: 'Owner is required' }]}> 
					<Input placeholder="Enter owner" allowClear/>
				</Form.Item>
				<Form.Item name="command" label="Command" rules={[{ required: true, message: 'Command is required' }]}> 
					<Input.TextArea placeholder="Enter safe command" rows={3} allowClear/>
				</Form.Item>
			</Form>
		</Modal>
	);
};


