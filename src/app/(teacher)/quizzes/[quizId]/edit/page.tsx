import { Suspense } from 'react';
import QuizEditPageClient from './quiz-edit-page-client';

export default async function QuizEditPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  return (
    <Suspense fallback={<div>Loading quiz editor...</div>}>
      <QuizEditPageClient quizId={quizId} />
    </Suspense>
  );
}

