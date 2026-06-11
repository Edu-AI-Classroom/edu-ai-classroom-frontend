export type ParentStudent = {
	parentId: number;
	studentId: number;
	relationship?: string | null;
	linkedAt?: string | null;
	status: string;
	student: {
		studentId: number;
		studentName: string;
		email?: string | null;
		profilePicture?: string | null;
		gradeLevel?: number | null;
	};
};

export type ParentStudentClass = {
	classId: number;
	className: string;
	subjectId?: number | null;
	subjectName?: string | null;
	gradeLevel?: number | null;
	joinedAt?: string | null;
	ownerTeacher?: {
		teacherId: number;
		teacherName: string;
		email?: string | null;
	} | null;
	averageScore: number | null;
	completedAssessments: number;
	totalAssessments: number;
};

export type ParentGradebookItem = {
	assessmentId: number;
	documentId: string;
	title: string;
	documentType: 'ASSIGNMENT' | 'EXAM' | string;
	startDate?: string | null;
	dueDate?: string | null;
	attemptId: number | null;
	status: string | null;
	submittedAt: string | null;
	totalScore: number | null;
};

export type ParentClassGradebook = {
	classId: number;
	className: string;
	subjectName?: string | null;
	studentId: number;
	averageScore: number | null;
	completedAssessments: number;
	totalAssessments: number;
	items: ParentGradebookItem[];
};

export type ParentLinkCode = {
	code: string;
	student_id?: number;
	expires_at?: string;
	is_revoked?: boolean;
	used_at?: string | null;
};
