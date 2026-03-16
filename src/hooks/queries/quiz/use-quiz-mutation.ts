import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { QuizService } from '@/services/quiz/quiz.service';
import type { CreateQuizPayload, CreateQuizQuestionPayload, ReorderQuestionsPayload, UpdateQuizPayload, UpdateQuizQuestionPayload } from '@/types/quiz';

export function useCreateQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuizPayload) => QuizService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.all });
    },
  });
}

export function useUpdateQuiz(quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateQuizPayload) => QuizService.update(quizId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.all });
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(quizId) });
    },
  });
}

export function useDeleteQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (quizId: string) => QuizService.delete(quizId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.all });
    },
  });
}

export function useCreateQuizQuestion(quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuizQuestionPayload) => QuizService.createQuestion(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.questions(quizId) });
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(quizId) });
    },
  });
}

export function useUpdateQuizQuestion(quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }: { questionId: string; payload: UpdateQuizQuestionPayload }) =>
      QuizService.updateQuestion(questionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.questions(quizId) });
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(quizId) });
    },
  });
}

export function useDeleteQuizQuestion(quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => QuizService.deleteQuestion(questionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.questions(quizId) });
      qc.invalidateQueries({ queryKey: queryKeys.quiz.detail(quizId) });
    },
  });
}

export function useReorderQuizQuestions(quizId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderQuestionsPayload) => QuizService.reorderQuestions(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz.questions(quizId) });
    },
  });
}

