import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet, httpPatch } from '@/services/http.helpers';
import type { NotificationItem } from '@/types/notification';

export const NotificationService = {
	list: (limit = 20) => httpGet<NotificationItem[]>(`${API_ENDPOINTS.NOTIFICATION.LIST}?limit=${limit}`),
	unreadCount: () => httpGet<{ count: number }>(API_ENDPOINTS.NOTIFICATION.UNREAD_COUNT),
	markRead: (notificationId: number) =>
		httpPatch<NotificationItem>(API_ENDPOINTS.NOTIFICATION.MARK_READ(notificationId)),
	markAllRead: () => httpPatch<{ success: boolean }>(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ),
};
