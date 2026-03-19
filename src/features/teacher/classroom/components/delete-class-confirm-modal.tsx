'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmActionModal } from './confirm-action-modal';

interface DeleteClassConfirmModalProps {
	isDeleting?: boolean;
	onConfirm: () => Promise<void> | void;
}

export function DeleteClassConfirmModal({
	isDeleting = false,
	onConfirm,
}: DeleteClassConfirmModalProps) {
	return (
		<ConfirmActionModal
			title="Do you really want to delete this class?"
			description="Can not revert this action. This will delete your class premantly."
			confirmLabel="Delete Class"
			isPending={isDeleting}
			onConfirm={onConfirm}
			trigger={
				<Button variant="destructive" className="mt-5 rounded-full" disabled={isDeleting}>
					<Trash2 className="w-4 h-4" />
					Delete Class
				</Button>
			}
		/>
	);
}
