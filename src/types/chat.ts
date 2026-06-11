export type MessageAttachment = {
	attachmentId: number;
	fileUrl: string;
	fileName: string;
	mimeType: string;
	fileSize: number;
};

export type ChatMessage = {
	messageId: number;
	conversationId: number;
	senderId: number;
	senderName: string;
	senderRole?: string | null;
	senderProfilePicture?: string | null;
	body?: string | null;
	createdAt: string;
	attachments: MessageAttachment[];
	reads?: Array<{ userId: number; readAt: string }>;
};

export type Conversation = {
	conversationId: number;
	conversationType?: 'PARENT_TEACHER' | 'STUDENT_TEACHER';
	classId: number;
	className: string;
	subjectName?: string | null;
	studentId: number;
	studentName: string;
	parentId?: number | null;
	parentName: string;
	teacherId: number;
	teacherName: string;
	createdAt: string;
	updatedAt?: string | null;
	lastMessageAt?: string | null;
	lastMessage?: ChatMessage | null;
	viewerRole?: 'PARENT' | 'TEACHER' | 'STUDENT';
};
