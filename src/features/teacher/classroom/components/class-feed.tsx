'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Image as ImageIcon,
	MessageCircle,
	MoreHorizontal,
	Paperclip,
	Pencil,
	Pin,
	PinOff,
	Send,
	Star,
	Trash2,
} from 'lucide-react';
import type { ChangeEvent } from 'react';
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
import { ConfirmActionModal } from './confirm-action-modal';

// --- Định nghĩa Types thay cho 'any' ---
interface CommentData {
	id: string;
	author: string;
	authorRole: string;
	content: string;
	createdAt: string;
}

interface PostData {
	id: string;
	author: string;
	content: string;
	createdAt: string;
	isPinned: boolean;
	audience: string;
	mediaUrl?: string;
	commentCount: number;
	comments: CommentData[];
}

interface PageResponse {
	data?: PostData[];
	total?: number;
	page?: number;
	limit?: number;
}

interface ClassFeedProps {
	classData: ClassroomUiData;
}

type PostAudience = 'students' | 'all';

export default function ClassFeed({ classData }: ClassFeedProps) {
	const classId = classData.id;
	const authUser = useAuthUser();
	const teacherName = authUser?.userName ?? 'Teacher';
	const queryClient = useQueryClient();

	const [newPost, setNewPost] = useState('');
	const [audience, setAudience] = useState<'students' | 'all'>('all');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [expandedComments, setExpandedComments] = useState<string[]>([]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		data: newsResponse,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: queryKeys.news.list(classId),
		queryFn: ({ pageParam = 1 }) =>
			NewsService.getNewsByClass(classId, {
				page: pageParam as number,
				limit: 10,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage: any) => {
			if (!lastPage) return undefined;
			const page = Number(lastPage.page) || 1;
			const limit = Number(lastPage.limit) || 10;
			const total = Number(lastPage.total) || 0;
			if (total === 0) return undefined;
			return page * limit < total ? page + 1 : undefined;
		},
		enabled: !!classId,
	});

	const announcements: PostData[] =
		(newsResponse?.pages as any[])?.flatMap((page) =>
			Array.isArray(page?.data) ? page.data : [],
		) || [];

	const createNewsMutation = useMutation({
		mutationFn: NewsService.createNews,
		onSuccess: () => {
			setNewPost('');
			setSelectedFile(null);
			setAudience('all');
			if (fileInputRef.current) fileInputRef.current.value = '';
			queryClient.invalidateQueries({ queryKey: queryKeys.news.list(classId) });
		},
	});

	const toggleComments = (id: string) => {
		setExpandedComments((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handlePost = () => {
		if (newPost.trim() && classId > 0) {
			createNewsMutation.mutate({
				classId,
				content: newPost,
				audience,
				isPinned: false,
				file: selectedFile || undefined,
			});
		}
	};

	const pinnedPosts = announcements.filter((a) => a.isPinned);
	const regularPosts = announcements.filter((a) => !a.isPinned);

	return (
		<div className="max-w-2xl mx-auto space-y-6 pb-20">
			<div>
				<h1 className="font-sans font-bold text-2xl text-[#333]">Class Feed</h1>
				<p className="font-serif text-lg text-[#666]">Announcements & Updates</p>
			</div>

			<div
				className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5]"
				style={{
					backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #E8E4DF 28px)',
					backgroundPosition: '0 12px',
				}}
			>
				<div className="flex items-start gap-3">
					<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold shrink-0">
						{teacherName
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</div>
					<div className="flex-1">
						<Textarea
							placeholder="Share an announcement with your class..."
							value={newPost}
							onChange={(e) => setNewPost(e.target.value)}
							disabled={createNewsMutation.isPending}
							className="min-h-20 border-none bg-transparent resize-none focus-visible:ring-0 p-0 text-[#333] placeholder:text-[#999]"
						/>

						{selectedFile && (
							<div className="flex items-center gap-2 mt-2 text-sm text-[#6B5B95] bg-[#C5B4E3]/10 p-2 rounded-lg w-fit">
								<ImageIcon className="w-4 h-4" />
								<span className="truncate max-w-[200px]">{selectedFile.name}</span>
								<button
									type="button"
									onClick={() => {
										setSelectedFile(null);
										if (fileInputRef.current) fileInputRef.current.value = '';
									}}
									className="text-[#E57373] hover:text-red-700 ml-2"
								>
									✕
								</button>
							</div>
						)}

						<div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E0DCD5]">
							<div className="flex items-center gap-2">
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									onChange={handleFileSelect}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="text-[#666] rounded-xl"
									onClick={() => fileInputRef.current?.click()}
									disabled={createNewsMutation.isPending}
								>
									<Paperclip className="w-4 h-4 mr-1" /> Attach
								</Button>
							</div>
							<Button
								type="button"
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

			{isLoading && (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5B041]" />
				</div>
			)}

			{!isLoading && pinnedPosts.length > 0 && (
				<div className="space-y-4">
					<h2 className="font-sans font-semibold text-sm text-[#666] uppercase tracking-wide flex items-center gap-2">
						<Pin className="w-4 h-4" /> Pinned
					</h2>
					{pinnedPosts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							isPinned
							expanded={expandedComments.includes(post.id)}
							onToggleComments={() => toggleComments(post.id)}
							currentUser={teacherName}
							classId={classId}
						/>
					))}
				</div>
			)}

			{!isLoading && (
				<div className="space-y-4">
					{pinnedPosts.length > 0 && regularPosts.length > 0 && (
						<h2 className="font-sans font-semibold text-sm text-[#666] uppercase tracking-wide">
							Recent Posts
						</h2>
					)}
					{regularPosts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							expanded={expandedComments.includes(post.id)}
							onToggleComments={() => toggleComments(post.id)}
							currentUser={teacherName}
							classId={classId}
						/>
					))}
				</div>
			)}

			{!isLoading && announcements.length === 0 && (
				<div className="text-center py-16">
					<MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No announcements yet.</p>
					<p className="text-sm text-[#999]">Post something to get started!</p>
				</div>
			)}

			{hasNextPage && (
				<div className="flex justify-center pt-6 pb-10">
					<Button
						type="button"
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
						className="rounded-xl border-[#E0DCD5] text-[#666] hover:bg-[#F0EDE8] px-8"
					>
						{isFetchingNextPage ? 'Loading more...' : 'Load More Posts'}
					</Button>
				</div>
			)}
		</div>
	);
}

