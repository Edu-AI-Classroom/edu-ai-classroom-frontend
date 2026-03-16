import {
	ArrowLeft,
	BarChart3,
	Bell,
	BookOpen,
	ChevronDown,
	ClipboardList,
	Home,
	Menu,
	MessageCircle,
	Newspaper,
	Settings,
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
import CourseAssignments from './components/CourseAssignments';
import CourseFeed from './components/CourseFeed';
import CourseGrades from './components/CourseGrades';
import CourseOverview from './components/CourseOverview';
import CourseSettings from './components/CourseSettings';

type TabType = 'overview' | 'feed' | 'assignments' | 'grades' | 'conversation' | 'settings';

const tabs = [
	{ id: 'overview' as TabType, label: 'Overview', icon: Home },
	{ id: 'feed' as TabType, label: 'Feed', icon: Newspaper },
	{ id: 'assignments' as TabType, label: 'Assignments', icon: ClipboardList },
	{ id: 'grades' as TabType, label: 'Grades', icon: BarChart3 },
	{ id: 'conversation' as TabType, label: 'Discussion', icon: MessageCircle },
	{ id: 'settings' as TabType, label: 'Settings', icon: Settings },
];

const classOptions = [
	{ id: 1, name: 'Math 4A', subject: 'Mathematics', color: '#10B981' },
	{ id: 2, name: 'Vietnamese 4A', subject: 'Literature', color: '#F59E0B' },
	{ id: 3, name: 'English 4A', subject: 'Foreign Language', color: '#6366F1' },
	{ id: 4, name: 'Science 4A', subject: 'Science', color: '#EC4899' },
];

const CourseDetail = () => {
	const router = useRouter();
	const studentName = 'Nguyen Van An';
	const [activeTab, setActiveTab] = useState<TabType>('overview');
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const [currentClass, setCurrentClass] = useState(classOptions[0]);

	const renderContent = () => {
		switch (activeTab) {
			case 'overview':
				return (
					<CourseOverview
						classData={{
							id: currentClass.id,
							name: currentClass.name,
							subject: currentClass.subject,
							grade: 'Grade 4',
							studentCount: 30,
							teacherCount: 1,
							groupCount: 5,
							color: currentClass.color,
							rotation: 0,
							pendingGrading: 0,
							upcomingDeadlines: 0,
							teacherName: 'Mr. Nguyen Toan',
						}}
					/>
				);
			case 'feed':
				return (
					<CourseFeed
						classData={{
							id: currentClass.id,
							name: currentClass.name,
							subject: currentClass.subject,
							grade: 'Grade 4',
							studentCount: 30,
							teacherCount: 1,
							groupCount: 5,
							color: currentClass.color,
							rotation: 0,
							pendingGrading: 0,
							upcomingDeadlines: 0,
							teacherName: 'Mr. Nguyen Toan',
						}}
					/>
				);
			case 'assignments':
				return <CourseAssignments />;
			case 'grades':
				return <CourseGrades />;
			case 'settings':
				return <CourseSettings />;
			default:
				return (
					<CourseOverview
						classData={{
							id: currentClass.id,
							name: currentClass.name,
							subject: currentClass.subject,
							grade: 'Grade 4',
							studentCount: 30,
							teacherCount: 1,
							groupCount: 5,
							color: currentClass.color,
							rotation: 0,
							pendingGrading: 0,
							upcomingDeadlines: 0,
							teacherName: 'Mr. Nguyen Toan',
						}}
					/>
				);
		}
	};

	return (
		<div className="min-h-screen teachify-bg flex">
			{/* Mobile Sidebar Overlay */}
			{mobileSidebarOpen && (
				<button
					type="button"
					aria-label="Close sidebar"
					className="fixed inset-0 bg-foreground/30 z-40 lg:hidden"
					onClick={() => setMobileSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:static inset-y-0 left-0 z-50 bg-sidebar border-r-4 border-double border-border transform transition-all duration-300 lg:transform-none ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
					} ${sidebarOpen ? 'w-64 lg:w-64' : 'w-64 lg:w-20'}`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="p-4 border-b border-border">
						<Link href="/" className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
								<BookOpen className="w-5 h-5 text-foreground" />
							</div>
							{sidebarOpen && <span className="font-bold text-xl text-foreground">Teachify</span>}
						</Link>
					</div>

					{/* Class Switcher */}
					<div className="p-4 border-b border-border">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className={`w-full justify-between rounded-xl bg-accent/20 border-accent/30 hover:bg-accent/30 ${sidebarOpen ? '' : 'px-2'
										}`}
								>
									<div className="flex items-center gap-2 truncate">
										<div
											className="w-6 h-6 rounded-md shrink-0"
											style={{ backgroundColor: currentClass.color }}
										/>
										{sidebarOpen && (
											<span className="font-semibold text-foreground truncate">
												{currentClass.name}
											</span>
										)}
									</div>
									{sidebarOpen && (
										<ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56 rounded-xl">
								{classOptions.map((c) => (
									<DropdownMenuItem
										key={c.id}
										onClick={() => setCurrentClass(c)}
										className="flex items-center gap-2 cursor-pointer"
									>
										<div className="w-4 h-4 rounded" style={{ backgroundColor: c.color }} />
										<span>{c.name}</span>
										<span className="text-xs text-muted-foreground ml-auto">{c.subject}</span>
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
								className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === tab.id
									? 'bg-accent/20 text-foreground font-semibold'
									: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
									} ${sidebarOpen ? '' : 'justify-center'}`}
							>
								<tab.icon className="w-5 h-5 shrink-0" />
								{sidebarOpen && <span>{tab.label}</span>}
								{activeTab === tab.id && sidebarOpen && (
									<div className="ml-auto w-2 h-2 rounded-full bg-accent" />
								)}
							</button>
						))}
					</nav>

					{/* Back to Dashboard */}
					<div className="p-4 border-t border-border">
						<button
							type="button"
							onClick={() => router.push('/')}
							className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all ${sidebarOpen ? '' : 'justify-center'
								}`}
						>
							<ArrowLeft className="w-5 h-5 shrink-0" />
							{sidebarOpen && <span>Back to Dashboard</span>}
						</button>
					</div>
				</div>
			</aside>

			{/* Main Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Bar */}
				<header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
					<div className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
						<button
							type="button"
							className="lg:hidden p-2 rounded-xl hover:bg-secondary"
							onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
						>
							{mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>

						<button
							type="button"
							className="hidden lg:block p-2 rounded-xl hover:bg-secondary"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<Menu className="w-5 h-5 text-muted-foreground" />
						</button>

						{/* Breadcrumbs */}
						<div className="flex-1 flex items-center gap-2 min-w-0">
							<div className="flex items-center gap-1 text-sm">
								<Link
									href="/"
									className="px-2 py-1 rounded bg-success/20 text-foreground font-medium hover:bg-success/30 transition-colors"
								>
									Courses
								</Link>
								<span className="text-muted-foreground">/</span>
								<span className="px-2 py-1 rounded bg-accent/30 text-foreground font-medium truncate">
									{currentClass.name}
								</span>
							</div>
						</div>

						{/* Notifications & Profile */}
						<div className="flex items-center gap-3">
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5 text-muted-foreground" />
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
									2
								</span>
							</Button>

							<div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
								<div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
									{studentName
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Content Area */}
				<main className="flex-1 p-4 lg:p-6 overflow-auto teachify-bg">{renderContent()}</main>
			</div>
		</div>
	);
};

export default CourseDetail;
