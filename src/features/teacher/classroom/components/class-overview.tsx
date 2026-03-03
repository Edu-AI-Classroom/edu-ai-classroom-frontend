'use client';

import {
	AlertTriangle,
	BarChart3,
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	MessageSquare,
	TrendingUp,
	Users,
} from 'lucide-react';
import type React from 'react';
import { useClassStudents } from '@/hooks/queries/class/use-class-query';
import type { ClassroomUiData } from '../classroom.mapper';

interface ClassOverviewProps {
	classData: ClassroomUiData;
}

export default function ClassOverview({ classData }: ClassOverviewProps) {
	const { data: studentResponse } = useClassStudents(classData.id);
	const students = studentResponse?.data ?? [];

	const stats = {
		totalStudents: classData.studentCount ?? students.length,
		submissionRate: 0,
		needsAttention: 0,
		avgGrade: 0,
		avgAttendance: 0,
	};

	const attentionItems: Array<{
		id: string;
		type: 'meeting' | 'grading' | 'deadline';
		title: string;
		description: string;
		dueDate?: string;
		priority: 'high' | 'medium' | 'low';
	}> = [];

	const recentActivity: Array<{
		id: string;
		studentName: string;
		description: string;
		timestamp: string;
	}> = [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-sans font-bold text-2xl text-[#333]">{classData.name}</h1>
					<p className="font-serif text-lg text-[#666]">
						{classData.subject} - {classData.grade}
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					icon={Users}
					label="Total Students"
					value={stats.totalStudents}
					color="#A8D5BA"
					rotation={-0.5}
				/>
				<StatCard
					icon={CheckCircle2}
					label="Submission Rate"
					value={`${stats.submissionRate}%`}
					color="#F5B041"
					rotation={0.5}
				/>
				<StatCard
					icon={AlertTriangle}
					label="Need Attention"
					value={stats.needsAttention}
					color="#E57373"
					rotation={-0.3}
				/>
				<StatCard
					icon={BarChart3}
					label="Average Grade"
					value={`${stats.avgGrade}%`}
					color="#C5B4E3"
					rotation={0.8}
				/>
			</div>

			{/* Marker-style Stats */}
			<div
				className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
				style={{ transform: 'rotate(-0.3deg)' }}
			>
				<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
					<TrendingUp className="w-5 h-5 text-[#A8D5BA]" />
					Class Performance
				</h2>
				<div className="grid sm:grid-cols-3 gap-6">
					<MarkerStat label="Attendance" value={stats.avgAttendance} color="#A8D5BA" />
					<MarkerStat label="Average Grade" value={stats.avgGrade} color="#F5B041" />
					<MarkerStat label="Engagement" value={85} color="#C5B4E3" />
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Attention Needed Widget */}
				<div
					className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
					style={{ transform: 'rotate(0.3deg)' }}
				>
					<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
						<div className="w-6 h-6 rounded bg-[#E57373]/20 flex items-center justify-center">
							<AlertTriangle className="w-4 h-4 text-[#E57373]" />
						</div>
						Attention Needed
					</h2>

					{attentionItems.length > 0 ? (
						<div className="space-y-3">
							{attentionItems.map((item) => (
								<div
									key={item.id}
									className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E0DCD5]"
								>
									<div
										className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
											item.type === 'meeting'
												? 'bg-[#C5B4E3]/20'
												: item.type === 'grading'
													? 'bg-[#F5B041]/20'
													: 'bg-[#E57373]/20'
										}`}
									>
										{item.type === 'meeting' && <Calendar className="w-4 h-4 text-[#C5B4E3]" />}
										{item.type === 'grading' && <FileText className="w-4 h-4 text-[#F5B041]" />}
										{item.type === 'deadline' && <Clock className="w-4 h-4 text-[#E57373]" />}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm text-[#333]">{item.title}</p>
										<p className="text-xs text-[#666] mt-0.5">{item.description}</p>
										{item.dueDate && (
											<p className="text-xs text-[#999] mt-1">Due: {item.dueDate}</p>
										)}
									</div>
									<span
										className={`px-2 py-0.5 rounded-full text-xs font-medium ${
											item.priority === 'high'
												? 'bg-[#E57373]/20 text-[#C62828]'
												: item.priority === 'medium'
													? 'bg-[#F5B041]/20 text-[#B8860B]'
													: 'bg-[#A8D5BA]/20 text-[#2E7D32]'
										}`}
									>
										{item.priority}
									</span>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-[#666]">
							<CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[#A8D5BA]" />
							<p className="font-serif">All caught up! No pending items.</p>
						</div>
					)}
				</div>

				{/* Recent Activity */}
				<div
					className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0DCD5]"
					style={{ transform: 'rotate(-0.2deg)' }}
				>
					<h2 className="font-sans font-bold text-lg text-[#333] mb-4 flex items-center gap-2">
						<div className="w-6 h-6 rounded bg-[#A8D4E6]/20 flex items-center justify-center">
							<MessageSquare className="w-4 h-4 text-[#A8D4E6]" />
						</div>
						Recent Activity
					</h2>

					{recentActivity.length > 0 ? (
						<div className="space-y-3">
							{recentActivity.map((activity) => (
								<div
									key={activity.id}
									className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E0DCD5]"
								>
									<div className="w-8 h-8 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white text-xs font-semibold shrink-0">
										{activity.studentName
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-[#333]">
											<span className="font-semibold">{activity.studentName}</span>{' '}
											<span className="text-[#666]">{activity.description}</span>
										</p>
										<p className="text-xs text-[#999] mt-0.5">{activity.timestamp}</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-[#666]">
							<MessageSquare className="w-10 h-10 mx-auto mb-2 text-[#A8D4E6]" />
							<p className="font-serif">No recent activity.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function StatCard({
	icon: Icon,
	label,
	value,
	color,
	rotation,
}: {
	icon: React.ElementType;
	label: string;
	value: string | number;
	color: string;
	rotation: number;
}) {
	return (
		<div
			className="bg-white rounded-2xl p-5 shadow-sm border border-[#E0DCD5]"
			style={{ transform: `rotate(${rotation}deg)` }}
		>
			<div className="flex items-center gap-3">
				<div
					className="w-12 h-12 rounded-xl flex items-center justify-center"
					style={{ backgroundColor: `${color}30` }}
				>
					<Icon className="w-6 h-6" style={{ color }} />
				</div>
				<div>
					<p className="font-sans font-bold text-2xl text-[#333]">{value}</p>
					<p className="text-sm text-[#666]">{label}</p>
				</div>
			</div>
		</div>
	);
}

function MarkerStat({ label, value, color }: { label: string; value: number; color: string }) {
	return (
		<div className="text-center">
			<p className="text-sm text-[#666] mb-2">{label}</p>
			<div className="relative h-3 bg-[#F0EDE8] rounded-full overflow-hidden">
				<div
					className="absolute inset-y-0 left-0 rounded-full"
					style={{ width: `${value}%`, backgroundColor: color }}
				/>
			</div>
			<p className="font-sans font-bold text-lg text-[#333] mt-2">{value}%</p>
		</div>
	);
}
