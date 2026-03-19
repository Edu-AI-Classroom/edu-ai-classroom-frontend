'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getRoleRedirectPath } from '@/lib/user/routes-by-role';
import { useAuthStore } from '@/stores/auth-store';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { token, user, hasHydrated } = useAuthStore();
	const isAuthenticated = !!token;

	useEffect(() => {
		if (hasHydrated && isAuthenticated && user) {
			router.push(getRoleRedirectPath(user.role));
		}
	}, [hasHydrated, isAuthenticated, router, user]);

	if (!hasHydrated || (isAuthenticated && user)) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center text-muted-foreground">
				<Spinner className="size-5" />
			</div>
		);
	}

	return <main className="min-h-screen w-full">{children}</main>;
}
