'use client';

import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
	useNotifications,
	useUnreadNotificationCount,
} from '@/hooks/queries/notification/use-notification-query';

export function NotificationBell() {
	const { data: notifications = [] } = useNotifications();
	const { data: unread } = useUnreadNotificationCount();
	const markRead = useMarkNotificationRead();
	const markAllRead = useMarkAllNotificationsRead();
	const unreadCount = unread?.count ?? 0;
	const latestSeenIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (notifications.length === 0) return;

		const latestNotification = notifications[0];
		const latestId = latestNotification.notificationId;

		if (latestSeenIdRef.current === null) {
			latestSeenIdRef.current = latestId;
			return;
		}

		if (latestId > latestSeenIdRef.current && !latestNotification.readAt) {
			toast(latestNotification.title, {
				description: latestNotification.body ?? undefined,
			});
			latestSeenIdRef.current = latestId;
		}
	}, [notifications]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5 text-[#666]" />
					{unreadCount > 0 && (
						<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E57373] px-1 text-xs text-white">
							{unreadCount > 9 ? '9+' : unreadCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-96 rounded-xl p-0">
				<div className="flex items-center justify-between border-b border-[#E0DCD5] p-4">
					<div>
						<p className="font-sans font-bold text-[#333]">Notifications</p>
						<p className="text-xs text-[#666]">{unreadCount} unread</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-8 rounded-lg"
						onClick={() => markAllRead.mutate()}
						disabled={unreadCount === 0}
					>
						<CheckCheck className="mr-1 h-4 w-4" />
						Read all
					</Button>
				</div>
				<div className="max-h-96 overflow-auto">
					{notifications.length === 0 ? (
						<p className="p-4 text-sm text-[#666]">No notifications yet.</p>
					) : (
						notifications.map((notification) => (
							<DropdownMenuItem
								key={notification.notificationId}
								className="block cursor-pointer border-b border-[#E0DCD5] p-4"
								onClick={() => {
									if (!notification.readAt) markRead.mutate(notification.notificationId);
								}}
							>
								<div className="flex items-start gap-3">
									<div
										className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
											notification.readAt ? 'bg-[#E0DCD5]' : 'bg-[#F5B041]'
										}`}
									/>
									<div className="min-w-0">
										<p className="font-semibold text-[#333]">{notification.title}</p>
										{notification.body && (
											<p className="mt-1 line-clamp-2 text-sm text-[#666]">{notification.body}</p>
										)}
										<p className="mt-2 text-xs text-[#999]">
											{new Date(notification.createdAt).toLocaleString()}
										</p>
									</div>
								</div>
							</DropdownMenuItem>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
