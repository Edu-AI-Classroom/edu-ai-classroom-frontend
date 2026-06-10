export type NotificationItem = {
	notificationId: number;
	userId: number;
	title: string;
	body?: string | null;
	type: string;
	linkUrl?: string | null;
	metadata?: unknown;
	readAt?: string | null;
	createdAt: string;
};
