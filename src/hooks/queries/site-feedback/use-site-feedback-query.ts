import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/services/api/query-keys';
import { SiteFeedbackService } from '@/services/site-feedback/site-feedback.service';
import type { CreateSiteFeedbackDto } from '@/types/site-feedback';

export function useSiteFeedback(limit = 6) {
	return useQuery({
		queryKey: queryKeys.siteFeedback.list(limit),
		queryFn: () => SiteFeedbackService.getFeedback(limit),
	});
}

export function useCreateSiteFeedback() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: CreateSiteFeedbackDto) => SiteFeedbackService.createFeedback(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.siteFeedback.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard.all });
			toast.success('Thanks for sharing your feedback.');
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Could not submit feedback.');
		},
	});
}
