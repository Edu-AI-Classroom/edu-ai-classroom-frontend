'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { consumeGoogleAuthIntent } from '@/features/auth/google/google-auth-session';
import { saveRegisterDraft } from '@/features/auth/register/register-draft';
import { getRoleRedirectPath } from '@/lib/user/routes-by-role';
import { AuthService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';

interface JwtPayload {
	sub: number;
	email?: string;
	role?: Role;
	iat?: number;
	exp?: number;
}

function getCallbackParams(searchParams: URLSearchParams) {
	const queryToken = searchParams.get('access_token');
	const queryExpiresIn = searchParams.get('expires_in');

	if (queryToken) {
		return {
			accessToken: queryToken,
			expiresIn: queryExpiresIn,
		};
	}

	if (typeof window === 'undefined') {
		return {
			accessToken: null,
			expiresIn: null,
		};
	}

	const hash = window.location.hash.startsWith('#')
		? window.location.hash.slice(1)
		: window.location.hash;
	const hashParams = new URLSearchParams(hash);

	return {
		accessToken: hashParams.get('access_token'),
		expiresIn: hashParams.get('expires_in'),
	};
}

function decodeJwtPayload(token: string): JwtPayload | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;

		const payload = parts[1];
		// Handle base64url encoding
		const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
		const decoded = atob(padded);
		return JSON.parse(decoded) as JwtPayload;
	} catch {
		return null;
	}
}

export default function GoogleCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login, setToken, setUser } = useAuthStore();
	const [error, setError] = useState<string | null>(null);

	const handleCallback = useCallback(async () => {
		const { accessToken } = getCallbackParams(searchParams);

		if (!accessToken) {
			setError('Authentication failed: missing access token.');
			return;
		}

		try {
			const intent = consumeGoogleAuthIntent();
			setToken(accessToken);
			setUser(null);

			// Decode the JWT to get user ID for profile fetch
			const payload = decodeJwtPayload(accessToken);
			if (!payload?.sub) {
				throw new Error('Invalid token payload');
			}

			const profile = await AuthService.getUserProfile(payload.sub, accessToken);

			if (intent === 'register' || !profile.role) {
				saveRegisterDraft({
					step: 2,
					authMethod: 'google',
					googleAccessToken: accessToken,
					formData: {
						name: profile.userName,
						email: profile.email ?? payload.email ?? '',
						password: '',
						role: profile.role === 'STUDENT' || profile.role === 'TEACHER' ? profile.role : null,
						gradeLevel: '',
						mentorQuery: '',
						mentorName: '',
						parentEmail: '',
					},
				});
				router.replace('/register');
				return;
			}

			const user = {
				userId: String(profile.userId),
				userName: profile.userName,
				email: profile.email,
				role: profile.role,
				profilePicture: profile.profilePicture,
				isActive: profile.isActive,
				credit: profile.credit,
				createdAt: profile.createdAt,
				updatedAt: profile.updatedAt,
			};

			login({ user, token: accessToken });
			router.replace(getRoleRedirectPath(profile.role));
		} catch (err) {
			console.error('Google auth callback error:', err);
			setError('Authentication failed. Please try again.');
			useAuthStore.getState().logout();
		}
	}, [searchParams, setToken, setUser, login, router]);

	useEffect(() => {
		handleCallback();
	}, [handleCallback]);

	if (error) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] p-4">
				<div className="w-full max-w-md rounded-2xl border-4 border-[#3a3a3a]/10 bg-white p-8 text-center shadow-2xl">
					<h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
					<p className="mb-6 text-gray-600">{error}</p>
					<button
						type="button"
						onClick={() => router.push('/login')}
						className="w-full rounded-xl border-2 border-[#333] bg-[#F4D06F] px-4 py-3 font-semibold text-[#333] shadow-[3px_3px_0px_#333] transition-all hover:shadow-[1px_1px_0px_#333] hover:-translate-y-0.5"
					>
						Back to Login
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6]">
			<div className="flex flex-col items-center gap-4">
				<Spinner className="size-10 text-[#F4D06F]" />
				<p className="text-lg font-medium text-gray-600">Completing sign-in...</p>
			</div>
		</div>
	);
}
