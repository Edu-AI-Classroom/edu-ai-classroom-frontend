'use client';

import { format } from 'date-fns';
import {
	ArrowLeft,
	BarChart3,
	ClipboardList,
	FileText,
	Plus,
	Search,
	Shield,
	Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ConfirmActionModal } from '@/features/teacher/classroom/components/confirm-action-modal';
import { useClassList } from '@/hooks/queries/class/use-class-query';
import { useDeleteQuiz } from '@/hooks/queries/quiz/use-quiz-mutation';
import { useQuizList, useQuizOverview } from '@/hooks/queries/quiz/use-quiz-query';
import type { QuizDocumentType } from '@/types/quiz';
import { CreateQuizDialog } from './widgets/create-quiz-dialog';

function getQuizStatusLabel(q: { status: string; dueDate?: string | null; questionCount: number }) {
	const status = String(q.status ?? '').toUpperCase();
	if (status === 'ARCHIVED') return 'ARCHIVED';

	const due = q.dueDate ? new Date(q.dueDate) : null;
	const isOverdue = !!due && !Number.isNaN(due.getTime()) && due.getTime() < Date.now();
	if (isOverdue) return 'OVERDUE';

	// Backend may keep DRAFT by default. Treat quizzes with questions as "published/ready".
	if (q.questionCount > 0) return 'PUBLISHED';

	return 'DRAFT';
}

function getQuizStatusBadgeClass(label: string) {
	switch (label) {
		case 'PUBLISHED':
			return 'bg-[#A8D5BA]/25 text-[#256f4b]';
		case 'OVERDUE':
			return 'bg-[#E57373]/20 text-[#C62828]';
		case 'ARCHIVED':
			return 'bg-[#E0DCD5] text-[#666]';
		default:
			return 'bg-[#F0EDE8] text-[#666]';
	}
}

function StatCard({
	title,
	value,
	icon: Icon,
	color,
}: {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}) {
	return (
		<div className="bg-white rounded-2xl p-5 border border-[#E0DCD5] shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-[#666]">{title}</p>
					<p className="font-sans font-bold text-3xl text-[#333] mt-1">{value}</p>
				</div>
				<div
					className="w-11 h-11 rounded-2xl flex items-center justify-center"
					style={{ backgroundColor: color }}
				>
					<Icon className="w-5 h-5 text-[#333]" />
				</div>
			</div>
		</div>
	);
}

