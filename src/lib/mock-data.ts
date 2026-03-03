// Mock data for Teachify Classroom Management

export interface Teacher {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: string;
}

export interface ClassData {
	id: string;
	name: string;
	subject: string;
	grade: string;
	studentCount: number;
	pendingGrading: number;
	upcomingDeadlines: number;
	color: string;
	rotation: number;
}

export interface Student {
	id: string;
	name: string;
	email: string;
	avatar: string;
	attendance: number;
	averageGrade: number;
	submissionRate: number;
	status: 'on-track' | 'needs-attention' | 'excellent';
}

export interface Assignment {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	totalPoints: number;
	submissionCount: number;
	totalStudents: number;
	type: 'homework' | 'quiz' | 'project' | 'exam';
	status: 'active' | 'past-due' | 'graded';
}

export interface Submission {
	id: string;
	studentId: string;
	studentName: string;
	assignmentId: string;
	assignmentTitle: string;
	submittedAt: string;
	status: 'pending' | 'graded' | 'late';
	grade?: number;
	feedback?: string;
}

export interface Announcement {
	id: string;
	author: string;
	authorAvatar: string;
	content: string;
	createdAt: string;
	isPinned: boolean;
	audience: 'students' | 'parents' | 'all';
	commentCount: number;
	comments: Comment[];
}

export interface Comment {
	id: string;
	author: string;
	authorRole: 'teacher' | 'student' | 'parent';
	content: string;
	createdAt: string;
}

export interface AttentionItem {
	id: string;
	type: 'meeting' | 'grading' | 'deadline';
	title: string;
	description: string;
	dueDate?: string;
	priority: 'high' | 'medium' | 'low';
}

export interface Activity {
	id: string;
	type: 'submission' | 'comment' | 'grade';
	studentName: string;
	description: string;
	timestamp: string;
}

// Current teacher
export const currentTeacher: Teacher = {
	id: 'teacher-1',
	name: 'Ms. Sarah Johnson',
	email: 'sarah.johnson@school.edu',
	avatar: '/avatars/teacher.jpg',
	role: 'Math & Science Teacher',
};

// Classes
export const classes: ClassData[] = [
	{
		id: 'class-5a',
		name: 'Class 5A',
		subject: 'Mathematics',
		grade: 'Grade 5',
		studentCount: 28,
		pendingGrading: 12,
		upcomingDeadlines: 3,
		color: '#F5B041',
		rotation: -1.5,
	},
	{
		id: 'class-5b',
		name: 'Class 5B',
		subject: 'Mathematics',
		grade: 'Grade 5',
		studentCount: 26,
		pendingGrading: 5,
		upcomingDeadlines: 2,
		color: '#A8D5BA',
		rotation: 1,
	},
	{
		id: 'class-6a',
		name: 'Class 6A',
		subject: 'Science',
		grade: 'Grade 6',
		studentCount: 30,
		pendingGrading: 8,
		upcomingDeadlines: 1,
		color: '#C5B4E3',
		rotation: -0.5,
	},
	{
		id: 'class-6b',
		name: 'Class 6B',
		subject: 'Science',
		grade: 'Grade 6',
		studentCount: 25,
		pendingGrading: 0,
		upcomingDeadlines: 4,
		color: '#A8D4E6',
		rotation: 2,
	},
];

