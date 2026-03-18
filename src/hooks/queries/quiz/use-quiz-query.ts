import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { QuizService } from '@/services/quiz/quiz.service';

export function useQuizOverview() {
	return useQuery({
		queryKey: queryKeys.quiz.overview(),
		queryFn: () => QuizService.getOverview(),
	});
}

export function useQuizList(params?: {
	search?: string;
	classId?: number;
	type?: 'ASSIGNMENT' | 'EXAM';
}) {
	return useQuery({
		queryKey: queryKeys.quiz.list(params),
		queryFn: () => QuizService.list(params),
	});
}

export function useQuizDetail(quizId?: string) {
	return useQuery({
		queryKey: queryKeys.quiz.detail(quizId ?? ''),
		queryFn: () => QuizService.getDetail(quizId as string),
		enabled: !!quizId,
	});
}

export function useQuizQuestions(quizId?: string) {
	return useQuery({
		queryKey: queryKeys.quiz.questions(quizId ?? ''),
		queryFn: () => QuizService.getQuestions(quizId as string),
		enabled: !!quizId,
	});
}

export function useQuizSubmissionsOverview(quizId?: string) {
	return useQuery({
		queryKey: queryKeys.quiz.submissions(quizId ?? ''),
		queryFn: () => QuizService.getSubmissionsOverview(quizId as string),
		enabled: !!quizId,
	});
}
