export type SiteFeedback = {
	id: number;
	name: string;
	email?: string | null;
	role?: string | null;
	rating: number;
	comment: string;
	isApproved: boolean;
	createdAt: string;
};

export type CreateSiteFeedbackDto = {
	name: string;
	email?: string;
	role?: string;
	rating: number;
	comment: string;
};