// Students by class
export const studentsByClass: Record<string, Student[]> = {
	'class-5a': [
		{
			id: 's1',
			name: 'Emma Wilson',
			email: 'emma.w@school.edu',
			avatar: '',
			attendance: 95,
			averageGrade: 88,
			submissionRate: 100,
			status: 'excellent',
		},
		{
			id: 's2',
			name: 'Liam Chen',
			email: 'liam.c@school.edu',
			avatar: '',
			attendance: 92,
			averageGrade: 75,
			submissionRate: 90,
			status: 'on-track',
		},
		{
			id: 's3',
			name: 'Olivia Martinez',
			email: 'olivia.m@school.edu',
			avatar: '',
			attendance: 88,
			averageGrade: 92,
			submissionRate: 95,
			status: 'excellent',
		},
		{
			id: 's4',
			name: 'Noah Johnson',
			email: 'noah.j@school.edu',
			avatar: '',
			attendance: 78,
			averageGrade: 65,
			submissionRate: 70,
			status: 'needs-attention',
		},
		{
			id: 's5',
			name: 'Ava Thompson',
			email: 'ava.t@school.edu',
			avatar: '',
			attendance: 96,
			averageGrade: 82,
			submissionRate: 100,
			status: 'on-track',
		},
		{
			id: 's6',
			name: 'Ethan Brown',
			email: 'ethan.b@school.edu',
			avatar: '',
			attendance: 90,
			averageGrade: 79,
			submissionRate: 85,
			status: 'on-track',
		},
		{
			id: 's7',
			name: 'Sophia Garcia',
			email: 'sophia.g@school.edu',
			avatar: '',
			attendance: 94,
			averageGrade: 91,
			submissionRate: 100,
			status: 'excellent',
		},
		{
			id: 's8',
			name: 'Mason Lee',
			email: 'mason.l@school.edu',
			avatar: '',
			attendance: 72,
			averageGrade: 58,
			submissionRate: 60,
			status: 'needs-attention',
		},
	],
	'class-5b': [
		{
			id: 's9',
			name: 'Isabella Davis',
			email: 'isabella.d@school.edu',
			avatar: '',
			attendance: 97,
			averageGrade: 94,
			submissionRate: 100,
			status: 'excellent',
		},
		{
			id: 's10',
			name: 'James Miller',
			email: 'james.m@school.edu',
			avatar: '',
			attendance: 89,
			averageGrade: 77,
			submissionRate: 88,
			status: 'on-track',
		},
		{
			id: 's11',
			name: 'Mia Anderson',
			email: 'mia.a@school.edu',
			avatar: '',
			attendance: 93,
			averageGrade: 85,
			submissionRate: 95,
			status: 'on-track',
		},
		{
			id: 's12',
			name: 'Benjamin Taylor',
			email: 'ben.t@school.edu',
			avatar: '',
			attendance: 85,
			averageGrade: 72,
			submissionRate: 80,
			status: 'on-track',
		},
	],
	'class-6a': [
		{
			id: 's13',
			name: 'Charlotte White',
			email: 'charlotte.w@school.edu',
			avatar: '',
			attendance: 98,
			averageGrade: 96,
			submissionRate: 100,
			status: 'excellent',
		},
		{
			id: 's14',
			name: 'Lucas Harris',
			email: 'lucas.h@school.edu',
			avatar: '',
			attendance: 91,
			averageGrade: 83,
			submissionRate: 92,
			status: 'on-track',
		},
		{
			id: 's15',
			name: 'Amelia Clark',
			email: 'amelia.c@school.edu',
			avatar: '',
			attendance: 76,
			averageGrade: 62,
			submissionRate: 65,
			status: 'needs-attention',
		},
		{
			id: 's16',
			name: 'Henry Robinson',
			email: 'henry.r@school.edu',
			avatar: '',
			attendance: 94,
			averageGrade: 88,
			submissionRate: 97,
			status: 'excellent',
		},
	],
	'class-6b': [
		{
			id: 's17',
			name: 'Harper Lewis',
			email: 'harper.l@school.edu',
			avatar: '',
			attendance: 95,
			averageGrade: 89,
			submissionRate: 98,
			status: 'excellent',
		},
		{
			id: 's18',
			name: 'Alexander Walker',
			email: 'alex.w@school.edu',
			avatar: '',
			attendance: 87,
			averageGrade: 74,
			submissionRate: 82,
			status: 'on-track',
		},
		{
			id: 's19',
			name: 'Evelyn Hall',
			email: 'evelyn.h@school.edu',
			avatar: '',
			attendance: 92,
			averageGrade: 81,
			submissionRate: 90,
			status: 'on-track',
		},
	],
};

