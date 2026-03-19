import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { http } from '@/services/http';

export type AdminDateFilters = {
	mode: 'range' | 'month' | 'year' | 'quarter' | 'day';
	month?: number;
	year?: number;
	quarter?: number;
	day?: string;
	compareMode?: 'none' | 'month' | 'year' | 'quarter' | 'day';
	from?: string;
	to?: string;
};

export const AdminDashboardService = {
	getOverview(filters: AdminDateFilters) {
		return http<{
			totalUsers: number;
			totalTeachers: number;
			totalStudents: number;
			totalClassrooms: number;
			totalRevenue: number;
			totalTransactions: number;
			usersGrowth: number;
			teachersGrowth: number;
			studentsGrowth: number;
			classroomsGrowth: number;
			revenueGrowth: number;
			transactionsGrowth: number;
		}>(API_ENDPOINTS.ADMIN_DASHBOARD.OVERVIEW + buildQuery(filters));
	},

	getUserGrowth(filters: AdminDateFilters) {
		return http<Array<{ date: string; value: number }>>(
			API_ENDPOINTS.ADMIN_DASHBOARD.USER_GROWTH + buildQuery(filters),
		);
	},

	getRoleDistribution(filters: AdminDateFilters) {
		return http<
			Array<{ role: 'TEACHER' | 'STUDENT' | 'PARENT' | 'ADMIN' | string; value: number }>
		>(
			API_ENDPOINTS.ADMIN_DASHBOARD.USER_GROWTH +
				buildQuery({ ...filters, aggregate: 'roles' } as any),
		);
	},

	getNewUsersPerMonth(filters: AdminDateFilters) {
		return http<Array<{ month: string; value: number }>>(
			API_ENDPOINTS.ADMIN_DASHBOARD.USER_GROWTH +
				buildQuery({ ...filters, aggregate: 'monthly' } as any),
		);
	},

	getClassrooms(filters: AdminDateFilters) {
		return http<{
			monthly: Array<{ month: string; value: number }>;
			topActive: Array<{ name: string; score: number }>;
		}>(API_ENDPOINTS.ADMIN_DASHBOARD.CLASSROOMS + buildQuery(filters));
	},

	getAiUsage(filters: AdminDateFilters) {
		return http<Array<{ feature: 'lesson' | 'quiz' | 'exam' | string; value: number }>>(
			API_ENDPOINTS.ADMIN_DASHBOARD.AI_USAGE + buildQuery(filters),
		);
	},

	getRevenue(filters: AdminDateFilters) {
		return http<Array<{ date: string; value: number }>>(
			API_ENDPOINTS.ADMIN_DASHBOARD.REVENUE + buildQuery(filters),
		);
	},

	getTransactions(filters: AdminDateFilters) {
		return http<{
			monthly: Array<{ month: string; value: number }>;
			statusBreakdown: Array<{
				status: 'SUCCESS' | 'PENDING' | 'FAILED' | string;
				value: number;
			}>;
			recent: Array<{
				id: number;
				userName: string;
				userInitials: string;
				email: string;
				planName: string;
				amount: number;
				status: 'SUCCESS' | 'PENDING' | 'FAILED' | string;
				createdAt: string;
			}>;
		}>(API_ENDPOINTS.ADMIN_DASHBOARD.TRANSACTIONS + buildQuery(filters));
	},
};

function buildQuery(filters: Record<string, any>): string {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') return;
		params.set(key, String(value));
	});
	const qs = params.toString();
	return qs ? `?${qs}` : '';
}
