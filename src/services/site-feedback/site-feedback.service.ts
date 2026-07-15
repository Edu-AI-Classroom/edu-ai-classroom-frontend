import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet, httpPost } from '@/services/http.helpers';
import type { CreateSiteFeedbackDto, SiteFeedback } from '@/types/site-feedback';

export const SiteFeedbackService = {
	getFeedback(limit = 6) {
		return httpGet<SiteFeedback[]>(`${API_ENDPOINTS.SITE_FEEDBACK.LIST}?limit=${limit}`);
	},

	createFeedback(dto: CreateSiteFeedbackDto) {
		return httpPost<SiteFeedback>(API_ENDPOINTS.SITE_FEEDBACK.CREATE, dto);
	},
};
