import { AlertTriangle, CheckCircle, ClipboardList, Clock, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ClassroomUiData } from '@/features/teacher/classroom/classroom.mapper';
import {
	useStartStudentQuizAttempt,
	useStudentQuizDetail,
	useStudentQuizList,
	useStudentQuizQuestions,
	useSubmitStudentQuizAttempt,
} from '@/hooks/queries/quiz/use-student-quiz-query';
import type { StudentQuizQuestion } from '@/types/student-quiz';

type UiStatus = 'pending' | 'submitted' | 'graded' | 'late';

const statusConfig: Record<UiStatus, { label: string; icon: React.ElementType; className: string }> = {
	pending: { label: 'Not Submitted', icon: AlertTriangle, className: 'bg-warning/15 text-warning' },
	submitted: { label: 'Submitted', icon: Clock, className: 'bg-primary/15 text-primary' },
	graded: { label: 'Graded', icon: CheckCircle, className: 'bg-success/15 text-success' },
	late: { label: 'Late Submission', icon: AlertTriangle, className: 'bg-destructive/15 text-destructive' },
};

function mapAttemptStatus(status?: string | null, score?: number | null): UiStatus {
	if (String(status ?? '').toUpperCase().includes('LATE')) return 'late';
	if (score != null) return 'graded';
	if (!status) return 'pending';
	if (String(status).toUpperCase().includes('SUBMITTED')) return 'submitted';
	return 'pending';
}

type CourseAssignmentsProps = {
	classData: ClassroomUiData;
};

type StudentAnswer = { index: number } | { text: string };

