import { AuthGuard } from '@/components/auth/auth-guard';
import { ConversationCallCenter } from '@/features/agora/conversation-call-center';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={['STUDENT']}>
			<div className="flex h-screen">
				{/* <TeacherSidebar /> */}
				<main className="flex-1 p-6">{children}</main>
				<ConversationCallCenter />
			</div>
		</AuthGuard>
	);
}
