export type RegisterRole = 'STUDENT' | 'TEACHER';
export type RegisterAuthMethod = 'credentials' | 'google';

export type RegisterFormData = {
	name: string;
	email: string;
	password: string;
	role: RegisterRole | null;
	gradeLevel: string;
	mentorQuery: string;
	mentorName: string;
	parentEmail: string;
};

export type RegisterStep = 1 | 2 | 3 | 4 | 5 | 6;