// Assignments by class
export const assignmentsByClass: Record<string, Assignment[]> = {
	'class-5a': [
		{
			id: 'a1',
			title: 'Fractions Quiz',
			description: 'Quiz on adding and subtracting fractions',
			dueDate: '2026-02-06',
			totalPoints: 50,
			submissionCount: 20,
			totalStudents: 28,
			type: 'quiz',
			status: 'active',
		},
		{
			id: 'a2',
			title: 'Word Problems Homework',
			description: 'Complete exercises 1-15 from Chapter 5',
			dueDate: '2026-02-08',
			totalPoints: 30,
			submissionCount: 15,
			totalStudents: 28,
			type: 'homework',
			status: 'active',
		},
		{
			id: 'a3',
			title: 'Geometry Project',
			description: 'Create a poster showing geometric shapes in real life',
			dueDate: '2026-02-15',
			totalPoints: 100,
			submissionCount: 0,
			totalStudents: 28,
			type: 'project',
			status: 'active',
		},
		{
			id: 'a4',
			title: 'Multiplication Tables Test',
			description: 'Timed test on 1-12 multiplication tables',
			dueDate: '2026-01-28',
			totalPoints: 40,
			submissionCount: 28,
			totalStudents: 28,
			type: 'exam',
			status: 'graded',
		},
	],
	'class-5b': [
		{
			id: 'a5',
			title: 'Decimals Worksheet',
			description: 'Practice converting fractions to decimals',
			dueDate: '2026-02-07',
			totalPoints: 25,
			submissionCount: 18,
			totalStudents: 26,
			type: 'homework',
			status: 'active',
		},
		{
			id: 'a6',
			title: 'Math Puzzle Challenge',
			description: 'Solve logic puzzles using math concepts',
			dueDate: '2026-02-10',
			totalPoints: 50,
			submissionCount: 5,
			totalStudents: 26,
			type: 'homework',
			status: 'active',
		},
	],
	'class-6a': [
		{
			id: 'a7',
			title: 'Plant Cell Diagram',
			description: 'Draw and label all parts of a plant cell',
			dueDate: '2026-02-05',
			totalPoints: 40,
			submissionCount: 25,
			totalStudents: 30,
			type: 'homework',
			status: 'active',
		},
		{
			id: 'a8',
			title: 'Photosynthesis Quiz',
			description: 'Quiz on the process of photosynthesis',
			dueDate: '2026-02-09',
			totalPoints: 35,
			submissionCount: 0,
			totalStudents: 30,
			type: 'quiz',
			status: 'active',
		},
		{
			id: 'a9',
			title: 'Science Fair Project Proposal',
			description: 'Submit your science fair project idea',
			dueDate: '2026-02-20',
			totalPoints: 20,
			submissionCount: 12,
			totalStudents: 30,
			type: 'project',
			status: 'active',
		},
	],
	'class-6b': [
		{
			id: 'a10',
			title: 'Elements Quiz',
			description: 'Identify elements from the periodic table',
			dueDate: '2026-02-06',
			totalPoints: 30,
			submissionCount: 20,
			totalStudents: 25,
			type: 'quiz',
			status: 'active',
		},
		{
			id: 'a11',
			title: 'Lab Report: Chemical Reactions',
			description: 'Write up your observations from the lab',
			dueDate: '2026-02-12',
			totalPoints: 60,
			submissionCount: 8,
			totalStudents: 25,
			type: 'homework',
			status: 'active',
		},
	],
};

