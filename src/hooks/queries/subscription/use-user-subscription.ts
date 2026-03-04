import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { subscriptionService } from '@/services/api/subscription.service';

export function useUserSubscription() {
	return useQuery({
		queryKey: queryKeys.subscription.userCurrent(),
		queryFn: () => subscriptionService.getUserCurrentSubscription(),
		retry: 1,
	});
}
