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
	studentId?: number;
	studentName?: string;
	joinedAt?: string;
	groupName?: string;
}

export interface TeacherApiResponse {
	teacherId: number;
	teacherName: string;
	email: string;
	addedAt: string;
	isOwner: boolean;
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

export interface JoinClassPayload {
	classCode: string;
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

// Assignment/Document Types
export interface Assignment {
	docId: number;
	docTitle: string;
	docType: 'ASSIGNMENT';
	gradeLevel?: number | null;
	subjectId?: number | null;
	note?: string | null;
	status: 'draft' | 'published' | 'archived' | 'graded';
	dueDate?: string | null;
	ownerId: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAssignmentPayload {
	title: string;
	note?: string;
	gradeLevel?: number;
	subjectId?: number;
	classId: number;
}

export interface UpdateAssignmentPayload {
	title?: string;
	note?: string;
	gradeLevel?: number;
	subjectId?: number;
	dueDate?: string;
}

export interface AssignmentListResponse extends PaginatedResponse<Assignment> {
	data: Assignment[];
}

export interface AssignmentResponse {
	message: string;
	data: Assignment;
}
