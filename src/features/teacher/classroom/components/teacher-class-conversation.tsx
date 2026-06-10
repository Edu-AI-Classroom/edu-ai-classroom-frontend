'use client';

import { useState } from 'react';
import { ChatPanel } from '@/features/chat/chat-panel';
import { useTeacherConversations } from '@/hooks/queries/chat/use-chat-query';

type TeacherClassConversationProps = {
	classId: number | string;
};

export default function TeacherClassConversation({ classId }: TeacherClassConversationProps) {
	const numericClassId = Number(classId);
	const { data: conversations = [] } = useTeacherConversations(
		Number.isFinite(numericClassId) ? numericClassId : undefined,
	);
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

	return (
		<ChatPanel
			conversations={conversations}
			selectedConversationId={selectedConversationId ?? conversations[0]?.conversationId}
			onSelectConversation={setSelectedConversationId}
			emptyText="Parent and student conversations will appear here after they start a chat."
		/>
	);
}
