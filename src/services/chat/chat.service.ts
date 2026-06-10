import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { http, } from '@/services/http';
import { httpGet, httpPatch, httpPost } from '@/services/http.helpers';
import type { ChatMessage, Conversation } from '@/types/chat';

export const ChatService = {
	getTeacherConversations: (classId?: number) => {
		const query = classId ? `?classId=${classId}` : '';
		return httpGet<Conversation[]>(`${API_ENDPOINTS.CHAT.TEACHER_CONVERSATIONS}${query}`);
	},

	getStudentConversations: (classId?: number) => {
		const query = classId ? `?classId=${classId}` : '';
		return httpGet<Conversation[]>(`${API_ENDPOINTS.CHAT.STUDENT_CONVERSATIONS}${query}`);
	},

	createStudentConversation: (classId: number) =>
		httpPost<Conversation>(API_ENDPOINTS.CHAT.STUDENT_CONVERSATIONS, { classId }),

	getMessages: (conversationId: number) =>
		httpGet<ChatMessage[]>(API_ENDPOINTS.CHAT.MESSAGES(conversationId)),

	sendMessage: (conversationId: number, body: string, files: File[] = []) => {
		if (files.length === 0) {
			return httpPost<ChatMessage>(API_ENDPOINTS.CHAT.MESSAGES(conversationId), { body });
		}

		const formData = new FormData();
		formData.set('body', body);
		for (const file of files) {
			formData.append('files', file);
		}

		return http<ChatMessage>(API_ENDPOINTS.CHAT.MESSAGES_WITH_FILES(conversationId), {
			method: 'POST',
			body: formData,
		});
	},

	markRead: (conversationId: number) =>
		httpPatch<{ readAt: string }>(API_ENDPOINTS.CHAT.MARK_READ(conversationId)),
};
