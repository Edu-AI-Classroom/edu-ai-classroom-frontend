import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { handleAuthError } from '@/lib/handlers/handleAuthError';
import { getRoleRedirectPath } from '@/lib/user/routes-by-role';
import { AuthService, getTokenFromAuthResponse } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError } from '@/types/api';
import type { AuthLoginPayload, AuthRegisterPayload } from '@/types/auth';

const getErrorMessage = (error: unknown, fallback: string) => {
	if (error && typeof error === 'object' && 'message' in error) {
		return String((error as { message?: string }).message ?? fallback);
	}
	return fallback;
};

export function useAuthUser() {
	return useAuthStore((state) => state.user);
}

export const useAuthMutations = () => {
	const router = useRouter();
	const _queryClient = useQueryClient();
	const { login, setToken } = useAuthStore();
	const [authError, setAuthError] = useState<string | null>(null);

	// Bootstrap auth after login / register
	const bootstrapAuth = async (response: Awaited<ReturnType<typeof AuthService.login>>) => {
		const token = getTokenFromAuthResponse(response);
		if (!token) throw new Error('Authentication token missing');
		setToken(token);

		if (!response.user) throw new Error('Unable to determine user id');

		// const userId = response.user?.userId ?? getJwtSubject(token);
		// if (!userId) throw new Error("Unable to determine user id");

		// const profile = await queryClient.fetchQuery({
		//   queryKey: queryKeys.auth.user_profile(userId),
		//   queryFn: () => AuthService.getUserProfile(userId),
		//   staleTime: 1000 * 60 * 5,
		// });
		login({ user: response.user, token }); // set auth store
		router.replace(getRoleRedirectPath(response.user.role));
	};

	const loginMutation = useMutation({
		mutationFn: (payload: AuthLoginPayload) => AuthService.login(payload),
		onSuccess: async (data) => {
			try {
				setAuthError(null);
				await bootstrapAuth(data);
			} catch (error) {
				setAuthError(getErrorMessage(error, 'Login failed'));
			}
		},
		onError: async (error: ApiError) => {
			try {
				await handleAuthError(error);
			} catch (err) {
				setAuthError(getErrorMessage(err, 'Login failed'));
			}
		},
	});

	const registerMutation = useMutation({
		mutationFn: (payload: AuthRegisterPayload) => AuthService.register(payload),
		onSuccess: async (data) => {
			try {
				setAuthError(null);
				await bootstrapAuth(data);
			} catch (error) {
				setAuthError(getErrorMessage(error, 'Registration failed'));
			}
		},
		onError: async (error: ApiError) => {
			try {
				await handleAuthError(error);
			} catch (err) {
				setAuthError(getErrorMessage(err, 'Registration failed'));
			}
		},
	});

	const clearAuthError = useCallback(() => setAuthError(null), []);

	return {
		authError,
		clearAuthError,
		loginMutation,
		registerMutation,
	};
};
