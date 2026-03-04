import buildQueryString from '@/lib/utils/buildQueryString';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import type { PaginationParams } from '@/types/api';
import { httpDelete, httpGet, httpPost, httpPut } from '../http.helpers';

// --- Định nghĩa Types ---
export interface CreateNewsPayload {
    classId: number;
    content: string;
    audience?: 'students' | 'parents' | 'all';
    isPinned?: boolean;
    file?: File;
}

export interface CreateCommentPayload {
    newsId: string | number;
    content: string;
    parentCommentId?: number;
}

export const NewsService = {
    // --- NEWS ---
    getNewsByClass: (classId: number, params?: PaginationParams) =>
        httpGet<unknown>(`${API_ENDPOINTS.NEWS.GET_BY_CLASS(classId)}${buildQueryString(params)}`),

    createNews: (payload: CreateNewsPayload) => {
        const formData = new FormData();
        if (payload.file) formData.append('file', payload.file);
        const newsData = {
            classId: payload.classId,
            content: payload.content,
            audience: payload.audience || 'all',
            isPinned: payload.isPinned || false,
        };
        formData.append('data', JSON.stringify(newsData));
        return httpPost<unknown>(API_ENDPOINTS.NEWS.CREATE, formData);
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
        return httpPut<unknown>(API_ENDPOINTS.NEWS.UPDATE(id), formData);
    },

    deleteNews: (id: string) => httpDelete<void>(API_ENDPOINTS.NEWS.DELETE(id)),

    // --- COMMENTS ---
    createComment: (payload: CreateCommentPayload) =>
        httpPost<unknown>(API_ENDPOINTS.COMMENTS.CREATE, payload),

    updateComment: (id: string, content: string) =>
        httpPut<unknown>(API_ENDPOINTS.COMMENTS.UPDATE(id), { content }),

    deleteComment: (id: string) => httpDelete<void>(API_ENDPOINTS.COMMENTS.DELETE(id)),
};