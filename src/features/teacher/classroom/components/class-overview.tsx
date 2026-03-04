'use client';

import {
	AlertTriangle,
	BarChart3,
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	MessageSquare,
	Plus,
	TrendingUp,
	Trash2,
	Users,
	X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/common/use-toast';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';
import { useClassStudents, useClassTeachers } from '@/hooks/queries/class/use-class-query';
import { useAuthStore } from '@/stores/auth-store';
import type { ClassroomUiData } from '../classroom.mapper';
import type { Teacher } from '@/types/class';
import { AddTeacherModal } from './AddTeacherModal';

interface ClassOverviewProps {
	classData: ClassroomUiData;
}

export default function ClassOverview({ classData }: ClassOverviewProps) {
	const { data: studentResponse } = useClassStudents(classData.id);
	const { data: teacherResponse } = useClassTeachers(classData.id);
	const { addTeacherToClassMutation, removeTeacherFromClassMutation } = useClassMutations();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
	const [removeTeacherDialogOpen, setRemoveTeacherDialogOpen] = useState(false);
	const [teacherToRemove, setTeacherToRemove] = useState<{
		teacherId: number;
		teacherName: string;
	} | null>(null);

	const students = studentResponse?.data ?? [];
	const teachers = teacherResponse ?? [];

	// Check if current user is the class owner
	const isOwner = classData.isOwner || user?.userId === classData.createdBy;

	// Type guard to check if user is a Teacher
	const isTeacher = (user: any): user is Teacher => {
		return user && user.role === 'TEACHER';
	};

	const handleRemoveTeacher = (teacherId: number, teacherName: string) => {
		setTeacherToRemove({ teacherId, teacherName });
		setRemoveTeacherDialogOpen(true);
	};

	const confirmRemoveTeacher = async () => {
		if (!teacherToRemove) return;
		try {
			await removeTeacherFromClassMutation.mutateAsync({
				classId: classData.id,
				teacherId: teacherToRemove.teacherId,
			});
			toast({
				title: 'Success',
				description: 'Teacher removed successfully',
			});
			setRemoveTeacherDialogOpen(false);
			setTeacherToRemove(null);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to remove teacher',
				variant: 'destructive',
			});
		}
	};

	const stats = {
		totalStudents: classData.studentCount ?? students.length,
		submissionRate: 0,
		needsAttention: 0,
		avgGrade: 0,
		avgAttendance: 0,
	};

	const attentionItems: Array<{
		id: string;
		type: 'meeting' | 'grading' | 'deadline';
		title: string;
		description: string;
		dueDate?: string;
		priority: 'high' | 'medium' | 'low';
	}> = [];

	const recentActivity: Array<{
		id: string;
		studentName: string;
		description: string;
		timestamp: string;
	}> = [];

	return (
		<div className="space-y-6">
			<AlertDialog
				open={removeTeacherDialogOpen}
				onOpenChange={(open) => {
					setRemoveTeacherDialogOpen(open);
					if (!open) setTeacherToRemove(null);
				}}
			>
				<AlertDialogContent className="rounded-3xl bg-white shadow-xl max-w-md border border-[#E0DCD5]">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-xl font-bold text-[#333]">
							Remove teacher?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-[#666]">
							This will remove{' '}
							<span className="font-semibold text-[#333]">
								{teacherToRemove?.teacherName}
							</span>{' '}
							from this class.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							className="rounded-xl border-[#E0DCD5] bg-white text-[#333] hover:bg-[#F0EDE8]"
							disabled={removeTeacherFromClassMutation.isPending}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								confirmRemoveTeacher();
							}}
							className="rounded-xl bg-[#E57373] text-white hover:bg-[#C62828]"
							disabled={removeTeacherFromClassMutation.isPending}
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">{classData.name}</h1>
					<p className="font-serif text-lg text-[#666]">
						{classData.subject} - {classData.grade}
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
				<StatCard
					icon={Users}
					label="Total Students"
					value={stats.totalStudents}
					color="#A8D5BA"
					rotation={-0.5}
				/>
				<StatCard
					icon={Users}
					label="Teachers"
					value={teachers.length}
					color="#C5B4E3"
					rotation={0.3}
				/>
				<StatCard
					icon={CheckCircle2}
					label="Submission Rate"
					value={`${stats.submissionRate}%`}
					color="#F5B041"
					rotation={0.5}
				/>
				<StatCard
					icon={AlertTriangle}
					label="Need Attention"
					value={stats.needsAttention}
					color="#E57373"
					rotation={-0.3}
				/>
				<StatCard
					icon={BarChart3}
					label="Average Grade"
					value={`${stats.avgGrade}%`}
					color="#C5B4E3"
					rotation={0.8}
				/>
			</div>

			{/* Teachers Section */}
			<div
				className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
				style={{ transform: 'rotate(-0.1deg)' }}
			>
				<div className="flex items-center justify-between mb-4">
					<h2 className="font-sans font-bold text-lg text-[#333] flex items-center gap-2">
						<Users className="w-5 h-5 text-[#C5B4E3]" />
						Teachers ({teachers.length})
					</h2>
					{isOwner && (
						<Button
							onClick={() => setIsAddTeacherModalOpen(true)}
							size="sm"
							className="rounded-xl bg-[#C5B4E3] text-white border-0 shadow-sm hover:shadow-md transition-all"
							disabled={addTeacherToClassMutation.isPending}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Teacher
						</Button>
					)}
				</div>

				{teachers.length > 0 ? (
					<div className="space-y-3">
						{teachers.map((teacher) => {
							const teacherIsOwner = teacher.isOwner;
							const teacherUserId = teacher.teacherId;
							const teacherUserName = teacher.teacherName;
							const teacherEmail = teacher.email;

							return (
								<div
									key={teacherUserId}
									className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-[#E0DCD5]"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white text-sm font-semibold shrink-0">
											{teacherUserName?.split(' ').map((n: string) => n[0]).join('') || 'T'}
										</div>
										<div>
											<p className="font-semibold text-sm text-[#333]">
												{teacherUserName}
												{teacherIsOwner && (
													<span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-[#C5B4E3]/20 text-[#C5B4E3]">
														Owner
													</span>
												)}
											</p>
											<p className="text-xs text-[#666]">{teacherEmail}</p>
										</div>
									</div>
									{isOwner && !teacherIsOwner && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveTeacher(teacherUserId, teacherUserName)}
											disabled={removeTeacherFromClassMutation.isPending}
											className="text-[#E57373] hover:text-[#C62828] hover:bg-[#E57373]/10 rounded-xl"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-center py-8 text-[#666]">
						<Users className="w-10 h-10 mx-auto mb-2 text-[#C5B4E3]" />
						<p className="font-serif">No teachers assigned yet.</p>
						{isOwner && (
							<p className="text-sm text-[#999] mt-1">
								Click "Add Teacher" to invite teachers to this class.
							</p>
						)}
					</div>
				)}
			</div>

			{/* Marker-style Stats */}
			<div
				className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
				style={{ transform: 'rotate(-0.3deg)' }}
			>
				<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
					<TrendingUp className="w-5 h-5 text-[#A8D5BA]" />
					Class Performance
				</h2>
				<div className="grid sm:grid-cols-3 gap-6">
					<MarkerStat label="Attendance" value={stats.avgAttendance} color="#A8D5BA" />
					<MarkerStat label="Average Grade" value={stats.avgGrade} color="#F5B041" />
					<MarkerStat label="Engagement" value={85} color="#C5B4E3" />
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Attention Needed Widget */}
				<div
					className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
					style={{ transform: 'rotate(0.3deg)' }}
				>
					<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
						<div className="w-6 h-6 rounded bg-[#E57373]/20 flex items-center justify-center">
							<AlertTriangle className="w-4 h-4 text-[#E57373]" />
						</div>
						Attention Needed
					</h2>

					{attentionItems.length > 0 ? (
						<div className="space-y-3">
							{attentionItems.map((item) => (
								<div
									key={item.id}
									className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E0DCD5]"
								>
									<div
										className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'meeting'
											? 'bg-[#C5B4E3]/20'
											: item.type === 'grading'
												? 'bg-[#F5B041]/20'
												: 'bg-[#E57373]/20'
											}`}
									>
										{item.type === 'meeting' && <Calendar className="w-4 h-4 text-[#C5B4E3]" />}
										{item.type === 'grading' && <FileText className="w-4 h-4 text-[#F5B041]" />}
										{item.type === 'deadline' && <Clock className="w-4 h-4 text-[#E57373]" />}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm text-[#333]">{item.title}</p>
										<p className="text-xs text-[#666] mt-0.5">{item.description}</p>
										{item.dueDate && (
											<p className="text-xs text-[#999] mt-1">Due: {item.dueDate}</p>
										)}
									</div>
									<span
										className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.priority === 'high'
											? 'bg-[#E57373]/20 text-[#C62828]'
											: item.priority === 'medium'
												? 'bg-[#F5B041]/20 text-[#B8860B]'
												: 'bg-[#A8D5BA]/20 text-[#2E7D32]'
											}`}
									>
										{item.priority}
									</span>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-[#666]">
							<CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[#A8D5BA]" />
							<p className="font-serif">All caught up! No pending items.</p>
						</div>
					)}
				</div>

				{/* Recent Activity */}
				<div
					className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
					style={{ transform: 'rotate(-0.2deg)' }}
				>
					<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
						<div className="w-6 h-6 rounded bg-[#A8D4E6]/20 flex items-center justify-center">
							<MessageSquare className="w-4 h-4 text-[#A8D4E6]" />
						</div>
						Recent Activity
					</h2>

					{recentActivity.length > 0 ? (
						<div className="space-y-3">
							{recentActivity.map((activity) => (
								<div
									key={activity.id}
									className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E0DCD5]"
								>
									<div className="w-8 h-8 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white text-xs font-semibold shrink-0">
										{activity.studentName
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-[#333]">
											<span className="font-semibold">{activity.studentName}</span>{' '}
											<span className="text-[#666]">{activity.description}</span>
										</p>
										<p className="text-xs text-[#999] mt-0.5">{activity.timestamp}</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-[#666]">
							<MessageSquare className="w-10 h-10 mx-auto mb-2 text-[#A8D4E6]" />
							<p className="font-serif">No recent activity.</p>
						</div>
					)}
				</div>
			</div>

			{/* Add Teacher Modal */}
			<AddTeacherModal
				open={isAddTeacherModalOpen}
				onOpenChange={setIsAddTeacherModalOpen}
				classId={classData.id}
				onSuccess={() => {
					toast({
						title: 'Success',
						description: 'Teacher added successfully',
					});
				}}
			/>
		</div>
	);
}

function StatCard({
	icon: Icon,
	label,
	value,
	color,
	rotation,
}: {
	icon: React.ElementType;
	label: string;
	value: string | number;
	color: string;
	rotation: number;
}) {
	return (
		<div
			className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5]"
			style={{ transform: `rotate(${rotation}deg)` }}
		>
			<div className="flex items-center gap-3">
				<div
					className="w-12 h-12 rounded-xl flex items-center justify-center"
					style={{ backgroundColor: `${color}30` }}
				>
					<Icon className="w-6 h-6" style={{ color }} />
				</div>
				<div>
					<p className="font-sans font-bold text-2xl text-[#333]">{value}</p>
					<p className="text-sm text-[#666]">{label}</p>
				</div>
			</div>
		</div>
	);
}

function MarkerStat({ label, value, color }: { label: string; value: number; color: string }) {
	return (
		<div className="text-center">
			<p className="text-sm text-[#666] mb-2">{label}</p>
			<div className="relative h-3 bg-[#F0EDE8] rounded-full overflow-hidden">
				<div
					className="absolute inset-y-0 left-0 rounded-full"
					style={{ width: `${value}%`, backgroundColor: color }}
				/>
			</div>
			<p className="font-sans font-bold text-lg text-[#333] mt-2">{value}%</p>
		</div>
	);
}
