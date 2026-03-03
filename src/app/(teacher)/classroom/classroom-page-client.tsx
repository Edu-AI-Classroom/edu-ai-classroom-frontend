// app/(teacher)/classroom/classroom-page-client.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import ClassListView from '@/features/teacher/classroom/class-list-view';
import ClassroomWorkspace from '@/features/teacher/classroom/classroom-workspace';
import { classes, getClassById } from '@/lib/mock-data';

export default function ClassroomPageClient() {
	const searchParams = useSearchParams();
	const classIdFromUrl = searchParams.get('classId');

	const [selectedClassId, setSelectedClassId] = useState<string | null>(classIdFromUrl);

	const selectedClass = useMemo(() => {
		if (!selectedClassId) return null;
		return getClassById(selectedClassId) ?? null;
	}, [selectedClassId]);

	const handleSelectClass = (classId: string) => {
		setSelectedClassId(classId);
		window.history.pushState({}, '', `/classroom?classId=${classId}`);
	};

	const handleBackToList = () => {
		setSelectedClassId(null);
		window.history.pushState({}, '', '/classroom');
	};

	if (selectedClass) {
		return (
			<ClassroomWorkspace
				classData={selectedClass}
				onBack={handleBackToList}
				onSwitchClass={handleSelectClass}
			/>
		);
	}

	return <ClassListView classes={classes} onSelectClass={handleSelectClass} />;
}
