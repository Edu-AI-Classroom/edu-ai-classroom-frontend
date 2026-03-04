'use client';

import { Loader2, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/common/use-toast';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { ClassService } from '@/services/classroom/class.service';
import type { Teacher, TeacherApiResponse } from '@/types/class';

interface AddTeacherModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	classId: number;
	onSuccess: () => void;
}

export function AddTeacherModal({
	open,
	onOpenChange,
	classId,
	onSuccess,
}: AddTeacherModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
	const { toast } = useToast();
	const { addTeacherToClassMutation } = useClassMutations();

	// Query for available teachers
	const { data: teachersResponse, isLoading, error } = useQuery({
		queryKey: ['class-teachers', classId],
		queryFn: async () => {
			return ClassService.getTeachers(classId);
		},
		enabled: open,
	});

	const availableTeachers =
		teachersResponse?.map((apiTeacher) => ({
			userId: apiTeacher.teacherId.toString(),
			userName: apiTeacher.teacherName,
			email: apiTeacher.email,
			role: 'TEACHER' as const,
			isOwner: apiTeacher.isOwner,
		})) ?? [];

	const filteredTeachers = availableTeachers.filter((teacher) =>
		teacher.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
		teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleAddTeacher = async () => {
		if (!selectedTeacherId) {
			toast({
				title: 'Error',
				description: 'Please select a teacher',
				variant: 'destructive',
			});
			return;
		}

		try {
			await addTeacherToClassMutation.mutateAsync({
				classId,
				payload: { email: '' }, // This would be updated based on the selected teacher
			});

			onSuccess();
			onOpenChange(false);
			setSearchQuery('');
			setSelectedTeacherId(null);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add teacher',
				variant: 'destructive',
			});
		}
	};

	const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;

		if (!email.trim()) {
			toast({
				title: 'Error',
				description: 'Please enter a valid email',
				variant: 'destructive',
			});
			return;
		}

		try {
			await addTeacherToClassMutation.mutateAsync({
				classId,
				payload: { email: email.trim() },
			});

			onSuccess();
			onOpenChange(false);
			setSearchQuery('');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add teacher',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-3xl bg-white shadow-xl max-w-md border border-[#E0DCD5]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#333] flex items-center justify-between">
						Add Teacher
						<Button
							variant="ghost"
							size="icon"
							onClick={() => onOpenChange(false)}
							className="h-8 w-8 rounded-full hover:bg-[#F0EDE8]"
						>
							<X className="w-4 h-4" />
						</Button>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Email Input Form */}
					<form onSubmit={handleEmailSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-[#666] mb-2">
								Teacher Email
							</label>
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
								<Input
									name="email"
									type="email"
									placeholder="Enter teacher email..."
									className="pl-10 rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
									disabled={addTeacherToClassMutation.isPending}
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={addTeacherToClassMutation.isPending}
							className="w-full rounded-xl bg-gradient-to-r from-[#C5B4E3] to-[#B19CD9] text-white font-semibold hover:shadow-lg transition-all"
						>
							{addTeacherToClassMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Adding...
								</>
							) : (
								'Add Teacher by Email'
							)}
						</Button>
					</form>
				</div>
			</DialogContent>
		</Dialog >
	);
}
