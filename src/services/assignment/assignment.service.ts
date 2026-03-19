import buildQueryString from '@/lib/utils/buildQueryString';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http.helpers';
import type { PaginationParams } from '@/types/api';
import type {
	Assignment,
	AssignmentResponse,
	CreateAssignmentPayload,
	UpdateAssignmentPayload,
} from '@/types/class';

export const AssignmentService = {
	createAssignment: (payload: CreateAssignmentPayload) =>
		httpPost<AssignmentResponse>(API_ENDPOINTS.ASSIGNMENT.CREATE_ASSIGNMENT, payload),

	getAssignments: (params?: PaginationParams) =>
		httpGet<Assignment[]>(`${API_ENDPOINTS.ASSIGNMENT.GET_ASSIGNMENTS}${buildQueryString(params)}`),

	getAssignmentsByClassroom: (classId: number) =>
		httpGet<Assignment[]>(`${API_ENDPOINTS.ASSIGNMENT.GET_ASSIGNMENTS}?classId=${classId}`),

	getAssignmentDetail: (assignmentId: number) =>
		httpGet<Assignment>(API_ENDPOINTS.ASSIGNMENT.GET_ASSIGNMENT_DETAIL(assignmentId)),

	updateAssignment: (assignmentId: number, payload: UpdateAssignmentPayload) =>
		httpPut<AssignmentResponse>(API_ENDPOINTS.ASSIGNMENT.UPDATE_ASSIGNMENT(assignmentId), payload),

	deleteAssignment: (assignmentId: number) =>
		httpDelete<void>(API_ENDPOINTS.ASSIGNMENT.DELETE_ASSIGNMENT(assignmentId)),
};
