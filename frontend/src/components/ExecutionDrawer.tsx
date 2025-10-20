import React from 'react';
import { Drawer, Empty, List, Typography } from 'antd';
import dayjs from 'dayjs';
import type { TaskExecution } from '../types';

interface ExecutionDrawerProps {
	open: boolean;
	onClose: () => void;
	executions: TaskExecution[];
	title?: string;
}

export const ExecutionDrawer: React.FC<ExecutionDrawerProps> = ({ open, onClose, executions, title }) => {
	return (
		<Drawer open={open} onClose={onClose} title={title || 'Executions'} width={640} aria-label="Execution output">
			{!executions?.length ? (
				<Empty description="No executions" />
			) : (
				<List
					dataSource={[...executions].reverse()}
					renderItem={(e) => (
						<List.Item>
							<List.Item.Meta
								title={`${dayjs(e.startTime).format('YYYY-MM-DD HH:mm:ss')} - ${e.endTime ? dayjs(e.endTime).format('HH:mm:ss') : ''}`}
								description={
									<Typography.Paragraph code style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
										{e.output || ''}
									</Typography.Paragraph>
								}
							/>
						</List.Item>
					)}
				/>
			)}
		</Drawer>
	);
};


