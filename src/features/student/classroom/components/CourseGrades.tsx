import { BarChart3, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useMemo } from 'react';
import type { ClassroomUiData } from '@/features/teacher/classroom/classroom.mapper';
import { useStudentQuizList } from '@/hooks/queries/quiz/use-student-quiz-query';

const CourseGrades = ({ classData }: { classData: ClassroomUiData }) => {
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: quizzes, isLoading } = useStudentQuizList({ classId });

	const list = useMemo(() => (Array.isArray(quizzes) ? quizzes : []), [quizzes]);
	const graded = list.filter((q) => q.lastAttempt?.totalScore != null);
	const avg =
		graded.length > 0
			? (
				graded.reduce((s, q) => s + Number(q.lastAttempt?.totalScore ?? 0), 0) / graded.length
			).toFixed(2)
			: '0.00';

	return (
		<div className="space-y-4">
			<div className="bg-card rounded-xl border border-border p-5">
				<div className="flex items-center gap-2 mb-2">
					<BarChart3 className="w-4 h-4 text-teachify-purple" />
					<h2 className="font-bold text-foreground">My Grades</h2>
				</div>
				<p className="text-sm text-muted-foreground">
					Average (graded submissions): <span className="font-semibold text-foreground">{avg}</span>
				</p>
			</div>

			<div className="bg-card rounded-xl border border-border overflow-hidden">
				<div className="p-4 border-b border-border flex items-center gap-2">
					<FileText className="w-4 h-4 text-muted-foreground" />
					<p className="font-semibold text-foreground">Assignments</p>
					<span className="text-xs text-muted-foreground ml-auto">{list.length} items</span>
				</div>

				<div className="divide-y divide-border">
					{isLoading && <div className="p-4 text-sm text-muted-foreground">Loading...</div>}

					{!isLoading &&
						list.map((q) => {
							const score = q.lastAttempt?.totalScore ?? null;
							const normalizedStatus = String(q.lastAttempt?.status ?? '').toUpperCase();
							const isLate = normalizedStatus.includes('LATE');
							const submitted = normalizedStatus.includes('SUBMITTED');
							const gradedStatus = score != null;
							return (
								<div key={q.id} className="p-4 flex items-center justify-between gap-3">
									<div className="min-w-0">
										<p className="font-semibold text-foreground truncate">{q.title}</p>
										<p className="text-xs text-muted-foreground">
											{q.documentType} • {new Date(q.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className="flex items-center gap-3">
										{isLate ? (
											<span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-destructive/15 text-destructive">
												<Clock className="w-3.5 h-3.5" />
												Late Submission
											</span>
										) : gradedStatus ? (
											<span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success">
												<CheckCircle2 className="w-3.5 h-3.5" />
												Graded
											</span>
										) : submitted ? (
											<span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary">
												<Clock className="w-3.5 h-3.5" />
												Submitted
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-warning/15 text-warning">
												<Clock className="w-3.5 h-3.5" />
												Not submitted
											</span>
										)}

										<span className="text-sm font-bold text-foreground tabular-nums">
											{score != null ? score : '—'}
										</span>
									</div>
								</div>
							);
						})}

					{!isLoading && list.length === 0 && (
						<div className="p-6 text-sm text-muted-foreground italic">
							No graded items yet.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CourseGrades;
