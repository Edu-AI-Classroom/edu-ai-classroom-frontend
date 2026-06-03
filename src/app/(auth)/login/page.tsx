'use client';

import { AuthFlipBook } from '@/features/auth/auth-flip-book';
import { useGoogleAuth } from '@/hooks/queries/auth/use-google-auth';

export default function LoginPage() {
	const { startGoogleLogin } = useGoogleAuth();

	return <AuthFlipBook initialMode="login" onGoogleLogin={startGoogleLogin} />;
}
