'use client';

import {
	ArrowLeft,
	BarChart3,
	Bell,
	BookOpen,
	ChevronDown,
	FileText,
	Home,
	LogOut,
	Megaphone,
	Menu,
	MessageCircle,
	Newspaper,
	PlayCircle,
	Plus,
	Settings,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthUser } from '@/hooks/queries/auth/use-auth-mutation';
import { useAuthStore } from '@/stores/auth-store';
import type { ClassroomUiData } from './classroom.mapper';
import ClassAssignments from './components/class-assignments';
import ClassFeed from './components/class-feed';
import ClassGrades from './components/class-grades';
import ClassOverview from './components/class-overview';
import { ClassroomSettings } from './components/class-setting';
import ClassStudents from './components/class-students';

type TabType =
	| 'overview'
	| 'feed'
	| 'students'
	| 'assignments'
	| 'grades'
	| 'conversation'
	| 'settings';

interface ClassroomWorkspaceProps {
	classData: ClassroomUiData;
	classOptions: ClassroomUiData[];
	onBack: () => void;
	onSwitchClass: (classId: number) => void;
}

const tabs = [
	{ id: 'overview' as TabType, label: 'Overview', icon: Home },
	{ id: 'feed' as TabType, label: 'Feed', icon: Newspaper },
	{ id: 'students' as TabType, label: 'Students', icon: Users },
	{ id: 'assignments' as TabType, label: 'Assignments', icon: FileText },
	{ id: 'grades' as TabType, label: 'Grades', icon: BarChart3 },
	{ id: 'conversation' as TabType, label: 'Conversation', icon: MessageCircle },
	{ id: 'settings' as TabType, label: 'Settings', icon: Settings },
];

