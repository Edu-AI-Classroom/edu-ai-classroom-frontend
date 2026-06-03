'use client';

import { useCallback } from 'react';
import {
	type GoogleAuthIntent,
	setGoogleAuthIntent,
} from '@/features/auth/google/google-auth-session';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export function useGoogleAuth() {
	const startGoogleAuth = useCallback((intent: GoogleAuthIntent) => {
		setGoogleAuthIntent(intent);
		window.location.href = `${API_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`;
	}, []);

	const startGoogleLogin = useCallback(() => {
		startGoogleAuth('login');
	}, [startGoogleAuth]);

	const startGoogleSignup = useCallback(() => {
		startGoogleAuth('register');
	}, [startGoogleAuth]);

	return { startGoogleLogin, startGoogleSignup };
}
