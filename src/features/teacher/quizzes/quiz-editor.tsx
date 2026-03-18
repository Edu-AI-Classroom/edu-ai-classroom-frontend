'use client';

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	AlignLeft,
	ArrowLeft,
	CheckSquare,
	ChevronDown,
	ChevronRight,
	FileText,
	GripVertical,
	Save,
	Sparkles,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmActionModal } from '@/features/teacher/classroom/components/confirm-action-modal';
import { useClassList } from '@/hooks/queries/class/use-class-query';
import {
	useCreateQuizQuestion,
	useDeleteQuizQuestion,
	useGenerateQuizWithAi,
	useReorderQuizQuestions,
	useUpdateQuiz,
	useUpdateQuizQuestion,
} from '@/hooks/queries/quiz/use-quiz-mutation';
import { useQuizDetail, useQuizQuestions } from '@/hooks/queries/quiz/use-quiz-query';
import type {
	AiGeneratedQuizQuestion,
	QuizDocumentType,
	QuizQuestion,
	QuizQuestionType,
} from '@/types/quiz';

function QuestionTypePill({ type }: { type: QuizQuestionType }) {
	return (
		<span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-[#F0EDE8] text-[#666]">
			{type}
		</span>
	);
}

function SortableQuestionItem({
	id,
	children,
}: {
	id: string;
	children: (props: {
		attributes: ReturnType<typeof useSortable>['attributes'];
		listeners: ReturnType<typeof useSortable>['listeners'];
		isDragging: boolean;
	}) => React.ReactNode;
}) {
	const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style}>
			{children({ attributes, listeners, isDragging })}
		</div>
	);
}

