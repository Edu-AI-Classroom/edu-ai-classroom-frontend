import { AuthGuard } from '@/components/auth/auth-guard';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={['STUDENT']}>
			<div className="flex h-screen">
				{/* <TeacherSidebar /> */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</AuthGuard>
	);
}
