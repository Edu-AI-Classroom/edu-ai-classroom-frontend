import { API_ENDPOINTS } from '@/services/api/api.endpoint'; // Đổi đường dẫn cho khớp project
import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http.helpers'; // Đổi đường dẫn cho khớp

// Bạn có thể đưa type này vào file @/types/lesson.ts
export interface LessonUiData {
	id: string;
	title: string;
	content: string;
	fileUrl: string;
	classId: number;
	status: string;
	createdAt: string;
}

export const LessonService = {
	list: (classId: number) => httpGet<LessonUiData[]>(API_ENDPOINTS.LESSON.GET_BY_CLASS(classId)),

	getDetail: (id: string) => httpGet<LessonUiData>(API_ENDPOINTS.LESSON.GET_DETAIL(id)),

	// Gửi FormData (chứa file upload)
	create: (payload: FormData) => httpPost<LessonUiData>(API_ENDPOINTS.LESSON.CREATE, payload),

	update: (id: string, payload: FormData) =>
		httpPut<LessonUiData>(API_ENDPOINTS.LESSON.UPDATE(id), payload),

	delete: (id: string) => httpDelete<void>(API_ENDPOINTS.LESSON.DELETE(id)),
};
