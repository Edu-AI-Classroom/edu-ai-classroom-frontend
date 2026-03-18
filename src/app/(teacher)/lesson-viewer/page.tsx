// app/(teacher)/lesson-viewer/page.tsx
'use client';

import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function LessonViewerContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const fileUrl = searchParams.get('url');
	const title = searchParams.get('title') || 'Document Viewer';

	// Nếu không có URL file, hiển thị lỗi
	if (!fileUrl) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-[#FAF9F6]">
				<p className="text-[#666] mb-4">No document URL provided.</p>
				<Button onClick={() => router.back()} className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#333]">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Go Back
				</Button>
			</div>
		);
	}

	const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
	const viewerUrl = isPdf
		? fileUrl
		: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

	return (
		<div className="flex flex-col h-screen bg-[#FAF9F6]">
			{/* Header */}
			<header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-[#E0DCD5] shrink-0 shadow-sm">
				<Button 
					variant="ghost" 
					size="icon" 
					onClick={() => router.back()} 
					className="text-[#666] hover:bg-[#F0EDE8] hover:text-[#333]"
				>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<h1 className="font-sans font-bold text-xl text-[#333] truncate">
					{title}
				</h1>
			</header>

			{/* Document Viewer */}
			<main className="flex-1 bg-[#F0EDE8] relative">
				<div className="absolute inset-0 flex items-center justify-center -z-10 text-[#999] font-medium animate-pulse">
					Loading document...
				</div>
				<iframe
					src={viewerUrl}
					className="w-full h-full border-0 relative z-10"
					title={title}
					allowFullScreen
				/>
			</main>
		</div>
	);
}

// Bọc trong Suspense vì Next.js yêu cầu khi sử dụng useSearchParams
export default function LessonViewerPage() {
	return (
		<Suspense fallback={
			<div className="flex h-screen items-center justify-center bg-[#FAF9F6]">
				<span className="text-[#666] animate-pulse">Loading viewer...</span>
			</div>
		}>
			<LessonViewerContent />
		</Suspense>
	);
}