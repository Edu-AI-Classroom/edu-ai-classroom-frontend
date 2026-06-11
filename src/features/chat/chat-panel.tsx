'use client';

import { Paperclip, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatMessages, useSendChatMessage } from '@/hooks/queries/chat/use-chat-query';
import type { Conversation } from '@/types/chat';

type ChatPanelProps = {
	conversations: Conversation[];
	selectedConversationId?: number | null;
	onSelectConversation: (conversationId: number) => void;
	emptyText?: string;
};

export function ChatPanel({
	conversations,
	selectedConversationId,
	onSelectConversation,
	emptyText = 'No conversations yet.',
}: ChatPanelProps) {
	const selectedConversation = useMemo(
		() => conversations.find((c) => c.conversationId === selectedConversationId) ?? null,
		[conversations, selectedConversationId],
	);
	const { data: messages = [] } = useChatMessages(selectedConversation?.conversationId);
	const sendMutation = useSendChatMessage(selectedConversation?.conversationId);
	const [body, setBody] = useState('');
	const [files, setFiles] = useState<File[]>([]);

	const getConversationTitle = (conversation: Conversation) => {
		if (conversation.viewerRole === 'PARENT' || conversation.viewerRole === 'STUDENT') {
			return conversation.teacherName;
		}
		return conversation.conversationType === 'STUDENT_TEACHER'
			? conversation.studentName
			: conversation.parentName;
	};

	const send = async () => {
		if (!selectedConversation || (!body.trim() && files.length === 0)) return;
		await sendMutation.mutateAsync({ body, files });
		setBody('');
		setFiles([]);
	};

	return (
		<div className="grid min-h-[560px] overflow-hidden rounded-2xl border border-[#E0DCD5] bg-white shadow-sm lg:grid-cols-[320px_1fr]">
			<aside className="border-b border-[#E0DCD5] bg-[#FAF9F6] lg:border-r lg:border-b-0">
				<div className="border-b border-[#E0DCD5] p-4">
					<h2 className="font-sans text-lg font-bold text-[#333]">Messages</h2>
					<p className="text-sm text-[#666]">{conversations.length} conversations</p>
				</div>
				<div className="max-h-[520px] overflow-auto">
					{conversations.length === 0 ? (
						<p className="p-4 text-sm text-[#666]">{emptyText}</p>
					) : (
						conversations.map((conversation) => (
							<button
								key={conversation.conversationId}
								type="button"
								onClick={() => onSelectConversation(conversation.conversationId)}
								className={`w-full border-b border-[#E0DCD5] p-4 text-left transition ${
									selectedConversationId === conversation.conversationId
										? 'bg-[#F5B041]/20'
										: 'hover:bg-white'
								}`}
							>
								<div className="flex items-center justify-between gap-3">
									<p className="truncate font-semibold text-[#333]">
										{getConversationTitle(conversation)}
									</p>
									<span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs text-[#666]">
										{conversation.className}
									</span>
								</div>
								<p className="mt-1 text-xs text-[#666]">
									{conversation.conversationType === 'STUDENT_TEACHER'
										? 'Student chat'
										: `Student: ${conversation.studentName}`}
								</p>
								<p className="mt-2 truncate text-sm text-[#666]">
									{conversation.lastMessage?.body ??
										(conversation.lastMessage?.attachments?.length
											? 'Attachment'
											: 'No messages yet')}
								</p>
							</button>
						))
					)}
				</div>
			</aside>

			<section className="flex min-h-[560px] flex-col">
				{selectedConversation ? (
					<>
						<header className="border-b border-[#E0DCD5] p-4">
							<h3 className="font-sans text-lg font-bold text-[#333]">
								{getConversationTitle(selectedConversation)}
							</h3>
							<p className="text-sm text-[#666]">
								{selectedConversation.className} - {selectedConversation.studentName}
							</p>
						</header>
						<div className="flex-1 space-y-3 overflow-auto bg-[#FAF9F6]/70 p-4">
							{messages.map((message) => {
								const isMine =
									message.senderId === selectedConversation.parentId &&
									selectedConversation.viewerRole === 'PARENT';
								const studentMine =
									message.senderId === selectedConversation.studentId &&
									selectedConversation.viewerRole === 'STUDENT';
								const teacherMine =
									message.senderId === selectedConversation.teacherId &&
									selectedConversation.viewerRole === 'TEACHER';
								const alignRight = isMine || studentMine || teacherMine;
								return (
									<div
										key={message.messageId}
										className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}
									>
										<div
											className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
												alignRight ? 'bg-[#F5B041] text-[#333]' : 'bg-white text-[#333]'
											}`}
										>
											{message.body && <p className="whitespace-pre-wrap">{message.body}</p>}
											{message.attachments.length > 0 && (
												<div className="mt-2 space-y-1">
													{message.attachments.map((attachment) => (
														<a
															key={attachment.attachmentId}
															href={attachment.fileUrl}
															target="_blank"
															rel="noreferrer"
															className="flex items-center gap-2 underline"
														>
															<Paperclip className="h-4 w-4" />
															<span className="truncate">{attachment.fileName}</span>
														</a>
													))}
												</div>
											)}
											<p className="mt-2 text-[11px] opacity-70">
												{new Date(message.createdAt).toLocaleString()}
											</p>
										</div>
									</div>
								);
							})}
							{messages.length === 0 && (
								<p className="py-16 text-center text-sm text-[#666]">Start the conversation.</p>
							)}
						</div>
						<div className="border-t border-[#E0DCD5] p-4">
							{files.length > 0 && (
								<div className="mb-2 flex flex-wrap gap-2">
									{files.map((file) => (
										<span
											key={`${file.name}-${file.size}`}
											className="rounded-full bg-[#F0EDE8] px-3 py-1 text-xs text-[#333]"
										>
											{file.name}
										</span>
									))}
								</div>
							)}
							<div className="flex gap-2">
								<label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#E0DCD5] px-3">
									<Paperclip className="h-4 w-4" />
									<input
										type="file"
										multiple
										className="hidden"
										onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 5))}
									/>
								</label>
								<Input
									value={body}
									onChange={(event) => setBody(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === 'Enter' && !event.shiftKey) {
											event.preventDefault();
											void send();
										}
									}}
									placeholder="Write a message..."
									className="rounded-xl bg-white"
								/>
								<Button
									type="button"
									onClick={() => void send()}
									disabled={sendMutation.isPending || (!body.trim() && files.length === 0)}
									className="rounded-xl bg-[#F5B041] text-[#333] hover:bg-[#e5a23c]"
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className="flex flex-1 items-center justify-center p-6 text-center text-[#666]">
						Select a conversation to start chatting.
					</div>
				)}
			</section>
		</div>
	);
}