export default function QuizEditor({ quizId }: { quizId: string }) {
	const router = useRouter();
	const { data: quiz, isLoading: isQuizLoading } = useQuizDetail(quizId);
	const { data: questions, isLoading: isQuestionsLoading } = useQuizQuestions(quizId);
	const { data: classes } = useClassList();

	const updateQuiz = useUpdateQuiz(quizId);
	const createQuestion = useCreateQuizQuestion(quizId);
	const updateQuestion = useUpdateQuizQuestion(quizId);
	const deleteQuestion = useDeleteQuizQuestion(quizId);
	const reorder = useReorderQuizQuestions(quizId);
	const aiGenerate = useGenerateQuizWithAi(quizId);

	const classOptions = useMemo(() => classes?.data ?? [], [classes]);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [classroomId, setClassroomId] = useState<number | undefined>(undefined);
	const [documentType, setDocumentType] = useState<QuizDocumentType>('ASSIGNMENT');
	const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(undefined);
	const [totalPoints, setTotalPoints] = useState<number | undefined>(undefined);
	const [dueDate, setDueDate] = useState<string>('');

	const [activeQuestionId, setActiveQuestionId] = useState<string>('');
	const [orderedQuestionIds, setOrderedQuestionIds] = useState<string[]>([]);
	const questionCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// AI generator (Gemini)
	const [aiPrompt, setAiPrompt] = useState('');
	const [aiTotalQuestions, setAiTotalQuestions] = useState<number>(10);
	const [aiMcqCount, setAiMcqCount] = useState<number>(7);
	const [aiEssayCount, setAiEssayCount] = useState<number>(3);
	const [aiPointsPerQuestion, setAiPointsPerQuestion] = useState<number>(1);
	const [aiGenerated, setAiGenerated] = useState<AiGeneratedQuizQuestion[] | null>(null);
	const [aiError, setAiError] = useState<string>('');
	const [isAiToolboxOpen, setIsAiToolboxOpen] = useState(false);

	// Hydrate local form from server once
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		if (!quiz || hydrated) return;
		setTitle(quiz.title);
		setDescription(quiz.description ?? '');
		setClassroomId(quiz.classroom?.id ?? undefined);
		setDocumentType(quiz.documentType);
		setTimeLimitMinutes(quiz.timeLimitMinutes ?? undefined);
		setTotalPoints(quiz.totalPoints ?? undefined);
		setDueDate(quiz.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : '');
		setHydrated(true);
	}, [hydrated, quiz]);

	const onSaveQuiz = async () => {
		if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
			await new Promise((resolve) => setTimeout(resolve, 0));
		}

		if (createQuestion.isPending || updateQuestion.isPending || reorder.isPending) {
			toast.error('Please wait', {
				description: 'Question changes are still syncing. Try save again in a moment.',
			});
			return;
		}

		if (sortedQuestions.length === 0) {
			toast.error('Validation Error', {
				description: 'Add at least one question before saving.',
			});
			return;
		}

		const questionsForValidation = sortedQuestions.map((question) => {
			if (question.id !== activeQuestionId) return question;

			const card = questionCardRefs.current[question.id];
			if (!card) return question;

			const questionTextInput = card.querySelector<HTMLInputElement>(
				'[data-field="question-text"]',
			);
			const maxScoreInput = card.querySelector<HTMLInputElement>('[data-field="max-score"]');

			if (question.type === 'MCQ') {
				const optionInputs = Array.from(
					card.querySelectorAll<HTMLInputElement>('[data-field="option-text"]'),
				);
				const checkedOption = card.querySelector<HTMLInputElement>(
					'[data-field="correct-option"]:checked',
				);

				return {
					...question,
					questionText: questionTextInput?.value ?? question.questionText,
					maxScore:
						maxScoreInput?.value !== undefined && maxScoreInput?.value !== ''
							? Number(maxScoreInput.value)
							: question.maxScore,
					options:
						optionInputs.length > 0
							? optionInputs.map((optionInput) => optionInput.value)
							: question.options,
					correctIndex:
						checkedOption && checkedOption.value !== ''
							? Number(checkedOption.value)
							: question.correctIndex,
				};
			}

			const expectedAnswerInput = card.querySelector<HTMLTextAreaElement>(
				'[data-field="expected-answer"]',
			);

			return {
				...question,
				questionText: questionTextInput?.value ?? question.questionText,
				maxScore:
					maxScoreInput?.value !== undefined && maxScoreInput?.value !== ''
						? Number(maxScoreInput.value)
						: question.maxScore,
				expectedAnswer: expectedAnswerInput?.value ?? (question as any).expectedAnswer,
			};
		});

		const getQuestionIssue = (question: QuizQuestion): string | null => {
			const text = question.questionText.trim();

			if (!text) {
				return 'Question text is missing.';
			}

			if (!Number.isFinite(question.maxScore) || Number(question.maxScore) <= 0) {
				return 'Points must be greater than 0.';
			}

			if (question.type === 'MCQ') {
				if (question.options.length < 2) {
					return 'MCQ must have at least 2 options.';
				}

				const hasInvalidOption = question.options.some((optionText) => {
					const trimmed = optionText.trim();
					return !trimmed;
				});

				if (hasInvalidOption) {
					return 'MCQ options are incomplete.';
				}

				if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
					return 'Correct answer is not selected.';
				}
			}

			if (question.type === 'ESSAY') {
				const expectedAnswer = ((question as any).expectedAnswer ?? '').trim();
				if (!expectedAnswer) {
					return 'Expected answer is missing for essay question.';
				}
			}

			return null;
		};

		for (const [questionIndex, question] of questionsForValidation.entries()) {
			const issue = getQuestionIssue(question);
			if (issue) {
				toast.error('Validation Error', {
					description: `Question ${questionIndex + 1}: ${issue}`,
				});
				handleSelectQuestion(question.id);
				return;
			}
		}

		try {
			await updateQuiz.mutateAsync({
				title: title.trim() || undefined,
				description: description.trim() || undefined,
				classroomId,
				documentType,
				timeLimitMinutes,
				totalPoints,
				dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
			});

			toast.success('Save Success', {
				description: 'Quiz has been saved successfully.',
			});

			router.push(`/quizzes/${quizId}`);
		} catch (error: any) {
			toast.error('Save Failed', {
				description: error?.message ?? 'Failed to save quiz.',
			});
		}
	};

	const sortedQuestions = useMemo(() => {
		return [...(questions ?? [])].sort((a, b) => a.positionOrder - b.positionOrder);
	}, [questions]);

	const totalQuestionPoints = useMemo(
		() => sortedQuestions.reduce((sum, question) => sum + Number(question.maxScore ?? 0), 0),
		[sortedQuestions],
	);

	const orderedQuestions = useMemo(() => {
		if (orderedQuestionIds.length === 0) return sortedQuestions;
		const questionMap = new Map(sortedQuestions.map((question) => [question.id, question]));
		return orderedQuestionIds
			.map((id) => questionMap.get(id))
			.filter((question): question is QuizQuestion => Boolean(question));
	}, [orderedQuestionIds, sortedQuestions]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	useEffect(() => {
		if (activeQuestionId) return;
		if (sortedQuestions.length === 0) return;
		setActiveQuestionId(sortedQuestions[0].id);
	}, [activeQuestionId, sortedQuestions]);

	useEffect(() => {
		const incomingIds = sortedQuestions.map((question) => question.id);
		setOrderedQuestionIds((prev) => {
			if (prev.length === 0) return incomingIds;
			const incomingSet = new Set(incomingIds);
			const kept = prev.filter((id) => incomingSet.has(id));
			const added = incomingIds.filter((id) => !kept.includes(id));
			const next = [...kept, ...added];
			const unchanged = next.length === prev.length && next.every((id, idx) => id === prev[idx]);
			return unchanged ? prev : next;
		});
	}, [sortedQuestions]);

	const handleDragEnd = async ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) return;

		const oldIndex = orderedQuestionIds.indexOf(String(active.id));
		const newIndex = orderedQuestionIds.indexOf(String(over.id));
		if (oldIndex < 0 || newIndex < 0) return;

		const next = arrayMove(orderedQuestionIds, oldIndex, newIndex);
		setOrderedQuestionIds(next);

		try {
			await reorder.mutateAsync({
				quizId,
				orderedQuestionIds: next,
			});
		} catch {
			setOrderedQuestionIds(orderedQuestionIds);
		}
	};

	const onQuickAddQuestion = async (type: QuizQuestionType) => {
		try {
			const createdQuestion =
				type === 'MCQ'
					? await createQuestion.mutateAsync({
							quizId,
							type: 'MCQ',
							questionText: 'Untitled multiple choice question',
							options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
							correctIndex: 0,
							maxScore: 1,
						})
					: await createQuestion.mutateAsync({
							quizId,
							type: 'ESSAY',
							questionText: 'Untitled essay question',
							maxScore: 1,
							expectedAnswer: '',
						});

			handleSelectQuestion(createdQuestion.id);
		} catch (error: any) {
			toast.error('Add Question Failed', {
				description: error?.message ?? 'Cannot add question now. Please try again.',
			});
		}
	};

	const onGenerateWithAi = async () => {
		setAiError('');
		setAiGenerated(null);
		const prompt = aiPrompt.trim();
		if (!prompt) return;

		try {
			const res = await aiGenerate.mutateAsync({
				prompt,
				totalQuestions: aiTotalQuestions,
				mcqCount: aiMcqCount,
				essayCount: aiEssayCount,
				pointsPerQuestion: aiPointsPerQuestion,
				language: 'vi',
			});
			setAiGenerated(res.questions ?? []);
		} catch (e: any) {
			const message = e?.message ?? 'AI generate failed';
			setAiError(message);
			toast.error('Generate Failed', {
				description: message,
			});
		}
	};

	const onInsertAiQuestions = async () => {
		if (!aiGenerated || aiGenerated.length === 0) return;
		setAiError('');
		try {
			for (const q of aiGenerated) {
				if (q.type === 'MCQ') {
					await createQuestion.mutateAsync({
						quizId,
						type: 'MCQ',
						questionText: q.questionText,
						options: q.options,
						correctIndex: q.correctIndex,
						maxScore: q.maxScore ?? aiPointsPerQuestion,
					});
				} else {
					await createQuestion.mutateAsync({
						quizId,
						type: 'ESSAY',
						questionText: q.questionText,
						expectedAnswer: q.expectedAnswer,
						maxScore: q.maxScore ?? aiPointsPerQuestion,
					});
				}
			}
			setAiGenerated(null);
			setAiPrompt('');
		} catch (e: any) {
			const message = e?.message ?? 'Insert questions failed';
			setAiError(message);
			toast.error('Insert Failed', {
				description: message,
			});
		}
	};

	const onUpdateQuestion = async (q: QuizQuestion, patch: Partial<QuizQuestion>) => {
		if (q.type === 'MCQ') {
			await updateQuestion.mutateAsync({
				questionId: q.id,
				payload: {
					type: 'MCQ',
					questionText: patch.questionText ?? q.questionText,
					options: (patch as any).options ?? q.options,
					correctIndex: (patch as any).correctIndex ?? q.correctIndex,
					maxScore: (patch as any).maxScore ?? q.maxScore,
				},
			});
			return;
		}

		await updateQuestion.mutateAsync({
			questionId: q.id,
			payload: {
				type: 'ESSAY',
				questionText: patch.questionText ?? q.questionText,
				maxScore: (patch as any).maxScore ?? q.maxScore,
				expectedAnswer:
					(patch as any).expectedAnswer !== undefined
						? ((patch as any).expectedAnswer as any)
						: ((q as any).expectedAnswer ?? null),
			},
		});
	};

	const handleSelectQuestion = (questionId: string) => {
		setActiveQuestionId(questionId);
		requestAnimationFrame(() => {
			questionCardRefs.current[questionId]?.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			});
		});
	};

	if (isQuizLoading) {
		return (
			<div className="min-h-screen bg-[#FAF9F6] grid-paper flex items-center justify-center text-[#666]">
				Loading quiz editor...
			</div>
		);
	}

	if (!quiz) {
		return (
			<div className="min-h-screen bg-[#FAF9F6] grid-paper flex items-center justify-center text-[#666]">
				Quiz not found.
			</div>
		);
	}

	const isSaving = updateQuiz.isPending;
	const questionTypeMeta: Record<
		QuizQuestionType,
		{ label: string; icon: React.ElementType; emoji: string }
	> = {
		MCQ: { label: 'Multiple Choice', icon: CheckSquare, emoji: '✅' },
		ESSAY: { label: 'Essay', icon: AlignLeft, emoji: '📝' },
	};

	return (
		<div className="min-h-screen bg-[#FAF9F6] grid-paper">
			<header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
					<div className="min-w-0 flex-1">
						<Link
							href={`/quizzes/${quizId}`}
							className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333]"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Quiz
						</Link>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Quiz title..."
							className="mt-2 h-11 border-0 bg-transparent px-0 text-2xl font-bold text-[#333] shadow-none focus-visible:ring-0"
						/>
						<p className="text-sm text-[#666]">
							{sortedQuestions.length} questions • {totalQuestionPoints} total points
						</p>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="outline" className="rounded-full">
							Save Draft
						</Button>
						<Button
							onClick={onSaveQuiz}
							disabled={isSaving}
							className="rounded-full bg-gradient-to-r from-[#F5B041] to-[#FA8D3E] text-white border-0 shadow-md hover:shadow-lg transition-all"
						>
							<Save className="w-4 h-4 mr-2" />
							{isSaving ? 'Saving...' : 'Save'}
						</Button>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 py-8">
				<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
					<div className="space-y-4">
						{aiGenerated && aiGenerated.length > 0 && (
							<section className="rounded-2xl border border-[#C5B4E3]/50 bg-[#F9F5FF] p-5 shadow-sm">
								<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
									<div>
										<p className="text-xs font-semibold tracking-wide text-[#6A4B95] uppercase">
											AI Draft
										</p>
										<h2 className="text-lg font-bold text-[#2F2344]">AI-generated questions</h2>
										<p className="text-sm text-[#5D4B78]">
											AI-generated draft questions will appear here. Click "Insert" to add them to
											your quiz.
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											className="rounded-xl"
											onClick={() => setAiGenerated(null)}
										>
											Clear draft
										</Button>
										<Button
											onClick={onInsertAiQuestions}
											disabled={createQuestion.isPending}
											className="rounded-xl bg-[#6A4B95] text-white hover:bg-[#5C4083]"
										>
											{createQuestion.isPending ? 'Inserting...' : 'Insert into quiz'}
										</Button>
									</div>
								</div>

								<div className="space-y-3">
									{(() => {
										const draftOccurrenceMap = new Map<string, number>();

										return aiGenerated.map((generatedQuestion, generatedIndex) => {
											const draftBase = `${generatedQuestion.type}-${generatedQuestion.questionText}`;
											const draftOccurrence = (draftOccurrenceMap.get(draftBase) ?? 0) + 1;
											draftOccurrenceMap.set(draftBase, draftOccurrence);
											const draftKey = `${draftBase}-${draftOccurrence}`;
											const optionOccurrenceMap = new Map<string, number>();

											return (
												<div
													key={draftKey}
													className="rounded-xl border border-[#D8C9EF] bg-white p-4"
												>
													<div className="mb-2 flex items-start justify-between gap-3">
														<p className="text-sm font-semibold text-[#2F2344]">
															{generatedIndex + 1}. {generatedQuestion.questionText}
														</p>
														<QuestionTypePill type={generatedQuestion.type} />
													</div>

													{generatedQuestion.type === 'MCQ' ? (
														<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
															{generatedQuestion.options.map((optionText, optionIndex) => {
																const optionOccurrence =
																	(optionOccurrenceMap.get(optionText) ?? 0) + 1;
																optionOccurrenceMap.set(optionText, optionOccurrence);
																const optionKey = `${draftKey}-option-${optionText}-${optionOccurrence}`;

																return (
																	<div
																		key={optionKey}
																		className={`rounded-lg border px-2 py-1.5 text-sm ${
																			generatedQuestion.correctIndex === optionIndex
																				? 'border-[#9D7AD8] bg-[#F1EAFE] text-[#2F2344]'
																				: 'border-[#E5DDF3] text-[#5D4B78]'
																		}`}
																	>
																		<span className="font-medium">
																			{String.fromCharCode(65 + optionIndex)}.
																		</span>{' '}
																		{optionText}
																	</div>
																);
															})}
														</div>
													) : (
														<p className="rounded-lg border border-[#E5DDF3] bg-[#FAF7FF] px-3 py-2 text-sm text-[#5D4B78]">
															<span className="font-semibold">Expected answer:</span>{' '}
															{generatedQuestion.expectedAnswer || '(empty)'}
														</p>
													)}
												</div>
											);
										});
									})()}
								</div>
							</section>
						)}

						{isQuestionsLoading && (
							<div className="rounded-2xl border border-[#E0DCD5] bg-white p-6 text-[#666]">
								Loading questions...
							</div>
						)}

						{!isQuestionsLoading && sortedQuestions.length === 0 && (
							<div className="rounded-2xl border border-[#E0DCD5] bg-white p-6 text-[#666]">
								No questions yet. Use toolbox on the right to add your first one.
							</div>
						)}

						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={orderedQuestions.map((question) => question.id)}
								strategy={verticalListSortingStrategy}
							>
								{orderedQuestions.map((q, idx) => {
									const isActive = activeQuestionId === q.id;
									const meta = questionTypeMeta[q.type];
									const OptionIcon = meta.icon;
									const optionOccurrenceMap = new Map<string, number>();
									const correctOccurrenceMap = new Map<string, number>();

									return (
										<SortableQuestionItem key={q.id} id={q.id}>
											{({ attributes, listeners, isDragging }) =>
												!isActive ? (
													<div
														ref={(el) => {
															questionCardRefs.current[q.id] = el;
														}}
														className={`rounded-2xl border border-[#E0DCD5] bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#F5B041]/50 hover:shadow-md ${isDragging ? 'scale-[0.99] opacity-80 shadow-xl' : ''}`}
													>
														<button
															type="button"
															onClick={() => handleSelectQuestion(q.id)}
															className="block w-full text-left"
															{...attributes}
															{...listeners}
														>
															<div className="flex items-start gap-3 p-5">
																<div className="flex flex-col items-center gap-1 pt-1 text-[#9A948B]">
																	<GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
																	<span className="text-xs font-bold">Q{idx + 1}</span>
																</div>

																<div className="min-w-0 flex-1">
																	<div className="mb-2 flex items-center gap-2">
																		<Badge variant="secondary" className="gap-1 text-xs">
																			<OptionIcon className="h-3.5 w-3.5" />
																			{meta.emoji} {meta.label}
																		</Badge>
																		<span className="ml-auto text-xs text-[#666]">
																			{q.maxScore} pts
																		</span>
																	</div>
																	<p className="line-clamp-2 text-sm text-[#333] transition-opacity duration-200">
																		{q.questionText || 'Untitled question...'}
																	</p>
																</div>
															</div>
														</button>
													</div>
												) : (
													<div
														ref={(el) => {
															questionCardRefs.current[q.id] = el;
														}}
														className={`rounded-2xl border border-[#F5B041] bg-white p-5 shadow-xl ring-2 ring-[#F5B041]/40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDragging ? 'scale-[0.99] opacity-80' : ''}`}
													>
														<div className="flex items-start gap-3">
															<div className="flex flex-col items-center gap-1 pt-1 text-[#9A948B]">
																<span
																	className="inline-flex cursor-grab active:cursor-grabbing"
																	{...attributes}
																	{...listeners}
																>
																	<GripVertical className="h-4 w-4" />
																</span>
																<span className="text-xs font-bold">Q{idx + 1}</span>
															</div>

															<div className="min-w-0 flex-1">
																<button
																	type="button"
																	onClick={() => handleSelectQuestion(q.id)}
																	className="mb-2 flex w-full items-center gap-2 text-left"
																>
																	<Badge variant="secondary" className="gap-1 text-xs">
																		<OptionIcon className="h-3.5 w-3.5" />
																		{meta.emoji} {meta.label}
																	</Badge>
																	<span className="ml-auto text-xs text-[#666]">
																		{q.maxScore} pts
																	</span>
																</button>

																<div className="animate-in fade-in-0 slide-in-from-bottom-1 space-y-3 duration-300">
																	<Input
																		defaultValue={q.questionText}
																		data-field="question-text"
																		onBlur={(e) => {
																			const value = e.target.value.trim();
																			if (value && value !== q.questionText) {
																				void onUpdateQuestion(q, {
																					questionText: value,
																				});
																			}
																		}}
																		className="rounded-xl border-dashed border-[#E0DCD5] bg-[#F9F8F6]"
																	/>

																	{q.type === 'MCQ' && (
																		<div className="space-y-2">
																			{q.options.map((opt, optIdx) => {
																				const optionOccurrence =
																					(optionOccurrenceMap.get(opt) ?? 0) + 1;
																				optionOccurrenceMap.set(opt, optionOccurrence);
																				const optionKey = `${q.id}-option-${opt}-${optionOccurrence}`;
																				return (
																					<div
																						key={optionKey}
																						className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-lg"
																					>
																						<input
																							type="radio"
																							name={`correct-answer-${q.id}`}
																							data-field="correct-option"
																							value={optIdx}
																							checked={q.correctIndex === optIdx}
																							onChange={() =>
																								void onUpdateQuestion(q, {
																									...(q as any),
																									correctIndex: optIdx,
																								} as any)
																							}
																							className="h-4 w-4 accent-[#F5B041]"
																							aria-label={`Set option ${optIdx + 1} as correct answer`}
																						/>
																						<Input
																							defaultValue={opt}
																							data-field="option-text"
																							onBlur={(e) => {
																								const value = e.target.value;
																								if (value === opt) return;
																								const nextOptions = [...q.options];
																								nextOptions[optIdx] = value;
																								void onUpdateQuestion(q, {
																									...(q as any),
																									options: nextOptions,
																								} as any);
																							}}
																							className="rounded-lg bg-white"
																						/>
																					</div>
																				);
																			})}
																		</div>
																	)}

																	{q.type === 'ESSAY' && (
																		<Textarea
																			defaultValue={(q as any).expectedAnswer ?? ''}
																			data-field="expected-answer"
																			onBlur={(e) => {
																				const value = e.target.value;
																				const current = (q as any).expectedAnswer ?? '';
																				if (value === current) return;
																				void onUpdateQuestion(q, {
																					...(q as any),
																					expectedAnswer: value,
																				} as any);
																			}}
																			placeholder="Expected answer / rubric"
																			className="rounded-xl bg-[#F9F8F6]"
																		/>
																	)}

																	<div className="grid grid-cols-[110px_1fr] items-center gap-2">
																		<div className="flex items-center gap-2">
																			<span className="text-sm text-[#666]">Points:</span>
																			<Input
																				type="number"
																				data-field="max-score"
																				min={0}
																				defaultValue={q.maxScore}
																				onBlur={(e) => {
																					const value = Number(e.target.value || 0);
																					if (!Number.isFinite(value) || value === q.maxScore)
																						return;
																					void onUpdateQuestion(q, {
																						...(q as any),
																						maxScore: value,
																					} as any);
																				}}
																				className="rounded-lg"
																			/>
																		</div>
																		<div className="flex items-center justify-end gap-2">
																			<span className="text-xs text-[#666]">
																				Drag handle to reorder
																			</span>
																			<ConfirmActionModal
																				title="Delete question?"
																				description="This will remove the question and its answer key."
																				confirmLabel="Delete"
																				isPending={deleteQuestion.isPending}
																				onConfirm={() => deleteQuestion.mutateAsync(q.id)}
																				trigger={
																					<Button variant="destructive" size="icon">
																						<Trash2 className="h-4 w-4" />
																					</Button>
																				}
																			/>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												)
											}
										</SortableQuestionItem>
									);
								})}
							</SortableContext>
						</DndContext>
					</div>

					<div className="space-y-4">
						<section className=" rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm">
							<button
								type="button"
								onClick={() => setIsAiToolboxOpen((prev) => !prev)}
								className="flex w-full items-center justify-between rounded-xl px-1 py-1 text-left"
							>
								<div>
									<p className="text-xs font-semibold tracking-wide text-[#5a3ea6] uppercase">
										Toolbox
									</p>
									<h2 className="text-base font-bold text-[#333]">AI Quiz Generator</h2>
								</div>
								{isAiToolboxOpen ? (
									<ChevronDown className="h-5 w-5 text-[#5a3ea6]" />
								) : (
									<ChevronRight className="h-5 w-5 text-[#5a3ea6]" />
								)}
							</button>

							{isAiToolboxOpen && (
								<div className="mt-3 space-y-3 border-t border-[#EEE7FA] pt-3">
									<div className="rounded-xl border border-[#E5DDF3] bg-[#FAF7FF] p-3">
										<p className="mb-1 text-xs font-semibold text-[#5a3ea6]">Prompt</p>
										<Textarea
											value={aiPrompt}
											onChange={(e) => setAiPrompt(e.target.value)}
											placeholder="Mô tả quiz bạn muốn tạo..."
											className="min-h-24 bg-white"
										/>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<div className="rounded-xl border border-[#E5DDF3] bg-[#FAF7FF] p-2.5">
											<p className="text-xs font-semibold text-[#5a3ea6]">Total Questions</p>
											<Input
												type="number"
												value={aiTotalQuestions}
												onChange={(e) => setAiTotalQuestions(Number(e.target.value) || 10)}
												placeholder="Total"
												className="mt-1 bg-white"
											/>
										</div>
										<div className="rounded-xl border border-[#E5DDF3] bg-[#FAF7FF] p-2.5">
											<p className="text-xs font-semibold text-[#5a3ea6]">Points / Question</p>
											<Input
												type="number"
												value={aiPointsPerQuestion}
												onChange={(e) => setAiPointsPerQuestion(Number(e.target.value) || 1)}
												placeholder="Points/Q"
												className="mt-1 bg-white"
											/>
										</div>
										<div className="rounded-xl border border-[#E5DDF3] bg-[#FAF7FF] p-2.5">
											<p className="text-xs font-semibold text-[#5a3ea6]">MCQ Count</p>
											<Input
												type="number"
												value={aiMcqCount}
												onChange={(e) => setAiMcqCount(Number(e.target.value) || 0)}
												placeholder="MCQ"
												className="mt-1 bg-white"
											/>
										</div>
										<div className="rounded-xl border border-[#E5DDF3] bg-[#FAF7FF] p-2.5">
											<p className="text-xs font-semibold text-[#5a3ea6]">Essay Count</p>
											<Input
												type="number"
												value={aiEssayCount}
												onChange={(e) => setAiEssayCount(Number(e.target.value) || 0)}
												placeholder="Essay"
												className="mt-1 bg-white"
											/>
										</div>
									</div>

									<div className="rounded-xl border border-[#E5DDF3] bg-[#FAF7FF] p-3 text-xs text-[#5D4B78]">
										<p className="mb-2 font-semibold text-[#5a3ea6]">Live input summary</p>
										<p>Prompt: {aiPrompt.trim() ? aiPrompt.trim() : '(not input)'}</p>
										<p>
											Question: {aiTotalQuestions} | MCQ: {aiMcqCount} | Essay: {aiEssayCount}
										</p>
										<p>Points per question: {aiPointsPerQuestion}</p>
									</div>

									{aiError && <p className="text-sm text-red-600">{aiError}</p>}

									<Button
										onClick={onGenerateWithAi}
										disabled={aiGenerate.isPending || !aiPrompt.trim()}
										className="w-full rounded-xl bg-[#6A4B95] text-white hover:bg-[#5C4083]"
									>
										{aiGenerate.isPending ? (
											<>
												<Spinner className="mr-2" />
												Generating...
											</>
										) : (
											<>
												<Sparkles className="mr-2 h-4 w-4" />
												Generate draft questions
											</>
										)}
									</Button>
								</div>
							)}
						</section>

						<section className="sticky top-35 rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm">
							<h2 className="flex items-center gap-2 text-base font-bold text-[#333]">
								Add Question
							</h2>
							<p className="mb-4 text-xs text-[#75706A]">
								Pick a type to auto-create a blank template question.
							</p>

							<div className="space-y-3">
								<button
									type="button"
									onClick={() => void onQuickAddQuestion('MCQ')}
									disabled={createQuestion.isPending}
									className="flex w-full items-center gap-3 rounded-3xl border border-[#D8D2CA] bg-[#F7F6F4] px-4 py-2 text-left text-sm font-medium text-[#3E3A36] transition-all hover:border-[#BFDCC8] hover:bg-[#F1F9F3] disabled:cursor-not-allowed disabled:opacity-60"
								>
									<CheckSquare className="h-5 w-5 text-[#5BBE85]" />
									<span>Multiple Choice</span>
								</button>

								{/* <button
									type="button"
									disabled
									className="flex w-full items-center gap-3 rounded-3xl border border-[#D8D2CA] bg-[#F7F6F4] px-4 py-3 text-left text-lg font-medium text-[#88837D] opacity-80"
									title="Fill in the Blank is coming soon"
								>
									<Pencil className="h-5 w-5 text-[#D9935B]" />
									<span>Fill in the Blank</span>
									<span className="ml-auto rounded-full bg-[#EFE8DE] px-2 py-0.5 text-xs font-semibold text-[#8A7C6B]">
										Soon
									</span>
								</button> */}

								<button
									type="button"
									onClick={() => void onQuickAddQuestion('ESSAY')}
									disabled={createQuestion.isPending}
									className="flex w-full items-center gap-3 rounded-3xl border border-[#D8D2CA] bg-[#F7F6F4] px-4 py-2 text-left text-sm font-medium text-[#3E3A36] transition-all hover:border-[#D7CCE8] hover:bg-[#F7F3FC] disabled:cursor-not-allowed disabled:opacity-60"
								>
									<FileText className="h-5 w-5 text-[#A58BC9]" />
									<span>Essay</span>
								</button>
							</div>
						</section>

						<section className="sticky top-83 rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm">
							<h2 className="mb-3 text-base font-bold text-[#333]">Quiz Settings</h2>
							<div className="space-y-3">
								<div className="space-y-1.5">
									<p className="text-xs font-semibold tracking-wide text-[#666] uppercase">
										Quiz Type
									</p>
									<select
										value={documentType}
										onChange={(e) => setDocumentType(e.target.value as QuizDocumentType)}
										className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-2.5 text-sm text-[#333]"
									>
										<option value="ASSIGNMENT">Assignment</option>
										<option value="EXAM">Exam</option>
									</select>
								</div>

								<div className="space-y-1.5">
									<p className="text-xs font-semibold tracking-wide text-[#666] uppercase">
										Classroom
									</p>
									<select
										value={classroomId ?? ''}
										onChange={(e) => {
											const value = e.target.value ? Number(e.target.value) : NaN;
											setClassroomId(Number.isNaN(value) ? undefined : value);
										}}
										className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-2.5 text-sm text-[#333]"
									>
										<option value="">No classroom (draft only)</option>
										{classOptions.map((item) => (
											<option key={item.classId} value={item.classId}>
												{item.className}
											</option>
										))}
									</select>
								</div>

								<div className="space-y-1.5 flex justify-between gap-8">
									<p className="text-xs font-semibold tracking-wide text-[#666] uppercase">
										Time Limit (minutes)
									</p>
									<Input
										type="number"
										min={0}
										value={timeLimitMinutes ?? ''}
										onChange={(e) =>
											setTimeLimitMinutes(e.target.value ? Number(e.target.value) : undefined)
										}
										placeholder="Example: 45"
									/>
								</div>

								<div className="space-y-1.5 flex justify-between gap-15">
									<p className="text-xs font-semibold tracking-wide text-[#666] uppercase">
										Total Points
									</p>
									<Input
										type="number"
										min={0}
										value={totalPoints ?? ''}
										onChange={(e) =>
											setTotalPoints(e.target.value ? Number(e.target.value) : undefined)
										}
										placeholder="Example: 100"
									/>
								</div>

								<div className="space-y-1.5">
									<div className="flex gap-2">
										<p className="text-xs font-semibold tracking-wide text-[#666] uppercase">
											Due Date
										</p>
										<p className="text-xs font-semibold text-[#8A867F]">-</p>
										<p className="text-xs text-[#8A867F]">Leave empty for no deadline.</p>
									</div>
									<Input
										type="datetime-local"
										value={dueDate}
										onChange={(e) => setDueDate(e.target.value)}
									/>
								</div>

								<div className="space-y-1.5">
									<p className="text-xs font-semibold tracking-wide text-[#666] uppercase">
										Description
									</p>
									<Textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Write instructions for students..."
									/>
								</div>
							</div>
						</section>

						{aiGenerated && aiGenerated.length > 0 && (
							<section className="rounded-2xl border border-[#D8C9EF] bg-[#FAF7FF] p-4 shadow-sm">
								<div className="mb-2 flex items-center gap-2">
									<Sparkles className="h-4 w-4 text-[#5a3ea6]" />
									<h2 className="text-base font-bold text-[#333]">AI Draft Ready</h2>
								</div>
								<p className="text-sm text-[#5D4B78]">
									Da tao {aiGenerated.length} cau hoi nhap. Xem chi tiet ben cot trai va bam Insert
									de them vao quiz.
								</p>
							</section>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
