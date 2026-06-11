import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpDelete, httpGet, httpPost } from '@/services/http.helpers';
import type { ParentClassGradebook, ParentLinkCode, ParentStudent, ParentStudentClass } from '@/types/parent';
import type { Conversation } from '@/types/chat';

export const ParentService = {
	consumeLinkCode: (code: string, relationship?: string) =>
		httpPost<ParentStudent>(API_ENDPOINTS.PARENT.CONSUME_LINK_CODE, { code, relationship }),

	getStudents: () => httpGet<ParentStudent[]>(API_ENDPOINTS.PARENT.STUDENTS),

	getStudentClasses: (studentId: number) =>
		httpGet<ParentStudentClass[]>(API_ENDPOINTS.PARENT.STUDENT_CLASSES(studentId)),

	getStudentClassGradebook: (studentId: number, classId: number) =>
		httpGet<ParentClassGradebook>(
			API_ENDPOINTS.PARENT.STUDENT_CLASS_GRADEBOOK(studentId, classId),
		),

	createConversation: (studentId: number, classId: number) =>
		httpPost<Conversation>(API_ENDPOINTS.PARENT.CONVERSATIONS, { studentId, classId }),

	getConversations: () => httpGet<Conversation[]>(API_ENDPOINTS.PARENT.CONVERSATIONS),
};

export const StudentParentLinkService = {
	create: () => httpPost<ParentLinkCode>(API_ENDPOINTS.STUDENT_PARENT_LINK.CREATE),
	active: () => httpGet<ParentLinkCode | null>(API_ENDPOINTS.STUDENT_PARENT_LINK.ACTIVE),
	revoke: (code: string) => httpDelete<void>(API_ENDPOINTS.STUDENT_PARENT_LINK.REVOKE(code)),
};
