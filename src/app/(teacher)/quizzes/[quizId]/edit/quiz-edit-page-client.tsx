'use client';

import QuizEditor from '@/features/teacher/quizzes/quiz-editor';

export default function QuizEditPageClient({ quizId }: { quizId: string }) {
	return <QuizEditor quizId={quizId} />;
}
