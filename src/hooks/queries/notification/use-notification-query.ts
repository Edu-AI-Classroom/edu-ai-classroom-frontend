import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification/notification.service';

export function useNotifications() {
	return useQuery({
		queryKey: ['notifications', 'list'],
		queryFn: () => NotificationService.list(20),
		refetchInterval: 5000,
	});
}

export function useUnreadNotificationCount() {
	return useQuery({
		queryKey: ['notifications', 'unread-count'],
		queryFn: NotificationService.unreadCount,
		refetchInterval: 5000,
	});
}

export function useMarkNotificationRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: NotificationService.markRead,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});
}

export function useMarkAllNotificationsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: NotificationService.markAllRead,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});
}
