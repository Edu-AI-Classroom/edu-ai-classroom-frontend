'use client';

import { Edit, Eye, FileText, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteLesson, useLessonList, useUpdateLesson } from '@/hooks/queries/lesson/use-lesson';
import type { LessonUiData } from '@/services/lesson/lesson.service';
import type { ClassroomUiData } from '../classroom.mapper';
import { CreateLessonModal } from './create-lesson-modal';
import { UpdateLessonModal } from './update-lesson-modal';

interface ClassLessonsProps {
	classData: ClassroomUiData;
}

export default function ClassLessons({ classData }: ClassLessonsProps) {
	const router = useRouter();
	const { data: lessons, isLoading } = useLessonList(classData.id);
	const deleteLessonMutation = useDeleteLesson();
	const updateLessonMutation = useUpdateLesson();

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedLesson, setSelectedLesson] = useState<LessonUiData | null>(null);
	const [revertLesson, setRevertLesson] = useState<LessonUiData | null>(null);

	const handleConfirmRevert = () => {
		if (!revertLesson) return;

		const formData = new FormData();
		formData.append('title', revertLesson.title);
		formData.append('content', revertLesson.content);
		formData.append('status', 'DRAFT');

		updateLessonMutation.mutate({ id: revertLesson.id, formData });
		setRevertLesson(null);
	};

	const handleDelete = (id: string) => {
		if (window.confirm('Are you sure you want to delete this lesson?')) {
			deleteLessonMutation.mutate(id);
		}
	};

	const handleEditClick = (lesson: LessonUiData) => {
		setSelectedLesson(lesson);
	};

	const handleViewDocument = (url: string, title: string) => {
		const viewerPath = `/lesson-viewer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
		router.push(viewerPath);
	};

	if (isLoading) {
		return <div className="p-8 text-center text-[#666] animate-pulse">Loading lessons...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Header Actions */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-[#333]">Class Lessons</h2>
					<p className="text-[#666]">Manage lecture slides and materials</p>
				</div>
				<Button
					className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#333] font-semibold"
					onClick={() => setIsCreateModalOpen(true)}
				>
					<Plus className="w-4 h-4 mr-2" />
					Create Lesson
				</Button>
			</div>

			{/* Lessons List Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Empty State */}
				{lessons?.length === 0 && (
					<div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-[#E0DCD5]">
						<FileText className="w-12 h-12 mx-auto text-[#999] mb-3" />
						<h3 className="text-lg font-medium text-[#333]">No lessons yet</h3>
						<p className="text-[#666]">Get started by creating your first lesson.</p>
					</div>
				)}

				{/* Render List */}
				{lessons?.map((lesson) => (
					<div
						key={lesson.id}
						className="bg-white p-5 rounded-2xl shadow-sm border border-[#E0DCD5] flex flex-col relative overflow-hidden"
					>
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-3">
								<div className="p-3 bg-[#F0EDE8] rounded-xl">
									<FileText className="w-6 h-6 text-[#F5B041]" />
								</div>
								{/* Hiển thị Badge Status */}
								<span
									className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide ${lesson.status === 'PUBLISHED' ? 'bg-[#A8D5BA]/30 text-green-700' : 'bg-[#E0DCD5] text-[#666]'}`}
								>
									{lesson.status}
								</span>
							</div>

							<div className="flex gap-1">
								{/* Nút Revert if PUBLISHED */}
								{lesson.status === 'PUBLISHED' && (
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-[#F5B041] hover:bg-[#F5B041]/10"
										onClick={() => setRevertLesson(lesson)}
										title="Revert to Draft"
										disabled={updateLessonMutation.isPending}
									>
										<RotateCcw className="w-4 h-4" />
									</Button>
								)}

								{/* Hiện nút Edit nếu không phải PUBLISHED */}
								{lesson.status !== 'PUBLISHED' && (
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-[#666] hover:text-[#333]"
										onClick={() => handleEditClick(lesson)}
										title="Edit Lesson"
									>
										<Edit className="w-4 h-4" />
									</Button>
								)}

								{/* Nút Delete */}
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-[#E57373] hover:bg-[#E57373]/10"
									onClick={() => handleDelete(lesson.id)}
									disabled={deleteLessonMutation.isPending}
									title="Delete Lesson"
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>

						<h3 className="font-bold text-lg text-[#333] mb-1 truncate" title={lesson.title}>
							{lesson.title}
						</h3>
						<div
							className="text-sm text-[#666] mb-4 line-clamp-2"
							dangerouslySetInnerHTML={{ __html: lesson.content || 'No description provided.' }}
						/>

						<div className="mt-auto pt-4 border-t border-[#E0DCD5]">
							{lesson.fileUrl ? (
								<button
									onClick={() => handleViewDocument(lesson.fileUrl, lesson.title)}
									className="flex items-center gap-1 text-sm font-semibold text-[#F5B041] hover:underline focus:outline-none"
								>
									<Eye className="w-4 h-4" />
									View Document
								</button>
							) : (
								<span className="text-sm text-[#999]">No file attached</span>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Create Modal */}
			<CreateLessonModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				classId={classData.id}
			/>

			{/* Update Modal */}
			<UpdateLessonModal
				isOpen={!!selectedLesson}
				onClose={() => setSelectedLesson(null)}
				lesson={selectedLesson}
			/>

			{/* Revert Confirmation Modal */}
			<AlertDialog open={!!revertLesson} onOpenChange={(open) => !open && setRevertLesson(null)}>
				<AlertDialogContent className="bg-[#FAF9F6] border-[#E0DCD5]">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-[#333]">Revert to Draft?</AlertDialogTitle>
						<AlertDialogDescription className="text-[#666]">
							Are you sure you want to revert this lesson to DRAFT? Students will no longer be able to
							see it until you publish it again.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-[#E0DCD5] text-[#666]">Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#333] font-bold"
							onClick={handleConfirmRevert}
						>
							Yes, revert to draft
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
