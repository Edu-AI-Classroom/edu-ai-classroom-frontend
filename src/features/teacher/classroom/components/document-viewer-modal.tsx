'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DocumentViewerModalProps {
	fileUrl: string | null;
	title?: string;
	onClose: () => void;
}

export function DocumentViewerModal({
	fileUrl,
	title = 'Document Viewer',
	onClose,
}: DocumentViewerModalProps) {
	if (!fileUrl) return null;

	// Kiểm tra xem file có phải là định dạng PDF không
	const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

	// Nếu không phải PDF (ví dụ: PPTX), nhúng qua trình xem của Microsoft
	const viewerUrl = isPdf
		? fileUrl
		: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

	return (
		<Dialog open={!!fileUrl} onOpenChange={(open) => !open && onClose()}>
			{/* Mở rộng max-w-6xl và chiều cao 90vh để xem file rõ nhất */}
			<DialogContent className="max-w-6xl w-[95vw] h-[95vh] flex flex-col p-0 bg-white border-[#E0DCD5] gap-0">
				<DialogHeader className="p-4 border-b border-[#E0DCD5] bg-[#FAF9F6] shrink-0">
					<DialogTitle className="text-xl font-bold text-[#333] truncate pr-8">{title}</DialogTitle>
				</DialogHeader>

				{/* Khung chứa iframe chiếm phần diện tích còn lại */}
				<div className="flex-1 w-full bg-[#F0EDE8] overflow-hidden relative">
					{/* Loading placeholder đơn giản */}
					<div className="absolute inset-0 flex items-center justify-center -z-10 text-[#999]">
						Loading document...
					</div>

					<iframe
						src={viewerUrl}
						className="w-full h-full border-0 relative z-10"
						title={title}
						// Cho phép full screen nếu người dùng muốn
						allowFullScreen
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
