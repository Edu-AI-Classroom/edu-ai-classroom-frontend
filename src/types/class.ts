import type { PaginatedResponse } from './api';
import type { User } from './auth';

//Classroom
export interface Classroom {
	classId: number;
	isOwner: boolean;
	className: string;
	gradeLevel: number;
	subjectId?: number;
	subjectName?: string;
	studentCount: number;
	teacherCount: number;
	groupCount: number;
	createdBy: number;
	createdByName?: string;
	createdAt?: string | null;
	isDeleted?: boolean;
}

export interface Student extends User {
	role: 'STUDENT';
	gradeLevel: number | null;
	parentPhone?: string | null;
	groupId?: number | null;
}

export interface Teacher extends User {
	role: 'TEACHER';
	isOwner: boolean;
}

export interface CreateClassroomPayload {
	className: string;
	gradeLevel?: number;
	subjectId?: number;
}

export interface UpdateClassroomPayload {
	className?: string;
	gradeLevel?: number;
	subjectId?: number;
}

export interface ClassListResponse extends PaginatedResponse<Classroom> {
	data: Classroom[];
}

//Teahcer and Student
export interface AddTeacherPayload {
	email: string;
}

export interface AddStudentPayload {
	//có thể thêm học sinh bằng email hoặc tên
	email?: string;
	studentName?: string;
}

export interface UsersInClassResponse extends PaginatedResponse<Student | Teacher> {
	data: (Student | Teacher)[];
}

//Student Group
export interface Group {
	groupId: number;
	classId: number;
	groupName: string;
	students: User[];
	studentCount: number;
	createdAt?: string | null;
}

export interface GroupListResponse extends PaginatedResponse<Group> {
	data: Group[];
}

export interface CreateStudentGroupPayload {
	groupName: string;
	description?: string;
}

export interface UpdateStudentGroupPayload {
	groupName?: string;
	description?: string;
}

export interface AssignStudentToGroupPayload {
	studentId: string;
}
