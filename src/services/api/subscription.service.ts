import type { SubscriptionPlan } from '@/types/subscription';
import { httpGet } from '../http.helpers';

// httpGet<T>() returns the .data field from API response
// API returns: { success, statusCode, message, data: SubscriptionPlan[], timestamp, path }
// So T should be SubscriptionPlan[]
export const subscriptionService = {
	getPlans: () => httpGet<SubscriptionPlan[]>('/api/subscription-plans'),
};
