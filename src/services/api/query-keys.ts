//queryKeys.domain.action(params)

export const queryKeys = {
	auth: {
		all: ['auth'] as const,
		user_profile: (userId: string) => [...queryKeys.auth.all, 'user_profile', userId] as const,
	},

	class: {
		all: ['class'] as const,
		list: (params?: {
			page?: number;
			limit?: number;
			sortBy?: string;
			sortOrder?: 'asc' | 'desc';
			search?: string;
		}) => ['class', 'list', params ?? {}] as const,
		detail: (classId: string | number) => ['class', 'detail', classId] as const,
		students: {
			list: (
				classId: string | number,
				params?: {
					page?: number;
					limit?: number;
					sortBy?: string;
					sortOrder?: 'asc' | 'desc';
					search?: string;
				},
			) => ['class', classId, 'students', params ?? {}] as const,
		},
		teachers: {
			list: (classId: string | number) => ['class', classId, 'teachers'] as const,
		},
		groups: {
			list: (
				classId: string | number,
				params?: {
					page?: number;
					limit?: number;
					sortBy?: string;
					sortOrder?: 'asc' | 'desc';
					search?: string;
				},
			) => ['class', classId, 'groups', params ?? {}] as const,

			detail: (classId: string | number, groupId: string | number) =>
				['class', classId, 'groups', groupId] as const,

			students: {
				list: (classId: string | number, groupId: string | number) =>
					['class', classId, 'groups', groupId, 'students'] as const,
			},
		},
	},

	subscription: {
		all: ['subscription'] as const,
		plans: () => [...queryKeys.subscription.all, 'plans'] as const,
		userCurrent: () => [...queryKeys.subscription.all, 'user-current'] as const,
	},

	assignment: {
		all: ['assignment'] as const,
		list: (params?: {
			page?: number;
			limit?: number;
			sortBy?: string;
			sortOrder?: 'asc' | 'desc';
			search?: string;
		}) => ['assignment', 'list', params ?? {}] as const,
		detail: (assignmentId: string | number) => ['assignment', 'detail', assignmentId] as const,
	},

	subject: {
		all: ['subject'] as const,
	},

	news: {
		all: ['news'] as const,
		list: (classId: number, params?: any) => ['news', 'class', classId, params ?? {}] as const,
		detail: (id: number | string) => ['news', 'detail', id] as const,
	},

	adminDashboard: {
		all: ['adminDashboard'] as const,
		overview: (filters: unknown) => ['adminDashboard', 'overview', filters] as const,
		userGrowth: (filters: unknown) => ['adminDashboard', 'userGrowth', filters] as const,
		revenue: (filters: unknown) => ['adminDashboard', 'revenue', filters] as const,
		transactions: (filters: unknown) => ['adminDashboard', 'transactions', filters] as const,
		aiUsage: (filters: unknown) => ['adminDashboard', 'aiUsage', filters] as const,
		classrooms: (filters: unknown) => ['adminDashboard', 'classrooms', filters] as const,
	},
};
