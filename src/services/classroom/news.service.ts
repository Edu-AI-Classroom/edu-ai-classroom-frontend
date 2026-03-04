import buildQueryString from '@/lib/utils/buildQueryString';
import type { PaginationParams } from '@/types/api';
import { API_ENDPOINTS } from '../api/api.endpoint';
import { httpDelete, httpGet, httpPost, httpPut } from '../http.helpers';

// Định nghĩa các type tương ứng với Backend DTO
export interface CreateNewsPayload {
	classId: number;
	content: string;
	audience?: 'students' | 'parents' | 'all';
	isPinned?: boolean;
	file?: File; // File đính kèm từ input
}

export interface CreateCommentPayload {
	newsId: string | number;
	content: string;
	parentCommentId?: number;
}

export const NewsService = {
	// --- NEWS ---
	getNewsByClass: (classId: number, params?: PaginationParams) =>
		httpGet<any>(`${API_ENDPOINTS.NEWS.GET_BY_CLASS(classId)}${buildQueryString(params)}`),

	createNews: (payload: CreateNewsPayload) => {
		const formData = new FormData();
		if (payload.file) {
			formData.append('file', payload.file);
		}

		// Nhét toàn bộ thông tin văn bản vào trường 'data' dưới dạng JSON string (theo cấu trúc backend NestJS yêu cầu)
		const newsData = {
			classId: payload.classId,
			content: payload.content,
			audience: payload.audience || 'all',
			isPinned: payload.isPinned || false,
		};
		formData.append('data', JSON.stringify(newsData));

		// Gọi API với formData (Lưu ý: httpPost của bạn phải hỗ trợ gửi FormData mà không đè header 'Content-Type' thành 'application/json')
		return httpPost<any>(API_ENDPOINTS.NEWS.CREATE, formData);
	},

	updateNews: (id: string, payload: Partial<CreateNewsPayload>) => {
		const formData = new FormData();
		if (payload.file) formData.append('file', payload.file);
		const newsData = {
			content: payload.content,
			audience: payload.audience,
			isPinned: payload.isPinned,
		};
		formData.append('data', JSON.stringify(newsData));
		return httpPut<any>(API_ENDPOINTS.NEWS.UPDATE(id), formData);
	},

	// THÊM MỚI: Xóa bài viết
	deleteNews: (id: string) => httpDelete<void>(API_ENDPOINTS.NEWS.DELETE(id)),

	// --- COMMENTS ---
	createComment: (payload: CreateCommentPayload) =>
		httpPost<any>(API_ENDPOINTS.COMMENTS.CREATE, payload),

	// THÊM MỚI: Cập nhật bình luận
	updateComment: (id: string, content: string) =>
		httpPut<any>(API_ENDPOINTS.COMMENTS.UPDATE(id), { content }),

	// THÊM MỚI: Xóa bình luận
	deleteComment: (id: string) => httpDelete<void>(API_ENDPOINTS.COMMENTS.DELETE(id)),
};
