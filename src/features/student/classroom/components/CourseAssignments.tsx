import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	CalendarDays,
	CheckCircle,
	Clock,
	FileText,
	Loader2,
	Play,
	Send,
	Star,
	Trophy,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { ClassroomUiData } from '@/features/teacher/classroom/classroom.mapper';
import {
	useStudentQuizDetail,
	useStudentQuizList,
} from '@/hooks/queries/quiz/use-student-quiz-query';
import type { StudentQuizAttemptSummary } from '@/types/student-quiz';

type UiStatus = 'pending' | 'submitted' | 'graded' | 'late';
type ListTab = 'todo' | 'in-progress' | 'graded';

const statusConfig: Record<
	UiStatus,
	{ label: string; icon: React.ElementType; className: string }
> = {
	pending: {
		label: 'Not Submitted',
		icon: AlertTriangle,
		className: 'bg-warning/15 text-warning',
	},
	submitted: {
		label: 'Submitted',
		icon: Clock,
		className: 'bg-primary/15 text-primary',
	},
	graded: {
		label: 'Graded',
		icon: CheckCircle,
		className: 'bg-success/15 text-success',
	},
	late: {
		label: 'Late Submission',
		icon: AlertTriangle,
		className: 'bg-destructive/15 text-destructive',
	},
};

function mapAttemptStatus(status?: string | null, score?: number | null): UiStatus {
	if (
		String(status ?? '')
			.toUpperCase()
			.includes('LATE')
	)
		return 'late';
	if (score != null) return 'graded';
	if (!status) return 'pending';
	if (String(status).toUpperCase().includes('SUBMITTED')) return 'submitted';
	return 'pending';
}

function formatDateSafe(date?: string | null) {
	if (!date) return 'No deadline';
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return 'No deadline';
	return parsed.toLocaleDateString();
}

function formatDateTimeSafe(date?: string | null) {
	if (!date) return '-';
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return '-';
	return parsed.toLocaleString();
}

function mapQuizToTab(status?: string | null, score?: number | null): ListTab {
	const normalized = String(status ?? '').toUpperCase();
	if (score != null || normalized.includes('GRADED')) return 'graded';
	if (normalized.includes('SUBMITTED')) return 'in-progress';
	return 'todo';
}

function sortAttemptsDesc(a: StudentQuizAttemptSummary, b: StudentQuizAttemptSummary) {
	const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
	const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
	if (aTime !== bTime) return bTime - aTime;
	return (b.attemptId ?? 0) - (a.attemptId ?? 0);
}

type CourseAssignmentsProps = {
	classData: ClassroomUiData;
};

