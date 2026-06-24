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
		<div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-[0_18px_45px_rgba(51,51,51,0.08)] ring-1 ring-white lg:grid-cols-[320px_1fr]">
			<aside className="border-b border-[#E0DCD5] bg-[#FAF9F6]/95 lg:border-r lg:border-b-0">
				<div className="border-b border-[#E0DCD5] bg-white/60 p-4">
					<h2 className="font-sans text-lg font-bold text-[#333]">Messages</h2>
					<p className="text-sm text-[#666]">{conversations.length} conversations</p>
				</div>
				<div className="max-h-[520px] space-y-2 overflow-auto p-3">
					{conversations.length === 0 ? (
						<p className="rounded-2xl border border-dashed border-[#D7D0C5] bg-white/70 p-4 text-sm text-[#666]">
							{emptyText}
						</p>
					) : (
						conversations.map((conversation) => (
							<button
								key={conversation.conversationId}
								type="button"
								onClick={() => onSelectConversation(conversation.conversationId)}
								className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
									selectedConversationId === conversation.conversationId
										? 'border-[#F5B041]/70 bg-[#F5B041]/20 shadow-sm ring-1 ring-[#F5B041]/20'
										: 'border-transparent bg-white/60 hover:border-[#E0DCD5] hover:bg-white'
								}`}
							>
								<div className="flex items-center justify-between gap-3">
									<p className="truncate font-semibold text-[#333]">
										{getConversationTitle(conversation)}
									</p>
									<span className="shrink-0 rounded-full border border-[#E0DCD5] bg-white px-2 py-0.5 text-xs text-[#666]">
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
						<header className="border-b border-[#E0DCD5] bg-white/90 p-5">
							<h3 className="font-sans text-lg font-bold text-[#333]">
								{getConversationTitle(selectedConversation)}
							</h3>
							<p className="text-sm text-[#666]">
								{selectedConversation.className} - {selectedConversation.studentName}
							</p>
						</header>
						<div className="flex-1 space-y-3 overflow-auto bg-[linear-gradient(#E9E3D8_1px,transparent_1px),linear-gradient(90deg,#E9E3D8_1px,transparent_1px)] bg-[length:32px_32px] bg-[#FAF9F6]/80 p-5">
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
											className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-[0_8px_24px_rgba(51,51,51,0.08)] ${
												alignRight
													? 'bg-[#F5B041] text-[#333]'
													: 'border border-[#E0DCD5] bg-white text-[#333]'
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
															className="flex items-center gap-2 rounded-xl bg-white/55 px-2 py-1 underline transition hover:bg-white"
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
								<div className="mx-auto mt-16 max-w-sm rounded-3xl border border-dashed border-[#D7D0C5] bg-white/80 p-8 text-center text-sm text-[#666] shadow-sm">
									Start the conversation.
								</div>
							)}
						</div>
						<div className="border-t border-[#E0DCD5] bg-white/95 p-4">
							{files.length > 0 && (
								<div className="mb-2 flex flex-wrap gap-2">
									{files.map((file) => (
										<span
											key={`${file.name}-${file.size}`}
											className="rounded-full border border-[#E0DCD5] bg-[#F0EDE8] px-3 py-1 text-xs text-[#333]"
										>
											{file.name}
										</span>
									))}
								</div>
							)}
							<div className="flex gap-2">
								<label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#E0DCD5] bg-white px-3 shadow-sm transition hover:border-[#F5B041] hover:bg-[#FFF8EB]">
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
									className="rounded-xl border-[#E0DCD5] bg-white shadow-sm focus-visible:ring-[#F5B041]"
								/>
								<Button
									type="button"
									onClick={() => void send()}
									disabled={sendMutation.isPending || (!body.trim() && files.length === 0)}
									className="rounded-xl bg-[#F5B041] text-[#333] shadow-sm hover:bg-[#e5a23c]"
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className="flex flex-1 items-center justify-center p-6 text-center text-[#666]">
						<div className="rounded-3xl border border-dashed border-[#D7D0C5] bg-[#FAF9F6]/80 px-8 py-10 shadow-sm">
							Select a conversation to start chatting.
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
