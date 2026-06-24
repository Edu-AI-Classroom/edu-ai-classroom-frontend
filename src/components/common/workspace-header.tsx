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
		<header className="sticky top-0 z-50 w-full border-b border-[#E0DCD5] bg-[#FAF9F6]/90 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur-md supports-backdrop-filter:bg-[#FAF9F6]/80">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				<TeachifyIcon />

				<div className="flex items-center gap-4">
					<NotificationBell />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1 transition hover:border-[#E0DCD5] hover:bg-white/80 hover:shadow-sm"
								aria-label="Open user menu"
							>
								{avatarUrl ? (
									<img
										src={avatarUrl}
										alt="User avatar"
										className="h-10 w-10 rounded-full ring-2 ring-white"
									/>
								) : (
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5B4E3] font-semibold text-white ring-2 ring-white">
										{userName
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
								)}
								<div className="hidden text-left sm:block">
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
