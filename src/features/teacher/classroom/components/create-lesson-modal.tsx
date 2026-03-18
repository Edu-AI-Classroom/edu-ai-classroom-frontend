'use client';

import { FileText, UploadCloud, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateLesson } from '@/hooks/queries/lesson/use-lesson';

interface CreateLessonModalProps {
	isOpen: boolean;
	onClose: () => void;
	classId: number;
}

export function CreateLessonModal({ isOpen, onClose, classId }: CreateLessonModalProps) {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

	const createLessonMutation = useCreateLesson();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			const selectedFile = e.target.files[0];
			const allowedTypes = [
				'application/pdf',
				'application/vnd.ms-powerpoint',
				'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			];

			if (!allowedTypes.includes(selectedFile.type)) {
				alert('Please upload only PDF or PPT/PPTX files.');
				return;
			}
			setFile(selectedFile);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;

		const formData = new FormData();
		formData.append('title', title);
		formData.append('content', content);
		formData.append('classId', classId.toString());
		formData.append('status', status);

		if (file) {
			formData.append('file', file);
		}

		createLessonMutation.mutate(formData, {
			onSuccess: () => {
				setTitle('');
				setContent('');
				setFile(null);
				setStatus('DRAFT');
				onClose();
			},
			onError: (error) => {
				console.error('Failed to create lesson:', error);
				alert('Failed to create lesson. Please try again.');
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px] bg-[#FAF9F6] border-[#E0DCD5]">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold text-[#333]">Create New Lesson</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 mt-4">
					<div className="space-y-2">
						<label htmlFor="title" className="text-sm font-semibold text-[#666]">
							Lesson Title <span className="text-red-500">*</span>
						</label>
						<Input
							id="title"
							placeholder="e.g., Introduction to React"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="bg-white border-[#E0DCD5]"
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="content" className="text-sm font-semibold text-[#666]">
							Description / Content <span className="text-red-500">*</span>
						</label>
						<textarea
							id="content"
							placeholder="Write a brief description or add HTML content..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full min-h-[120px] p-3 rounded-md border border-[#E0DCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5B041]/50"
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="create-status" className="text-sm font-semibold text-[#666]">
							Status
						</label>
						<select
							id="create-status"
							value={status}
							onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
							className="w-full p-2.5 rounded-md border border-[#E0DCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5B041]/50"
						>
							<option value="DRAFT">Draft (Hidden from students)</option>
							<option value="PUBLISHED">Published (Visible to students immediately)</option>
						</select>
					</div>

					<div className="space-y-2">
						<label htmlFor="create-material-file" className="text-sm font-semibold text-[#666]">
							Attach Material (PDF, PPTX)
						</label>
						<div className="relative border-2 border-dashed border-[#E0DCD5] rounded-xl p-6 text-center hover:bg-white transition-colors bg-[#F0EDE8]/50">
							<input
								id="create-material-file"
								type="file"
								accept=".pdf,.ppt,.pptx"
								onChange={handleFileChange}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
							{file ? (
								<div className="flex items-center justify-center gap-2 text-[#F5B041] font-medium">
									<FileText className="w-5 h-5" />
									<span className="truncate max-w-[200px]">{file.name}</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-6 w-6 ml-2 text-[#E57373] hover:bg-[#E57373]/20 z-10"
										onClick={(e) => {
											e.preventDefault();
											setFile(null);
										}}
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							) : (
								<div className="flex flex-col items-center gap-2 text-[#999]">
									<UploadCloud className="w-8 h-8 text-[#C5B4E3]" />
									<span className="text-sm">Click or drag file to upload</span>
								</div>
							)}
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-[#E0DCD5]">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="border-[#E0DCD5] text-[#666]"
							disabled={createLessonMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#333] font-bold"
							disabled={createLessonMutation.isPending}
						>
							{createLessonMutation.isPending ? 'Creating...' : 'Create Lesson'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
