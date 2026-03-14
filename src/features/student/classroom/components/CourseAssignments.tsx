import { AlertTriangle, CheckCircle, ClipboardList, Clock } from 'lucide-react';

const assignments = [
	{
		id: 1,
		title: 'Chapter 5 Assignment',
		dueDate: 'Today',
		status: 'pending' as const,
		score: null,
	},
	{
		id: 2,
		title: 'Chapter 4 Assignment',
		dueDate: 'Mar 10, 2026',
		status: 'graded' as const,
		score: 9.0,
	},
	{
		id: 3,
		title: '15-Minute Quiz',
		dueDate: 'Mar 05, 2026',
		status: 'graded' as const,
		score: 8.0,
	},
	{
		id: 4,
		title: 'Chapter 3 Assignment',
		dueDate: 'Feb 28, 2026',
		status: 'graded' as const,
		score: 8.5,
	},
	{
		id: 5,
		title: 'Chapter 2 Assignment',
		dueDate: 'Feb 20, 2026',
		status: 'submitted' as const,
		score: null,
	},
	{
		id: 6,
		title: 'Chapter 1 Assignment',
		dueDate: 'Feb 10, 2026',
		status: 'graded' as const,
		score: 9.5,
	},
];

const statusConfig = {
	pending: { label: 'Not Submitted', icon: AlertTriangle, className: 'bg-warning/15 text-warning' },
	submitted: { label: 'Submitted', icon: Clock, className: 'bg-primary/15 text-primary' },
	graded: { label: 'Graded', icon: CheckCircle, className: 'bg-success/15 text-success' },
};

const CourseAssignments = () => {
	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-bold text-foreground">Assignments</h2>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<ClipboardList className="w-4 h-4" />
					<span>{assignments.length} assignments</span>
				</div>
			</div>

			<div className="space-y-3">
				{assignments.map((a) => {
					const config = statusConfig[a.status];
					const StatusIcon = config.icon;
					return (
						<div
							key={a.id}
							className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
						>
							<div className="flex items-center gap-3">
								<div
									className={`w-8 h-8 rounded-lg ${config.className.split(' ')[0]} flex items-center justify-center`}
								>
									<StatusIcon className={`w-4 h-4 ${config.className.split(' ')[1]}`} />
								</div>
								<div>
									<p className="font-semibold text-foreground text-sm">{a.title}</p>
									<p className="text-xs text-muted-foreground">Due: {a.dueDate}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<span className={`text-xs px-2.5 py-1 rounded-full ${config.className}`}>
									{config.label}
								</span>
								{a.score !== null && (
									<span className="text-sm font-bold text-success">{a.score}</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CourseAssignments;
