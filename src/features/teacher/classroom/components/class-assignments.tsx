'use client';

import {
	AlertCircle,
	Award,
	Calendar,
	CheckCircle2,
	Clock,
	Edit,
	Eye,
	FileText,
	FolderOpen,
	HelpCircle,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { type ClassData, getAssignmentsForClass } from '@/lib/mock-data';

interface ClassAssignmentsProps {
	classData: ClassData;
}

const typeIcons = {
	homework: FileText,
	quiz: HelpCircle,
	project: FolderOpen,
	exam: Award,
};

const typeColors = {
	homework: '#A8D5BA',
	quiz: '#F5B041',
	project: '#C5B4E3',
	exam: '#E57373',
};

export default function ClassAssignments({ classData }: ClassAssignmentsProps) {
	const assignments = getAssignmentsForClass(classData.id);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterType, setFilterType] = useState<'all' | 'homework' | 'quiz' | 'project' | 'exam'>(
		'all',
	);
	const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'past-due' | 'graded'>('all');

	const filteredAssignments = assignments.filter((assignment) => {
		const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = filterType === 'all' || assignment.type === filterType;
		const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
		return matchesSearch && matchesType && matchesStatus;
	});

	const activeAssignments = filteredAssignments.filter((a) => a.status === 'active');
	const pastAssignments = filteredAssignments.filter((a) => a.status !== 'active');

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">Assignments</h1>
					<p className="font-serif text-lg text-[#666]">{assignments.length} total assignments</p>
				</div>
				<Button className="bg-[#F5B041] hover:bg-[#E5A030] text-[#333] font-semibold rounded-xl">
					<Plus className="w-4 h-4 mr-2" />
					Create Assignment
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col lg:flex-row gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
					<Input
						placeholder="Search assignments..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					{(['all', 'homework', 'quiz', 'project', 'exam'] as const).map((type) => {
						const Icon = type === 'all' ? FileText : typeIcons[type];
						return (
							<button
								type="button"
								key={type}
								onClick={() => setFilterType(type)}
								className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
									filterType === type
										? type === 'all'
											? 'bg-[#333] text-white'
											: `bg-[${typeColors[type]}] text-[#333]`
										: 'bg-white text-[#666] border border-[#E0DCD5] hover:bg-[#F0EDE8]'
								}`}
								style={
									filterType === type && type !== 'all'
										? { backgroundColor: typeColors[type] }
										: undefined
								}
							>
								<Icon className="w-4 h-4" />
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</button>
						);
					})}
				</div>

				<div className="flex gap-2">
					{(['all', 'active', 'graded'] as const).map((status) => (
						<button
							type="button"
							key={status}
							onClick={() => setFilterStatus(status)}
							className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
								filterStatus === status
									? 'bg-[#A8D4E6] text-[#333]'
									: 'bg-white text-[#666] border border-[#E0DCD5] hover:bg-[#F0EDE8]'
							}`}
						>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* Active Assignments */}
			{activeAssignments.length > 0 && (
				<div className="space-y-4">
					<h2 className="font-sans font-semibold text-sm text-[#666] uppercase tracking-wide flex items-center gap-2">
						<Clock className="w-4 h-4" />
						Active Assignments
					</h2>
					<div className="grid lg:grid-cols-2 gap-4">
						{activeAssignments.map((assignment, index) => (
							<AssignmentCard key={assignment.id} assignment={assignment} index={index} />
						))}
					</div>
				</div>
			)}

			{/* Past Assignments */}
			{pastAssignments.length > 0 && (
				<div className="space-y-4">
					<h2 className="font-sans font-semibold text-sm text-[#666] uppercase tracking-wide flex items-center gap-2">
						<CheckCircle2 className="w-4 h-4" />
						Completed & Graded
					</h2>
					<div className="grid lg:grid-cols-2 gap-4">
						{pastAssignments.map((assignment, index) => (
							<AssignmentCard key={assignment.id} assignment={assignment} index={index} />
						))}
					</div>
				</div>
			)}

			{filteredAssignments.length === 0 && (
				<div className="text-center py-16">
					<FileText className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No assignments found.</p>
					<p className="text-sm text-[#999]">
						Try adjusting your filters or create a new assignment.
					</p>
				</div>
			)}
		</div>
	);
}

interface AssignmentCardProps {
	assignment: {
		id: string;
		title: string;
		description: string;
		dueDate: string;
		totalPoints: number;
		submissionCount: number;
		totalStudents: number;
		type: 'homework' | 'quiz' | 'project' | 'exam';
		status: 'active' | 'past-due' | 'graded';
	};
	index: number;
}

function AssignmentCard({ assignment, index }: AssignmentCardProps) {
	const Icon = typeIcons[assignment.type];
	const color = typeColors[assignment.type];
	const submissionRate = Math.round((assignment.submissionCount / assignment.totalStudents) * 100);
	const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'active';

	return (
		<div
			className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5] hover:shadow-md transition-shadow"
			style={{ transform: `rotate(${index % 2 === 0 ? -0.3 : 0.3}deg)` }}
		>
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-3">
					<div
						className="w-10 h-10 rounded-xl flex items-center justify-center"
						style={{ backgroundColor: `${color}30` }}
					>
						<Icon className="w-5 h-5" style={{ color }} />
					</div>
					<div>
						<h3 className="font-sans font-semibold text-[#333]">{assignment.title}</h3>
						<p className="text-xs text-[#999] capitalize">{assignment.type}</p>
					</div>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreHorizontal className="w-4 h-4 text-[#666]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="rounded-xl">
						<DropdownMenuItem>
							<Eye className="w-4 h-4 mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Edit className="w-4 h-4 mr-2" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem className="text-[#E57373]">
							<Trash2 className="w-4 h-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<p className="text-sm text-[#666] mb-4 line-clamp-2">{assignment.description}</p>

			<div className="flex items-center justify-between text-sm mb-4">
				<div className="flex items-center gap-1.5 text-[#666]">
					<Calendar className="w-4 h-4" />
					<span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
				</div>
				<span className="font-semibold text-[#333]">{assignment.totalPoints} pts</span>
			</div>

			{/* Submission Progress */}
			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs">
					<span className="text-[#666]">Submissions</span>
					<span className="font-semibold text-[#333]">
						{assignment.submissionCount} / {assignment.totalStudents}
					</span>
				</div>
				<div className="h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
					<div
						className="h-full rounded-full"
						style={{
							width: `${submissionRate}%`,
							backgroundColor: color,
						}}
					/>
				</div>
			</div>

			{/* Status Badge */}
			<div className="mt-4 flex items-center justify-between">
				<span
					className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
						assignment.status === 'graded'
							? 'bg-[#A8D5BA]/20 text-[#2E7D32]'
							: isOverdue
								? 'bg-[#E57373]/20 text-[#C62828]'
								: 'bg-[#A8D4E6]/20 text-[#1565C0]'
					}`}
				>
					{assignment.status === 'graded' && <CheckCircle2 className="w-3 h-3" />}
					{isOverdue && <AlertCircle className="w-3 h-3" />}
					{assignment.status === 'active' && !isOverdue && <Clock className="w-3 h-3" />}
					{assignment.status === 'graded' ? 'Graded' : isOverdue ? 'Overdue' : 'Active'}
				</span>

				{assignment.status === 'active' && (
					<Button variant="outline" size="sm" className="rounded-xl text-xs bg-transparent">
						View Submissions
					</Button>
				)}
			</div>
		</div>
	);
}
