import { AuthGuard } from '@/components/auth/auth-guard';
import { ConversationCallCenter } from '@/features/agora/conversation-call-center';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={['PARENT']}>
			<div className="flex min-h-screen w-full min-w-0 overflow-hidden">
				{children}
				<ConversationCallCenter />
			</div>
		</AuthGuard>
	);
}
