import type { SubscriptionPlan } from '@/types/subscription';
import { http } from '../http';
import { httpGet } from '../http.helpers';

// httpGet<T>() returns the .data field from API response
// API returns: { success, statusCode, message, data: SubscriptionPlan[], timestamp, path }
// So T should be SubscriptionPlan[]

const mapToBackend = (dto: Partial<SubscriptionPlan>) => {
	const mapped: any = {};
	if (dto.subCode !== undefined) mapped.sub_code = dto.subCode;
	if (dto.subName !== undefined) mapped.sub_name = dto.subName;
	if (dto.price !== undefined) mapped.price = dto.price;
	if (dto.durationDays !== undefined) mapped.duration_days = dto.durationDays;
	if (dto.aiTokenLimit !== undefined) mapped.ai_token_limit = dto.aiTokenLimit;
	if (dto.aiRequestLimit !== undefined) mapped.ai_request_limit = dto.aiRequestLimit;
	if (dto.maxClasses !== undefined) mapped.max_classes = dto.maxClasses;
	if (dto.maxDocuments !== undefined) mapped.max_documents = dto.maxDocuments;
	if (dto.isActive !== undefined) mapped.is_active = dto.isActive;
	return mapped;
};

export const subscriptionService = {
	getPlans: () => httpGet<SubscriptionPlan[]>('/api/subscription-plans'),

	getUserCurrentSubscription: () =>
		httpGet<SubscriptionPlan>('/api/users/current-subscription').catch(() => null),

	createPlan: (dto: Partial<SubscriptionPlan>) =>
		http<SubscriptionPlan>('/api/subscription-plans', {
			method: 'POST',
			body: mapToBackend(dto),
		}),

	updatePlan: (id: number, dto: Partial<SubscriptionPlan>) =>
		http<SubscriptionPlan>(`/api/subscription-plans/${id}`, {
			method: 'PUT',
			body: mapToBackend(dto),
		}),

	deletePlan: (id: number) =>
		http<{ message: string }>(`/api/subscription-plans/${id}`, { method: 'DELETE' }),
};
