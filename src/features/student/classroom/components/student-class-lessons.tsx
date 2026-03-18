'use client';

import { Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ClassroomUiData } from '@/features/teacher/classroom/classroom.mapper';
import { useLessonList } from '@/hooks/queries/lesson/use-lesson';

interface StudentClassLessonsProps {
	classData: ClassroomUiData;
}

export default function StudentClassLessons({ classData }: StudentClassLessonsProps) {
	const router = useRouter();
	const { data: lessons, isLoading } = useLessonList(classData.id);

	const handleViewDocument = (url: string, title: string) => {
		// Trỏ URL về trang viewer của student
		const viewerPath = `/student/classroom/lesson-viewer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
		router.push(viewerPath);
	};

	if (isLoading) {
		return <div className="p-8 text-center text-[#666] animate-pulse">Loading lessons...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-2xl font-bold text-[#333]">Class Lessons</h2>
				<p className="text-[#666]">Access your lecture slides and study materials</p>
			</div>

			{/* Lessons List Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Empty State */}
				{lessons?.length === 0 && (
					<div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-[#E0DCD5]">
						<FileText className="w-12 h-12 mx-auto text-[#999] mb-3" />
						<h3 className="text-lg font-medium text-[#333]">No lessons available</h3>
						<p className="text-[#666]">Your teacher hasn't uploaded any materials yet.</p>
					</div>
				)}

				{/* Render List */}
				{lessons?.map((lesson) => (
					<div
						key={lesson.id}
						className="bg-white p-5 rounded-2xl shadow-sm border border-[#E0DCD5] hover:shadow-md transition-shadow flex flex-col"
					>
						<div className="flex items-start mb-4">
							<div className="p-3 bg-[#F0EDE8] rounded-xl">
								<FileText className="w-6 h-6 text-[#F5B041]" />
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
		</div>
	);
}
