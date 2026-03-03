import type { Role } from '@/types/auth';

export function getRoleRedirectPath(role: Role): string {
	switch (role) {
		case 'TEACHER':
			return '/dashboard';
		case 'STUDENT':
			return '/student';
		case 'PARENT':
			return '/parent';
		default:
			return '/';
	}
}
