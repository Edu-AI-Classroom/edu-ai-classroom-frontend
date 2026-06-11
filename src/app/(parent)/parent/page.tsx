'use client';

import {
	BarChart3,
	BookOpen,
	CheckCircle2,
	Clock,
	Home,
	LinkIcon,
	LogOut,
	Menu,
	MessageCircle,
	TrendingUp,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChatPanel } from '@/features/chat/chat-panel';
import { NotificationBell } from '@/features/notification/notification-bell';
import { useAuthUser } from '@/hooks/queries/auth/use-auth-mutation';
import {
	useConsumeParentLinkCode,
	useCreateParentConversation,
	useParentConversations,
	useParentGradebook,
	useParentStudentClasses,
	useParentStudents,
} from '@/hooks/queries/parent/use-parent-query';
import { useAuthStore } from '@/stores/auth-store';

type ParentTab = 'overview' | 'students' | 'grades' | 'messages' | 'link';

const tabs = [
	{ id: 'overview' as ParentTab, label: 'Overview', icon: Home },
	{ id: 'students' as ParentTab, label: 'Students', icon: Users },
	{ id: 'grades' as ParentTab, label: 'Grades', icon: BarChart3 },
	{ id: 'messages' as ParentTab, label: 'Messages', icon: MessageCircle },
	{ id: 'link' as ParentTab, label: 'Link Student', icon: LinkIcon },
];

