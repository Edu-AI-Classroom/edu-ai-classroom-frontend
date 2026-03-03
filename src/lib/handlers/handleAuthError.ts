import { redirect } from 'next/navigation';
import { AuthService, getTokenFromAuthResponse } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError } from '@/types/api';

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

export async function handleAuthError(error?: ApiError) {
	if (!error) return;

	const { token, setToken, logout } = useAuthStore.getState();

	// 403: không có quyền → redirect riêng
	if (error.status === 403) {
		redirect('/403');
	}

	// Không phải lỗi auth → throw tiếp
	if (error.status !== 401) {
		throw error;
	}

	/**
	 * ===== CASE 1: LOGIN SAI / PUBLIC ROUTE 401 =====
	 * Không có token → không refresh, không logout
	 */
	if (!token) {
		throw error; // để hook tự show toast
	}

	/**
	 * ===== CASE 2: TOKEN EXPIRED =====
	 * Có token + hết hạn → refresh
	 */
	if (error.code === 'TOKEN_EXPIRED') {
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

			if (!newToken) throw error;

			setToken(newToken);

			queue.forEach((cb) => {
				cb(newToken);
			});
			queue = [];

			return newToken;
		} catch {
			queue = [];
			logout();
			redirect('/login');
		} finally {
			isRefreshing = false;
		}
	}

	/**
	 * ===== CASE 3: INVALID TOKEN / MISSING TOKEN / UNAUTHORIZED =====
	 * Có token nhưng token không hợp lệ
	 */
	logout();
	redirect('/login');
}
