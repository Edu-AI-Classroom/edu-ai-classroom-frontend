export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/api/auth/login',
		REGISTER: '/api/auth/register',
		REFRESH_TOKEN: '/api/auth/refresh-token',
	},

	USER: {
		LIST: '/api/users',
		USER_PROFILE: (userId: number) => `/api/users/${userId}`,
	},

	SUBJECT: {
		GET_SUBJECTS: '/api/subjects',
	},

	CLASS: {
		CREATE_CLASS: '/api/classrooms',
		GET_CLASS_LIST: '/api/classrooms',
		GET_DETAIL: (classId: number) => `/api/classrooms/${classId}`,
		UPDATE_DETAIL: (classId: number) => `/api/classrooms/${classId}`,
		DELETE_CLASS: (classId: number) => `/api/classrooms/${classId}`,

		ASSIGN_STUDENT_TO_CLASS: (classId: number) => `/api/classrooms/${classId}/students`,
		GET_STUDENTS: (classId: number) => `/api/classrooms/${classId}/students`,
		REMOVE_STUDENT_FROM_CLASS: (classId: number, studentId: number) =>
			`/api/classrooms/${classId}/students/${studentId}`,

		ADD_TEACHER_TO_CLASS: (classId: number) => `/api/classrooms/${classId}/teachers`,
		GET_TEACHERS: (classId: number) => `/api/classrooms/${classId}/teachers`,
		REMOVE_TEACHER_FROM_CLASS: (classId: number, teacherId: number) =>
			`/api/classrooms/${classId}/teachers/${teacherId}`,

		CREATE_STUDENT_GROUP: (classId: number) => `/api/classrooms/${classId}/groups`,
		GET_STUDENT_GROUP_LIST: (classId: number) => `/api/classrooms/${classId}/groups`,
		GET_STUDENT_GROUP_DETAIL: (classId: number, groupId: number) =>
			`/api/classrooms/${classId}/groups/${groupId}`,
		UPDATE_STUDENT_GROUP_DETAIL: (classId: number, groupId: number) =>
			`/api/classrooms/${classId}/groups/${groupId}`,
		DELETE_STUDENT_GROUP: (classId: number, groupId: number) =>
			`/api/classrooms/${classId}/groups/${groupId}`,

		ASSIGN_STUDENT_TO_GROUP: (classId: number, groupId: number) =>
			`/api/classrooms/${classId}/groups/${groupId}/students`,
		REMOVE_STUDENT_FROM_GROUP: (classId: number, groupId: number, studentId: number) =>
			`/api/classrooms/${classId}/groups/${groupId}/students/${studentId}`,
	},

	NEWS: {
		CREATE: '/api/news',
		GET_BY_CLASS: (classId: number) => `/api/news/class/${classId}`,
		GET_DETAIL: (id: number | string) => `/api/news/${id}`,
		UPDATE: (id: number | string) => `/api/news/${id}`,
		DELETE: (id: number | string) => `/api/news/${id}`,
	},

	COMMENTS: {
		CREATE: '/api/comments',
		GET_BY_NEWS: (newsId: number | string) => `/api/comments/news/${newsId}`,
		UPDATE: (id: number | string) => `/api/comments/${id}`,
		DELETE: (id: number | string) => `/api/comments/${id}`,
	},

	ASSIGNMENT: {
		CREATE_ASSIGNMENT: '/api/assignments',
		GET_ASSIGNMENTS: '/api/assignments',
		GET_ASSIGNMENT_DETAIL: (assignmentId: number) => `/api/assignments/${assignmentId}`,
		UPDATE_ASSIGNMENT: (assignmentId: number) => `/api/assignments/${assignmentId}`,
		DELETE_ASSIGNMENT: (assignmentId: number) => `/api/assignments/${assignmentId}`,
	},
};