export default function ParentHome() {
	const router = useRouter();
	const authUser = useAuthUser();
	const logout = useAuthStore((state) => state.logout);
	const { data: students = [] } = useParentStudents();
	const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>();
	const activeStudentId = selectedStudentId ?? students[0]?.studentId;
	const { data: classes = [] } = useParentStudentClasses(activeStudentId);
	const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
	const activeClassId = selectedClassId ?? classes[0]?.classId;
	const { data: gradebook } = useParentGradebook(activeStudentId, activeClassId);
	const { data: conversations = [] } = useParentConversations();
	const consumeCode = useConsumeParentLinkCode();
	const createConversation = useCreateParentConversation();
	const [activeTab, setActiveTab] = useState<ParentTab>('overview');
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const [code, setCode] = useState('');
	const [relationship, setRelationship] = useState('');
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

	const parentName = authUser?.userName ?? 'Parent';
	const initials =
		parentName
			.split(' ')
			.map((part) => part[0])
			.join('')
			.slice(0, 2) || 'P';

	const activeStudent = useMemo(
		() => students.find((student) => student.studentId === activeStudentId),
		[students, activeStudentId],
	);

	const activeClass = useMemo(
		() => classes.find((item) => item.classId === activeClassId),
		[classes, activeClassId],
	);

	const progressSummary = useMemo(() => {
		const totalAssessments = classes.reduce((sum, item) => sum + (item.totalAssessments ?? 0), 0);
		const completedAssessments = classes.reduce(
			(sum, item) => sum + (item.completedAssessments ?? 0),
			0,
		);
		const scoredClasses = classes.filter((item) => item.averageScore != null);
		const averageScore =
			scoredClasses.length > 0
				? Number(
						(
							scoredClasses.reduce((sum, item) => sum + Number(item.averageScore ?? 0), 0) /
							scoredClasses.length
						).toFixed(2),
					)
				: null;
		const completionRate =
			totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0;
		const needsAttention = classes.filter(
			(item) =>
				(item.totalAssessments ?? 0) > 0 &&
				((item.completedAssessments ?? 0) < (item.totalAssessments ?? 0) ||
					(item.averageScore != null && item.averageScore < 5)),
		);

		return {
			totalAssessments,
			completedAssessments,
			averageScore,
			completionRate,
			needsAttention,
		};
	}, [classes]);

	const handleLogout = () => {
		logout();
		router.replace('/login');
	};

	const switchTab = (tab: ParentTab) => {
		setActiveTab(tab);
		setMobileSidebarOpen(false);
	};

	const startChat = async (classId: number) => {
		if (!activeStudentId) return;
		const conversation = await createConversation.mutateAsync({ studentId: activeStudentId, classId });
		setSelectedConversationId(conversation.conversationId);
		setActiveTab('messages');
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'overview':
				return (
					<div className="space-y-6">
						<div>
							<h1 className="font-sans text-2xl font-bold text-[#333]">Parent Center</h1>
							<p className="text-sm text-[#666]">
								Track student progress and stay connected with classroom teachers.
							</p>
						</div>

						<div className="grid gap-4 md:grid-cols-3">
							<MetricCard icon={Users} label="Linked students" value={students.length} color="#C5B4E3" />
							<MetricCard
								icon={TrendingUp}
								label="Average score"
								value={progressSummary.averageScore ?? '-'}
								color="#A8D5BA"
							/>
							<MetricCard
								icon={CheckCircle2}
								label="Completion"
								value={`${progressSummary.completionRate}%`}
								color="#F5B041"
							/>
						</div>

						<ProgressDashboard
							classes={classes}
							summary={progressSummary}
							onOpenGrades={() => setActiveTab('grades')}
						/>

						<div className="grid gap-6 xl:grid-cols-[360px_1fr]">
							<StudentPicker
								students={students}
								activeStudentId={activeStudentId}
								onSelect={(studentId) => {
									setSelectedStudentId(studentId);
									setSelectedClassId(undefined);
								}}
							/>
							<ClassCards
								classes={classes}
								activeClassId={activeClassId}
								onSelect={setSelectedClassId}
								onChat={startChat}
							/>
						</div>
					</div>
				);
			case 'students':
				return (
					<div className="space-y-6">
						<SectionHeader title="Students" description="Manage linked students and switch context." />
						<StudentPicker
							students={students}
							activeStudentId={activeStudentId}
							onSelect={(studentId) => {
								setSelectedStudentId(studentId);
								setSelectedClassId(undefined);
							}}
							tall
						/>
					</div>
				);
			case 'grades':
				return (
					<div className="space-y-6">
						<SectionHeader
							title="Grades"
							description={
								activeStudent
									? `Viewing progress for ${activeStudent.student.studentName}.`
									: 'Select a linked student to view grades.'
							}
						/>
						<ClassCards
							classes={classes}
							activeClassId={activeClassId}
							onSelect={setSelectedClassId}
							onChat={startChat}
						/>
						<GradebookTable
							className={activeClass?.className}
							subjectName={activeClass?.subjectName}
							gradebook={gradebook}
						/>
					</div>
				);
			case 'messages':
				return (
					<div className="space-y-6">
						<SectionHeader title="Messages" description="Chat with the owner teacher of each class." />
						<ChatPanel
							conversations={conversations}
							selectedConversationId={selectedConversationId ?? conversations[0]?.conversationId}
							onSelectConversation={setSelectedConversationId}
							emptyText="Open a class card and press Chat to start a conversation."
						/>
					</div>
				);
			case 'link':
				return (
					<div className="max-w-2xl space-y-6">
						<SectionHeader title="Link Student" description="Use the one-time code generated by a student." />
						<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
							<div className="mb-4 flex items-center gap-2">
								<LinkIcon className="h-5 w-5 text-[#F5B041]" />
								<h2 className="font-sans text-xl font-bold text-[#333]">Enter link code</h2>
							</div>
							<div className="space-y-3">
								<Input
									value={code}
									onChange={(event) => setCode(event.target.value.toUpperCase())}
									placeholder="Enter student link code"
									className="rounded-xl"
								/>
								<Input
									value={relationship}
									onChange={(event) => setRelationship(event.target.value)}
									placeholder="Relationship, e.g. Mother"
									className="rounded-xl"
								/>
								<Button
									className="w-full rounded-xl bg-[#F5B041] text-[#333] hover:bg-[#e5a23c]"
									disabled={!code.trim() || consumeCode.isPending}
									onClick={() =>
										consumeCode.mutate(
											{ code, relationship },
											{
												onSuccess: () => {
													setCode('');
													setRelationship('');
													setActiveTab('students');
												},
											},
										)
									}
								>
									Link student
								</Button>
								{consumeCode.isError && (
									<p className="text-sm text-[#C62828]">Could not link student. Check the code.</p>
								)}
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex h-screen w-full min-w-0 overflow-hidden bg-[#FAF9F6]">
			{mobileSidebarOpen && (
				<button
					type="button"
					aria-label="Close sidebar"
					className="fixed inset-0 z-40 bg-black/30 lg:hidden"
					onClick={() => setMobileSidebarOpen(false)}
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-50 h-full bg-white border-r-4 border-double border-[#E8B4B8] transition-all duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
					mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} ${sidebarOpen ? 'w-64' : 'w-20'}`}
			>
				<div className="flex h-full flex-col">
					<div className="border-b border-[#E0DCD5] p-4">
						<Link href="/parent" className="flex items-center gap-2">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5B041]">
								<BookOpen className="h-5 w-5 text-[#333]" />
							</div>
							{sidebarOpen && <span className="font-sans text-xl font-bold text-[#333]">Teachify</span>}
						</Link>
					</div>

					<nav className="flex-1 space-y-1 overflow-y-auto p-4">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => switchTab(tab.id)}
								className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
									activeTab === tab.id
										? 'bg-[#F5B041]/20 font-semibold text-[#333]'
										: 'text-[#666] hover:bg-[#F0EDE8] hover:text-[#333]'
								} ${sidebarOpen ? '' : 'justify-center'}`}
							>
								<tab.icon className="h-5 w-5 shrink-0" />
								{sidebarOpen && <span>{tab.label}</span>}
								{activeTab === tab.id && sidebarOpen && (
									<div className="ml-auto h-2 w-2 rounded-full bg-[#F5B041]" />
								)}
							</button>
						))}
					</nav>
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-30 border-b border-[#E0DCD5] bg-[#FAF9F6]/95 backdrop-blur-sm">
					<div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6">
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="rounded-xl p-2 hover:bg-[#F0EDE8] lg:hidden"
								onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
							>
								{mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
							</button>
							<button
								type="button"
								className="hidden rounded-xl p-2 hover:bg-[#F0EDE8] lg:block"
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								<Menu className="h-5 w-5 text-[#666]" />
							</button>
							<div className="min-w-0">
								<p className="text-xs font-semibold uppercase tracking-wide text-[#999]">Parent</p>
								<h1 className="truncate font-sans text-lg font-bold text-[#333]">
									{tabs.find((tab) => tab.id === activeTab)?.label}
								</h1>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<NotificationBell />

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="hidden items-center gap-3 rounded-lg border-l border-[#E0DCD5] px-2 py-1 pl-3 hover:bg-black/5 sm:flex"
										aria-label="Open user menu"
									>
										<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C5B4E3] text-sm font-semibold text-white">
											{initials}
										</div>
										<div className="text-left">
											<p className="font-sans text-sm font-semibold text-[#333]">{parentName}</p>
											<p className="text-xs text-[#666]">PARENT</p>
										</div>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44 rounded-xl">
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				<main className="grid-paper flex-1 overflow-auto p-4 lg:p-6">{renderContent()}</main>
			</div>
		</div>
	);
}

function SectionHeader({ title, description }: { title: string; description: string }) {
	return (
		<div>
			<h2 className="font-sans text-2xl font-bold text-[#333]">{title}</h2>
			<p className="text-sm text-[#666]">{description}</p>
		</div>
	);
}

function MetricCard({
	icon: Icon,
	label,
	value,
	color,
}: {
	icon: typeof Users;
	label: string;
	value: number | string;
	color: string;
}) {
	return (
		<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
			<Icon className="mb-3 h-6 w-6" style={{ color }} />
			<p className="text-sm text-[#666]">{label}</p>
			<p className="font-sans text-3xl font-bold text-[#333]">{value}</p>
		</div>
	);
}

function ProgressDashboard({
	classes,
	summary,
	onOpenGrades,
}: {
	classes: any[];
	summary: {
		totalAssessments: number;
		completedAssessments: number;
		averageScore: number | null;
		completionRate: number;
		needsAttention: any[];
	};
	onOpenGrades: () => void;
}) {
	return (
		<div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
			<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-sans text-xl font-bold text-[#333]">Progress Dashboard</h2>
						<p className="text-sm text-[#666]">Score and completion by class.</p>
					</div>
					<Button type="button" variant="outline" className="rounded-xl" onClick={onOpenGrades}>
						View grades
					</Button>
				</div>

				<div className="space-y-4">
					{classes.map((item) => {
						const completion =
							item.totalAssessments > 0
								? Math.round((item.completedAssessments / item.totalAssessments) * 100)
								: 0;
						const scoreWidth =
							item.averageScore != null ? Math.max(4, Math.min(100, item.averageScore * 10)) : 0;
						return (
							<div key={item.classId} className="rounded-xl bg-[#FAF9F6] p-4">
								<div className="mb-3 flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="truncate font-semibold text-[#333]">{item.className}</p>
										<p className="text-sm text-[#666]">{item.subjectName ?? 'Subject'}</p>
									</div>
									<span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#333]">
										{item.averageScore ?? '-'}
									</span>
								</div>
								<div className="space-y-3">
									<div>
										<div className="mb-1 flex justify-between text-xs text-[#666]">
											<span>Average score</span>
											<span>{item.averageScore != null ? `${item.averageScore}/10` : 'No score'}</span>
										</div>
										<div className="h-2 rounded-full bg-[#E0DCD5]">
											<div
												className="h-2 rounded-full bg-[#A8D5BA]"
												style={{ width: `${scoreWidth}%` }}
											/>
										</div>
									</div>
									<div>
										<div className="mb-1 flex justify-between text-xs text-[#666]">
											<span>Completion</span>
											<span>
												{item.completedAssessments}/{item.totalAssessments} ({completion}%)
											</span>
										</div>
										<div className="h-2 rounded-full bg-[#E0DCD5]">
											<div
												className="h-2 rounded-full bg-[#F5B041]"
												style={{ width: `${completion}%` }}
											/>
										</div>
									</div>
								</div>
							</div>
						);
					})}
					{classes.length === 0 && <p className="py-8 text-center text-sm text-[#666]">No class data yet.</p>}
				</div>
			</div>

			<div className="space-y-4">
				<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
					<h2 className="font-sans text-xl font-bold text-[#333]">Weekly summary</h2>
					<div className="mt-4 space-y-3">
						<SummaryLine
							icon={CheckCircle2}
							label="Completed assessments"
							value={`${summary.completedAssessments}/${summary.totalAssessments}`}
						/>
						<SummaryLine icon={Clock} label="Needs attention" value={summary.needsAttention.length} />
						<SummaryLine
							icon={MessageCircle}
							label="Conversations"
							value={classes.length > 0 ? 'Available by class' : 'No class yet'}
						/>
					</div>
				</div>
				<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
					<h2 className="font-sans text-xl font-bold text-[#333]">Attention list</h2>
					{summary.needsAttention.length === 0 ? (
						<p className="mt-3 text-sm text-[#666]">Everything looks on track.</p>
					) : (
						<div className="mt-3 space-y-2">
							{summary.needsAttention.map((item) => (
								<div key={item.classId} className="rounded-lg bg-[#FDECEC] p-3 text-sm text-[#333]">
									<p className="font-semibold">{item.className}</p>
									<p className="text-[#666]">
										Score {item.averageScore ?? '-'} - {item.completedAssessments}/
										{item.totalAssessments} completed
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function SummaryLine({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof CheckCircle2;
	label: string;
	value: string | number;
}) {
	return (
		<div className="flex items-center justify-between gap-3 rounded-lg bg-[#FAF9F6] p-3">
			<div className="flex items-center gap-2">
				<Icon className="h-4 w-4 text-[#F5B041]" />
				<span className="text-sm text-[#666]">{label}</span>
			</div>
			<span className="font-semibold text-[#333]">{value}</span>
		</div>
	);
}

function StudentPicker({
	students,
	activeStudentId,
	onSelect,
	tall = false,
}: {
	students: any[];
	activeStudentId?: number;
	onSelect: (studentId: number) => void;
	tall?: boolean;
}) {
	return (
		<div className={`rounded-xl border border-[#E0DCD5] bg-white p-4 shadow-sm ${tall ? 'min-h-[420px]' : ''}`}>
			<h2 className="mb-3 font-sans text-lg font-bold text-[#333]">Students</h2>
			{students.length === 0 ? (
				<p className="text-sm text-[#666]">Ask your student to create a parent link code.</p>
			) : (
				<div className="space-y-2">
					{students.map((student) => (
						<button
							key={student.studentId}
							type="button"
							onClick={() => onSelect(student.studentId)}
							className={`w-full rounded-xl border p-3 text-left ${
								activeStudentId === student.studentId
									? 'border-[#F5B041] bg-[#F5B041]/10'
									: 'border-[#E0DCD5] bg-white'
							}`}
						>
							<p className="font-semibold text-[#333]">{student.student.studentName}</p>
							<p className="text-sm text-[#666]">{student.relationship ?? 'Parent'}</p>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function ClassCards({
	classes,
	activeClassId,
	onSelect,
	onChat,
}: {
	classes: any[];
	activeClassId?: number;
	onSelect: (classId: number) => void;
	onChat: (classId: number) => void;
}) {
	return (
		<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
			<h2 className="mb-4 font-sans text-xl font-bold text-[#333]">Classes</h2>
			<div className="grid gap-3 md:grid-cols-2">
				{classes.map((item) => (
					<button
						type="button"
						key={item.classId}
						onClick={() => onSelect(item.classId)}
						className={`rounded-xl border p-4 text-left ${
							activeClassId === item.classId
								? 'border-[#F5B041] bg-[#F5B041]/10'
								: 'border-[#E0DCD5] bg-[#FAF9F6]'
						}`}
					>
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0">
								<p className="truncate font-semibold text-[#333]">{item.className}</p>
								<p className="text-sm text-[#666]">{item.subjectName ?? 'Subject'}</p>
								<p className="text-xs text-[#666]">
									Teacher: {item.ownerTeacher?.teacherName ?? 'Owner teacher'}
								</p>
							</div>
							<Button
								type="button"
								size="sm"
								className="shrink-0 rounded-xl bg-[#F5B041] text-[#333] hover:bg-[#e5a23c]"
								onClick={(event) => {
									event.stopPropagation();
									void onChat(item.classId);
								}}
							>
								Chat
							</Button>
						</div>
						<p className="mt-3 text-sm text-[#666]">
							Average: <span className="font-bold text-[#333]">{item.averageScore ?? '-'}</span> -{' '}
							{item.completedAssessments}/{item.totalAssessments} completed
						</p>
					</button>
				))}
			</div>
			{classes.length === 0 && (
				<p className="py-10 text-center text-sm text-[#666]">No classes available for this student.</p>
			)}
		</div>
	);
}

function GradebookTable({
	className,
	subjectName,
	gradebook,
}: {
	className?: string;
	subjectName?: string | null;
	gradebook: any;
}) {
	return (
		<div className="rounded-xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
			<div className="mb-4">
				<h2 className="font-sans text-xl font-bold text-[#333]">Class gradebook</h2>
				<p className="text-sm text-[#666]">
					{className ?? 'Select a class'} {subjectName ? `- ${subjectName}` : ''}
				</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-[#E0DCD5] text-left">
							<th className="p-3">Assessment</th>
							<th className="p-3">Type</th>
							<th className="p-3">Status</th>
							<th className="p-3">Score</th>
						</tr>
					</thead>
					<tbody>
						{gradebook?.items.map((item: any) => (
							<tr key={item.assessmentId} className="border-b border-[#E0DCD5]">
								<td className="p-3 font-semibold text-[#333]">{item.title}</td>
								<td className="p-3 text-[#666]">{item.documentType}</td>
								<td className="p-3 text-[#666]">{item.status ?? 'Not submitted'}</td>
								<td className="p-3 font-bold text-[#333]">{item.totalScore ?? '-'}</td>
							</tr>
						))}
					</tbody>
				</table>
				{(!gradebook || gradebook.items.length === 0) && (
					<p className="py-8 text-center text-sm text-[#666]">No grade data yet.</p>
				)}
			</div>
		</div>
	);
}
