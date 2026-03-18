import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StudentQuizService } from '@/services/quiz/student-quiz.service';
import type { SubmitQuizPayload } from '@/types/student-quiz';

export function useStudentQuizList(params?: { classId?: number }) {
	return useQuery({
		queryKey: ['studentQuiz', 'list', params] as const,
		queryFn: () => StudentQuizService.list(params),
		enabled: !!params?.classId,
	});
}

export function useStudentQuizDetail(quizId?: string) {
	return useQuery({
		queryKey: ['studentQuiz', 'detail', quizId] as const,
		queryFn: () => StudentQuizService.getDetail(quizId as string),
		enabled: !!quizId,
	});
}

export function useStudentQuizQuestions(quizId?: string) {
	return useQuery({
		queryKey: ['studentQuiz', 'questions', quizId] as const,
		queryFn: () => StudentQuizService.getQuestions(quizId as string),
		enabled: !!quizId,
	});
}

export function useStartStudentQuizAttempt() {
	return useMutation({
		mutationKey: ['studentQuiz', 'attempt', 'start'] as const,
		mutationFn: (quizId: string) => StudentQuizService.startAttempt(quizId),
	});
}

export function useSubmitStudentQuizAttempt() {
	const qc = useQueryClient();
	return useMutation({
		mutationKey: ['studentQuiz', 'attempt', 'submit'] as const,
		mutationFn: (vars: { quizId: string; attemptId: number; payload: SubmitQuizPayload }) =>
			StudentQuizService.submitAttempt(vars.quizId, vars.attemptId, vars.payload),
		onSuccess: (_data, vars) => {
			// refresh list so latest attempt/score shows up (ASSIGNMENT retakes)
			qc.invalidateQueries({ queryKey: ['studentQuiz', 'list'] });
			qc.invalidateQueries({ queryKey: ['studentQuiz', 'detail', vars.quizId] });
		},
	});
}
