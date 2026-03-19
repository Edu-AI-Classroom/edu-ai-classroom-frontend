'use client';

import QuizDetailView from '@/features/teacher/quizzes/quiz-detail-view';

export default function QuizDetailPageClient({ quizId }: { quizId: string }) {
	return <QuizDetailView quizId={quizId} />;
}
