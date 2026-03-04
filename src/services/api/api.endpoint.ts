export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/api/auth/login',
		REGISTER: '/api/users',
		REFRESH_TOKEN: '/api/auth/refresh-token',
	},

	USER: {
		LIST: '/api/users',
		USER_PROFILE: (userId: number) => `/api/users/${userId}`,
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
};
