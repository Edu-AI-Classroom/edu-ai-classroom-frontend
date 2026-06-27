import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpPost } from '@/services/http.helpers';
import type {
	ConfirmPaymentResponse,
	PaymentLinkRequest,
	PaymentLinkResponse,
} from '@/types/payment';

export const paymentService = {
	createPaymentLink: (payload: PaymentLinkRequest) =>
		httpPost<PaymentLinkResponse>(API_ENDPOINTS.TRANSACTION.CREATE_PAYMENT_LINK, payload),

	confirmPaymentSuccess: (orderCode: string) =>
		httpPost<ConfirmPaymentResponse>(`/api/transactions/confirm/${orderCode}`),
};
