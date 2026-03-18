import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { subscriptionService } from '@/services/payment/subscription.service';
import type { SubscriptionPlan } from '@/types/subscription';

export function useSubscriptionPlans() {
	return useQuery<SubscriptionPlan[]>({
		queryKey: queryKeys.subscription.plans(),
		queryFn: () => subscriptionService.getPlans(),
	});
}
