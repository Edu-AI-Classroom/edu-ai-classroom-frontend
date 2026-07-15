import { useQueries } from '@tanstack/react-query';

import {
	AdminDashboardService,
	type AdminDateFilters,
} from '@/services/admin/admin-dashboard.service';
import { queryKeys } from '@/services/api/query-keys';

export function useAdminDashboard(filters: AdminDateFilters) {
	const [
		overview,
		userGrowth,
		roleDistribution,
		newUsersPerMonth,
		classrooms,
		aiUsage,
		revenue,
		transactions,
		reviews,
		users,
	] = useQueries({
		queries: [
			{
				queryKey: queryKeys.adminDashboard.overview(filters),
				queryFn: () => AdminDashboardService.getOverview(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.userGrowth(filters),
				queryFn: () => AdminDashboardService.getUserGrowth(filters),
			},
			{
				queryKey: [...queryKeys.adminDashboard.userGrowth(filters), 'roles'],
				queryFn: () => AdminDashboardService.getRoleDistribution(filters),
			},
			{
				queryKey: [...queryKeys.adminDashboard.userGrowth(filters), 'monthly'],
				queryFn: () => AdminDashboardService.getNewUsersPerMonth(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.classrooms(filters),
				queryFn: () => AdminDashboardService.getClassrooms(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.aiUsage(filters),
				queryFn: () => AdminDashboardService.getAiUsage(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.revenue(filters),
				queryFn: () => AdminDashboardService.getRevenue(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.transactions(filters),
				queryFn: () => AdminDashboardService.getTransactions(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.reviews(filters),
				queryFn: () => AdminDashboardService.getReviews(filters),
			},
			{
				queryKey: queryKeys.adminDashboard.users(filters),
				queryFn: () => AdminDashboardService.getUsers(filters),
			},
		],
	});

	return {
		overview: overview.data,
		userGrowth: userGrowth.data,
		roleDistribution: roleDistribution.data,
		newUsersPerMonth: newUsersPerMonth.data,
		classroomMonthly: classrooms.data?.monthly,
		topClassrooms: classrooms.data?.topActive,
		aiUsage: aiUsage.data,
		revenue: revenue.data,
		transactionsMonthly: transactions.data?.monthly,
		transactionStatus: transactions.data?.statusBreakdown,
		recentTransactions: transactions.data?.recent,
		reviews: reviews.data,
		userSummary: users.data?.roleSummary,
		recentUsers: users.data?.recentUsers,
		isLoading:
			overview.isLoading ||
			userGrowth.isLoading ||
			roleDistribution.isLoading ||
			newUsersPerMonth.isLoading ||
			classrooms.isLoading ||
			aiUsage.isLoading ||
			revenue.isLoading ||
			transactions.isLoading ||
			reviews.isLoading ||
			users.isLoading,
	};
}
