'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';

interface AdminGuardProps {
	children: React.ReactNode;
	allowedRoles?: Role[];
	redirectTo?: string;
}

export function AdminGuard({ children, allowedRoles = ['ADMIN'], redirectTo }: AdminGuardProps) {
	const router = useRouter();
	const { token, user, hasHydrated } = useAuthStore();
	const [showDenied, setShowDenied] = useState(false);

	const isAuthenticated = !!token;

	const isAllowed = useMemo(() => {
		if (!hasHydrated) return false;
		if (!isAuthenticated || !user) return false;
		if (!allowedRoles || allowedRoles.length === 0) return true;
		return allowedRoles.includes(user.role);
	}, [allowedRoles, hasHydrated, isAuthenticated, user]);

	useEffect(() => {
		if (!hasHydrated) return;

		if (!isAllowed) {
			setShowDenied(true);

			if (redirectTo) {
				const timeout = setTimeout(() => {
					router.replace(redirectTo);
				}, 2500);

				return () => clearTimeout(timeout);
			}
		}
	}, [hasHydrated, isAllowed, redirectTo, router]);

	if (!hasHydrated) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
				<span className="text-sm">Loading session…</span>
			</div>
		);
	}

	if (!isAllowed && showDenied) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#FAF9F6]">
				<div className="rounded-2xl border border-[#E0DCD5] bg-white px-10 py-8 shadow-sm">
					<h1 className="mb-2 text-center font-sans text-2xl font-bold text-[#333]">
						Access Denied
					</h1>
					<p className="mb-6 max-w-sm text-center text-sm text-[#666]">
						You don&apos;t have permission to view the Admin Dashboard. Please contact your system
						administrator if you believe this is a mistake.
					</p>
					<div className="flex justify-center">
						<Button
							variant="outline"
							onClick={() => router.push('/')}
							className="rounded-full px-6"
						>
							Go back home
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!isAllowed) {
		return null;
	}

	return <>{children}</>;
}
