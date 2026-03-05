'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/common/use-toast';
import {
	useAssignmentDetail,
	useUpdateAssignment,
} from '@/hooks/queries/assignment/use-assignment-query';
import { useSubjects } from '@/hooks/queries/subject/use-subject-query';

interface AssignmentDetailModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	assignmentId: number;
}

export function AssignmentDetailModal({
	open,
	onOpenChange,
	assignmentId,
}: AssignmentDetailModalProps) {
	const { toast } = useToast();
	const { data, isLoading, error } = useAssignmentDetail(open ? assignmentId : null);
	const updateMutation = useUpdateAssignment();
	const { data: subjects, isLoading: isSubjectsLoading, isError: isSubjectsError } = useSubjects();

	const [title, setTitle] = useState('');
	const [note, setNote] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [subjectId, setSubjectId] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (data) {
			setTitle(data.docTitle);
			setNote(data.note ?? '');
			setDueDate(data.dueDate ?? '');
			setSubjectId(data.subjectId ?? undefined);
		}
	}, [data]);

	const isEditable = data ? data.status === 'published' : false;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!data) return;

		try {
			await updateMutation.mutateAsync({
				assignmentId,
				payload: {
					title: title.trim() || data.docTitle,
					note: note.trim() || undefined,
					subjectId,
					dueDate: dueDate || undefined,
				},
			});
			toast({
				title: 'Updated',
				description: 'Assignment updated successfully',
			});
			onOpenChange(false);
		} catch {
			toast({
				title: 'Error',
				description: 'Failed to update assignment',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-3xl bg-white shadow-xl max-w-lg border border-[#E0DCD5]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#333]">Assignment Details</DialogTitle>
				</DialogHeader>

				{isLoading && (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-6 h-6 animate-spin text-[#F5B041]" />
					</div>
				)}

				{!isLoading && error && (
					<p className="text-sm text-red-600 py-4">
						Failed to load assignment details. Please try again later.
					</p>
				)}

				{!isLoading && !error && data && (
					<form onSubmit={handleSave} className="space-y-5 py-4">
						<div>
							<label
								htmlFor="assignment-title"
								className="block text-sm font-semibold text-[#666] mb-2"
							>
								Title
							</label>
							<Input
								id="assignment-title"
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								disabled={!isEditable || updateMutation.isPending}
								className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
							/>
						</div>

						<div>
							<label
								htmlFor="assignment-description"
								className="block text-sm font-semibold text-[#666] mb-2"
							>
								Description
							</label>
							<textarea
								id="assignment-description"
								value={note}
								onChange={(e) => setNote(e.target.value)}
								disabled={!isEditable || updateMutation.isPending}
								className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors resize-none"
								rows={3}
							/>
						</div>

						<div>
							<label
								htmlFor="assignment-due-date"
								className="block text-sm font-semibold text-[#666] mb-2"
							>
								Due Date
							</label>
							<Input
								id="assignment-due-date"
								type="date"
								value={dueDate || ''}
								onChange={(e) => setDueDate(e.target.value)}
								disabled={!isEditable || updateMutation.isPending}
								className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
							/>
						</div>

						<div>
							<label
								htmlFor="assignment-subject"
								className="block text-sm font-semibold text-[#666] mb-2"
							>
								Subject
							</label>
							<select
								id="assignment-subject"
								value={subjectId ?? ''}
								onChange={(e) => {
									const val = e.target.value ? parseInt(e.target.value, 10) : NaN;
									setSubjectId(Number.isNaN(val) ? undefined : val);
								}}
								className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors cursor-pointer"
								disabled={
									!isEditable || updateMutation.isPending || isSubjectsLoading || isSubjectsError
								}
							>
								{isSubjectsLoading && <option>Loading subjects...</option>}
								{!isSubjectsLoading && isSubjectsError && <option>Error loading subjects</option>}
								{!isSubjectsLoading && !isSubjectsError && (
									<>
										<option value="">Select a subject...</option>
										{(subjects ?? []).map((subject) => (
											<option key={subject.id} value={subject.id}>
												{subject.name}
											</option>
										))}
									</>
								)}
							</select>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								className="rounded-xl"
								onClick={() => onOpenChange(false)}
							>
								Close
							</Button>
							<Button
								type="submit"
								disabled={!isEditable || updateMutation.isPending}
								className="rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FA8D3E] text-white"
							>
								{!isEditable
									? 'View Only'
									: updateMutation.isPending
										? 'Saving...'
										: 'Save Changes'}
							</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
