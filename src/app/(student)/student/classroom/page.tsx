// app/(student)/student/classroom/page.tsx
import { Suspense } from 'react';
import ClassroomPageClient from './classroom-page-client';

export default function ClassroomPage() {
	return (
		<Suspense fallback={<div>Loading classroom...</div>}>
			<ClassroomPageClient />
		</Suspense>
	);
}
