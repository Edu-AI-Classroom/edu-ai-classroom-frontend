'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';

interface AuthGuardProps {
	children: React.ReactNode;
	allowedRoles?: Role[];
	redirectTo?: string;
}

export function AuthGuard({ children, allowedRoles, redirectTo = '/login' }: AuthGuardProps) {
	const router = useRouter();
	const { token, user, hasHydrated } = useAuthStore();
	const isAuthenticated = !!token;

	const isAllowed = useMemo(() => {
		if (!hasHydrated) return false;
		if (!isAuthenticated || !user) return false;
		if (!allowedRoles || allowedRoles.length === 0) return true;
		return allowedRoles.includes(user.role);
	}, [allowedRoles, hasHydrated, isAuthenticated, user]);

	useEffect(() => {
		if (hasHydrated && !isAllowed) {
			router.replace(redirectTo);
		}
	}, [hasHydrated, isAllowed, redirectTo, router]);

	if (!hasHydrated || !isAllowed) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
				<Spinner className="size-5" />
			</div>
		);
	}

	return <>{children}</>;
}
