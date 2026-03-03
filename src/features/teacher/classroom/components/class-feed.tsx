'use client';

import { ChevronDown, ChevronUp, MessageCircle, Paperclip, Pin, Send, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { type ClassData, currentTeacher, getAnnouncementsForClass } from '@/lib/mock-data';

interface ClassFeedProps {
	classData: ClassData;
}

export default function ClassFeed({ classData }: ClassFeedProps) {
	const announcements = getAnnouncementsForClass(classData.id);
	const [newPost, setNewPost] = useState('');
	const [audience, setAudience] = useState<'students' | 'parents' | 'all'>('all');
	const [expandedComments, setExpandedComments] = useState<string[]>([]);

	const toggleComments = (id: string) => {
		setExpandedComments((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handlePost = () => {
		if (newPost.trim()) {
			// In a real app, this would add to the feed
			setNewPost('');
		}
	};

	const pinnedPosts = announcements.filter((a) => a.isPinned);
	const regularPosts = announcements.filter((a) => !a.isPinned);

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-sans font-bold text-2xl text-[#333]">Class Feed</h1>
				<p className="font-serif text-lg text-[#666]">Announcements & Updates</p>
			</div>

			{/* Compose Box */}
			<div
				className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5]"
				style={{
					backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #E8E4DF 28px)',
					backgroundPosition: '0 12px',
				}}
			>
				<div className="flex items-start gap-3">
					<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold shrink-0">
						{currentTeacher.name
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</div>
					<div className="flex-1">
						<Textarea
							placeholder="Share an announcement with your class..."
							value={newPost}
							onChange={(e) => setNewPost(e.target.value)}
							className="min-h-[80px] border-none bg-transparent resize-none focus-visible:ring-0 p-0 text-[#333] placeholder:text-[#999]"
						/>
						<div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E0DCD5]">
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="sm" className="text-[#666] rounded-xl">
									<Paperclip className="w-4 h-4 mr-1" />
									Attach
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="rounded-xl text-[#666] bg-transparent"
										>
											{audience === 'all'
												? 'Everyone'
												: audience === 'students'
													? 'Students'
													: 'Parents'}
											<ChevronDown className="w-3 h-3 ml-1" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="rounded-xl">
										<DropdownMenuItem onClick={() => setAudience('all')}>Everyone</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setAudience('students')}>
											Students Only
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setAudience('parents')}>
											Parents Only
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<Button
								onClick={handlePost}
								disabled={!newPost.trim()}
								className="bg-[#F5B041] hover:bg-[#E5A030] text-[#333] font-semibold rounded-xl"
							>
								<Send className="w-4 h-4 mr-2" />
								Post
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Pinned Posts */}
			{pinnedPosts.length > 0 && (
				<div className="space-y-4">
					<h2 className="font-sans font-semibold text-sm text-[#666] uppercase tracking-wide flex items-center gap-2">
						<Pin className="w-4 h-4" />
						Pinned
					</h2>
					{pinnedPosts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							isPinned
							expanded={expandedComments.includes(post.id)}
							onToggleComments={() => toggleComments(post.id)}
						/>
					))}
				</div>
			)}

			{/* Regular Posts */}
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
					/>
				))}
			</div>

			{announcements.length === 0 && (
				<div className="text-center py-16">
					<MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No announcements yet.</p>
					<p className="text-sm text-[#999]">Post something to get started!</p>
				</div>
			)}
		</div>
	);
}

interface PostCardProps {
	post: {
		id: string;
		author: string;
		content: string;
		createdAt: string;
		isPinned: boolean;
		audience: string;
		commentCount: number;
		comments: {
			id: string;
			author: string;
			authorRole: string;
			content: string;
			createdAt: string;
		}[];
	};
	isPinned?: boolean;
	expanded: boolean;
	onToggleComments: () => void;
}

function PostCard({ post, isPinned, expanded, onToggleComments }: PostCardProps) {
	return (
		<div
			className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
				isPinned ? 'border-[#E57373]/50' : 'border-[#E0DCD5]'
			}`}
			style={{
				transform: `rotate(${isPinned ? 0 : Math.random() * 0.4 - 0.2}deg)`,
			}}
		>
			{/* Pushpin for pinned posts */}
			{isPinned && (
				<div className="absolute -top-1 right-4 z-10">
					<div className="w-6 h-6 rounded-full bg-[#E57373] shadow-md flex items-center justify-center">
						<Pin className="w-3 h-3 text-white" />
					</div>
				</div>
			)}

			<div className="p-5">
				{/* Author */}
				<div className="flex items-center gap-3 mb-3">
					<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
						{post.author
							.split(' ')
							.slice(0, 2)
							.map((n) => n[0])
							.join('')}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-[#333]">{post.author}</span>
							<Star className="w-4 h-4 text-[#F5B041] fill-[#F5B041]" />
						</div>
						<p className="text-xs text-[#999]">{post.createdAt}</p>
					</div>
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-[#F0EDE8] text-[#666]">
						{post.audience === 'all' ? 'Everyone' : post.audience}
					</span>
				</div>

				{/* Content */}
				<p className="text-[#333] leading-relaxed whitespace-pre-wrap">{post.content}</p>

				{/* Comments Toggle */}
				{post.comments.length > 0 && (
					<button
						type="button"
						onClick={onToggleComments}
						className="mt-4 flex items-center gap-2 text-sm text-[#666] hover:text-[#333]"
					>
						<MessageCircle className="w-4 h-4" />
						{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
						{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
					</button>
				)}
			</div>

			{/* Comments Section */}
			{expanded && post.comments.length > 0 && (
				<div className="border-t border-[#E0DCD5] bg-[#FAF9F6] p-4 space-y-3">
					{post.comments.map((comment) => (
						<div
							key={comment.id}
							className="bg-[#F5B041]/10 rounded-xl p-3 ml-4 border-l-4 border-[#F5B041]"
							style={{ transform: `rotate(${Math.random() * 0.3 - 0.15}deg)` }}
						>
							<div className="flex items-center gap-2 mb-1">
								<span className="font-semibold text-sm text-[#333]">{comment.author}</span>
								<span
									className={`px-1.5 py-0.5 rounded text-xs font-medium ${
										comment.authorRole === 'teacher'
											? 'bg-[#F5B041]/30 text-[#B8860B]'
											: comment.authorRole === 'parent'
												? 'bg-[#C5B4E3]/30 text-[#6B5B95]'
												: 'bg-[#A8D5BA]/30 text-[#2E7D32]'
									}`}
								>
									{comment.authorRole}
								</span>
							</div>
							<p className="text-sm text-[#666]">{comment.content}</p>
							<p className="text-xs text-[#999] mt-1">{comment.createdAt}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
