export interface SubscriptionPlan {
	subId: number;
	subCode: string;
	subName: string;
	price: number;
	durationDays: number;
	aiTokenLimit: number;
	aiRequestLimit: number | null;
	maxClasses: number;
	maxDocuments: number | null;
	isActive: boolean;
}

export interface CurrentSubscription {
	status: 'NOT_SUBSCRIBED' | 'ACTIVE' | 'EXPIRED';
	subscriptionName?: string;
	subscriptionCode?: string;
	startDate?: string;
	expiryDate?: string;
	daysRemaining?: number;
	subscriptionStatus?: string;
	aiTokenLimit?: number | null;
	aiTokensRemaining?: number;
	maxClasses?: number | null;
	usedClasses?: number;
	remainingClasses?: number | null;
}
