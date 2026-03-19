import { AuthGuard } from '@/components/auth/auth-guard';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={['PARENT']}>
			<div className="flex min-h-screen">{children}</div>
		</AuthGuard>
	);
}