// ---- COMPONENT POST CARD ----
interface PostCardProps {
	post: PostData;
	isPinned?: boolean;
	expanded: boolean;
	onToggleComments: () => void;
	currentUser: string;
	classId: number;
}

function PostCard({
	post,
	isPinned,
	expanded,
	onToggleComments,
	currentUser,
	classId,
}: PostCardProps) {
	const queryClient = useQueryClient();
	const isAuthor = currentUser === post.author;

	const [isEditingPost, setIsEditingPost] = useState(false);
	const [editPostContent, setEditPostContent] = useState(post.content);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const [newComment, setNewComment] = useState('');
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [editCommentContent, setEditCommentContent] = useState('');

	const invalidateFeed = () =>
		queryClient.invalidateQueries({ queryKey: queryKeys.news.list(classId) });

	const deletePostMut = useMutation({
		mutationFn: () => NewsService.deleteNews(post.id),
		onSuccess: invalidateFeed,
	});
	const updatePostMut = useMutation({
		mutationFn: () => NewsService.updateNews(post.id, { content: editPostContent, classId }),
		onSuccess: () => {
			setIsEditingPost(false);
			invalidateFeed();
		},
	});

	// Mutation: Ghim/Bỏ ghim bài viết
	const togglePinMut = useMutation({
		mutationFn: () => {
			const audience: PostAudience =
				post.audience === 'students' || post.audience === 'all' ? post.audience : 'all';

			return NewsService.updateNews(post.id, {
				classId,
				content: post.content,
				audience,
				isPinned: !post.isPinned,
			});
		},
		onSuccess: invalidateFeed,
	});

	const addCommentMut = useMutation({
		mutationFn: () => NewsService.createComment({ newsId: post.id, content: newComment }),
		onSuccess: () => {
			setNewComment('');
			onToggleComments();
			invalidateFeed();
		},
	});
	const deleteCommentMut = useMutation({
		mutationFn: (id: string) => NewsService.deleteComment(id),
		onSuccess: invalidateFeed,
	});
	const updateCommentMut = useMutation({
		mutationFn: (id: string) => NewsService.updateComment(id, editCommentContent),
		onSuccess: () => {
			setEditingCommentId(null);
			invalidateFeed();
		},
	});

	const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<>
			<div
				className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${isPinned ? 'border-[#E57373]/50' : 'border-[#E0DCD5]'}`}
			>
				{isPinned && (
					<div className="absolute -top-1 right-4 z-10">
						<div className="w-6 h-6 rounded-full bg-[#E57373] shadow-md flex items-center justify-center">
							<Pin className="w-3 h-3 text-white" />
						</div>
					</div>
				)}

				<div className="p-5">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
							{(post.author || 'Member')
								.split(' ')
								.slice(0, 2)
								.map((n: string) => (n ? n[0] : ''))
								.join('')}
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-[#333]">{post.author}</span>
								<Star className="w-4 h-4 text-[#F5B041] fill-[#F5B041]" />
							</div>
							<p className="text-xs text-[#999]">{formattedDate}</p>
						</div>

						{isAuthor && !isEditingPost && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-[#999] hover:text-[#333]"
									>
										<MoreHorizontal className="w-5 h-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="rounded-xl min-w-[140px]">
									{/* NÚT GHIM ĐƯỢC THÊM VÀO ĐÂY */}
									<DropdownMenuItem
										onClick={() => togglePinMut.mutate()}
										disabled={togglePinMut.isPending}
										className="cursor-pointer text-[#666]"
									>
										{post.isPinned ? (
											<PinOff className="w-4 h-4 mr-2" />
										) : (
											<Pin className="w-4 h-4 mr-2" />
										)}
										{post.isPinned ? 'Unpin Post' : 'Pin to Top'}
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => setIsEditingPost(true)}
										className="cursor-pointer text-[#666]"
									>
										<Pencil className="w-4 h-4 mr-2" /> Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setIsDeleteModalOpen(true)}
										disabled={deletePostMut.isPending}
										className="cursor-pointer text-[#E57373] hover:text-red-600 hover:bg-red-50"
									>
										<Trash2 className="w-4 h-4 mr-2" /> Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>

					{isEditingPost ? (
						<div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E0DCD5]">
							<Textarea
								value={editPostContent}
								onChange={(e) => setEditPostContent(e.target.value)}
								className="min-h-20 mb-3 bg-white"
							/>
							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setIsEditingPost(false);
										setEditPostContent(post.content);
									}}
									className="rounded-lg"
								>
									Cancel
								</Button>
								<Button
									type="button"
									size="sm"
									onClick={() => updatePostMut.mutate()}
									disabled={updatePostMut.isPending || !editPostContent.trim()}
									className="rounded-lg bg-[#F5B041] hover:bg-[#E5A030] text-[#333]"
								>
									Save
								</Button>
							</div>
						</div>
					) : (
						<p className="text-[#333] leading-relaxed whitespace-pre-wrap">{post.content}</p>
					)}

					{post.mediaUrl && !isEditingPost && (
						<div className="mt-4 rounded-xl overflow-hidden border border-[#E0DCD5]">
							<img
								src={post.mediaUrl}
								alt="Post media"
								className="w-full max-h-[400px] object-cover"
								onError={(e) => {
									e.currentTarget.style.display = 'none';
								}}
							/>
						</div>
					)}

					<button
						type="button"
						onClick={onToggleComments}
						className="mt-4 flex items-center gap-2 text-sm text-[#666] hover:text-[#333]"
					>
						<MessageCircle className="w-4 h-4" />
						{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
					</button>
				</div>

				{expanded && (
					<div className="border-t border-[#E0DCD5] bg-[#FAF9F6] p-4 space-y-3">
						{post.comments.map((comment) => {
							const isCommentAuthor = currentUser === comment.author;
							const isEditingThis = editingCommentId === comment.id;

							return (
								<div
									key={comment.id}
									className="bg-[#F5B041]/10 rounded-xl p-3 ml-4 border-l-4 border-[#F5B041] relative group"
								>
									<div className="flex items-center justify-between gap-2 mb-1">
										<div className="flex items-center gap-2">
											<span className="font-semibold text-sm text-[#333]">{comment.author}</span>
											<span className="px-1.5 py-0.5 rounded text-xs font-medium capitalize bg-[#A8D5BA]/30 text-[#2E7D32]">
												{comment.authorRole}
											</span>
										</div>

										{isCommentAuthor && !isEditingThis && (
											<div className="hidden group-hover:flex items-center gap-1">
												<button
													type="button"
													onClick={() => {
														setEditingCommentId(comment.id);
														setEditCommentContent(comment.content);
													}}
													className="p-1 text-[#999] hover:text-[#333]"
												>
													<Pencil className="w-3.5 h-3.5" />
												</button>
												<button
													type="button"
													onClick={() => deleteCommentMut.mutate(comment.id)}
													className="p-1 text-[#E57373] hover:text-red-700"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											</div>
										)}
									</div>

									{isEditingThis ? (
										<div className="mt-2">
											<Textarea
												value={editCommentContent}
												onChange={(e) => setEditCommentContent(e.target.value)}
												className="min-h-10 text-sm mb-2 bg-white"
											/>
											<div className="flex justify-end gap-2">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => setEditingCommentId(null)}
													className="h-7 text-xs"
												>
													Cancel
												</Button>
												<Button
													type="button"
													size="sm"
													onClick={() => updateCommentMut.mutate(comment.id)}
													disabled={updateCommentMut.isPending || !editCommentContent.trim()}
													className="h-7 text-xs bg-[#F5B041] hover:bg-[#E5A030] text-[#333]"
												>
													Save
												</Button>
											</div>
										</div>
									) : (
										<>
											<p className="text-sm text-[#666]">{comment.content}</p>
											<p className="text-xs text-[#999] mt-1">
												{new Date(comment.createdAt).toLocaleDateString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													month: 'short',
													day: 'numeric',
												})}
											</p>
										</>
									)}
								</div>
							);
						})}

						<div className="flex items-start gap-2 mt-4 ml-4">
							<div className="w-8 h-8 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold text-xs shrink-0">
								{currentUser
									.split(' ')
									.map((n: string) => n[0])
									.join('')}
							</div>
							<div className="flex-1 relative">
								<Textarea
									placeholder="Write a comment..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									className="min-h-10 pr-10 resize-none rounded-xl text-sm"
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											if (newComment.trim()) addCommentMut.mutate();
										}
									}}
								/>
								<button
									type="button"
									onClick={() => addCommentMut.mutate()}
									disabled={!newComment.trim() || addCommentMut.isPending}
									className="absolute right-2 bottom-2 p-1.5 text-[#F5B041] hover:text-[#E5A030] disabled:opacity-50 disabled:hover:text-[#F5B041]"
								>
									<Send className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<ConfirmActionModal
				title="Do you really want to delete this post?"
				description="Can not revert this action. This announcement and all comments will be removed."
				confirmLabel="Delete Post"
				isPending={deletePostMut.isPending}
				open={isDeleteModalOpen}
				onOpenChange={setIsDeleteModalOpen}
				onConfirm={async () => {
					await deletePostMut.mutateAsync();
				}}
			/>
		</>
	);
}
