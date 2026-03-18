'use client';

import { useQuery } from '@tanstack/react-query';
import { Mail, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet } from '@/services/http.helpers';
import type { AuthUserResponse } from '@/types/auth';

interface StudentProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	classId: number;
	student: {
		id: string;
		userId: string;
		name: string;
		email: string;
		studentId?: number;
		className?: string;
		status?: string;
	};
}

export function StudentProfileModal({
	open,
	onOpenChange,
	classId,
	student,
}: StudentProfileModalProps) {
	const {
		data: profile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['student-profile', student.userId],
		queryFn: () =>
			httpGet<AuthUserResponse>(API_ENDPOINTS.USER.USER_PROFILE(Number(student.userId))),
		enabled: open && !!student.userId,
	});

	const displayName = student.name || profile?.userName || 'Student';
	const displayEmail = student.email || profile?.email || '';
	const statusText = student.status ?? (profile?.isActive ? 'Active' : 'Inactive');

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-3xl bg-white shadow-xl max-w-lg border border-[#E0DCD5]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#333]">Student Profile</DialogTitle>
				</DialogHeader>

				<div className="py-4 space-y-6">
					{isLoading && <p className="text-sm text-[#666]">Loading student information...</p>}

					{!isLoading && error && (
						<p className="text-sm text-red-600">
							Failed to load student profile. Please try again later.
						</p>
					)}

					{!isLoading && !error && (
						<>
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
									{displayName
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</div>
								<div>
									<p className="font-sans font-semibold text-lg text-[#333]">{displayName}</p>
									<p className="text-sm text-[#666] flex items-center gap-1">
										<Mail className="w-4 h-4" />
										{displayEmail || 'No email'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="bg-[#FAF9F6] rounded-xl p-3">
									<p className="text-[#999] mb-1">Student ID</p>
									<p className="font-semibold text-[#333]">{student.userId}</p>
								</div>
								<div className="bg-[#FAF9F6] rounded-xl p-3">
									<p className="text-[#999] mb-1">Class</p>
									<p className="font-semibold text-[#333]">
										{student.className ?? `Class #${classId}`}
									</p>
								</div>
								<div className="bg-[#FAF9F6] rounded-xl p-3">
									<p className="text-[#999] mb-1">Status</p>
									<p className="font-semibold text-[#333] flex items-center gap-1">
										<User className="w-4 h-4" />
										{statusText}
									</p>
								</div>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
