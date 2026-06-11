import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chat/chat.service';

export function useTeacherConversations(classId?: number) {
	return useQuery({
		queryKey: ['chat', 'teacher', 'conversations', classId ?? 'all'],
		queryFn: () => ChatService.getTeacherConversations(classId),
		refetchInterval: 8000,
	});
}

export function useStudentConversations(classId?: number) {
	return useQuery({
		queryKey: ['chat', 'student', 'conversations', classId ?? 'all'],
		queryFn: () => ChatService.getStudentConversations(classId),
		refetchInterval: 8000,
	});
}

export function useCreateStudentConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (classId: number) => ChatService.createStudentConversation(classId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['chat', 'student', 'conversations'] });
			void queryClient.invalidateQueries({ queryKey: ['chat'] });
		},
	});
}

export function useChatMessages(conversationId?: number) {
	return useQuery({
		queryKey: ['chat', 'messages', conversationId],
		queryFn: () => ChatService.getMessages(conversationId as number),
		enabled: !!conversationId,
		refetchInterval: conversationId ? 5000 : false,
	});
}

export function useSendChatMessage(conversationId?: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ body, files }: { body: string; files?: File[] }) =>
			ChatService.sendMessage(conversationId as number, body, files ?? []),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
			void queryClient.invalidateQueries({ queryKey: ['chat'] });
			void queryClient.invalidateQueries({ queryKey: ['parent', 'conversations'] });
		},
	});
}
