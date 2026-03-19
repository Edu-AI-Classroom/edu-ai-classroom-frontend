// app/(student)/student/classroom/classroom-page-client.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import StudentClassListView from '@/features/student/classroom/student-class-list-view';
import StudentClassroomWorkspace from '@/features/student/classroom/student-classroom-workspace';
import { mapClassroomToUi } from '@/features/teacher/classroom/classroom.mapper';
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

	useEffect(() => {
		if (classIdFromUrl) {
			setSelectedClassId(parseClassId(classIdFromUrl));
		}
	}, [classIdFromUrl]);

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
		window.history.pushState({}, '', `/student/classroom?classId=${classId}`);
	};

	const handleBackToList = () => {
		setSelectedClassId(null);
		window.history.pushState({}, '', '/student/classroom');
	};

	if (isClassListLoading) {
		return (
			<div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAF9F6] z-50">
				<div className="animate-bounce text-4xl mb-4">📚</div>
				<p className="text-[#666] font-medium tracking-wide animate-pulse">
					Loading your classes...
				</p>
			</div>
		);
	}

	if (selectedClassId !== null && isClassDetailLoading && !selectedClass) {
		return (
			<div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAF9F6]/80 backdrop-blur-sm z-50">
				<div className="animate-spin text-4xl mb-4">✏️</div>
				<p className="text-[#666] font-medium italic">Loading the classroom...</p>
			</div>
		);
	}

	if (selectedClass) {
		return (
			<StudentClassroomWorkspace
				classData={selectedClass}
				classOptions={classes}
				onBack={handleBackToList}
				onSwitchClass={handleSelectClass}
			/>
		);
	}

	return <StudentClassListView classes={classes} onSelectClass={handleSelectClass} />;
}
