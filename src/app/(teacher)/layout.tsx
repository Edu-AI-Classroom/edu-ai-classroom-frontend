// import TeacherSidebar from '@/components/layout/TeacherSidebar'
import { AuthGuard } from '@/components/auth/auth-guard';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={['TEACHER']} redirectTo="/403">
			<div className="flex h-screen">
				{/* <TeacherSidebar /> */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</AuthGuard>
	);
}
