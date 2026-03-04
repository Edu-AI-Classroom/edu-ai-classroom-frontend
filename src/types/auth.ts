export type Role = 'TEACHER' | 'STUDENT' | 'PARENT' | 'ADMIN';

export interface User {
	userId: number;
	userName: string;
	email: string;
	role: Role;
	profilePicture?: string | null;
	isActive?: boolean;
	credit?: number;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface AuthLoginPayload {
	email: string;
	password: string;
}

export interface AuthRegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface AuthUserResponse {
	userId: string;
	userName: string;
	email?: string;
	role: Role;
	profilePicture?: string | null;
	isActive?: boolean;
	credit?: number;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface AuthTokenResponse {
	message?: string;
	token?: string;
	access_token?: string;
	jwt?: string;
	expires_in?: string;
	user?: AuthUserResponse;
}