export default function ClassroomWorkspace({
	classData,
	classOptions,
	onBack,
	onSwitchClass,
}: ClassroomWorkspaceProps) {
	const router = useRouter();
	const authUser = useAuthUser();
	const logout = useAuthStore((state) => state.logout);
	const teacherName = authUser?.userName ?? 'Teacher';
	const [activeTab, setActiveTab] = useState<TabType>('overview');
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	const handleLogout = () => {
		logout();
		router.replace('/login');
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'overview':
				return <ClassOverview classData={classData} />;
			case 'feed':
				return <ClassFeed classData={classData} />;
			case 'students':
				return <ClassStudents classData={classData} />;
			case 'assignments':
				return <ClassAssignments classData={classData} />;
			case 'grades':
				return <ClassGrades classData={classData} />;
			case 'conversation':
				return (
					<div className="flex items-center justify-center h-64 text-[#666]">
						<div className="text-center">
							<MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#C5B4E3]" />
							<p className="font-serif text-lg">Conversation feature coming soon!</p>
						</div>
					</div>
				);
			case 'settings':
				return <ClassroomSettings classData={classData} onDeleted={onBack} />;
			default:
				return <ClassOverview classData={classData} />;
		}
	};

	return (
		<div className="h-screen bg-[#FAF9F6] flex overflow-hidden">
			{/* Mobile Sidebar Overlay */}
			{mobileSidebarOpen && (
				<button
					type="button"
					aria-label="Close sidebar"
					className="fixed inset-0 bg-black/30 z-40 lg:hidden"
					onClick={() => setMobileSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:sticky lg:top-0 lg:self-start inset-y-0 left-0 z-50 h-full lg:h-screen w-64 bg-white border-r-4 border-double border-[#E8B4B8] transform transition-transform duration-300 lg:transform-none ${
					mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
				} ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="p-4 border-b border-[#E0DCD5]">
						<Link href="/dashboard" className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-[#F5B041] flex items-center justify-center shrink-0">
								<BookOpen className="w-5 h-5 text-[#333]" />
							</div>
							{sidebarOpen && (
								<span className="font-sans font-bold text-xl text-[#333]">Teachify</span>
							)}
						</Link>
					</div>

					{/* Class Switcher */}
					<div className="p-4 border-b border-[#E0DCD5]">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className={`w-full justify-between rounded-xl bg-[#F5B041]/10 border-[#F5B041]/30 hover:bg-[#F5B041]/20 ${
										sidebarOpen ? '' : 'px-2'
									}`}
								>
									<div className="flex items-center gap-2 truncate">
										<div
											className="w-6 h-6 rounded-md shrink-0"
											style={{ backgroundColor: classData.color }}
										/>
										{sidebarOpen && (
											<span className="font-semibold text-[#333] truncate">{classData.name}</span>
										)}
									</div>
									{sidebarOpen && <ChevronDown className="w-4 h-4 text-[#666] shrink-0" />}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56 rounded-xl">
								{classOptions.map((c) => (
									<DropdownMenuItem key={c.id} onClick={() => onSwitchClass(c.id)}>
										<div className="flex w-full items-center gap-2 cursor-pointer">
											<div className="w-4 h-4 rounded" style={{ backgroundColor: c.color }} />
											<span>{c.name}</span>
											<span className="text-xs text-[#999] ml-auto">{c.subject}</span>
										</div>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Navigation Tabs */}
					<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
						{tabs.map((tab) => (
							<button
								type="button"
								key={tab.id}
								onClick={() => {
									setActiveTab(tab.id);
									setMobileSidebarOpen(false);
								}}
								className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
									activeTab === tab.id
										? 'bg-[#F5B041]/20 text-[#333] font-semibold'
										: 'text-[#666] hover:bg-[#F0EDE8] hover:text-[#333]'
								} ${sidebarOpen ? '' : 'justify-center'}`}
							>
								<tab.icon className="w-5 h-5 shrink-0" />
								{sidebarOpen && <span>{tab.label}</span>}
								{activeTab === tab.id && sidebarOpen && (
									<div className="ml-auto w-2 h-2 rounded-full bg-[#F5B041]" />
								)}
							</button>
						))}
					</nav>

					{/* Back to Dashboard */}
					<div className="p-4 border-t border-[#E0DCD5]">
						<button
							type="button"
							onClick={onBack}
							className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#666] hover:bg-[#F0EDE8] hover:text-[#333] transition-all ${
								sidebarOpen ? '' : 'justify-center'
							}`}
						>
							<ArrowLeft className="w-5 h-5 shrink-0" />
							{sidebarOpen && <span>Back to Classes</span>}
						</button>
					</div>
				</div>
			</aside>

			{/* Main Area */}
			<div className="flex-1 flex flex-col min-w-0 h-full">
				{/* Top Bar */}
				<header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
					<div className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
						{/* Mobile Menu Button */}
						<button
							type="button"
							className="lg:hidden p-2 rounded-xl hover:bg-[#F0EDE8]"
							onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
						>
							{mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>

						{/* Sidebar Toggle (Desktop) */}
						<button
							type="button"
							className="hidden lg:block p-2 rounded-xl hover:bg-[#F0EDE8]"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<Menu className="w-5 h-5 text-[#666]" />
						</button>

						{/* Breadcrumbs */}
						<div className="flex-1 flex items-center gap-2 min-w-0">
							<div className="flex items-center gap-1 text-sm">
								<span className="px-2 py-1 rounded bg-[#A8D5BA]/30 text-[#333] font-medium">
									Classrooms
								</span>
								<span className="text-[#999]">/</span>
								<span className="px-2 py-1 rounded bg-[#F5B041]/30 text-[#333] font-medium truncate">
									{classData.name}
								</span>
							</div>
						</div>

						{/* Notifications & Profile */}
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5 text-[#666]" />
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E57373] text-white text-xs rounded-full flex items-center justify-center">
									0
								</span>
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#E0DCD5] rounded-lg hover:bg-black/5 px-2 py-1"
										aria-label="Open user menu"
									>
										<div className="w-9 h-9 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold text-sm">
											{teacherName
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</div>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44 rounded-xl">
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="w-4 h-4 mr-2" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				{/* Content Area */}
				<main className="flex-1 p-4 lg:p-6 overflow-auto grid-paper">{renderContent()}</main>
			</div>
		</div>
	);
}