// Submissions by class
export const submissionsByClass: Record<string, Submission[]> = {
	'class-5a': [
		{
			id: 'sub1',
			studentId: 's1',
			studentName: 'Emma Wilson',
			assignmentId: 'a1',
			assignmentTitle: 'Fractions Quiz',
			submittedAt: '2026-02-04 09:30',
			status: 'pending',
		},
		{
			id: 'sub2',
			studentId: 's2',
			studentName: 'Liam Chen',
			assignmentId: 'a1',
			assignmentTitle: 'Fractions Quiz',
			submittedAt: '2026-02-04 10:15',
			status: 'pending',
		},
		{
			id: 'sub3',
			studentId: 's3',
			studentName: 'Olivia Martinez',
			assignmentId: 'a1',
			assignmentTitle: 'Fractions Quiz',
			submittedAt: '2026-02-03 14:00',
			status: 'graded',
			grade: 48,
			feedback: 'Excellent work!',
		},
		{
			id: 'sub4',
			studentId: 's5',
			studentName: 'Ava Thompson',
			assignmentId: 'a2',
			assignmentTitle: 'Word Problems Homework',
			submittedAt: '2026-02-04 08:00',
			status: 'pending',
		},
		{
			id: 'sub5',
			studentId: 's4',
			studentName: 'Noah Johnson',
			assignmentId: 'a4',
			assignmentTitle: 'Multiplication Tables Test',
			submittedAt: '2026-01-28 11:00',
			status: 'graded',
			grade: 28,
			feedback: 'Keep practicing!',
		},
	],
	'class-5b': [
		{
			id: 'sub6',
			studentId: 's9',
			studentName: 'Isabella Davis',
			assignmentId: 'a5',
			assignmentTitle: 'Decimals Worksheet',
			submittedAt: '2026-02-04 07:45',
			status: 'pending',
		},
	],
	'class-6a': [
		{
			id: 'sub7',
			studentId: 's13',
			studentName: 'Charlotte White',
			assignmentId: 'a7',
			assignmentTitle: 'Plant Cell Diagram',
			submittedAt: '2026-02-03 16:00',
			status: 'graded',
			grade: 40,
			feedback: 'Perfect diagram!',
		},
		{
			id: 'sub8',
			studentId: 's15',
			studentName: 'Amelia Clark',
			assignmentId: 'a7',
			assignmentTitle: 'Plant Cell Diagram',
			submittedAt: '2026-02-05 08:30',
			status: 'late',
		},
	],
	'class-6b': [
		{
			id: 'sub9',
			studentId: 's17',
			studentName: 'Harper Lewis',
			assignmentId: 'a10',
			assignmentTitle: 'Elements Quiz',
			submittedAt: '2026-02-04 11:00',
			status: 'pending',
		},
	],
};

