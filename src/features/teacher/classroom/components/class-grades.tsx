'use client';

import { AlertTriangle, CheckCircle2, Clock, Download, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClassStudents } from '@/hooks/queries/class/use-class-query';
import type { ClassroomUiData } from '../classroom.mapper';

interface ClassGradesProps {
	classData: ClassroomUiData;
}

type StudentStatus = 'on-track' | 'excellent' | 'needs-attention';

interface Student {
	id: string | number;
	name: string;
	status: StudentStatus;
	averageGrade: number;
}

export default function ClassGrades({ classData }: ClassGradesProps) {
	const { data: studentsResponse } = useClassStudents(classData.id);
	const students: Student[] = (studentsResponse?.data ?? []).map((student) => ({
		id: student.userId,
		name: student.userName ?? '',
		status: 'on-track' as StudentStatus,
		averageGrade: 0,
	}));
	const assignments: Array<{ id: string; title: string; totalPoints: number }> = [];
	const submissions: Array<{
		studentId: string;
		assignmentId: string;
		status: 'pending' | 'graded' | 'late';
		grade?: number;
	}> = [];
	const [searchQuery, setSearchQuery] = useState('');

	const filteredStudents = students.filter((student) =>
		(student.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Create a grade matrix
	const getStudentGrade = (studentId: string | number, assignmentId: string) => {
		const submission = submissions.find(
			(s) => String(s.studentId) === String(studentId) && s.assignmentId === assignmentId,
		);
		return submission;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">Gradebook</h1>
					<p className="font-serif text-lg text-[#666]">
						{students.length} students, {assignments.length} assignments
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" className="rounded-xl bg-transparent">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</Button>
					<Button variant="outline" className="rounded-xl bg-transparent">
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{/* Search */}
			<div className="relative max-w-sm">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
				<Input
					placeholder="Search students..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
				/>
			</div>

			{/* Grade Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-[#E0DCD5] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#E0DCD5] bg-[#FAF9F6]">
								<th className="text-left p-4 font-sans font-semibold text-[#333] sticky left-0 bg-[#FAF9F6] min-w-50">
									Student
								</th>
								{assignments.slice(0, 4).map((assignment) => (
									<th
										key={assignment.id}
										className="text-center p-4 font-sans font-semibold text-[#333] min-w-30"
									>
										<div className="flex flex-col items-center gap-1">
											<span className="text-sm truncate max-w-25" title={assignment.title}>
												{assignment.title}
											</span>
											<span className="text-xs text-[#999] font-normal">
												{assignment.totalPoints} pts
											</span>
										</div>
									</th>
								))}
								<th className="text-center p-4 font-sans font-semibold text-[#333] min-w-25 bg-[#F5B041]/10">
									Average
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredStudents.map((student, index) => (
								<tr
									key={student.id}
									className={`border-b border-[#E0DCD5] ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAF9F6]/50'}`}
								>
									<td className="p-4 sticky left-0 bg-inherit">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white text-xs font-semibold shrink-0">
												{student.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</div>
											<div>
												<p className="font-semibold text-sm text-[#333]">{student.name}</p>
												<span
													className={`text-xs ${
														student.status === 'excellent'
															? 'text-[#2E7D32]'
															: student.status === 'needs-attention'
																? 'text-[#C62828]'
																: 'text-[#666]'
													}`}
												>
													{student.status === 'excellent'
														? 'Excellent'
														: student.status === 'needs-attention'
															? 'Needs Attention'
															: 'On Track'}
												</span>
											</div>
										</div>
									</td>
									{assignments.slice(0, 4).map((assignment) => {
										const submission = getStudentGrade(student.id, assignment.id);
										return (
											<td key={assignment.id} className="p-4 text-center">
												{submission ? (
													<div className="flex flex-col items-center gap-1">
														{submission.status === 'graded' && submission.grade !== undefined ? (
															<>
																<span
																	className={`font-semibold ${
																		submission.grade >= assignment.totalPoints * 0.9
																			? 'text-[#2E7D32]'
																			: submission.grade >= assignment.totalPoints * 0.7
																				? 'text-[#333]'
																				: 'text-[#C62828]'
																	}`}
																>
																	{submission.grade}/{assignment.totalPoints}
																</span>
																<CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
															</>
														) : submission.status === 'late' ? (
															<>
																<span className="text-xs text-[#C62828]">Late</span>
																<AlertTriangle className="w-4 h-4 text-[#E57373]" />
															</>
														) : (
															<>
																<span className="text-xs text-[#F5B041]">Pending</span>
																<Clock className="w-4 h-4 text-[#F5B041]" />
															</>
														)}
													</div>
												) : (
													<span className="text-[#999] text-xs">-</span>
												)}
											</td>
										);
									})}
									<td className="p-4 text-center bg-[#F5B041]/10">
										<span className="font-sans font-bold text-lg text-[#333]">
											{student.averageGrade}%
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap items-center gap-6 text-sm text-[#666]">
				<div className="flex items-center gap-2">
					<CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
					<span>Graded</span>
				</div>
				<div className="flex items-center gap-2">
					<Clock className="w-4 h-4 text-[#F5B041]" />
					<span>Pending Review</span>
				</div>
				<div className="flex items-center gap-2">
					<AlertTriangle className="w-4 h-4 text-[#E57373]" />
					<span>Late Submission</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-[#999]">-</span>
					<span>Not Submitted</span>
				</div>
			</div>

			{filteredStudents.length === 0 && (
				<div className="text-center py-16">
					<Search className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No students found.</p>
				</div>
			)}
		</div>
	);
}
