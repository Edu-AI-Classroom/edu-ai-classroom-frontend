import {
	AlertTriangle,
	BarChart3,
	CheckCircle,
	ClipboardList,
	Clock,
	FileText,
	TrendingUp,
	Users,
} from 'lucide-react';
import type { ClassroomUiData } from '@/features/teacher/classroom/classroom.mapper';
import { useClassStudents } from '@/hooks/queries/class/use-class-query';
import { useStudentQuizList } from '@/hooks/queries/quiz/use-student-quiz-query';

interface CourseOverviewProps {
	classData: ClassroomUiData;
}

function formatDueLabel(dueDate?: string | null) {
	if (!dueDate) return null;
	const d = new Date(dueDate);
	if (Number.isNaN(d.getTime())) return null;

	const today = new Date();
	const isSameDay =
		d.getFullYear() === today.getFullYear() &&
		d.getMonth() === today.getMonth() &&
		d.getDate() === today.getDate();

	if (isSameDay) return 'Today';
	return new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit' }).format(d);
}

const CourseOverview = ({ classData }: CourseOverviewProps) => {
	const teacherInitial = classData.teacherName ? classData.teacherName.charAt(0) : 'T';
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: quizzes } = useStudentQuizList({ classId });
	const { data: studentsResponse, isLoading: isStudentsLoading } = useClassStudents(classId);

	const list = Array.isArray(quizzes) ? quizzes : [];
	const total = list.length;
	const completed = list.filter((q) =>
		String(q.lastAttempt?.status ?? '')
			.toUpperCase()
			.includes('SUBMITTED'),
	).length;
	const graded = list.filter((q) => q.lastAttempt?.totalScore != null).length;
	const completedOrGraded = Math.max(completed, graded);
	const progressPct = total > 0 ? Math.round((completedOrGraded / total) * 100) : 0;
	const avgScore =
		graded > 0
			? (
					list
						.filter((q) => q.lastAttempt?.totalScore != null)
						.reduce((s, q) => s + Number(q.lastAttempt?.totalScore ?? 0), 0) / graded
				).toFixed(1)
			: '0.0';

	const avgNum = Number.parseFloat(avgScore);
	const safeAvgNum = Number.isFinite(avgNum) ? Math.max(0, Math.min(10, avgNum)) : 0;
	const avgPct = Math.round((safeAvgNum / 10) * 100);

	const classmates = (studentsResponse?.data ?? []).filter((u: any) => String(u?.role ?? '').toUpperCase() === 'STUDENT');
	const classmatesCount = classmates.length || classData.studentCount || 0;

	return (
		<div>
			<h1 className="text-2xl font-bold text-foreground">{classData.name}</h1>
			<p className="text-muted-foreground italic text-sm">
				{classData.subject} – {classData.grade}
			</p>

			{/* Stats row */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
				{[
					{
						icon: ClipboardList,
						value: String(total),
						label: 'Total Quizzes',
						bgColor: 'bg-teachify-green/15',
						textColor: 'text-teachify-green',
					},
					{
						icon: CheckCircle,
						value: String(completedOrGraded),
						label: 'Completed',
						bgColor: 'bg-success/15',
						textColor: 'text-success',
					},
					{
						icon: TrendingUp,
						value: `${progressPct}%`,
						label: 'Progress',
						bgColor: 'bg-primary/15',
						textColor: 'text-primary',
					},
					{
						icon: AlertTriangle,
						value: '0',
						label: 'Needs Attention',
						bgColor: 'bg-warning/15',
						textColor: 'text-warning',
					},
					{
						icon: BarChart3,
						value: avgScore,
						label: 'Avg. Grade',
						bgColor: 'bg-teachify-purple/15',
						textColor: 'text-teachify-purple',
					},
				].map((stat) => (
					<div key={stat.label} className="bg-card rounded-xl border border-border p-4">
						<div className="flex items-center gap-2">
							<div
								className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}
							>
								<stat.icon className={`w-4 h-4 ${stat.textColor}`} />
							</div>
							<div>
								<p className="text-xl font-bold text-foreground">{stat.value}</p>
								<p className="text-xs text-muted-foreground">{stat.label}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Teacher info */}
			<div className="bg-card rounded-xl border border-border p-5 mt-6">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4 text-muted-foreground" />
						<h2 className="font-bold text-foreground">Teacher</h2>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground font-bold text-sm">
						{teacherInitial}
					</div>
					<div>
						<p className="font-semibold text-foreground">{classData.teacherName}</p>
						<p className="text-xs text-muted-foreground">Teacher</p>
					</div>
				</div>
			</div>

			{/* Classmates */}
			<div className="bg-card rounded-xl border border-border p-5 mt-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4 text-muted-foreground" />
						<h2 className="font-bold text-foreground">Classmates</h2>
					</div>
					<span className="text-xs text-muted-foreground">{classmatesCount} students</span>
				</div>

				{isStudentsLoading ? (
					<p className="text-sm text-muted-foreground">Loading classmates...</p>
				) : classmates.length === 0 ? (
					<p className="text-sm text-muted-foreground">No classmates data available.</p>
				) : (
					<div className="space-y-2 max-h-36 overflow-auto pr-1">
						{classmates.slice(0, 12).map((u: any) => {
							const name = u?.studentName ?? u?.user_name ?? u?.userName ?? 'Student';
							const initial = String(name).charAt(0) || 'S';
							return (
								<div key={u?.studentId ?? u?.userId ?? name} className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground font-bold text-xs">
										{initial}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium text-foreground truncate">{name}</p>
										{u?.email ? <p className="text-xs text-muted-foreground truncate">{u.email}</p> : null}
									</div>
								</div>
							);
						})}

						{classmates.length > 12 ? (
							<p className="text-xs text-muted-foreground pt-1">+{classmates.length - 12} more</p>
						) : null}
					</div>
				)}
			</div>

			{/* My Progress */}
			<div className="bg-card rounded-xl border border-border p-5 mt-4">
				<div className="flex items-center gap-2 mb-4">
					<TrendingUp className="w-4 h-4 text-muted-foreground" />
					<h2 className="font-bold text-foreground">Learning Progress</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Assignments Completed</span>
							<span className="text-sm font-semibold text-foreground">
								{completedOrGraded}/{total}
							</span>
						</div>
						<div className="h-2.5 bg-secondary rounded-full overflow-hidden">
							<div
								className="h-full bg-primary rounded-full transition-all duration-500"
								style={{ width: `${progressPct}%` }}
							/>
						</div>
						<p className="text-sm font-semibold text-foreground mt-1">{progressPct}%</p>
					</div>

					<div>
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Avg. Grade</span>
							<span className="text-sm font-semibold text-foreground">{avgScore}</span>
						</div>
						<div className="h-2.5 bg-secondary rounded-full overflow-hidden">
							<div
								className="h-full bg-success rounded-full transition-all duration-500"
								style={{ width: `${avgPct}%` }}
							/>
						</div>
						<p className="text-sm font-semibold text-foreground mt-1">{safeAvgNum.toFixed(1)}/10</p>
					</div>
				</div>
			</div>

			{/* Bottom row */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
				{/* To-do */}
				<div className="bg-card rounded-xl border border-border p-5">
					<div className="flex items-center gap-2 mb-3">
						<Clock className="w-4 h-4 text-warning" />
						<h2 className="font-bold text-foreground">To-Do</h2>
					</div>
					<div className="space-y-3">
						{list
							.filter((q) => {
								const a = q.lastAttempt;
								const status = String(a?.status ?? '').toUpperCase();
								const isDone =
									!!a?.submittedAt ||
									a?.totalScore != null ||
									status.includes('SUBMITTED') ||
									status.includes('GRADED');
								return !isDone;
							})
							.sort((a, b) => {
								const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
								const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
								return ad - bd;
							})
							.slice(0, 3)
							.map((q) => {
								const dueLabel = formatDueLabel(q.dueDate);
								const isPastDue = q.dueDate ? new Date(q.dueDate).getTime() < Date.now() : false;
								return (
									<div
										key={q.id}
										className={`flex items-center gap-3 p-2 rounded-lg ${isPastDue ? 'bg-warning/5 border border-warning/20' : ''}`}
									>
										{isPastDue ? (
											<AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
										) : (
											<Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
										)}
										<p
											className={`text-sm ${isPastDue ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
										>
											{q.title}
											{dueLabel ? ` – Due: ${dueLabel}` : ''}
										</p>
									</div>
								);
							})}

						{list.filter((q) => {
							const a = q.lastAttempt;
							const status = String(a?.status ?? '').toUpperCase();
							const isDone =
								!!a?.submittedAt ||
								a?.totalScore != null ||
								status.includes('SUBMITTED') ||
								status.includes('GRADED');
							return !isDone;
						}).length === 0 && (
							<p className="text-sm text-muted-foreground">No pending assignments.</p>
						)}
					</div>
				</div>

				{/* Recent Grades */}
				<div className="bg-card rounded-xl border border-border p-5">
					<div className="flex items-center gap-2 mb-3">
						<FileText className="w-4 h-4 text-teachify-blue" />
						<h2 className="font-bold text-foreground">Recent Grades</h2>
					</div>
					<div className="space-y-3">
						{list
							.filter((q) => q.lastAttempt?.totalScore != null)
							.sort((a, b) => {
								const at = a.lastAttempt?.submittedAt
									? new Date(a.lastAttempt.submittedAt).getTime()
									: 0;
								const bt = b.lastAttempt?.submittedAt
									? new Date(b.lastAttempt.submittedAt).getTime()
									: 0;
								return bt - at;
							})
							.slice(0, 3)
							.map((q) => {
								const score = Number(q.lastAttempt?.totalScore ?? 0).toFixed(1);
								const scoreNum = Number(q.lastAttempt?.totalScore ?? 0);
								const color =
									scoreNum >= 8 ? 'text-success' : scoreNum >= 5 ? 'text-primary' : 'text-warning';
								const status = String(q.lastAttempt?.status ?? '').toUpperCase();
								const isLate = status.includes('LATE');
								return (
									<div key={q.id} className="flex items-center justify-between">
										<p className="text-sm text-foreground">
											{q.title}
											{isLate ? (
												<span className="ml-2 text-xs text-warning font-semibold">(Late)</span>
											) : null}
										</p>
										<span className={`text-sm font-bold ${color}`}>{score}</span>
									</div>
								);
							})}

						{list.filter((q) => q.lastAttempt?.totalScore != null).length === 0 && (
							<p className="text-sm text-muted-foreground">No graded submissions yet.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseOverview;
