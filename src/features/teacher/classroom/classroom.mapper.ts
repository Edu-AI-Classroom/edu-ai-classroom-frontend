import type { Classroom } from '@/types/class';

export interface ClassroomUiData {
	id: number;
	name: string;
	subject: string;
	grade: string;
	studentCount: number;
	teacherCount: number;
	groupCount: number;
	color: string;
	rotation: number;
	pendingGrading: number;
	upcomingDeadlines: number;
	isOwner?: boolean;
	createdBy?: number;
}

const CLASSROOM_COLORS = ['#F5B041', '#A8D5BA', '#C5B4E3', '#A8D4E6', '#E8B4B8'] as const;
const CLASSROOM_ROTATIONS = [-1.2, 0.8, -0.4, 1.2, -0.8] as const;

export const mapClassroomToUi = (classroom: Classroom, index = 0): ClassroomUiData => ({
	id: classroom.classId,
	name: classroom.className,
	subject: classroom.subjectName ?? 'General',
	grade: `Grade ${classroom.gradeLevel}`,
	studentCount: classroom.studentCount ?? 0,
	teacherCount: classroom.teacherCount ?? 0,
	groupCount: classroom.groupCount ?? 0,
	color: CLASSROOM_COLORS[index % CLASSROOM_COLORS.length],
	rotation: CLASSROOM_ROTATIONS[index % CLASSROOM_ROTATIONS.length],
	pendingGrading: 0,
	upcomingDeadlines: 0,
	isOwner: classroom.createdBy === classroom.createdBy, // This will be updated based on current user
	createdBy: classroom.createdBy,
});
