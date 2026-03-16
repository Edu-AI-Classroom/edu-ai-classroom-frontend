export type QuizDocumentType = 'ASSIGNMENT' | 'EXAM';
export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type QuizOverview = {
  totalQuizzes: number;
  totalAssignments: number;
  totalExams: number;
  totalStudentSubmissions: number;
};

export type QuizListItem = {
  id: string;
  title: string;
  description?: string | null;
  classroom?: { id: number; name: string } | null;
  documentType: QuizDocumentType;
  questionCount: number;
  createdAt: string;
  status: QuizStatus;
};

export type QuizDetail = {
  id: string;
  title: string;
  description?: string | null;
  classroom?: { id: number; name: string } | null;
  documentType: QuizDocumentType;
  timeLimitMinutes?: number | null;
  totalPoints?: number | null;
  createdAt: string;
  status: QuizStatus;
};

export type QuizQuestionType = 'MCQ' | 'ESSAY';

export type QuizQuestionBase = {
  id: string;
  quizId: string;
  positionOrder: number;
  type: QuizQuestionType;
  questionText: string;
};

export type QuizQuestionMcq = QuizQuestionBase & {
  type: 'MCQ';
  options: string[];
  correctIndex: number;
  maxScore: number;
};

export type QuizQuestionEssay = QuizQuestionBase & {
  type: 'ESSAY';
  maxScore: number;
};

export type QuizQuestion = QuizQuestionMcq | QuizQuestionEssay;

export type CreateQuizPayload = {
  title: string;
  description?: string;
  classroomId?: number;
  documentType: QuizDocumentType;
  timeLimitMinutes?: number;
  totalPoints?: number;
};

export type UpdateQuizPayload = Partial<CreateQuizPayload>;

export type CreateQuizQuestionPayload =
  | {
      quizId: string;
      type: 'MCQ';
      questionText: string;
      options: string[];
      correctIndex: number;
      maxScore: number;
      positionOrder?: number;
    }
  | {
      quizId: string;
      type: 'ESSAY';
      questionText: string;
      maxScore: number;
      positionOrder?: number;
    };

export type UpdateQuizQuestionPayload =
  | {
      type: 'MCQ';
      questionText?: string;
      options?: string[];
      correctIndex?: number;
      maxScore?: number;
    }
  | {
      type: 'ESSAY';
      questionText?: string;
      maxScore?: number;
    };

export type ReorderQuestionsPayload = {
  quizId: string;
  orderedQuestionIds: string[];
};

export type QuizSubmissionsOverview = {
  totalStudentsAttempted: number;
  averageScore: number;
  highestScore: number;
  completionRate: number; // 0..1
  attemptsByDay: { date: string; attempts: number }[];
  scoreDistribution: { bucket: string; count: number }[];
};

