export interface PaymentLinkRequest {
	amount: number;
	transaction_type: 'PAYMENT' | 'REFUND' | 'WITHDRAWAL';
	payment_gateway: 'PAYOS' | 'STRIPE' | 'PAYPAL';
	sub_id: number;
}

export interface PaymentLinkResponse {
	id?: string;
	payment_link?: string;
	checkoutUrl?: string;
	amount?: number;
	status?: string;
	message?: string;
	data?: {
		id: string;
		payment_link: string;
		checkoutUrl: string;
		amount: number;
		status: string;
	};
}

export interface ConfirmPaymentResponse {
	transactionId: number;
	orderCode: string;
	status: string;
	alreadyCompleted: boolean;
}