// Announcements by class
export const announcementsByClass: Record<string, Announcement[]> = {
	'class-5a': [
		{
			id: 'ann1',
			author: 'Ms. Sarah Johnson',
			authorAvatar: '',
			content:
				'Reminder: Math quiz on fractions this Friday! Please review Chapter 4 and practice the exercises we did in class. Office hours available Thursday after school.',
			createdAt: '2026-02-03 08:00',
			isPinned: true,
			audience: 'all',
			commentCount: 3,
			comments: [
				{
					id: 'c1',
					author: 'Emma Wilson',
					authorRole: 'student',
					content: 'Will the quiz include mixed numbers?',
					createdAt: '2026-02-03 09:15',
				},
				{
					id: 'c2',
					author: 'Ms. Sarah Johnson',
					authorRole: 'teacher',
					content: 'Yes, there will be 2-3 questions on mixed numbers.',
					createdAt: '2026-02-03 09:30',
				},
				{
					id: 'c3',
					author: 'Parent of Liam',
					authorRole: 'parent',
					content: 'Thank you for the reminder!',
					createdAt: '2026-02-03 18:00',
				},
			],
		},
		{
			id: 'ann2',
			author: 'Ms. Sarah Johnson',
			authorAvatar: '',
			content:
				"Great job everyone on today's group activity! I loved seeing your creative problem-solving approaches. Keep up the excellent teamwork!",
			createdAt: '2026-02-02 15:30',
			isPinned: false,
			audience: 'students',
			commentCount: 5,
			comments: [
				{
					id: 'c4',
					author: 'Sophia Garcia',
					authorRole: 'student',
					content: 'It was so fun!',
					createdAt: '2026-02-02 15:45',
				},
				{
					id: 'c5',
					author: 'Ava Thompson',
					authorRole: 'student',
					content: 'Can we do more activities like this?',
					createdAt: '2026-02-02 16:00',
				},
			],
		},
		{
			id: 'ann3',
			author: 'Ms. Sarah Johnson',
			authorAvatar: '',
			content:
				'Parent-teacher conferences are scheduled for February 20th. Please sign up for a time slot using the link sent to your email.',
			createdAt: '2026-02-01 10:00',
			isPinned: true,
			audience: 'parents',
			commentCount: 1,
			comments: [],
		},
	],
	'class-5b': [
		{
			id: 'ann4',
			author: 'Ms. Sarah Johnson',
			authorAvatar: '',
			content:
				"Welcome back from the break! This week we'll be starting our new unit on decimals. Please bring your calculators to class.",
			createdAt: '2026-02-03 07:30',
			isPinned: false,
			audience: 'all',
			commentCount: 0,
			comments: [],
		},
	],
	'class-6a': [
		{
			id: 'ann5',
			author: 'Ms. Sarah Johnson',
			authorAvatar: '',
			content:
				"Science Fair project proposals are due February 20th. Start thinking about your experiment ideas! I've shared some inspiration resources in the Content Library.",
			createdAt: '2026-02-02 09:00',
			isPinned: true,
			audience: 'all',
			commentCount: 2,
			comments: [
				{
					id: 'c6',
					author: 'Henry Robinson',
					authorRole: 'student',
					content: 'Can we work in pairs?',
					createdAt: '2026-02-02 10:00',
				},
				{
					id: 'c7',
					author: 'Ms. Sarah Johnson',
					authorRole: 'teacher',
					content: 'Yes, pairs are allowed this year!',
					createdAt: '2026-02-02 10:15',
				},
			],
		},
	],
	'class-6b': [
		{
			id: 'ann6',
			author: 'Ms. Sarah Johnson',
			authorAvatar: '',
			content:
				'Lab safety reminder: Please remember to wear closed-toe shoes and tie back long hair during our chemistry experiments this week.',
			createdAt: '2026-02-04 07:00',
			isPinned: true,
			audience: 'students',
			commentCount: 0,
			comments: [],
		},
	],
};

// Attention items by class
export const attentionItemsByClass: Record<string, AttentionItem[]> = {
	'class-5a': [
		{
			id: 'att1',
			type: 'meeting',
			title: 'Parent Meeting: Noah Johnson',
			description: 'Discuss academic progress and support plan',
			dueDate: '2026-02-05 14:00',
			priority: 'high',
		},
		{
			id: 'att2',
			type: 'grading',
			title: '12 Submissions Pending',
			description: 'Fractions Quiz needs grading',
			priority: 'medium',
		},
		{
			id: 'att3',
			type: 'deadline',
			title: 'Word Problems Due',
			description: 'Homework deadline in 4 days',
			dueDate: '2026-02-08',
			priority: 'low',
		},
	],
	'class-5b': [
		{
			id: 'att4',
			type: 'grading',
			title: '5 Submissions Pending',
			description: 'Decimals Worksheet needs grading',
			priority: 'medium',
		},
	],
	'class-6a': [
		{
			id: 'att5',
			type: 'grading',
			title: '8 Submissions Pending',
			description: 'Plant Cell Diagram needs grading',
			priority: 'high',
		},
		{
			id: 'att6',
			type: 'meeting',
			title: 'Science Fair Planning',
			description: 'Department meeting to discuss judging criteria',
			dueDate: '2026-02-10 15:00',
			priority: 'medium',
		},
	],
	'class-6b': [
		{
			id: 'att7',
			type: 'deadline',
			title: 'Lab Reports Due Soon',
			description: '4 days until deadline',
			dueDate: '2026-02-12',
			priority: 'medium',
		},
	],
};

