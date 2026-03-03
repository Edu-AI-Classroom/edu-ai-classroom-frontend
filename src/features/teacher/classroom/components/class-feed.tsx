'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, MessageCircle, Paperclip, Pin, Send, Star } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useAuthUser } from '@/hooks/queries/auth/use-auth-mutation';
import { queryKeys } from '@/services/api/query-keys';
import { NewsService } from '@/services/classroom/news.service';
import type { ClassroomUiData } from '../classroom.mapper';

interface ClassFeedProps {
	classData: ClassroomUiData;
}

export default function ClassFeed({ classData }: ClassFeedProps) {
	const classId = classData.id;
	const authUser = useAuthUser();
	const teacherName = authUser?.userName ?? 'Teacher';
	const queryClient = useQueryClient();

	const [newPost, setNewPost] = useState('');
	const [audience, setAudience] = useState<'students' | 'parents' | 'all'>('all');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [expandedComments, setExpandedComments] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// 1. Fetch danh sách bài viết từ Backend
	const { data: newsResponse, isLoading } = useQuery({
		queryKey: queryKeys.news.list(classId),
		queryFn: () => NewsService.getNewsByClass(classId),
		enabled: !!classId,
	});

	// Lấy mảng data thực tế (Tuỳ thuộc vào cách httpGet của bạn trả về data.data hay thẳng mảng)
	const announcements = newsResponse?.data?.data || newsResponse?.data || [];

	// 2. Mutation tạo bài viết mới
	const createNewsMutation = useMutation({
		mutationFn: NewsService.createNews,
		onSuccess: () => {
			// Reset form
			setNewPost('');
			setSelectedFile(null);
			setAudience('all');
			// Gọi lại API để lấy list mới
			queryClient.invalidateQueries({ queryKey: queryKeys.news.list(classId) });
		},
	});

	const toggleComments = (id: string) => {
		setExpandedComments((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handlePost = () => {
		if (newPost.trim() && classId > 0) {
			createNewsMutation.mutate({
				classId,
				content: newPost,
				audience,
				isPinned: false, // Hoặc thêm UI toggle pin ở khung tạo post
				file: selectedFile || undefined,
			});
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const pinnedPosts = announcements.filter((a: any) => a.isPinned);
	const regularPosts = announcements.filter((a: any) => !a.isPinned);

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* ... Header giữ nguyên ... */}

			{/* Compose Box */}
			<div
				className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5]"
				style={
					{
						/*...*/
					}
				}
			>
				<div className="flex items-start gap-3">
					{/* ... Avatar giữ nguyên ... */}
					<div className="flex-1">
						<Textarea
							placeholder="Share an announcement with your class..."
							value={newPost}
							onChange={(e) => setNewPost(e.target.value)}
							disabled={createNewsMutation.isPending}
							className="min-h-20 border-none bg-transparent resize-none focus-visible:ring-0 p-0 text-[#333] placeholder:text-[#999]"
						/>

						{selectedFile && (
							<div className="text-xs text-blue-500 mt-2">Đính kèm: {selectedFile.name}</div>
						)}

						<div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E0DCD5]">
							<div className="flex items-center gap-2">
								{/* Input file ẩn */}
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									onChange={handleFileSelect}
								/>
								<Button
									variant="ghost"
									size="sm"
									className="text-[#666] rounded-xl"
									onClick={() => fileInputRef.current?.click()}
								>
									<Paperclip className="w-4 h-4 mr-1" />
									Attach
								</Button>
								{/* ... Dropdown Audience giữ nguyên ... */}
							</div>
							<Button
								onClick={handlePost}
								disabled={!newPost.trim() || createNewsMutation.isPending}
								className="bg-[#F5B041] hover:bg-[#E5A030] text-[#333] font-semibold rounded-xl"
							>
								{createNewsMutation.isPending ? (
									'Posting...'
								) : (
									<>
										<Send className="w-4 h-4 mr-2" /> Post
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Loading State */}
			{isLoading && <div className="text-center text-gray-500 py-10">Loading feed...</div>}

			{/* Hiển thị bài viết giống hệt cũ, chỉ truyền data thực vào PostCard */}
			{/* ... */}
		</div>
	);
}

// PostCard giữ nguyên phần hiển thị, bạn có thể cập nhật thêm phần input để tạo Comment mới bên dưới danh sách comment.
