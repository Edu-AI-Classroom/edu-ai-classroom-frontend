'use client';

import {
	AlertTriangle,
	Award,
	CheckCircle,
	Mail,
	MoreHorizontal,
	Plus,
	Search,
	User,
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
import { type ClassData, getStudentsForClass } from '@/lib/mock-data';

interface ClassStudentsProps {
	classData: ClassData;
}

export default function ClassStudents({ classData }: ClassStudentsProps) {
	const students = getStudentsForClass(classData.id);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<
		'all' | 'excellent' | 'on-track' | 'needs-attention'
	>('all');

	const filteredStudents = students.filter((student) => {
		const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const statusCounts = {
		all: students.length,
		excellent: students.filter((s) => s.status === 'excellent').length,
		'on-track': students.filter((s) => s.status === 'on-track').length,
		'needs-attention': students.filter((s) => s.status === 'needs-attention').length,
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">Students</h1>
					<p className="font-serif text-lg text-[#666]">{students.length} students enrolled</p>
				</div>
				<Button className="bg-[#F5B041] hover:bg-[#E5A030] text-[#333] font-semibold rounded-xl">
					<Plus className="w-4 h-4 mr-2" />
					Add Student
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
					<Input
						placeholder="Search students..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					{(['all', 'excellent', 'on-track', 'needs-attention'] as const).map((status) => (
						<button
							type="button"
							key={status}
							onClick={() => setFilterStatus(status)}
							className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
								filterStatus === status
									? status === 'excellent'
										? 'bg-[#A8D5BA] text-[#333]'
										: status === 'on-track'
											? 'bg-[#A8D4E6] text-[#333]'
											: status === 'needs-attention'
												? 'bg-[#E57373] text-white'
												: 'bg-[#F5B041] text-[#333]'
									: 'bg-white text-[#666] border border-[#E0DCD5] hover:bg-[#F0EDE8]'
							}`}
						>
							{status === 'all'
								? 'All'
								: status === 'excellent'
									? 'Excellent'
									: status === 'on-track'
										? 'On Track'
										: 'Needs Attention'}
							<span className="ml-1.5 text-xs opacity-80">({statusCounts[status]})</span>
						</button>
					))}
				</div>
			</div>

			{/* Student Grid */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredStudents.map((student, index) => (
					<div
						key={student.id}
						className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5] hover:shadow-md transition-shadow"
						style={{ transform: `rotate(${((index % 3) - 1) * 0.3}deg)` }}
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
									{student.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</div>
								<div>
									<h3 className="font-sans font-semibold text-[#333]">{student.name}</h3>
									<p className="text-xs text-[#666]">{student.email}</p>
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
										<User className="w-4 h-4 mr-2" />
										View Profile
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Mail className="w-4 h-4 mr-2" />
										Send Message
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Status Badge */}
						<div className="mb-4">
							<span
								className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
									student.status === 'excellent'
										? 'bg-[#A8D5BA]/20 text-[#2E7D32]'
										: student.status === 'on-track'
											? 'bg-[#A8D4E6]/20 text-[#1565C0]'
											: 'bg-[#E57373]/20 text-[#C62828]'
								}`}
							>
								{student.status === 'excellent' && <Award className="w-3 h-3" />}
								{student.status === 'on-track' && <CheckCircle className="w-3 h-3" />}
								{student.status === 'needs-attention' && <AlertTriangle className="w-3 h-3" />}
								{student.status === 'excellent'
									? 'Excellent'
									: student.status === 'on-track'
										? 'On Track'
										: 'Needs Attention'}
							</span>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-2 text-center">
							<div className="p-2 rounded-xl bg-[#FAF9F6]">
								<p className="font-sans font-bold text-lg text-[#333]">{student.attendance}%</p>
								<p className="text-xs text-[#666]">Attendance</p>
							</div>
							<div className="p-2 rounded-xl bg-[#FAF9F6]">
								<p className="font-sans font-bold text-lg text-[#333]">{student.averageGrade}%</p>
								<p className="text-xs text-[#666]">Avg Grade</p>
							</div>
							<div className="p-2 rounded-xl bg-[#FAF9F6]">
								<p className="font-sans font-bold text-lg text-[#333]">{student.submissionRate}%</p>
								<p className="text-xs text-[#666]">Submitted</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredStudents.length === 0 && (
				<div className="text-center py-16">
					<Search className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No students found.</p>
					<p className="text-sm text-[#999]">Try adjusting your search or filters.</p>
				</div>
			)}
		</div>
	);
}
