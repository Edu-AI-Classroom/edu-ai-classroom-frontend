'use client';

import { format } from 'date-fns';
import { ArrowLeft, BarChart3, ClipboardList, Pencil, Trophy } from 'lucide-react';
import Link from 'next/link';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	useQuizDetail,
	useQuizQuestions,
	useQuizSubmissionsOverview,
} from '@/hooks/queries/quiz/use-quiz-query';

function MetricPill({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-2xl border border-[#E0DCD5] bg-white px-4 py-3">
			<p className="text-xs font-semibold text-[#666]">{label}</p>
			<p className="text-lg font-bold text-[#333] mt-0.5">{value}</p>
		</div>
	);
}

export default function QuizDetailView({ quizId }: { quizId: string }) {
	const { data: quiz, isLoading: isQuizLoading } = useQuizDetail(quizId);
	const { data: questions } = useQuizQuestions(quizId);
	const { data: submissions } = useQuizSubmissionsOverview(quizId);

	if (isQuizLoading) {
		return (
			<div className="min-h-screen bg-[#FAF9F6] grid-paper flex items-center justify-center text-[#666]">
				Loading quiz...
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

	return (
		<div className="min-h-screen bg-[#FAF9F6] grid-paper">
			<header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
					<div className="min-w-0">
						<Link
							href="/quizzes"
							className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333]"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Quiz Dashboard
						</Link>
						<h1 className="font-sans font-bold text-2xl text-[#333] mt-1 truncate">{quiz.title}</h1>
						<p className="text-sm text-[#666]">
							{quiz.documentType} • {quiz.classroom?.name ?? 'No classroom'} • Created{' '}
							{quiz.createdAt ? format(new Date(quiz.createdAt), 'dd/MM/yyyy') : '—'}
						</p>
					</div>

					<Button asChild variant="outline" className="rounded-xl">
						<Link href={`/quizzes/${quiz.id}/edit`}>
							<Pencil className="w-4 h-4 mr-2" />
							Edit Quiz
						</Link>
					</Button>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
					<MetricPill label="Questions" value={`${(questions ?? []).length}`} />
					<MetricPill
						label="Time limit"
						value={quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : '—'}
					/>
					<MetricPill
						label="Total points"
						value={quiz.totalPoints != null ? `${quiz.totalPoints}` : '—'}
					/>
					<MetricPill label="Status" value={quiz.status} />
				</div>

				<Tabs defaultValue="questions">
					<TabsList className="rounded-2xl bg-white border border-[#E0DCD5]">
						<TabsTrigger value="questions" className="rounded-xl">
							<ClipboardList className="w-4 h-4 mr-2" />
							Questions
						</TabsTrigger>
						<TabsTrigger value="submissions" className="rounded-xl">
							<Trophy className="w-4 h-4 mr-2" />
							Submissions
						</TabsTrigger>
						<TabsTrigger value="analytics" className="rounded-xl">
							<BarChart3 className="w-4 h-4 mr-2" />
							Analytics
						</TabsTrigger>
					</TabsList>

					<TabsContent value="questions" className="mt-4">
						<div className="bg-white rounded-2xl border border-[#E0DCD5] shadow-sm overflow-hidden">
							<div className="p-5 border-b border-[#E0DCD5]">
								<h2 className="font-sans font-bold text-lg text-[#333]">Question List</h2>
								<p className="text-sm text-[#666]">
									Questions are ordered as students will see them.
								</p>
							</div>
							<div className="p-5 space-y-3">
								{(questions ?? []).length === 0 && <p className="text-[#666]">No questions yet.</p>}
								{(questions ?? []).map((q, idx) => (
									<div key={q.id} className="rounded-2xl border border-[#E0DCD5] bg-[#FFFCF5] p-4">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<p className="text-xs font-semibold text-[#666]">
													Q{idx + 1} • {q.type}
												</p>
												<p className="font-semibold text-[#333] mt-1">{q.questionText}</p>
												{q.type === 'MCQ' && (
													<ul className="mt-2 space-y-1 text-sm text-[#666] list-disc pl-5">
														{q.options.map((opt, i) => (
															<li
																key={`${q.id}-${opt}`}
																className={
																	i === q.correctIndex ? 'text-[#256f4b] font-semibold' : ''
																}
															>
																{opt}
															</li>
														))}
													</ul>
												)}
												<p className="text-sm text-[#666] mt-2">
													Max score: <span className="font-semibold text-[#333]">{q.maxScore}</span>
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</TabsContent>

					<TabsContent value="submissions" className="mt-4">
						<div className="grid lg:grid-cols-4 gap-3">
							<MetricPill label="Attempted" value={`${submissions?.totalStudentsAttempted ?? 0}`} />
							<MetricPill label="Avg score" value={`${submissions?.averageScore ?? 0}`} />
							<MetricPill label="Highest" value={`${submissions?.highestScore ?? 0}`} />
							<MetricPill
								label="Completion rate"
								value={`${Math.round(((submissions?.completionRate ?? 0) * 100) as number)}%`}
							/>
						</div>

						<div className="mt-4 bg-white rounded-2xl border border-[#E0DCD5] shadow-sm overflow-hidden">
							<div className="p-5 border-b border-[#E0DCD5]">
								<h2 className="font-sans font-bold text-lg text-[#333]">Submission Trend</h2>
								<p className="text-sm text-[#666]">Attempts over the last days</p>
							</div>
							<div className="p-4 h-[280px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={submissions?.attemptsByDay ?? []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
										<Tooltip />
										<Line
											type="monotone"
											dataKey="attempts"
											stroke="#F5B041"
											strokeWidth={3}
											dot={false}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="analytics" className="mt-4">
						<div className="bg-white rounded-2xl border border-[#E0DCD5] shadow-sm overflow-hidden">
							<div className="p-5 border-b border-[#E0DCD5]">
								<h2 className="font-sans font-bold text-lg text-[#333]">Score Distribution</h2>
								<p className="text-sm text-[#666]">How scores are distributed across attempts</p>
							</div>
							<div className="p-4 h-[320px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={submissions?.scoreDistribution ?? []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
										<Tooltip />
										<Bar dataKey="count" fill="#C5B4E3" radius={[8, 8, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
