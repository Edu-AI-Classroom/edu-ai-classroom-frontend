'use client';

import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';
import type { CreateClassroomPayload } from '@/types/class';
import type { ClassroomUiData } from '../classroom.mapper';
import { mapSubjectNameToId, parseGradeLevel } from './class-form.config';
import { CreateClassModal } from './create-class-modal';
import { DeleteClassConfirmModal } from './delete-class-confirm-modal';

interface ClassroomSettingsProps {
	classData: ClassroomUiData;
	onDeleted?: () => void;
}

export const ClassroomSettings: React.FC<ClassroomSettingsProps> = ({ classData, onDeleted }) => {
	const router = useRouter();
	const { updateClassMutation, deleteClassMutation, classError, clearClassError } =
		useClassMutations();

	const handleUpdateGeneral = (payload: CreateClassroomPayload, helpers: { close: () => void }) => {
		clearClassError();
		updateClassMutation.mutate(
			{
				classId: classData.id,
				payload,
			},
			{
				onSuccess: () => {
					helpers.close();
				},
			},
		);
	};

	const handleDeleteClass = async () => {
		await deleteClassMutation.mutateAsync({ classId: classData.id });
		onDeleted?.();
		router.replace('/classroom');
	};

	const handleCopy = async (classId: number) => {
		if (!classId) {
			alert('No class code available to copy');
			return;
		}

		try {
			await navigator.clipboard.writeText(classId.toString());
			toast.success('Copied!');
		} catch (err) {
			console.error(err);
			toast.error('Failed to copy!');
		}
	};

	return (
		<div className="space-y-8 max-w-2xl m-auto">
			{/* General Settings */}
			<CreateClassModal
				inline
				mode="edit"
				title="Edit Class Information"
				description="Update class name, grade level, and subject."
				submitLabel="Save Changes"
				initialValues={{
					className: classData.name,
					gradeLevel: parseGradeLevel(classData.grade) ?? null,
					subjectId: mapSubjectNameToId(classData.subject) ?? null,
				}}
				isSubmitting={updateClassMutation.isPending}
				externalError={classError}
				onSubmit={handleUpdateGeneral}
			/>

			{/* Class Code */}
			<div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
				<h3 className="font-bold font-heading text-lg flex items-center gap-2">
					<span>🔗</span> Class Code
				</h3>
				<p className="text-sm text-muted-foreground">
					Share this code with students to join the class
				</p>
				<div className="flex items-center gap-3">
					<div className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-lg tracking-wider">
						{classData.id ?? 'N/A'}
					</div>
					<Button
						variant="outline"
						className="gap-2 rounded-full"
						onClick={() => handleCopy(classData.id ?? null)}
					>
						<Copy className="w-4 h-4" />
						Copy
					</Button>
				</div>
			</div>

			{/* Preferences */}
			<div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-6">
				<h3 className="font-bold font-heading text-lg flex items-center gap-2">
					<span>⚙️</span> Preferences
				</h3>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Allow Late Submissions</p>
							<p className="text-sm text-muted-foreground">Students can submit after deadline</p>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Show Grades to Students</p>
							<p className="text-sm text-muted-foreground">Students can view their grades</p>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Email Notifications</p>
							<p className="text-sm text-muted-foreground">Get notified about submissions</p>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Student Comments</p>
							<p className="text-sm text-muted-foreground">Allow students to comment on posts</p>
						</div>
						<Switch defaultChecked />
					</div>
				</div>
			</div>

			{/* Danger Zone */}
			<div className="bg-card rounded-xl border-2 border-destructive/30 p-6 shadow-card space-y-2">
				<h3 className="font-bold font-heading text-lg flex items-center gap-2 text-destructive">
					<span>⚠️</span> Danger Zone
				</h3>
				<p className="text-sm text-muted-foreground">
					These actions are irreversible. Please proceed with caution.
				</p>
				<div className="flex flex-wrap gap-3">
					<DeleteClassConfirmModal
						onConfirm={handleDeleteClass}
						isDeleting={deleteClassMutation.isPending}
					/>
				</div>
			</div>
		</div>
	);
};
