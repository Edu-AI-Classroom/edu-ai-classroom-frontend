import type { QuizDocumentType, QuizStatus } from './quiz';

export type StudentQuizListItem = {
  id: string;
  title: string;
  description?: string | null;
  documentType: QuizDocumentType;
  status: QuizStatus;
  createdAt: string;
  dueDate?: string | null;
  lastAttempt?: {
    attemptId: number;
    status?: string | null;
    totalScore?: number | null;
    submittedAt?: string | null;
  } | null;
};

export type StudentQuizDetail = {
  id: string;
  title: string;
  description?: string | null;
  documentType: QuizDocumentType;
  timeLimitMinutes?: number | null;
  totalPoints?: number | null;
  status: QuizStatus;
  createdAt: string;
  dueDate?: string | null;
  classId: number;
};

export type StudentQuizQuestionType = 'MCQ' | 'ESSAY';

export type StudentQuizQuestionBase = {
  id: string;
  quizId: string;
  positionOrder: number;
  type: StudentQuizQuestionType;
  questionText: string;
  maxScore: number;
};

export type StudentQuizQuestionMcq = StudentQuizQuestionBase & {
  type: 'MCQ';
  options: string[];
};

export type StudentQuizQuestionEssay = StudentQuizQuestionBase & {
  type: 'ESSAY';
};

export type StudentQuizQuestion = StudentQuizQuestionMcq | StudentQuizQuestionEssay;

export type StartQuizAttemptResponse = {
  attemptId: number;
  quizId: string;
  status: string;
  startedAt: string;
};

export type SubmitQuizPayload = {
  answers: { blockId: string; answer: unknown }[];
};

export type SubmitQuizResponse = {
  attemptId: number;
  quizId: string;
  status: string;
  totalScore: number;
  submittedAt: string;
};

