'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatPanel } from '@/features/chat/chat-panel';
import {
	useCreateStudentConversation,
	useStudentConversations,
} from '@/hooks/queries/chat/use-chat-query';

type StudentClassConversationProps = {
	classId: number;
};

export default function StudentClassConversation({ classId }: StudentClassConversationProps) {
	const { data: conversations = [] } = useStudentConversations(classId);
	const createConversation = useCreateStudentConversation();
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

	useEffect(() => {
		if (!selectedConversationId && conversations[0]?.conversationId) {
			setSelectedConversationId(conversations[0].conversationId);
		}
	}, [conversations, selectedConversationId]);

	const startConversation = async () => {
		const conversation = await createConversation.mutateAsync(classId);
		setSelectedConversationId(conversation.conversationId);
	};

	if (conversations.length === 0) {
		return (
			<div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-[#E0DCD5] bg-white p-8 text-center shadow-sm">
				<div className="max-w-sm">
					<h2 className="font-sans text-xl font-bold text-[#333]">Message your teacher</h2>
					<p className="mt-2 text-sm text-[#666]">
						Start a private classroom conversation with the owner teacher for this class.
					</p>
					<Button
						type="button"
						onClick={() => void startConversation()}
						disabled={createConversation.isPending}
						className="mt-5 rounded-xl bg-[#F5B041] text-[#333] hover:bg-[#e5a23c]"
					>
						Start chat
					</Button>
				</div>
			</div>
		);
	}

	return (
		<ChatPanel
			conversations={conversations}
			selectedConversationId={selectedConversationId ?? conversations[0]?.conversationId}
			onSelectConversation={setSelectedConversationId}
			emptyText="Start a chat with your teacher for this class."
		/>
	);
}
