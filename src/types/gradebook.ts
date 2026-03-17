export type GradebookQuiz = {
  id: string;
  title: string;
  documentType: 'ASSIGNMENT' | 'EXAM';
  createdAt: string;
};

export type GradebookCell = {
  attemptId: number | null;
  status: string | null;
  submittedAt: string | null;
  totalScore: number | null;
};

export type GradebookRow = {
  student: { id: number; name: string; email?: string | null };
  averageScore: number | null;
  grades: Record<string, GradebookCell>;
};

export type ClassGradebook = {
  classId: number;
  quizzes: GradebookQuiz[];
  rows: GradebookRow[];
};

