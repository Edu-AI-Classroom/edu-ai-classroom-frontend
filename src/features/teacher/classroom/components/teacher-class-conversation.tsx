'use client';

import { useEffect, useState } from 'react';
import { ChatPanel } from '@/features/chat/chat-panel';
import { useTeacherConversations } from '@/hooks/queries/chat/use-chat-query';

type TeacherClassConversationProps = {
	classId: number | string;
	preferredConversationId?: number | null;
};

export default function TeacherClassConversation({
	classId,
	preferredConversationId,
}: TeacherClassConversationProps) {
	const numericClassId = Number(classId);
	const { data: conversations = [] } = useTeacherConversations(
		Number.isFinite(numericClassId) ? numericClassId : undefined,
	);
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

	useEffect(() => {
		if (preferredConversationId) {
			setSelectedConversationId(preferredConversationId);
		}
	}, [preferredConversationId]);

	return (
		<ChatPanel
			conversations={conversations}
			selectedConversationId={selectedConversationId ?? conversations[0]?.conversationId}
			onSelectConversation={setSelectedConversationId}
			emptyText="Parent and student conversations will appear here after they start a chat."
		/>
	);
}
