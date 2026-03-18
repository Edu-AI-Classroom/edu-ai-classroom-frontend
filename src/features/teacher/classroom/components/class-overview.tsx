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
	Trash2,
	TrendingUp,
	Users,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/common/use-toast';
import { queryKeys } from '@/services/api/query-keys';
import { useClassMutations } from '@/hooks/queries/class/use-class-mutation';
import { useClassStudents, useClassTeachers, useClassStudentStats } from '@/hooks/queries/class/use-class-query';
import { useQuizList } from '@/hooks/queries/quiz/use-quiz-query';
import { QuizService } from '@/services/quiz/quiz.service';
import { NewsService } from '@/services/classroom/news.service';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import type { Teacher } from '@/types/class';
import type { ClassroomUiData } from '../classroom.mapper';
import { AddTeacherModal } from './AddTeacherModal';
import { useQueries } from '@tanstack/react-query';

interface ClassOverviewProps {
	classData: ClassroomUiData;
}

export default function ClassOverview({ classData }: ClassOverviewProps) {
	const { data: studentResponse } = useClassStudents(classData.id);
	const { data: teacherResponse } = useClassTeachers(classData.id);
	const { data: studentStats } = useClassStudentStats(classData.id);
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: quizList } = useQuizList({ classId });
	const { addTeacherToClassMutation, removeTeacherFromClassMutation } = useClassMutations();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const { data: newsResponse } = useQuery({
		queryKey: [...queryKeys.news.list(classId), 'overview'] as const,
		queryFn: () => NewsService.getNewsByClass(classId, { page: 1, limit: 10 }),
		enabled: !!classId,
	});

	const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
	const [removeTeacherDialogOpen, setRemoveTeacherDialogOpen] = useState(false);
	const [teacherToRemove, setTeacherToRemove] = useState<{
		teacherId: number;
		teacherName: string;
	} | null>(null);

	const students = studentResponse?.data ?? [];
	const teachers = teacherResponse ?? [];
	const quizzes = Array.isArray(quizList) ? quizList : [];

	const submissionQueries = useQueries({
		queries: quizzes.map((q) => ({
			queryKey: ['teacherQuiz', 'submissions', q.id] as const,
			queryFn: () => QuizService.getSubmissionsOverview(q.id),
			enabled: !!q.id,
		})),
	});

	const totalAttempts = submissionQueries.reduce(
		(sum, q) => sum + (q.data?.totalStudentsAttempted ?? 0),
		0,
	);
	const totalStudentsCount = classData.studentCount ?? (studentResponse as any)?.data?.total ?? (Array.isArray(students) ? students.length : 0);
	const possibleSubmissions = totalStudentsCount > 0 ? totalStudentsCount * quizzes.length : 0;
	const submissionRatePct =
		possibleSubmissions > 0 ? Math.round((totalAttempts / possibleSubmissions) * 100) : 0;

	const avgScorePct = (() => {
		let weightedPctSum = 0;
		let weightedCount = 0;

		submissionQueries.forEach((q, idx) => {
			const attempted = q.data?.totalStudentsAttempted ?? 0;
			const avgScore = q.data?.averageScore ?? 0;
			const totalPoints = (quizzes[idx] as any)?.totalPoints ?? 100;
			if (attempted <= 0 || totalPoints <= 0) return;
			weightedPctSum += (avgScore / totalPoints) * 100 * attempted;
			weightedCount += attempted;
		});

		return weightedCount > 0 ? Math.round(weightedPctSum / weightedCount) : 0;
	})();

	// Check if current user is the class owner
	const isOwner = classData.isOwner || user?.userId === classData.createdBy;

	// Type guard to check if user is a Teacher
	const _isTeacher = (user: any): user is Teacher => {
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
		} catch (_error) {
			toast({
				title: 'Error',
				description: 'Failed to remove teacher',
				variant: 'destructive',
			});
		}
	};

	const stats = {
		totalStudents: totalStudentsCount,
		submissionRate: submissionRatePct,
		needsAttention: (studentStats ?? []).filter((s) => (s.avgGradePct ?? 0) < 4).length,
		avgGrade: avgScorePct,
	};

	const statsByStudentIdForName = new Map(
		(Array.isArray(studentResponse?.data) ? studentResponse.data : []).map((s: any) => [
			s.studentId ?? s.userId,
			s.studentName ?? s.userName,
		]),
	);

	const attentionItems = (Array.isArray(studentStats) ? studentStats : [])
		.filter((s) => (s.avgGradePct ?? 0) < 4)
		.map((s) => ({
			id: `attention-${s.studentId}`,
			type: 'grading' as 'meeting' | 'grading' | 'deadline',
			title: statsByStudentIdForName.get(s.studentId) ?? 'Unknown Student',
			description: `Low average grade: ${Math.round((s.avgGradePct ?? 0) * 10)}%`,
			priority: 'high' as const,
			dueDate: undefined,
		}));

	const recentActivity: Array<{
		id: string;
		studentName: string;
		description: string;
		timestamp: string;
	}> = [];

	const newsData = (newsResponse as any)?.data || (Array.isArray(newsResponse) ? newsResponse : []);
	if (Array.isArray(newsData)) {
		newsData.forEach((post: any) => {
			if (!post) return;
			// Add post to activity
			recentActivity.push({
				id: `post-${post.id}`,
				studentName: post.author || 'Member',
				description: 'posted a new announcement',
				timestamp: new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				}),
			});

			// Add comments to activity
			if (Array.isArray(post.comments)) {
				post.comments.forEach((comment: any) => {
					if (!comment) return;
					recentActivity.push({
						id: `comment-${comment.id}`,
						studentName: comment.author || 'Member',
						description: 'commented on an announcement',
						timestamp: new Date(comment.createdAt || Date.now()).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						}),
					});
				});
			}
		});
	}

	// Sort by date (descending)
	recentActivity.sort((a, b) => (b.id || '').localeCompare(a.id || ''));

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
							<span className="font-semibold text-[#333]">{teacherToRemove?.teacherName}</span> from
							this class.
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

			{/* Marker-style Stats */}
			<div
				className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
				style={{ transform: 'rotate(-0.3deg)' }}
			>
				<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
					<TrendingUp className="w-5 h-5 text-[#A8D5BA]" />
					Class Performance
				</h2>
				<div className="grid sm:grid-cols-2 gap-6 text-center">
					<MarkerStat label="Average Grade" value={stats.avgGrade} color="#F5B041" />
					<MarkerStat label="Submission Rate" value={stats.submissionRate} color="#C5B4E3" />
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
