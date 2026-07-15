export type AgoraParticipant = {
	userId: number;
	userName: string;
	role: 'TEACHER' | 'STUDENT' | string;
	speakerEnabled: boolean;
	joinedAt?: string | null;
	leftAt?: string | null;
};

export type AgoraSession = {
	sessionId: string;
	classId: number;
	channelName: string;
	status: 'ACTIVE' | 'ENDED' | string;
	createdByUserId: number;
	createdByUserName: string;
	title?: string | null;
	scheduledStartAt?: string | null;
	startedAt?: string | null;
	endedAt?: string | null;
	participantCount: number;
	attendanceCount: number;
	participants: AgoraParticipant[];
};

export type AgoraToken = {
	appId: string;
	rtcToken: string;
	channelName: string;
	uid: number;
	role: 'PUBLISHER' | 'SUBSCRIBER' | string;
	expireAt: string;
};

export type CreateAgoraSessionDto = {
	title?: string;
	scheduledStartAt?: string;
};

export type AgoraConversationCall = {
	callId: string;
	conversationId: number;
	classId: number;
	className?: string | null;
	studentName?: string | null;
	channelName: string;
	status: 'RINGING' | 'ACTIVE' | 'DECLINED' | 'ENDED' | string;
	callerId: number;
	callerName: string;
	recipientId: number;
	recipientName: string;
	incoming: boolean;
	createdAt?: string | null;
	acceptedAt?: string | null;
	endedAt?: string | null;
};
