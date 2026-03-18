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
