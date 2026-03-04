'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { CreateAssignmentPayload } from '@/types/class';
import { useSubjects } from '@/hooks/queries/subject/use-subject-query';

interface CreateAssignmentDialogProps {
	onSubmit: (payload: CreateAssignmentPayload) => Promise<void>;
	classId: number;
	isLoading: boolean;
}

export function CreateAssignmentDialog({
	onSubmit,
	classId,
	isLoading,
}: CreateAssignmentDialogProps) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [note, setNote] = useState('');
	const [gradeLevel, setGradeLevel] = useState<number | undefined>(undefined);
	const [subjectId, setSubjectId] = useState<number | undefined>(undefined);
	const [dueDate, setDueDate] = useState<string>('');

	const { data: subjects, isLoading: isSubjectsLoading, isError: isSubjectsError } = useSubjects();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) {
			alert('Please enter assignment title');
			return;
		}

		try {
			await onSubmit({
				title: title.trim(),
				note: note.trim() || undefined,
				gradeLevel: gradeLevel ?? undefined,
				subjectId: subjectId ?? undefined,
				classId,
			});

			setTitle('');
			setNote('');
			setGradeLevel(undefined);
			setSubjectId(undefined);
			setOpen(false);
		} catch {
			// Error already handled by component
		}
	};

	const isSubmitting = isLoading;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FA8D3E] text-white border-0 shadow-md hover:shadow-lg transition-all"
					size="sm"
				>
					<Plus className="w-4 h-4 mr-2" />
					Create Assignment
				</Button>
			</DialogTrigger>

			<DialogContent className="rounded-3xl bg-white shadow-xl max-w-md border border-[#E0DCD5]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#333]">
						Create New Assignment
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					<div>
						<label className="block text-sm font-semibold text-[#666] mb-2">
							Assignment Title *
						</label>
						<Input
							type="text"
							placeholder="e.g., Chapter 5 Exercises"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
							disabled={isSubmitting}
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-[#666] mb-2">
							Description (Optional)
						</label>
						<textarea
							placeholder="Add any instructions or notes..."
							value={note}
							onChange={(e) => setNote(e.target.value)}
							className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors resize-none"
							rows={3}
							disabled={isSubmitting}
						/>
					</div>


					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm font-semibold text-[#666]">
								Grade Level (Optional)
							</label>
							{gradeLevel && (
								<span className="text-sm font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-full">
									Grade {gradeLevel}
								</span>
							)}
						</div>
						<input
							type="range"
							min="1"
							max="5"
							step="1"
							value={gradeLevel ?? 0}
							onChange={(e) => {
								const val = parseInt(e.target.value, 10);
								setGradeLevel(val === 0 ? undefined : val);
							}}
							className="w-full h-2 bg-[#E0DCD5] rounded-full appearance-none cursor-pointer accent-[#F59E0B]"
							disabled={isSubmitting}
						/>
						<div className="flex justify-between text-xs text-[#999] mt-1">
							<span>1</span>
							<span>2</span>
							<span>3</span>
							<span>4</span>
							<span>5</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-semibold text-[#666] mb-2">
							Subject (Optional)
						</label>
						<select
							value={subjectId ?? ''}
							onChange={(e) => {
								const val = e.target.value ? parseInt(e.target.value, 10) : NaN;
								setSubjectId(Number.isNaN(val) ? undefined : val);
							}}
							className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors cursor-pointer"
							disabled={isSubmitting || isSubjectsLoading || isSubjectsError}
						>
							{isSubjectsLoading && <option>Loading subjects...</option>}
							{!isSubjectsLoading && isSubjectsError && (
								<option>Error loading subjects</option>
							)}
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

					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
							className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0DCD5] text-[#666] font-semibold hover:bg-[#F9F8F6] transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !title.trim()}
							className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FA8D3E] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
						>
							{isSubmitting ? 'Creating...' : 'Create Assignment'}
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
