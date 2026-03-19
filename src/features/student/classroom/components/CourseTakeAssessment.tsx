'use client';

import { AlertTriangle, CheckCircle, ChevronUp, Clock, Loader2, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
	useStartStudentQuizAttempt,
	useStudentQuizDetail,
	useStudentQuizList,
	useStudentQuizQuestions,
	useSubmitStudentQuizAttempt,
} from '@/hooks/queries/quiz/use-student-quiz-query';
import type { StudentQuizQuestion } from '@/types/student-quiz';

type StudentAnswer = { index: number } | { text: string };

const CourseTakeAssessment = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const quizId = searchParams.get('quizId');
	const classIdParam = searchParams.get('classId');
	const classId = classIdParam ? Number(classIdParam) : undefined;

	const [attemptId, setAttemptId] = useState<number | null>(null);
	const [attemptStartedAt, setAttemptStartedAt] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, StudentAnswer | undefined>>({});
	const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
	const [showSubmitDialog, setShowSubmitDialog] = useState(false);
	const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
	const [startError, setStartError] = useState<string | null>(null);
	const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const autoStartTriggeredRef = useRef(false);

	const { data: quizDetail, isLoading: isDetailLoading } = useStudentQuizDetail(
		quizId ?? undefined,
	);
	const { data: quizList } = useStudentQuizList({ classId });
	const { data: questions, isLoading: isQuestionsLoading } = useStudentQuizQuestions(
		attemptId != null ? (quizId ?? undefined) : undefined,
	);
	const startAttempt = useStartStudentQuizAttempt();
	const submitAttempt = useSubmitStudentQuizAttempt();

	const listItem = useMemo(
		() =>
			Array.isArray(quizList) ? quizList.find((q) => String(q.id) === String(quizId)) : undefined,
		[quizId, quizList],
	);

	const isExam = quizDetail?.documentType === 'EXAM';
	const hasSubmittedExam =
		isExam &&
		String(listItem?.lastAttempt?.status ?? '')
			.toUpperCase()
			.includes('SUBMITTED');

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	const setAnswer = useCallback((blockId: string, answer: StudentAnswer) => {
		setAnswers((prev) => ({ ...prev, [blockId]: answer }));
		setValidationErrors((prev) => {
			const next = new Set(prev);
			next.delete(blockId);
			return next;
		});
	}, []);

	const answeredCount = useMemo(
		() =>
			(questions ?? []).filter((q) => {
				const answer = answers[q.id];
				if (!answer) return false;
				if ('text' in answer) return answer.text.trim().length > 0;
				return typeof answer.index === 'number';
			}).length,
		[answers, questions],
	);

	const navigateBackToAssignments = useCallback(() => {
		if (classId != null && Number.isFinite(classId)) {
			router.replace(`/student/classroom?classId=${classId}`);
			return;
		}
		router.replace('/student/classroom');
	}, [classId, router]);

	const handleStart = useCallback(async () => {
		if (!quizId || hasSubmittedExam) return;
		setStartError(null);
		try {
			const started = await startAttempt.mutateAsync(quizId);
			setAttemptId(started.attemptId);
			setAttemptStartedAt(started.startedAt);
		} catch {
			setStartError('Unable to start assessment. Please try again.');
			autoStartTriggeredRef.current = false;
		}
	}, [hasSubmittedExam, quizId, startAttempt]);

	useEffect(() => {
		if (!quizId) return;
		if (attemptId != null) return;
		if (isDetailLoading) return;
		if (!quizDetail) return;
		if (hasSubmittedExam) return;
		if (autoStartTriggeredRef.current) return;

		autoStartTriggeredRef.current = true;
		void handleStart();
	}, [attemptId, handleStart, hasSubmittedExam, isDetailLoading, quizDetail, quizId]);

	const handleSubmit = useCallback(async () => {
		if (!quizId || attemptId == null || !questions) return;

		const unanswered = questions.filter((q) => {
			const answer = answers[q.id];
			if (!answer) return true;
			if ('text' in answer) return answer.text.trim().length === 0;
			return false;
		});

		if (unanswered.length > 0) {
			setValidationErrors(new Set(unanswered.map((q) => q.id)));
			setShowSubmitDialog(true);
			return;
		}

		const payload = {
			answers: Object.entries(answers).map(([blockId, answer]) => ({
				blockId,
				answer,
			})),
		};

		await submitAttempt.mutateAsync({
			quizId,
			attemptId,
			payload,
		});

		navigateBackToAssignments();
	}, [answers, attemptId, navigateBackToAssignments, questions, quizId, submitAttempt]);

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
		if (remainingSeconds == null || remainingSeconds > 0) return;
		if (attemptId != null && !submitAttempt.isPending) {
			handleSubmit();
		}
	}, [attemptId, handleSubmit, remainingSeconds, submitAttempt.isPending]);

	if (!quizId) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Card className="max-w-md p-8 text-center">
					<CardContent className="space-y-4 p-0">
						<h2 className="text-xl font-bold">Missing quiz id</h2>
						<p className="text-sm text-muted-foreground">
							Please open this page from the quiz detail screen.
						</p>
						<Button onClick={navigateBackToAssignments}>Back to classroom</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isDetailLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
				<Clock className="mr-2 h-5 w-5 animate-spin" />
				Loading assessment...
			</div>
		);
	}

	if (!quizDetail) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Card className="max-w-md p-8 text-center">
					<CardContent className="space-y-4 p-0">
						<h2 className="text-xl font-bold">Assessment not found</h2>
						<Button onClick={navigateBackToAssignments}>Back to classroom</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const timerEnabled = remainingSeconds != null;
	const isUrgent = (remainingSeconds ?? 9999) < 120;

	return (
		<div className="min-h-screen bg-background bg-grid-paper flex flex-col">
			<header className="sticky top-0 z-50 bg-card/95 border-b border-border px-4 py-3">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between">
					<h1 className="max-w-[50%] truncate text-xl font-bold md:text-2xl">{quizDetail.title}</h1>
					<div className="flex items-center gap-4">
						{quizDetail.timeLimitMinutes && quizDetail.timeLimitMinutes > 0 && timerEnabled && (
							<Badge
								variant="outline"
								className={`px-4 py-1.5 font-mono text-base ${
									isUrgent
										? 'animate-pulse border-destructive/30 bg-destructive/10 text-destructive'
										: 'border-sky-700/30 bg-sky-200/40 text-sky-900'
								}`}
							>
								<Clock className="mr-2 h-4 w-4" />
								{formatTime(remainingSeconds ?? 0)}
							</Badge>
						)}
						<Button
							onClick={() => setShowSubmitDialog(true)}
							disabled={attemptId == null || submitAttempt.isPending}
							className="gap-2 rounded-xl font-bold"
						>
							<Send className="h-4 w-4" />
							Submit
						</Button>
					</div>
				</div>
			</header>

			<div className="mx-auto flex w-full max-w-6xl flex-1">
				<div className="flex-1 overflow-y-auto p-4 pb-32 md:p-6">
					{attemptId == null ? (
						<Card className="mx-auto mt-8 max-w-2xl">
							<CardContent className="space-y-4 p-6">
								<h2 className="text-xl font-bold">{quizDetail.documentType}</h2>
								<p className="text-sm text-muted-foreground">
									{quizDetail.description ?? 'Preparing your assessment...'}
								</p>
								{hasSubmittedExam && (
									<p className="text-sm text-destructive">
										You already submitted this exam. Only one attempt is allowed.
									</p>
								)}
								{startError && <p className="text-sm text-destructive">{startError}</p>}
								{hasSubmittedExam ? (
									<div className="flex gap-3">
										<Button variant="outline" onClick={navigateBackToAssignments}>
											Back
										</Button>
									</div>
								) : startError ? (
									<div className="flex gap-3">
										<Button variant="outline" onClick={navigateBackToAssignments}>
											Back
										</Button>
										<Button
											onClick={handleStart}
											disabled={startAttempt.isPending}
											className="gap-2"
										>
											{startAttempt.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
											{startAttempt.isPending ? 'Starting...' : 'Retry'}
										</Button>
									</div>
								) : (
									<div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
										<Loader2 className="h-4 w-4 animate-spin" />
										Starting assessment...
									</div>
								)}
							</CardContent>
						</Card>
					) : isQuestionsLoading ? (
						<div className="flex items-center justify-center py-10 text-muted-foreground">
							<Clock className="mr-2 h-5 w-5 animate-spin" />
							Loading questions...
						</div>
					) : (
						<div className="space-y-6">
							{(questions ?? []).map((q, idx) => (
								<QuestionCard
									key={q.id}
									question={q}
									index={idx}
									answer={answers[q.id]}
									onAnswer={(val) => setAnswer(q.id, val)}
									hasError={validationErrors.has(q.id)}
									ref={(el) => {
										questionRefs.current[q.id] = el;
									}}
								/>
							))}
						</div>
					)}
				</div>

				<div className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-56 overflow-y-auto border-l border-border bg-card/50 p-4 md:block">
					<h3 className="mb-3 text-lg font-semibold text-muted-foreground">Questions</h3>
					<div className="grid grid-cols-4 gap-2">
						{(questions ?? []).map((q, idx) => {
							const answer = answers[q.id];
							const isAnswered =
								!!answer && ('index' in answer || ('text' in answer && answer.text.trim() !== ''));
							const hasError = validationErrors.has(q.id);
							return (
								<button
									type="button"
									key={q.id}
									onClick={() =>
										questionRefs.current[q.id]?.scrollIntoView({
											behavior: 'smooth',
											block: 'center',
										})
									}
									className={`h-10 w-10 rounded-xl border-2 text-sm font-bold transition-all ${
										hasError
											? 'border-destructive bg-destructive/10 text-destructive'
											: isAnswered
												? 'border-emerald-700/30 bg-emerald-200/50 text-emerald-900'
												: 'border-border bg-card text-muted-foreground hover:border-primary/50'
									}`}
								>
									{idx + 1}
								</button>
							);
						})}
					</div>

					<div className="mt-6 border-t border-border pt-4">
						<div className="h-2 w-full rounded-full bg-secondary">
							<div
								className="h-2 rounded-full bg-primary transition-all"
								style={{
									width:
										(questions?.length ?? 0) > 0
											? `${(answeredCount / (questions?.length ?? 1)) * 100}%`
											: '0%',
								}}
							/>
						</div>
						<p className="mt-1 text-center text-xs text-muted-foreground">
							{answeredCount}/{questions?.length ?? 0} completed
						</p>
					</div>
				</div>
			</div>

			<div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 md:hidden">
				<Button
					size="icon"
					variant="outline"
					className="h-12 w-12 rounded-full bg-card shadow-lg"
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					<ChevronUp className="h-5 w-5" />
				</Button>
			</div>

			<Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
				<DialogContent className="rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">Submit Assessment?</DialogTitle>
						<DialogDescription>
							{validationErrors.size > 0 ? (
								<span className="flex items-center gap-2 text-destructive">
									<AlertTriangle className="h-4 w-4" />
									You have {validationErrors.size} unanswered question(s).
								</span>
							) : (
								'You have answered all questions. Ready to submit?'
							)}
						</DialogDescription>
					</DialogHeader>
					<div className="mt-4 flex justify-end gap-3">
						<Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
							Go Back
						</Button>
						<Button onClick={handleSubmit} disabled={submitAttempt.isPending}>
							{submitAttempt.isPending ? 'Submitting...' : 'Confirm Submit'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

type QuestionCardProps = {
	question: StudentQuizQuestion;
	index: number;
	answer: StudentAnswer | undefined;
	onAnswer: (val: StudentAnswer) => void;
	hasError: boolean;
	ref: (el: HTMLDivElement | null) => void;
};

const QuestionCard = ({ question, index, answer, onAnswer, hasError, ref }: QuestionCardProps) => {
	const isMCQ = question.type === 'MCQ';
	const optionOccurrenceMap = new Map<string, number>();

	return (
		<div ref={ref}>
			<Card
				className={`transition-all ${
					hasError ? 'border-destructive/30 ring-2 ring-destructive/50' : ''
				}`}
			>
				<CardContent className="p-5 md:p-6">
					<div className="mb-4 flex items-start gap-3">
						<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
							{index + 1}
						</span>
						<div className="flex-1">
							<div className="mb-1 flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{isMCQ ? 'Multiple Choice' : 'Essay'} • {question.maxScore} pts
								</Badge>
							</div>
							<p className="text-base font-semibold leading-relaxed">{question.questionText}</p>
							{hasError && (
								<p className="mt-1 text-xs text-destructive">Please answer this question</p>
							)}
						</div>
					</div>

					{isMCQ && question.type === 'MCQ' ? (
						<div className="ml-11 grid gap-2">
							{question.options.map((opt, i) => {
								const isSelected = !!answer && 'index' in answer && answer.index === i;
								const letter = String.fromCharCode(65 + i);
								const currentOccurrence = (optionOccurrenceMap.get(opt) ?? 0) + 1;
								optionOccurrenceMap.set(opt, currentOccurrence);
								const optionKey = `${question.id}-${opt}-${currentOccurrence}`;
								return (
									<button
										key={optionKey}
										type="button"
										onClick={() => onAnswer({ index: i })}
										className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
											isSelected
												? 'border-primary bg-primary/10 shadow-sm'
												: 'border-border bg-card hover:border-primary/30'
										}`}
									>
										<span
											className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'bg-muted text-muted-foreground'
											}`}
										>
											{letter}
										</span>
										<span className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>{opt}</span>
										{isSelected && (
											<CheckCircle className="ml-auto h-4 w-4 flex-shrink-0 text-primary" />
										)}
									</button>
								);
							})}
						</div>
					) : (
						<div className="ml-11">
							<Textarea
								placeholder="Write your answer here..."
								className="min-h-[120px] resize-y rounded-xl border-2 border-border bg-card"
								value={answer && 'text' in answer ? answer.text : ''}
								onChange={(e) => onAnswer({ text: e.target.value })}
							/>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default CourseTakeAssessment;