const CourseAssignments = ({ classData }: CourseAssignmentsProps) => {
	const router = useRouter();
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: quizzes, isLoading, error } = useStudentQuizList({ classId });

	const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<ListTab>('todo');

	const handleOpenQuiz = (quizId?: string | number | null) => {
		if (quizId == null) return;
		const normalizedQuizId = String(quizId).trim();
		if (!normalizedQuizId) return;
		setActiveQuizId(normalizedQuizId);
	};

	const activeQuiz = useMemo(
		() =>
			Array.isArray(quizzes)
				? quizzes.find((q) => String(q.id) === String(activeQuizId))
				: undefined,
		[activeQuizId, quizzes],
	);

	const list = Array.isArray(quizzes) ? quizzes : [];
	const tabCounts = useMemo(
		() => ({
			todo: list.filter(
				(q) => mapQuizToTab(q.lastAttempt?.status, q.lastAttempt?.totalScore ?? null) === 'todo',
			).length,
			'in-progress': list.filter(
				(q) =>
					mapQuizToTab(q.lastAttempt?.status, q.lastAttempt?.totalScore ?? null) === 'in-progress',
			).length,
			graded: list.filter(
				(q) => mapQuizToTab(q.lastAttempt?.status, q.lastAttempt?.totalScore ?? null) === 'graded',
			).length,
		}),
		[list],
	);

	const filteredList = useMemo(
		() =>
			list.filter(
				(q) => mapQuizToTab(q.lastAttempt?.status, q.lastAttempt?.totalScore ?? null) === activeTab,
			),
		[activeTab, list],
	);

	const tabItems: Array<{
		id: ListTab;
		label: string;
		icon: React.ElementType;
		count: number;
	}> = [
		{ id: 'todo', label: 'To-Do', icon: Clock, count: tabCounts.todo },
		{
			id: 'in-progress',
			label: 'In Progress',
			icon: Send,
			count: tabCounts['in-progress'],
		},
		{
			id: 'graded',
			label: 'Graded',
			icon: CheckCircle,
			count: tabCounts.graded,
		},
	];

	const { data: quizDetail } = useStudentQuizDetail(activeQuiz?.id);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12 text-muted-foreground">
				<Loader2 className="w-5 h-5 animate-spin mr-2" />
				Loading quizzes...
			</div>
		);
	}

	if (error) {
		return <div className="text-sm text-destructive">Failed to load quizzes.</div>;
	}

	if (activeQuizId && activeQuiz) {
		const detailAttempts = quizDetail?.attempts ?? quizDetail?.attemptHistory ?? null;

		const attempts =
			Array.isArray(detailAttempts) && detailAttempts.length > 0
				? [...detailAttempts].sort(sortAttemptsDesc)
				: activeQuiz.lastAttempt
					? [activeQuiz.lastAttempt]
					: [];

		const isExam = quizDetail?.documentType === 'EXAM';
		const hasSubmittedExam =
			isExam && attempts.some((a) => String(a.status).toUpperCase().includes('SUBMITTED'));
		const canStart = !hasSubmittedExam;
		const lastScore = attempts.length > 0 ? attempts[0].totalScore : null;
		const currentTotalPoints = quizDetail?.totalPoints ?? '-';

		return (
			<div className="space-y-8">
				<div className="mb-6 flex items-center justify-between">
					<Button variant="outline" className="rounded-xl" onClick={() => setActiveQuizId(null)}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>

				<div className="flex justify-between">
					<div className="relative mb-8">
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive/30 rounded-full" />
						<div className="pl-6">
							<div className="mb-2 flex flex-wrap items-center gap-3">
								<Badge
									variant="outline"
									className={`px-3 py-1 text-sm ${
										isExam
											? 'border-[#ba68c8]/40 bg-[#ba68c8]/15 text-[#7b1fa2]'
											: 'border-[#64b5f6]/40 bg-[#64b5f6]/15 text-[#1565c0]'
									}`}
								>
									{isExam ? 'Exam' : 'Assignment'}
								</Badge>
								<Badge
									variant="outline"
									className={`px-3 py-1 text-sm ${
										lastScore != null
											? 'border-[#a8d5ba] bg-[#a8d5ba]/20 text-[#1f6f5f]'
											: 'border-[#e57373]/40 bg-[#e57373]/15 text-[#b23a48]'
									}`}
								>
									{lastScore != null ? 'Submitted' : 'Not Submitted'}
								</Badge>
							</div>
							<h2 className="text-3xl font-bold text-foreground">{activeQuiz.title}</h2>
							{activeQuiz.description && (
								<p className="mt-2 max-w-2xl text-muted-foreground">{activeQuiz.description}</p>
							)}
						</div>
					</div>

					<div className="flex justify-center">
						<Button
							size="default"
							disabled={!canStart}
							onClick={() =>
								router.push(
									`/student/classroom/assessment?quizId=${activeQuiz.id}&classId=${classId}`,
								)
							}
							className="h-12 gap-2 rounded-2xl px-10 text-md font-bold"
						>
							<Play className="h-5 w-5" />
							{hasSubmittedExam
								? 'Exam Submitted'
								: isExam
									? 'Start exam'
									: attempts.length > 0
										? 'Retake assignment'
										: 'Start assignment'}
						</Button>
					</div>
				</div>

				<div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
					{[
						{
							label: 'Time Limit',
							value:
								quizDetail?.timeLimitMinutes && quizDetail.timeLimitMinutes > 0
									? `${quizDetail.timeLimitMinutes} min`
									: 'No limit',
							icon: Clock,
							chipClass: 'bg-[#a8d4e6]/25 text-[#1f4f6f]',
						},
						{
							label: 'Total Points',
							value: currentTotalPoints,
							icon: Star,
							chipClass: 'bg-[#f5b041]/25 text-[#8a5a00]',
						},
						{
							label: 'Best Score',
							value: lastScore != null ? `${lastScore}/${currentTotalPoints}` : '-',
							icon: Trophy,
							chipClass: 'bg-[#a8d5ba]/25 text-[#1f6f5f]',
						},
						{
							label: 'Due Date',
							value: formatDateSafe(quizDetail?.dueDate ?? activeQuiz.dueDate),
							icon: CalendarDays,
							chipClass: 'bg-[#e8b4b8]/25 text-[#7a3b46]',
						},
					].map((stat) => (
						<div key={stat.label}>
							<Card>
								<CardContent className="flex flex-col items-center gap-2 text-center">
									<div
										className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.chipClass}`}
									>
										<stat.icon className="h-5 w-5" />
									</div>
									<p className="text-lg font-bold text-foreground">{stat.value}</p>
									<p className="text-xs text-muted-foreground">{stat.label}</p>
								</CardContent>
							</Card>
						</div>
					))}
				</div>

				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<FileText className="h-5 w-5 text-primary" />
							Attempt History
						</CardTitle>
					</CardHeader>
					<CardContent>
						{attempts.length === 0 ? (
							<div className="py-8 text-center text-muted-foreground">
								No attempts yet. Start when you are ready.
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Attempt</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Score</TableHead>
										<TableHead>Submitted</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{attempts.map((attempt) => (
										<TableRow key={attempt.attemptId}>
											<TableCell className="font-medium">#{attempt.attemptId}</TableCell>
											<TableCell>
												<Badge variant="outline">
													{String(attempt.status ?? '')
														.toUpperCase()
														.includes('SUBMITTED') ? (
														<span className="inline-flex items-center gap-1">
															<CheckCircle className="h-3 w-3" /> Submitted
														</span>
													) : (
														(attempt.status ?? '-')
													)}
												</Badge>
											</TableCell>
											<TableCell className="font-bold">
												{attempt.totalScore != null
													? `${attempt.totalScore}/${currentTotalPoints}`
													: '-'}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{formatDateTimeSafe(attempt.submittedAt)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-4 flex flex-wrap gap-2">
				{tabItems.map((tab) => {
					const Icon = tab.icon;
					const isActive = tab.id === activeTab;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all ${
								isActive
									? 'border-primary/30 bg-primary text-primary-foreground'
									: 'border-border bg-muted/60 text-muted-foreground hover:bg-muted'
							}`}
						>
							<Icon className="h-4 w-4" />
							<span>{tab.label}</span>
							<Badge
								variant="secondary"
								className={`h-5 rounded-full px-1.5 text-xs ${
									isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''
								}`}
							>
								{tab.count}
							</Badge>
						</button>
					);
				})}
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{filteredList.map((q) => {
					const uiStatus = mapAttemptStatus(
						q.lastAttempt?.status,
						q.lastAttempt?.totalScore ?? null,
					);
					const config = statusConfig[uiStatus];
					const isGraded = uiStatus === 'graded';
					const isInProgress = uiStatus === 'submitted';
					const isTodo = uiStatus === 'pending' || uiStatus === 'late';

					const chipClass = isGraded
						? 'bg-emerald-100 text-emerald-800'
						: isInProgress
							? 'bg-sky-100 text-sky-800'
							: 'bg-amber-100 text-amber-900';

					const chipLabel = isGraded ? 'Graded' : isInProgress ? 'Submitted' : 'New';

					const ctaLabel = isGraded
						? 'View Result'
						: isInProgress
							? 'View Submission'
							: 'Open Assignment';

					return (
						<Card
							key={q.id}
							className="overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
						>
							<CardContent className="p-5">
								<div className="flex items-start justify-between gap-3">
									<h3 className="line-clamp-2 text-xl font-bold text-foreground">{q.title}</h3>
									<span
										className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${chipClass}`}
									>
										{chipLabel}
									</span>
								</div>

								<div className="flex flex-wrap items-center gap-2 mb-5 text-sm text-muted-foreground">
									<span>{q.documentType}</span>
									<span className="text-muted-foreground/50">•</span>
									<span>Due {formatDateSafe(q.dueDate)}</span>
									{q.lastAttempt?.totalScore != null && (
										<>
											<span className="text-muted-foreground/50">•</span>
											<span className="font-semibold text-foreground">
												{q.lastAttempt.totalScore} pts
											</span>
										</>
									)}
								</div>

								<button
									type="button"
									onClick={() => handleOpenQuiz(q.id)}
									className="inline-flex h-10 w-full items-center justify-center gap-2 mb-3 rounded-full bg-[#f1c643] px-5 text-lmd font-semibold text-[#1f1f1f] transition hover:brightness-95"
								>
									<Play className="h-4 w-4" />
									{ctaLabel}
								</button>

								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span className={`rounded-full px-2.5 py-1 ${config.className}`}>
										{config.label}
									</span>
									<span>Created at {formatDateSafe(q.createdAt)}</span>
								</div>
							</CardContent>
						</Card>
					);
				})}

				{filteredList.length === 0 && (
					<Card className="border-border/80 md:col-span-2">
						<CardContent className="flex flex-col items-center gap-3 py-10 text-center">
							<AlertCircle className="h-10 w-10 text-muted-foreground" />
							<p className="text-sm text-muted-foreground">
								{activeTab === 'todo'
									? 'No pending quizzes right now.'
									: activeTab === 'in-progress'
										? 'No submitted quizzes waiting for grading.'
										: 'No graded quizzes yet.'}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default CourseAssignments;
