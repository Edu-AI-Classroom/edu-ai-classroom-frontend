import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/payment/subscription.service';
import { queryKeys } from '@/services/api/query-keys';
import type { SubscriptionPlan } from '@/types/subscription';
import { toast } from 'sonner';

export function useSubscriptionPlans() {
	return useQuery({
		queryKey: queryKeys.subscription.plans(),
		queryFn: () => subscriptionService.getPlans(),
	});
}

export function useCreateSubscriptionPlan() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: Partial<SubscriptionPlan>) => subscriptionService.createPlan(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.subscription.plans() });
			toast.success('Subscription plan created successfully');
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Failed to create subscription plan');
		},
	});
}

export function useUpdateSubscriptionPlan() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: number; dto: Partial<SubscriptionPlan> }) =>
			subscriptionService.updatePlan(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.subscription.plans() });
			toast.success('Subscription plan updated successfully');
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Failed to update subscription plan');
		},
	});
}

export function useDeleteSubscriptionPlan() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => subscriptionService.deletePlan(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.subscription.plans() });
			toast.success('Subscription plan deleted successfully');
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Failed to delete subscription plan');
		},
	});
}
