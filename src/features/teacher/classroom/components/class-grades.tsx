'use client';

import { AlertTriangle, CheckCircle2, Clock, Download, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClassGradebook } from '@/hooks/queries/gradebook/use-gradebook-query';
import type { ClassroomUiData } from '../classroom.mapper';

interface ClassGradesProps {
	classData: ClassroomUiData;
}

type StudentStatus = 'on-track' | 'excellent' | 'needs-attention';

export default function ClassGrades({ classData }: ClassGradesProps) {
	const classId = typeof classData.id === 'string' ? Number(classData.id) : classData.id;
	const { data: gradebook, isLoading, isError } = useClassGradebook(classId);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<'none' | 'highest' | 'lowest'>('none');

	const quizzes = gradebook?.quizzes ?? [];
	const rows = gradebook?.rows ?? [];

	const filteredRows = useMemo(() => {
		const filtered = rows.filter((r) =>
			(r.student?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
		);

		if (sortBy === 'none') return filtered;

		const dir = sortBy === 'highest' ? -1 : 1;
		return [...filtered].sort((a, b) => {
			const av = a.averageScore;
			const bv = b.averageScore;
			if (av == null && bv == null) return 0;
			if (av == null) return 1; // nulls last
			if (bv == null) return -1;
			return dir * (av - bv);
		});
	}, [rows, searchQuery, sortBy]);

	const getStudentStatus = (avg: number | null): StudentStatus => {
		if (avg == null) return 'on-track';
		if (avg > 8) return 'excellent';
		if (avg < 4) return 'needs-attention';
		return 'on-track';
	};

	const handleExportExcel = () => {
		const headers = ['Student', 'Email', ...quizzes.map((q) => q.title), 'Average'];

		const data = filteredRows.map((r) => {
			const row: Record<string, string | number> = {
				Student: r.student?.name ?? '',
				Email: r.student?.email ?? '',
			};

			for (const q of quizzes) {
				const cell = r.grades?.[q.id];
				const score = cell?.totalScore ?? null;
				const status = String(cell?.status ?? '').toUpperCase();
				const isLate = status.includes('LATE');

				row[q.title] = score != null ? `${score}${isLate ? ' (Late)' : ''}` : cell?.submittedAt ? 'Submitted' : '';
			}

			row.Average = r.averageScore ?? '';
			return row;
		});

		const ws = XLSX.utils.json_to_sheet(data, { header: headers });
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Gradebook');

		const fileName = `gradebook-class-${classId}.xlsx`;
		const array = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([array], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">Gradebook</h1>
					<p className="font-serif text-lg text-[#666]">
						{rows.length} students, {quizzes.length} assignments
					</p>
				</div>
				<div className="flex gap-2">

					<Button
						variant="outline"
						className="rounded-xl bg-transparent"
						onClick={handleExportExcel}
						disabled={filteredRows.length === 0}
					>
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{/* Search */}
			<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
				<div className="relative max-w-sm w-full">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
					<Input
						placeholder="Search students..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
					/>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm text-[#666] font-semibold">Sort:</span>
					<select
						value={sortBy}
						onChange={(e) => {
							const v = e.target.value;
							if (v === 'none' || v === 'highest' || v === 'lowest') setSortBy(v);
						}}
						className="rounded-xl border border-[#E0DCD5] bg-white px-3 py-2 text-sm text-[#333] outline-none"
					>
						<option value="none">Default</option>
						<option value="highest">Highest average</option>
						<option value="lowest">Lowest average</option>
					</select>
				</div>
			</div>

			{isLoading && <div className="text-sm text-[#666]">Loading gradebook...</div>}
			{isError && <div className="text-sm text-red-600">Failed to load gradebook.</div>}

			{/* Grade Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-[#E0DCD5] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#E0DCD5] bg-[#FAF9F6]">
								<th className="text-left p-4 font-sans font-semibold text-[#333] sticky left-0 bg-[#FAF9F6] min-w-50">
									Student
								</th>
								{quizzes.map((quiz) => (
									<th
										key={quiz.id}
										className="text-center p-4 font-sans font-semibold text-[#333] min-w-30"
									>
										<div className="flex flex-col items-center gap-1">
											<span className="text-sm truncate max-w-25" title={quiz.title}>
												{quiz.title}
											</span>
											<span className="text-xs text-[#999] font-normal">
												{quiz.documentType}
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
							{filteredRows.map((row, index) => {
								const student = row.student;
								const average = row.averageScore;
								const status = getStudentStatus(average);
								const initials = (student.name ?? '')
									.split(' ')
									.map((n) => n[0])
									.join('');

								return (
									<tr
										key={student.id}
										className={`border-b border-[#E0DCD5] ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAF9F6]/50'}`}
									>
										<td className="p-4 sticky left-0 bg-inherit">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white text-xs font-semibold shrink-0">
													{initials}
												</div>
												<div>
													<p className="font-semibold text-sm text-[#333]">{student.name}</p>
													<span
														className={`text-xs ${status === 'excellent'
															? 'text-[#2E7D32]'
															: status === 'needs-attention'
																? 'text-[#C62828]'
																: 'text-[#666]'
															}`}
													>
														{status === 'excellent'
															? 'Excellent'
															: status === 'needs-attention'
																? 'Needs Attention'
																: 'On Track'}
													</span>
												</div>
											</div>
										</td>
										{quizzes.map((quiz) => {
											const cell = row.grades?.[quiz.id];
											const score = cell?.totalScore ?? null;
											const submitted = !!cell?.submittedAt;
											const isGraded = score != null;
											const normalizedStatus = String(cell?.status ?? '').toUpperCase();
											const isLate = normalizedStatus.includes('LATE');
											return (
												<td key={quiz.id} className="p-4 text-center">
													{submitted ? (
														<div className="flex flex-col items-center gap-1">
															{isLate && (
																<span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C62828]">
																	<AlertTriangle className="w-3.5 h-3.5 text-[#E57373]" />
																	Late Submission
																</span>
															)}
															{isGraded ? (
																<span className="inline-flex items-center gap-2">
																	<span className="font-semibold text-[#333]">{score}</span>
																	{/* Don't show the "graded check" icon for late submissions */}
																	{!isLate && <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />}
																</span>
															) : (
																<span className="inline-flex items-center gap-2">
																	<span className="text-xs text-[#F5B041]">Pending</span>
																	<Clock className="w-4 h-4 text-[#F5B041]" />
																</span>
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
												{average ?? '-'}
											</span>
										</td>
									</tr>
								);
							})}
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

			{filteredRows.length === 0 && (
				<div className="text-center py-16">
					<Search className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
					<p className="text-[#666] font-serif text-lg">No students found.</p>
				</div>
			)}
		</div>
	);
}
