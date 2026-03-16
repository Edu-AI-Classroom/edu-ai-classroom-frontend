import { Suspense } from 'react';
import QuizzesPageClient from './quizzes-page-client';

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div>Loading quizzes...</div>}>
      <QuizzesPageClient />
    </Suspense>
  );
}

