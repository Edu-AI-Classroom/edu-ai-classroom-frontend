import buildQueryString from '@/lib/utils/buildQueryString';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http.helpers';
import type { ApiMetaResponse, PaginationParams } from '@/types/api';
import type {
	AddStudentPayload,
	AddTeacherPayload,
	AssignStudentToGroupPayload,
	ClassListResponse,
	Classroom,
	CreateClassroomPayload,
	CreateStudentGroupPayload,
	Group,
	GroupListResponse,
	Student,
	Teacher,
	TeacherApiResponse,
	UpdateClassroomPayload,
	UpdateStudentGroupPayload,
	UsersInClassResponse,
} from '@/types/class';

export const ClassService = {
	createClass: (payload: CreateClassroomPayload) =>
		httpPost<Classroom>(API_ENDPOINTS.CLASS.CREATE_CLASS, payload),

	getClassList: (params?: PaginationParams) =>
		httpGet<ClassListResponse>(`${API_ENDPOINTS.CLASS.GET_CLASS_LIST}${buildQueryString(params)}`),

	getClassDetail: (classId: number) => httpGet<Classroom>(API_ENDPOINTS.CLASS.GET_DETAIL(classId)),

	updateClassDetail: (classId: number, payload: UpdateClassroomPayload) =>
		httpPut<Classroom>(API_ENDPOINTS.CLASS.UPDATE_DETAIL(classId), payload),

	deleteClass: (classId: number) => httpDelete<void>(API_ENDPOINTS.CLASS.DELETE_CLASS(classId)),

	addTeacherToClass: (classId: number, payload: AddTeacherPayload) =>
		httpPost<Teacher>(API_ENDPOINTS.CLASS.ADD_TEACHER_TO_CLASS(classId), payload),

	getTeachers: (classId: number, params?: PaginationParams) =>
		httpGet<TeacherApiResponse[]>(
			`${API_ENDPOINTS.CLASS.GET_TEACHERS(classId)}${buildQueryString(params)}`,
		),

	removeTeacherFromClass: (classId: number, teacherId: number) =>
		httpDelete<void>(API_ENDPOINTS.CLASS.REMOVE_TEACHER_FROM_CLASS(classId, teacherId)),

	addStudentToClass: (classId: number, payload: AddStudentPayload) =>
		httpPost<Student>(API_ENDPOINTS.CLASS.ASSIGN_STUDENT_TO_CLASS(classId), payload),

	getStudents: (classId: number, params?: PaginationParams) =>
		httpGet<UsersInClassResponse>(
			`${API_ENDPOINTS.CLASS.GET_STUDENTS(classId)}${buildQueryString(params)}`,
		),

	removeStudentFromClass: (classId: number, studentId: number) =>
		httpDelete<void>(API_ENDPOINTS.CLASS.REMOVE_STUDENT_FROM_CLASS(classId, studentId)),

	createStudentGroup: (classId: number, payload: CreateStudentGroupPayload) =>
		httpPost<Group>(API_ENDPOINTS.CLASS.CREATE_STUDENT_GROUP(classId), payload),

	getStudentGroupList: (classId: number, params?: PaginationParams) =>
		httpGet<GroupListResponse>(
			`${API_ENDPOINTS.CLASS.GET_STUDENT_GROUP_LIST(classId)}${buildQueryString(params)}`,
		),

	getStudentGroupDetail: (classId: number, groupId: number) =>
		httpGet<Group>(API_ENDPOINTS.CLASS.GET_STUDENT_GROUP_DETAIL(classId, groupId)),

	updateStudentGroupDetail: (
		classId: number,
		groupId: number,
		payload: UpdateStudentGroupPayload,
	) => httpPut<Group>(API_ENDPOINTS.CLASS.UPDATE_STUDENT_GROUP_DETAIL(classId, groupId), payload),

	deleteStudentGroup: (classId: number, groupId: number) =>
		httpDelete<void>(API_ENDPOINTS.CLASS.DELETE_STUDENT_GROUP(classId, groupId)),

	assignStudentToGroup: (classId: number, groupId: number, payload: AssignStudentToGroupPayload) =>
		httpPost<ApiMetaResponse>(
			API_ENDPOINTS.CLASS.ASSIGN_STUDENT_TO_GROUP(classId, groupId),
			payload,
		),

	removeStudentFromGroup: (classId: number, groupId: number, studentId: number) =>
		httpDelete<void>(API_ENDPOINTS.CLASS.REMOVE_STUDENT_FROM_GROUP(classId, groupId, studentId)),
};
