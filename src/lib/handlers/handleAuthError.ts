import { redirect } from 'next/navigation';
import { AuthService, getTokenFromAuthResponse } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError } from '@/types/api';

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const AUTH_ERROR_CODES = new Set([
	'TOKEN_EXPIRED',
	'INVALID_TOKEN',
	'MISSING_TOKEN',
	'UNAUTHORIZED',
	'FORBIDDEN',
]);

function isAuthRelatedError(error: ApiError) {
	const normalizedCode = error.code?.toUpperCase();
	const normalizedMessage = error.message?.toLowerCase() ?? '';

	return (
		error.status === 401 ||
		(error.status === 403 &&
			!!normalizedCode &&
			(AUTH_ERROR_CODES.has(normalizedCode) ||
				normalizedCode.includes('TOKEN') ||
				normalizedCode.includes('AUTH'))) ||
		normalizedMessage.includes('token') ||
		normalizedMessage.includes('auth')
	);
}

function isTokenIssueError(error: ApiError) {
	const normalizedCode = error.code?.toUpperCase() ?? '';
	const normalizedMessage = error.message?.toLowerCase() ?? '';

	return (
		normalizedCode.includes('TOKEN') ||
		normalizedCode === 'UNAUTHORIZED' ||
		normalizedCode === 'FORBIDDEN' ||
		normalizedMessage.includes('token') ||
		normalizedMessage.includes('expired')
	);
}

function clearAuthState() {
	const { logout } = useAuthStore.getState();
	logout();

	useAuthStore.persist.clearStorage();
	if (typeof window !== 'undefined') {
		localStorage.removeItem('auth-store');
	}
}

function goToForbiddenPage() {
	if (typeof window !== 'undefined') {
		window.location.assign('/403');
		return;
	}

	redirect('/403');
}

export async function handleAuthError(error?: ApiError) {
	if (!error) return;

	const { token, setToken } = useAuthStore.getState();

	if (!isAuthRelatedError(error)) {
		throw error;
	}

	if (!token) throw error;

	if (error.status === 403 && !isTokenIssueError(error)) {
		goToForbiddenPage();
		throw error;
	}

	if (isRefreshing) {
		return new Promise<string>((resolve, reject) => {
			queue.push((newToken) => {
				if (newToken) resolve(newToken);
				else reject(error);
			});
		});
	}

	isRefreshing = true;

	try {
		const res = await AuthService.refreshToken();
		const newToken = getTokenFromAuthResponse(res);

		if (!newToken) {
			throw error;
		}

		setToken(newToken);
		queue.forEach((cb) => {
			cb(newToken);
		});
		queue = [];

		return newToken;
	} catch {
		queue.forEach((cb) => {
			cb(null);
		});
		queue = [];
		clearAuthState();
		goToForbiddenPage();
		throw error;
	} finally {
		isRefreshing = false;
	}
}
