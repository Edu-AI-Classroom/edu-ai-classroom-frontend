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
import { useStudentQuizList } from '@/hooks/queries/quiz/use-student-quiz-query';

interface CourseOverviewProps {
	classData: ClassroomUiData;
}

const CourseOverview = ({ classData }: CourseOverviewProps) => {
	const teacherInitial = classData.teacherName ? classData.teacherName.charAt(0) : 'T';
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: quizzes } = useStudentQuizList({ classId });

	const list = Array.isArray(quizzes) ? quizzes : [];
	const total = list.length;
	const completed = list.filter((q) => String(q.lastAttempt?.status ?? '').toUpperCase() === 'SUBMITTED').length;
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

			{/* My Progress */}
			<div className="bg-card rounded-xl border border-border p-5 mt-4">
				<div className="flex items-center gap-2 mb-4">
					<TrendingUp className="w-4 h-4 text-muted-foreground" />
					<h2 className="font-bold text-foreground">Learning Progress</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[
						{ label: 'Assignments Completed', value: 67, color: 'bg-primary' },
						{ label: 'Average Grade', value: 85, color: 'bg-success' },
						{ label: 'Class Participation', value: 92, color: 'bg-teachify-purple' },
					].map((bar) => (
						<div key={bar.label}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-muted-foreground">{bar.label}</span>
							</div>
							<div className="h-2.5 bg-secondary rounded-full overflow-hidden">
								<div
									className={`h-full ${bar.color} rounded-full transition-all duration-500`}
									style={{ width: `${bar.value}%` }}
								/>
							</div>
							<p className="text-sm font-semibold text-foreground mt-1">{bar.value}%</p>
						</div>
					))}
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
						<div className="flex items-center gap-3 p-2 rounded-lg bg-warning/5 border border-warning/20">
							<AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
							<p className="text-sm font-medium text-foreground">
								Chapter 5 Assignment – Due: Today
							</p>
						</div>
						<div className="flex items-center gap-3 p-2 rounded-lg">
							<Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
							<p className="text-sm text-muted-foreground">Midterm Review – Mar 20</p>
						</div>
					</div>
				</div>

				{/* Recent Grades */}
				<div className="bg-card rounded-xl border border-border p-5">
					<div className="flex items-center gap-2 mb-3">
						<FileText className="w-4 h-4 text-teachify-blue" />
						<h2 className="font-bold text-foreground">Recent Grades</h2>
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm text-foreground">Chapter 4 Assignment</p>
							<span className="text-sm font-bold text-success">9.0</span>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-sm text-foreground">15-Minute Quiz</p>
							<span className="text-sm font-bold text-primary">8.0</span>
						</div>
						<div className="flex items-center justify-between">
							<p className="text-sm text-foreground">Chapter 3 Assignment</p>
							<span className="text-sm font-bold text-success">8.5</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseOverview;