// Recent activity by class
export const activityByClass: Record<string, Activity[]> = {
	'class-5a': [
		{
			id: 'act1',
			type: 'submission',
			studentName: 'Emma Wilson',
			description: 'submitted Fractions Quiz',
			timestamp: '2 hours ago',
		},
		{
			id: 'act2',
			type: 'submission',
			studentName: 'Liam Chen',
			description: 'submitted Fractions Quiz',
			timestamp: '3 hours ago',
		},
		{
			id: 'act3',
			type: 'comment',
			studentName: 'Sophia Garcia',
			description: 'commented on announcement',
			timestamp: '5 hours ago',
		},
		{
			id: 'act4',
			type: 'submission',
			studentName: 'Ava Thompson',
			description: 'submitted Word Problems Homework',
			timestamp: '6 hours ago',
		},
	],
	'class-5b': [
		{
			id: 'act5',
			type: 'submission',
			studentName: 'Isabella Davis',
			description: 'submitted Decimals Worksheet',
			timestamp: '4 hours ago',
		},
	],
	'class-6a': [
		{
			id: 'act6',
			type: 'grade',
			studentName: 'Charlotte White',
			description: 'received grade for Plant Cell Diagram',
			timestamp: '1 day ago',
		},
		{
			id: 'act7',
			type: 'submission',
			studentName: 'Amelia Clark',
			description: 'submitted Plant Cell Diagram (late)',
			timestamp: '8 hours ago',
		},
	],
	'class-6b': [
		{
			id: 'act8',
			type: 'submission',
			studentName: 'Harper Lewis',
			description: 'submitted Elements Quiz',
			timestamp: '3 hours ago',
		},
	],
};

// Helper functions
export function getClassById(classId: string): ClassData | undefined {
	return classes.find((c) => c.id === classId);
}

export function getStudentsForClass(classId: string): Student[] {
	return studentsByClass[classId] || [];
}

export function getAssignmentsForClass(classId: string): Assignment[] {
	return assignmentsByClass[classId] || [];
}

export function getSubmissionsForClass(classId: string): Submission[] {
	return submissionsByClass[classId] || [];
}

export function getAnnouncementsForClass(classId: string): Announcement[] {
	return announcementsByClass[classId] || [];
}

export function getAttentionItemsForClass(classId: string): AttentionItem[] {
	return attentionItemsByClass[classId] || [];
}

export function getActivityForClass(classId: string): Activity[] {
	return activityByClass[classId] || [];
}

export function getClassStats(classId: string) {
	const students = getStudentsForClass(classId);
	const assignments = getAssignmentsForClass(classId);
	const submissions = getSubmissionsForClass(classId);

	const totalStudents = students.length;
	const avgAttendance =
		students.length > 0
			? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)
			: 0;
	const avgGrade =
		students.length > 0
			? Math.round(students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length)
			: 0;
	const needsAttention = students.filter((s) => s.status === 'needs-attention').length;

	const activeAssignments = assignments.filter((a) => a.status === 'active');
	const totalExpectedSubmissions = activeAssignments.reduce((sum, a) => sum + a.totalStudents, 0);
	const totalActualSubmissions = activeAssignments.reduce((sum, a) => sum + a.submissionCount, 0);
	const submissionRate =
		totalExpectedSubmissions > 0
			? Math.round((totalActualSubmissions / totalExpectedSubmissions) * 100)
			: 0;

	return {
		totalStudents,
		avgAttendance,
		avgGrade,
		needsAttention,
		submissionRate,
		pendingGrading: submissions.filter((s) => s.status === 'pending').length,
	};
}
