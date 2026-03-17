import buildQueryString from '@/lib/utils/buildQueryString';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet, httpPost } from '@/services/http.helpers';
import type {
  StartQuizAttemptResponse,
  StudentQuizDetail,
  StudentQuizListItem,
  StudentQuizQuestion,
  SubmitQuizPayload,
  SubmitQuizResponse,
} from '@/types/student-quiz';

export const StudentQuizService = {
  list: (params?: { classId?: number }) =>
    httpGet<StudentQuizListItem[]>(
      `${API_ENDPOINTS.STUDENT_QUIZ.LIST}${buildQueryString(params as any)}`,
    ),

  getDetail: (quizId: string) =>
    httpGet<StudentQuizDetail>(API_ENDPOINTS.STUDENT_QUIZ.DETAIL(quizId)),

  getQuestions: (quizId: string) =>
    httpGet<StudentQuizQuestion[]>(API_ENDPOINTS.STUDENT_QUIZ.QUESTIONS(quizId)),

  startAttempt: (quizId: string) =>
    httpPost<StartQuizAttemptResponse>(API_ENDPOINTS.STUDENT_QUIZ.START_ATTEMPT(quizId), {}),

  submitAttempt: (quizId: string, attemptId: number, payload: SubmitQuizPayload) =>
    httpPost<SubmitQuizResponse>(
      API_ENDPOINTS.STUDENT_QUIZ.SUBMIT_ATTEMPT(quizId, attemptId),
      payload,
    ),
};

