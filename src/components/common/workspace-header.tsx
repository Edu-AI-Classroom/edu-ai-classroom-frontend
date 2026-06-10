'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotificationBell } from '@/features/notification/notification-bell';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/auth';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { TeachifyIcon } from './Teachify';

interface WorkspaceHeaderProps {
	userName: string;
	userRole: string | Role;
	avatarUrl?: string | null;
}

export default function WorkspaceHeader({ userName, userRole, avatarUrl }: WorkspaceHeaderProps) {
	const router = useRouter();
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = () => {
		logout();
		router.replace('/login');
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-cream/95 backdrop-blur supports-backdrop-filter:bg-cream/80">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<TeachifyIcon />

				<div className="flex items-center gap-4">
					<NotificationBell />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex items-center gap-3 pl-4 border-l border-[#E0DCD5] rounded-lg hover:bg-black/5 px-2 py-1"
								aria-label="Open user menu"
							>
								{avatarUrl ? (
									<img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full" />
								) : (
									<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
										{userName
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
								)}
								<div className="hidden sm:block text-left">
									<p className="font-sans font-semibold text-sm text-[#333]">{userName}</p>
									<p className="text-xs text-[#666]">{userRole}</p>
								</div>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-44">
							<DropdownMenuItem onClick={handleLogout}>
								<LogOut className="w-4 h-4 mr-2" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