export default function TeacherQuizDashboard() {
	const [search, setSearch] = useState('');
	const [typeFilter, setTypeFilter] = useState<QuizDocumentType | 'ALL'>('ALL');

	const { data: overview } = useQuizOverview();
	const { data: classes } = useClassList();
	const { data: quizzes, isLoading } = useQuizList({
		search: search.trim() || undefined,
		type: typeFilter === 'ALL' ? undefined : typeFilter,
	});

	const deleteQuiz = useDeleteQuiz();

	const classOptions = useMemo(() => classes?.data ?? [], [classes]);

	return (
		<div className="min-h-screen bg-[#FAF9F6] grid-paper">
			<header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
					<div>
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333] mb-1"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Dashboard
						</Link>
						<h1 className="font-sans font-bold text-2xl text-[#333]">Quiz Dashboard</h1>
						<p className="font-serif text-[#666]">
							Create quizzes, build questions, and track submissions.
						</p>
					</div>

					<CreateQuizDialog
						classOptions={classOptions}
						trigger={
							<Button className="rounded-xl bg-gradient-to-r from-[#A8D5BA] to-[#7FC8A9] text-[#113] border-0 shadow-md hover:shadow-lg transition-all">
								<Plus className="w-4 h-4 mr-2" />
								New Quiz
							</Button>
						}
					/>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
				<section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						title="Total Quizzes"
						value={overview?.totalQuizzes ?? 0}
						icon={ClipboardList}
						color="#F5B041"
					/>
					<StatCard
						title="Total Assignments"
						value={overview?.totalAssignments ?? 0}
						icon={FileText}
						color="#C5B4E3"
					/>
					<StatCard
						title="Total Exams"
						value={overview?.totalExams ?? 0}
						icon={Shield}
						color="#A8D5BA"
					/>
					<StatCard
						title="Student Submissions"
						value={overview?.totalStudentSubmissions ?? 0}
						icon={Trophy}
						color="#E8B4B8"
					/>
				</section>

				<section className="bg-white rounded-2xl border border-[#E0DCD5] shadow-sm overflow-hidden">
					<div className="p-5 border-b border-[#E0DCD5] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-[#F5B041]/15 flex items-center justify-center">
								<BarChart3 className="w-5 h-5 text-[#333]" />
							</div>
							<div>
								<h2 className="font-sans font-bold text-lg text-[#333]">Your Quizzes</h2>
								<p className="text-sm text-[#666]">Manage assignment/exam quizzes</p>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-2 sm:items-center">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
								<Input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search quizzes..."
									className="pl-9 rounded-xl bg-[#FAF9F6] border-[#E0DCD5] w-full sm:w-64"
								/>
							</div>

							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value as any)}
								className="rounded-xl border border-[#E0DCD5] bg-[#FAF9F6] px-3 py-2 text-sm text-[#333] outline-none"
							>
								<option value="ALL">All types</option>
								<option value="ASSIGNMENT">Assignment</option>
								<option value="EXAM">Exam</option>
							</select>
						</div>
					</div>

					<div className="p-2">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Quiz Title</TableHead>
									<TableHead>Classroom</TableHead>
									<TableHead>Type</TableHead>
									<TableHead className="text-right">Questions</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading && (
									<TableRow>
										<TableCell colSpan={7} className="text-center text-[#666] py-10">
											Loading quizzes...
										</TableCell>
									</TableRow>
								)}

								{!isLoading && (quizzes ?? []).length === 0 && (
									<TableRow>
										<TableCell colSpan={7} className="text-center text-[#666] py-10">
											No quizzes found. Create your first quiz.
										</TableCell>
									</TableRow>
								)}

								{(quizzes ?? []).map((q) => (
									<TableRow key={q.id}>
										<TableCell className="font-semibold text-[#333]">{q.title}</TableCell>
										<TableCell className="text-[#666]">{q.classroom?.name ?? '—'}</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
													q.documentType === 'EXAM'
														? 'bg-[#A8D5BA]/25 text-[#256f4b]'
														: 'bg-[#C5B4E3]/25 text-[#5a3ea6]'
												}`}
											>
												{q.documentType}
											</span>
										</TableCell>
										<TableCell className="text-right tabular-nums">{q.questionCount}</TableCell>
										<TableCell className="text-[#666]">
											{q.createdAt ? format(new Date(q.createdAt), 'dd/MM/yyyy') : '—'}
										</TableCell>
										<TableCell>
											{(() => {
												const label = getQuizStatusLabel(q);
												return (
													<span
														className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${getQuizStatusBadgeClass(label)}`}
													>
														{label}
													</span>
												);
											})()}
										</TableCell>
										<TableCell className="text-right">
											<div className="inline-flex items-center gap-2">
												<Button asChild variant="outline" size="sm" className="rounded-xl">
													<Link href={`/quizzes/${q.id}`}>View</Link>
												</Button>
												<Button asChild variant="outline" size="sm" className="rounded-xl">
													<Link href={`/quizzes/${q.id}/edit`}>Edit</Link>
												</Button>
												<ConfirmActionModal
													title="Delete quiz?"
													description="This will permanently remove the quiz and its questions."
													confirmLabel="Delete"
													isPending={deleteQuiz.isPending}
													onConfirm={() => deleteQuiz.mutateAsync(q.id)}
													trigger={
														<Button variant="destructive" size="sm" className="rounded-xl">
															Delete
														</Button>
													}
												/>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</section>
			</main>
		</div>
	);
}
