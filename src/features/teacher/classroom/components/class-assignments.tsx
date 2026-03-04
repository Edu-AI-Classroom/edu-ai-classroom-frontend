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
	Loader2,
	MoreHorizontal,
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
import { useToast } from '@/hooks/common/use-toast';
import {
	useAssignmentsByClassroom,
	useCreateAssignment,
	useUpdateAssignment,
	useDeleteAssignment,
} from '@/hooks/queries/assignment/use-assignment-query';
import type { ClassroomUiData } from '../classroom.mapper';
import { CreateAssignmentDialog } from './create-assignment-dialog';
import { AssignmentDetailModal } from './assignment-detail-modal';
import type { Assignment } from '@/types/class';

interface ClassAssignmentsProps {
	classData: ClassroomUiData;
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

type AssignmentStatus = 'PUBLISHED' | 'OVERDUE' | 'GRADED';

function getUiStatus(assignment: Assignment): AssignmentStatus {
	if (assignment.status === 'graded' || assignment.status === 'archived') {
		return 'GRADED';
	}

	const due = assignment.dueDate ? new Date(assignment.dueDate) : new Date(assignment.updatedAt);
	const now = new Date();

	// if (due < now) {
	// 	return 'OVERDUE';
	// }

	return 'PUBLISHED';
}

export default function ClassAssignments({ classData }: ClassAssignmentsProps) {
	const classId = typeof classData.id === 'string' ? parseInt(classData.id, 10) : classData.id;
	const { data: assignmentsResponse, isLoading, error: queryError } =
		useAssignmentsByClassroom(classId);
	const createMutation = useCreateAssignment(classId);
	const updateMutation = useUpdateAssignment(classId);
	const deleteMutation = useDeleteAssignment(classId);
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState('');
	const [filterType, setFilterType] = useState<'all' | 'homework' | 'quiz' | 'project' | 'exam'>(
		'all',
	);
	const [filterStatus, setFilterStatus] = useState<AssignmentStatus | 'ALL'>('ALL');
	const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	const assignments = (Array.isArray(assignmentsResponse) ? assignmentsResponse : []) as Assignment[];

	const mappedAssignments = assignments.map((assignment) => {
		const uiStatus = getUiStatus(assignment);
		return {
			raw: assignment,
			id: String(assignment.docId),
			title: assignment.docTitle,
			description: assignment.note || 'No description',
			dueDate: assignment.dueDate || assignment.updatedAt,
			totalPoints: 100,
			submissionCount: 0,
			totalStudents: 0,
			type: 'homework' as const,
			status: uiStatus,
		};
	});

	const filteredAssignments = mappedAssignments.filter((assignment) => {
		const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = filterType === 'all' || assignment.type === filterType;
		const matchesStatus = filterStatus === 'ALL' || assignment.status === filterStatus;
		return matchesSearch && matchesType && matchesStatus;
	});

	const handleCreateAssignment = async (payload: {
		title: string;
		note?: string;
		gradeLevel?: number;
		subjectId?: number;
		classId: number;
	}) => {
		try {
			await createMutation.mutateAsync(payload);
			toast({
				title: 'Success',
				description: 'Assignment created successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create assignment',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteAssignment = async (assignmentId: string) => {
		if (!confirm('Delete this assignment?')) return;

		try {
			await deleteMutation.mutateAsync(parseInt(assignmentId));
			toast({
				title: 'Success',
				description: 'Assignment deleted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete assignment',
				variant: 'destructive',
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin text-[#F5B041] mx-auto mb-3" />
					<p className="text-gray-600">Loading assignments...</p>
				</div>
			</div>
		);
	}

	if (queryError) {
		return (
			<div className="space-y-6">
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
					<div>
						<h3 className="font-semibold mb-1">Failed to load assignments</h3>
						<p className="text-sm">{String(queryError)}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">Assignments</h1>
					<p className="font-serif text-lg text-[#666]">
						{mappedAssignments.length} total assignments
					</p>
				</div>
				<CreateAssignmentDialog
					onSubmit={handleCreateAssignment}
					classId={classId}
					isLoading={createMutation.isPending}
				/>
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
								className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${filterType === type
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
					{(['ALL', 'PUBLISHED', 'OVERDUE', 'GRADED'] as const).map((status) => (
						<button
							type="button"
							key={status}
							onClick={() => setFilterStatus(status)}
							className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
								? status === 'PUBLISHED'
									? 'bg-[#A8D4E6] text-[#1565C0]'
									: status === 'OVERDUE'
										? 'bg-[#FEE2E2] text-[#B91C1C]'
										: status === 'GRADED'
											? 'bg-[#DCFCE7] text-[#166534]'
											: 'bg-[#333] text-white'
								: 'bg-white text-[#666] border border-[#E0DCD5] hover:bg-[#F0EDE8]'
								}`}
						>
							{status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
						</button>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<div className="grid lg:grid-cols-2 gap-4">
					{filteredAssignments.map((assignment, index) => (
						<AssignmentCard
							key={assignment.id}
							assignment={assignment}
							index={index}
							onViewDetails={() => {
								setSelectedAssignmentId(assignment.raw.docId);
								setIsDetailOpen(true);
							}}
							onDelete={() => handleDeleteAssignment(assignment.id)}
							isUpdating={updateMutation.isPending}
							isDeleting={deleteMutation.isPending}
						/>
					))}
				</div>
			</div>

			{filteredAssignments.length === 0 && (
				<div className="text-center py-16">
					<FileText className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No assignments found.</p>
					<p className="text-sm text-[#999]">
						Try adjusting your filters or create a new assignment.
					</p>
				</div>
			)}
			{selectedAssignmentId !== null && (
				<AssignmentDetailModal
					open={isDetailOpen}
					onOpenChange={(open) => {
						setIsDetailOpen(open);
						if (!open) {
							setSelectedAssignmentId(null);
						}
					}}
					assignmentId={selectedAssignmentId}
				/>
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
		status: AssignmentStatus;
	};
	index: number;
	onViewDetails: () => void;
	onDelete: () => void;
	isUpdating: boolean;
	isDeleting: boolean;
}

function AssignmentCard({
	assignment,
	index,
	onViewDetails,
	onDelete,
	isUpdating,
	isDeleting,
}: AssignmentCardProps) {
	const Icon = typeIcons[assignment.type];
	const color = typeColors[assignment.type];
	const submissionRate = Math.round((assignment.submissionCount / assignment.totalStudents) * 100);
	const isOverdue = assignment.status === 'OVERDUE';

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
						<DropdownMenuItem onClick={onViewDetails}>
							<Eye className="w-4 h-4 mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete} disabled={isDeleting} className="text-[#E57373]">
							<Trash2 className="w-4 h-4 mr-2" />
							{isDeleting ? 'Deleting...' : 'Delete'}
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
					className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${assignment.status === 'GRADED'
						? 'bg-[#DCFCE7] text-[#166534]'
						: assignment.status === 'OVERDUE'
							? 'bg-[#FEE2E2] text-[#B91C1C]'
							: 'bg-[#DBEAFE] text-[#1D4ED8]'
						}`}
				>
					{assignment.status === 'GRADED' && <CheckCircle2 className="w-3 h-3" />}
					{assignment.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
					{assignment.status === 'PUBLISHED' && <Clock className="w-3 h-3" />}
					{assignment.status}
				</span>

				{assignment.status === 'PUBLISHED' && (
					<Button variant="outline" size="sm" className="rounded-xl text-xs bg-transparent">
						View Submissions
					</Button>
				)}
			</div>
		</div>
	);
}
