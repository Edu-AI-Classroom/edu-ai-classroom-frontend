import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet, httpPatch, httpPost } from '@/services/http.helpers';
import type {
	AgoraConversationCall,
	AgoraSession,
	AgoraToken,
	CreateAgoraSessionDto,
} from '@/types/agora';

export const AgoraService = {
	listSessions(classId: number) {
		return httpGet<AgoraSession[]>(API_ENDPOINTS.AGORA.SESSIONS(classId));
	},

	getSession(classId: number, sessionId: string) {
		return httpGet<AgoraSession>(API_ENDPOINTS.AGORA.SESSION_DETAIL(classId, sessionId));
	},

	createSession(classId: number, dto: CreateAgoraSessionDto) {
		return httpPost<AgoraSession>(API_ENDPOINTS.AGORA.SESSIONS(classId), dto);
	},

	issueToken(classId: number, sessionId: string, speaker?: boolean) {
		return httpPost<AgoraToken>(API_ENDPOINTS.AGORA.TOKEN(classId, sessionId, speaker));
	},

	joinSession(classId: number, sessionId: string) {
		return httpPost<AgoraSession>(API_ENDPOINTS.AGORA.JOIN(classId, sessionId));
	},

	leaveSession(classId: number, sessionId: string) {
		return httpPost<AgoraSession>(API_ENDPOINTS.AGORA.LEAVE(classId, sessionId));
	},

	endSession(classId: number, sessionId: string) {
		return httpPost<AgoraSession>(API_ENDPOINTS.AGORA.END(classId, sessionId));
	},

	updateParticipant(
		classId: number,
		sessionId: string,
		participantId: number,
		speakerEnabled: boolean,
	) {
		return httpPatch<AgoraSession>(
			API_ENDPOINTS.AGORA.PARTICIPANT(classId, sessionId, participantId),
			{
				speakerEnabled,
			},
		);
	},

	startConversationCall(conversationId: number) {
		return httpPost<AgoraConversationCall>(
			API_ENDPOINTS.AGORA.START_CONVERSATION_CALL(conversationId),
		);
	},

	listActiveConversationCalls() {
		return httpGet<AgoraConversationCall[]>(API_ENDPOINTS.AGORA.ACTIVE_CONVERSATION_CALLS);
	},

	getConversationCall(callId: string) {
		return httpGet<AgoraConversationCall>(API_ENDPOINTS.AGORA.CONVERSATION_CALL(callId));
	},

	acceptConversationCall(callId: string) {
		return httpPost<AgoraConversationCall>(API_ENDPOINTS.AGORA.ACCEPT_CONVERSATION_CALL(callId));
	},

	declineConversationCall(callId: string) {
		return httpPost<AgoraConversationCall>(API_ENDPOINTS.AGORA.DECLINE_CONVERSATION_CALL(callId));
	},

	endConversationCall(callId: string) {
		return httpPost<AgoraConversationCall>(API_ENDPOINTS.AGORA.END_CONVERSATION_CALL(callId));
	},

	issueConversationCallToken(callId: string) {
		return httpPost<AgoraToken>(API_ENDPOINTS.AGORA.CONVERSATION_CALL_TOKEN(callId));
	},
};