const CourseAssignments = ({ classData }: CourseAssignmentsProps) => {
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: quizzes, isLoading, error } = useStudentQuizList({ classId });

	const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
	const [attemptId, setAttemptId] = useState<number | null>(null);
	const [attemptStartedAt, setAttemptStartedAt] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, StudentAnswer | undefined>>({});
	const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

	const { data: questions, isLoading: isQuestionsLoading } = useStudentQuizQuestions(
		attemptId != null ? (activeQuizId ?? undefined) : undefined,
	);
	const { data: quizDetail } = useStudentQuizDetail(activeQuizId ?? undefined);
	const startAttempt = useStartStudentQuizAttempt();
	const submitAttempt = useSubmitStudentQuizAttempt();

	const activeQuiz = useMemo(
		() => (Array.isArray(quizzes) ? quizzes.find((q) => q.id === activeQuizId) : undefined),
		[activeQuizId, quizzes],
	);

	const handleOpenQuiz = async (quizId: string) => {
		setActiveQuizId(quizId);
		setAttemptId(null);
		setAttemptStartedAt(null);
		setAnswers({});
		setRemainingSeconds(null);
	};

	const handleStart = async () => {
		if (!activeQuizId) return;
		const started = await startAttempt.mutateAsync(activeQuizId);
		setAttemptId(started.attemptId);
		setAttemptStartedAt(started.startedAt);
	};

	const handleSubmit = async () => {
		if (!activeQuizId || attemptId == null) return;
		const payload = {
			answers: Object.entries(answers).map(([blockId, answer]) => ({ blockId, answer })),
		};
		await submitAttempt.mutateAsync({ quizId: activeQuizId, attemptId, payload });
		// keep the attempt screen, but mark submitted by resetting attemptId
		setAttemptId(null);
		setAttemptStartedAt(null);
		setRemainingSeconds(null);
	};

	useEffect(() => {
		if (!attemptId || !attemptStartedAt) return;
		const limitMinutes = quizDetail?.timeLimitMinutes ?? null;
		if (!limitMinutes || limitMinutes <= 0) {
			setRemainingSeconds(null);
			return;
		}

		const tick = () => {
			const startedAtMs = new Date(attemptStartedAt).getTime();
			const limitMs = limitMinutes * 60 * 1000;
			const nowMs = Date.now();
			const remainingMs = Math.max(0, startedAtMs + limitMs - nowMs);
			setRemainingSeconds(Math.ceil(remainingMs / 1000));
		};

		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, [attemptId, attemptStartedAt, quizDetail?.timeLimitMinutes]);

	useEffect(() => {
		if (remainingSeconds == null) return;
		if (remainingSeconds > 0) return;
		// Auto-submit when timer hits 0
		if (attemptId != null && !submitAttempt.isPending) {
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [remainingSeconds]);

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
		const timerEnabled = remainingSeconds != null;
		const mm = timerEnabled ? Math.floor(remainingSeconds / 60) : 0;
		const ss = timerEnabled ? remainingSeconds % 60 : 0;

		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold text-foreground">{activeQuiz.title}</h2>
						<p className="text-xs text-muted-foreground">{activeQuiz.description ?? ''}</p>
						{quizDetail?.documentType === 'EXAM' && (
							<p className="text-xs text-warning mt-1">EXAM: you can attempt only once.</p>
						)}
					</div>
					<Button variant="outline" className="rounded-xl" onClick={() => setActiveQuizId(null)}>
						Back
					</Button>
				</div>

				{attemptId == null ? (
					<div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							Start an attempt to answer and submit.
						</div>
						<Button className="rounded-xl" onClick={handleStart} disabled={startAttempt.isPending}>
							{startAttempt.isPending ? 'Starting...' : 'Start quiz'}
						</Button>
					</div>
				) : (
					<div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground flex items-center gap-3">
							<span>Attempt #{attemptId}</span>
							{timerEnabled && (
								<span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-xs font-semibold">
									Time left: {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
								</span>
							)}
						</div>
						<Button
							className="rounded-xl"
							onClick={handleSubmit}
							disabled={submitAttempt.isPending}
						>
							{submitAttempt.isPending ? 'Submitting...' : 'Submit'}
						</Button>
					</div>
				)}

				{attemptId == null ? (
					<div className="bg-card rounded-xl border border-border p-4 text-sm text-muted-foreground">
						Questions will be shown after you press <span className="font-semibold">Start quiz</span>.
					</div>
				) : isQuestionsLoading ? (
					<div className="flex items-center py-10 text-muted-foreground">
						<Loader2 className="w-5 h-5 animate-spin mr-2" />
						Loading questions...
					</div>
				) : (
					<div className="space-y-3">
						{(questions ?? []).map((q: StudentQuizQuestion, idx: number) => (
							<div key={q.id} className="bg-card rounded-xl border border-border p-4">
								<p className="text-sm font-semibold text-foreground">
									{idx + 1}. {q.questionText}
								</p>

								{q.type === 'MCQ' ? (
									<div className="mt-3 space-y-2">
										{q.options.map((opt, i) => {
											const a = answers[q.id];
											const checked = !!a && 'index' in a && a.index === i;
											return (
												<button
													type="button"
													key={String(i)}
													className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${checked
														? 'border-primary bg-primary/10 text-foreground'
														: 'border-border hover:bg-secondary'
														}`}
													onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: { index: i } }))}
												>
													<span className="text-sm">{opt}</span>
												</button>
											);
										})}
									</div>
								) : (
									<div className="mt-3">
										<Textarea
											value={(() => {
												const a = answers[q.id];
												return a && 'text' in a ? a.text : '';
											})()}
											onChange={(e) =>
												setAnswers((prev) => ({ ...prev, [q.id]: { text: e.target.value } }))
											}
											placeholder="Type your answer..."
											className="rounded-xl"
										/>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	const list = Array.isArray(quizzes) ? quizzes : [];

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-bold text-foreground">Quizzes</h2>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<ClipboardList className="w-4 h-4" />
					<span>{list.length} quizzes</span>
				</div>
			</div>

			<div className="space-y-3">
				{list.map((q) => {
					const uiStatus = mapAttemptStatus(q.lastAttempt?.status, q.lastAttempt?.totalScore ?? null);
					const config = statusConfig[uiStatus];
					const StatusIcon = config.icon;
					return (
						<button
							type="button"
							key={q.id}
							onClick={() => handleOpenQuiz(q.id)}
							className="w-full bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow text-left"
						>
							<div className="flex items-center gap-3">
								<div
									className={`w-8 h-8 rounded-lg ${config.className.split(' ')[0]} flex items-center justify-center`}
								>
									<StatusIcon className={`w-4 h-4 ${config.className.split(' ')[1]}`} />
								</div>
								<div>
									<p className="font-semibold text-foreground text-sm">{q.title}</p>
									<p className="text-xs text-muted-foreground">
										{q.documentType} • {new Date(q.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<span className={`text-xs px-2.5 py-1 rounded-full ${config.className}`}>
									{config.label}
								</span>
								{q.lastAttempt?.totalScore != null && (
									<span className="text-sm font-bold text-success">{q.lastAttempt.totalScore}</span>
								)}
							</div>
						</button>
					);
				})}

				{list.length === 0 && (
					<div className="text-sm text-muted-foreground italic">No quizzes assigned yet.</div>
				)}
			</div>
		</div>
	);
};

export default CourseAssignments;
