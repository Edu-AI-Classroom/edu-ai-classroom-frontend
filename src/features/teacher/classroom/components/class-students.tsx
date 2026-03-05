'use client';

import { AlertTriangle, Loader2, Mail, MoreHorizontal, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/common/use-toast';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';
import { useClassStudents } from '@/hooks/queries/class/use-class-query';
import type { AddStudentPayload } from '@/types/class';
import type { ClassroomUiData } from '../classroom.mapper';
import { AddStudentDialog } from './add-student-dialog';
import { StudentProfileModal } from './student-profile-modal';

interface ClassStudentsProps {
	classData: ClassroomUiData;
}

type UiStudentStatus = 'all' | 'excellent' | 'on-track' | 'needs-attention';

type UiStudent = {
	id: number;
	name: string;
	email: string;
	attendance?: number;
	averageGrade?: number;
	submissionRate?: number;
	status?: Exclude<UiStudentStatus, 'all'>;
};

export default function ClassStudents({ classData }: ClassStudentsProps) {
	const classId = typeof classData.id === 'string' ? parseInt(classData.id, 10) : classData.id;
	const { data: studentsResponse, isLoading } = useClassStudents(classId);
	const { addStudentToClassMutation } = useClassMutations();
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<UiStudentStatus>('all');
	const [removingStudentId, setRemovingStudentId] = useState<number | null>(null);
	const [isAddingStudent, setIsAddingStudent] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<any>(null);
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const students = (studentsResponse?.data ?? [])
		.filter((user: any) => user.role === 'STUDENT')
		.map((student: any) => ({
			id: student.studentId ?? student.userId ?? 0,
			name: student.studentName ?? student.user_name ?? student.userName ?? 'Unknown',
			email: student.email ?? '',
			attendance: 0,
			averageGrade: 0,
			submissionRate: 0,
			status: 'on-track' as const,
		}));

	const filteredStudents = students.filter((student) => {
		const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const statusCounts = {
		all: students.length,
		excellent: 0,
		'on-track': students.length,
		'needs-attention': 0,
	};

	const handleAddStudent = async (payload: AddStudentPayload) => {
		setIsAddingStudent(true);
		try {
			await addStudentToClassMutation.mutateAsync({
				classId,
				payload,
			});

			toast({
				title: 'Success',
				description: 'Student added to class successfully',
			});
		} catch (error) {
			console.error('Add student error:', error);
			toast({
				title: 'Error',
				description: 'Failed to add student. Make sure the student exists in the system.',
				variant: 'destructive',
			});
		} finally {
			setIsAddingStudent(false);
		}
	};

	const handleRemoveStudent = async (studentId: number, studentName: string) => {
		if (!confirm(`Remove ${studentName} from this class?`)) return;

		setRemovingStudentId(studentId);
		try {
			// TODO: Implement remove student API call using ClassService
			toast({
				title: 'Success',
				description: `${studentName} removed from class`,
			});
		} catch (error) {
			console.error('Remove student error:', error);
			toast({
				title: 'Error',
				description: 'Failed to remove student',
				variant: 'destructive',
			});
		} finally {
			setRemovingStudentId(null);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin text-[#F5B041] mx-auto mb-3" />
					<p className="text-gray-600">Loading students...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">Students</h1>
					<p className="font-serif text-lg text-[#666]">{students.length} students enrolled</p>
				</div>
				<AddStudentDialog onSubmit={handleAddStudent} isLoading={isAddingStudent} />
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
					<Input
						placeholder="Search students..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					{(['all', 'excellent', 'on-track', 'needs-attention'] as const).map((status) => (
						<button
							type="button"
							key={status}
							onClick={() => setFilterStatus(status)}
							className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
								filterStatus === status
									? status === 'excellent'
										? 'bg-[#A8D5BA] text-[#333]'
										: status === 'on-track'
											? 'bg-[#A8D4E6] text-[#333]'
											: status === 'needs-attention'
												? 'bg-[#E57373] text-white'
												: 'bg-[#F5B041] text-[#333]'
									: 'bg-white text-[#666] border border-[#E0DCD5] hover:bg-[#F0EDE8]'
							}`}
						>
							{status === 'all'
								? 'All'
								: status === 'excellent'
									? 'Excellent'
									: status === 'on-track'
										? 'On Track'
										: 'Needs Attention'}
							<span className="ml-1.5 text-xs opacity-80">({statusCounts[status]})</span>
						</button>
					))}
				</div>
			</div>

			{/* Student Grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredStudents.map((student, index) => (
					<div
						key={student.id}
						className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5] hover:shadow-md transition-shadow"
						style={{ transform: `rotate(${((index % 3) - 1) * 0.3}deg)` }}
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
									{student.name
										.split(' ')
										.map((n: string) => n[0])
										.join('')
										.toUpperCase()}
								</div>
								<div>
									<h3 className="font-sans font-semibold text-[#333]">{student.name}</h3>
									<p className="text-xs text-[#666]">{student.email}</p>
								</div>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreHorizontal className="w-4 h-4 text-[#666]" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="rounded-xl">
									<DropdownMenuItem
										onClick={() => {
											setSelectedStudent(student);
											setIsProfileOpen(true);
										}}
									>
										<User className="w-4 h-4 mr-2" />
										View Profile
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Mail className="w-4 h-4 mr-2" />
										Send Message
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleRemoveStudent(student.id, student.name)}
										disabled={removingStudentId === student.id}
										className="text-red-600"
									>
										{removingStudentId === student.id ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Removing...
											</>
										) : (
											<>
												<AlertTriangle className="w-4 h-4 mr-2" />
												Remove from Class
											</>
										)}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-2 text-center">
							<div className="p-2 rounded-xl bg-[#FAF9F6]">
								<p className="font-sans font-bold text-lg text-[#333]">{student.attendance}%</p>
								<p className="text-xs text-[#666]">Attendance</p>
							</div>
							<div className="p-2 rounded-xl bg-[#FAF9F6]">
								<p className="font-sans font-bold text-lg text-[#333]">{student.averageGrade}%</p>
								<p className="text-xs text-[#666]">Avg Grade</p>
							</div>
							<div className="p-2 rounded-xl bg-[#FAF9F6]">
								<p className="font-sans font-bold text-lg text-[#333]">{student.submissionRate}%</p>
								<p className="text-xs text-[#666]">Submitted</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredStudents.length === 0 && (
				<div className="text-center py-16">
					<Search className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No students found.</p>
					<p className="text-sm text-[#999]">Try adjusting your search or filters.</p>
				</div>
			)}

			{selectedStudent && (
				<StudentProfileModal
					open={isProfileOpen}
					onOpenChange={setIsProfileOpen}
					classId={classId}
					student={{
						id: String(selectedStudent.id),
						userId: String(selectedStudent.userId ?? selectedStudent.id),
						name: selectedStudent.name,
						email: selectedStudent.email,
						status: selectedStudent.status,
					}}
				/>
			)}
		</div>
	);
}
