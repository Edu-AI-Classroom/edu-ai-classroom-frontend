import { AuthGuard } from '@/components/auth/auth-guard';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={['STUDENT']}>
			<div className="flex min-h-screen">{children}</div>
		</AuthGuard>
	);
}
