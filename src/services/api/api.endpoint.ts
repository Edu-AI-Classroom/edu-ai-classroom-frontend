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
		GRADEBOOK: (classId: number) => `/api/classrooms/${classId}/gradebook`,
		JOIN_CLASS: '/api/classrooms/join',

		ASSIGN_STUDENT_TO_CLASS: (classId: number) => `/api/classrooms/${classId}/students`,
		GET_STUDENTS: (classId: number) => `/api/classrooms/${classId}/students`,
		GET_STUDENT_STATS: (classId: number) => `/api/classrooms/${classId}/students/stats`,
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

	SUBSCRIPTION: {
		GET_PLANS: '/api/subscription-plans',
	},

	TRANSACTION: {
		CREATE_PAYMENT_LINK: '/api/transactions/payment-link',
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

	QUIZ: {
		OVERVIEW: '/api/teacher/quizzes/overview',
		LIST: '/api/teacher/quizzes',
		DETAIL: (quizId: string) => `/api/teacher/quizzes/${quizId}`,
		UPDATE: (quizId: string) => `/api/teacher/quizzes/${quizId}`,
		DELETE: (quizId: string) => `/api/teacher/quizzes/${quizId}`,

		AI_GENERATE: (quizId: string) => `/api/teacher/quizzes/${quizId}/ai-generate`,

		QUESTIONS: (quizId: string) => `/api/teacher/quizzes/${quizId}/questions`,
		CREATE_QUESTION: '/api/teacher/questions',
		UPDATE_QUESTION: (questionId: string) => `/api/teacher/questions/${questionId}`,
		DELETE_QUESTION: (questionId: string) => `/api/teacher/questions/${questionId}`,
		REORDER_QUESTIONS: (quizId: string) => `/api/teacher/quizzes/${quizId}/questions/reorder`,

		SUBMISSIONS: (quizId: string) => `/api/teacher/quizzes/${quizId}/submissions`,
	},

	STUDENT_QUIZ: {
		LIST: '/api/student/quizzes',
		DETAIL: (quizId: string) => `/api/student/quizzes/${quizId}`,
		QUESTIONS: (quizId: string) => `/api/student/quizzes/${quizId}/questions`,
		START_ATTEMPT: (quizId: string) => `/api/student/quizzes/${quizId}/attempts/start`,
		SUBMIT_ATTEMPT: (quizId: string, attemptId: number) =>
			`/api/student/quizzes/${quizId}/attempts/${attemptId}/submit`,
	},

	ADMIN_DASHBOARD: {
		OVERVIEW: '/api/admin/dashboard/overview',
		USER_GROWTH: '/api/admin/dashboard/user-growth',
		REVENUE: '/api/admin/dashboard/revenue',
		TRANSACTIONS: '/api/admin/dashboard/transactions',
		AI_USAGE: '/api/admin/dashboard/ai-usage',
		CLASSROOMS: '/api/admin/dashboard/classrooms',
	},

	LESSON: {
		CREATE: '/api/lessons',
		GET_BY_CLASS: (classId: number) => `/api/lessons/class/${classId}`,
		GET_DETAIL: (id: string) => `/api/lessons/${id}`,
		UPDATE: (id: string) => `/api/lessons/${id}`,
		DELETE: (id: string) => `/api/lessons/${id}`,
	},
};
