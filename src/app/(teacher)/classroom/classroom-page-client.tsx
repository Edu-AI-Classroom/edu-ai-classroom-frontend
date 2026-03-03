// app/(teacher)/classroom/classroom-page-client.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ClassListView from '@/features/teacher/classroom/class-list-view';
import { mapClassroomToUi } from '@/features/teacher/classroom/classroom.mapper';
import ClassroomWorkspace from '@/features/teacher/classroom/classroom-workspace';
import { useClassDetail, useClassList } from '@/hooks/queries/class/use-class-query';

const parseClassId = (value: string | null): number | null => {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? null : parsed;
};

export default function ClassroomPageClient() {
	const searchParams = useSearchParams();
	const classIdFromUrl = searchParams.get('classId');

	const [selectedClassId, setSelectedClassId] = useState<number | null>(
		parseClassId(classIdFromUrl),
	);
	const { data: classListResponse, isLoading: isClassListLoading } = useClassList();
	const { data: classDetail, isLoading: isClassDetailLoading } = useClassDetail(
		selectedClassId ?? undefined,
	);

	const classes = useMemo(
		() => (classListResponse?.data ?? []).map((item, index) => mapClassroomToUi(item, index)),
		[classListResponse],
	);

	const selectedClass = useMemo(() => {
		if (selectedClassId === null) return null;

		if (classDetail) {
			const selectedIndex = classes.findIndex((item) => item.id === selectedClassId);
			return mapClassroomToUi(classDetail, selectedIndex >= 0 ? selectedIndex : 0);
		}

		return classes.find((item) => item.id === selectedClassId) ?? null;
	}, [classDetail, classes, selectedClassId]);

	useEffect(() => {
		setSelectedClassId(parseClassId(classIdFromUrl));
	}, [classIdFromUrl]);

	const handleSelectClass = (classId: number) => {
		setSelectedClassId(classId);
		window.history.pushState({}, '', `/classroom?classId=${classId}`);
	};

	const handleBackToList = () => {
		setSelectedClassId(null);
		window.history.pushState({}, '', '/classroom');
	};

	if (isClassListLoading && classes.length === 0) {
		return <div className="p-6 text-[#666]">Loading classes...</div>;
	}

	if (selectedClassId !== null && isClassDetailLoading && !selectedClass) {
		return <div className="p-6 text-[#666]">Loading classroom...</div>;
	}

	if (selectedClass) {
		return (
			<ClassroomWorkspace
				classData={selectedClass}
				classOptions={classes}
				onBack={handleBackToList}
				onSwitchClass={handleSelectClass}
			/>
		);
	}

	return <ClassListView classes={classes} onSelectClass={handleSelectClass} />;
}
