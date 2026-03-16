import { Suspense } from 'react';
import QuizDetailPageClient from './quiz-detail-page-client';

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizDetailPageClient quizId={quizId} />
    </Suspense>
  );
}

