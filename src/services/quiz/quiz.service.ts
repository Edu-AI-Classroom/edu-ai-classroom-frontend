import buildQueryString from '@/lib/utils/buildQueryString';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http.helpers';
import type {
	CreateQuizPayload,
	CreateQuizQuestionPayload,
	GenerateQuizWithAiPayload,
	GenerateQuizWithAiResponse,
	QuizDetail,
	QuizListItem,
	QuizOverview,
	QuizQuestion,
	QuizSubmissionsOverview,
	ReorderQuestionsPayload,
	UpdateQuizPayload,
	UpdateQuizQuestionPayload,
} from '@/types/quiz';

export const QuizService = {
	getOverview: () => httpGet<QuizOverview>(API_ENDPOINTS.QUIZ.OVERVIEW),

	list: (params?: { search?: string; classId?: number; type?: 'ASSIGNMENT' | 'EXAM' }) =>
		httpGet<QuizListItem[]>(`${API_ENDPOINTS.QUIZ.LIST}${buildQueryString(params)}`),

	getDetail: (quizId: string) => httpGet<QuizDetail>(API_ENDPOINTS.QUIZ.DETAIL(quizId)),

	aiGenerate: (quizId: string, payload: GenerateQuizWithAiPayload) =>
		httpPost<GenerateQuizWithAiResponse>(API_ENDPOINTS.QUIZ.AI_GENERATE(quizId), payload, {
			timeout: 60_000,
		}),

	create: (payload: CreateQuizPayload) => httpPost<QuizDetail>(API_ENDPOINTS.QUIZ.LIST, payload),

	update: (quizId: string, payload: UpdateQuizPayload) =>
		httpPut<QuizDetail>(API_ENDPOINTS.QUIZ.UPDATE(quizId), payload),

	delete: (quizId: string) => httpDelete<void>(API_ENDPOINTS.QUIZ.DELETE(quizId)),

	getQuestions: (quizId: string) => httpGet<QuizQuestion[]>(API_ENDPOINTS.QUIZ.QUESTIONS(quizId)),

	createQuestion: (payload: CreateQuizQuestionPayload) =>
		httpPost<QuizQuestion>(API_ENDPOINTS.QUIZ.CREATE_QUESTION, payload),

	updateQuestion: (questionId: string, payload: UpdateQuizQuestionPayload) =>
		httpPut<QuizQuestion>(API_ENDPOINTS.QUIZ.UPDATE_QUESTION(questionId), payload),

	deleteQuestion: (questionId: string) =>
		httpDelete<void>(API_ENDPOINTS.QUIZ.DELETE_QUESTION(questionId)),

	reorderQuestions: (payload: ReorderQuestionsPayload) =>
		httpPut<void>(API_ENDPOINTS.QUIZ.REORDER_QUESTIONS(payload.quizId), payload),

	getSubmissionsOverview: (quizId: string) =>
		httpGet<QuizSubmissionsOverview>(API_ENDPOINTS.QUIZ.SUBMISSIONS(quizId)),
};
