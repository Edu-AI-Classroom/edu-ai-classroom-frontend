'use client';

import { format } from 'date-fns';
import {
	Activity,
	BarChart3,
	BookOpen,
	Bot,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	CreditCard,
	GraduationCap,
	LayoutGrid,
	Menu,
	MessageSquareText,
	Sparkles,
	Star,
	TrendingUp,
	Users,
	WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from 'recharts';
import { AdminGuard } from '@/components/auth/admin-guard';
import { TeachifyIcon } from '@/components/common/Teachify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlanManagement } from '@/features/admin/subscription/subscription-plan-management';
import { useAdminDashboard } from '@/hooks/queries/admin/use-admin-dashboard';
import { cn } from '@/lib/utils/utils';

type DateFilterMode = 'range' | 'month' | 'year' | 'quarter' | 'day';
type CompareMode = 'none' | 'month' | 'year' | 'quarter' | 'day';

const monthOptions = [
	{ label: 'Jan', value: 1 },
	{ label: 'Feb', value: 2 },
	{ label: 'Mar', value: 3 },
	{ label: 'Apr', value: 4 },
	{ label: 'May', value: 5 },
	{ label: 'Jun', value: 6 },
	{ label: 'Jul', value: 7 },
	{ label: 'Aug', value: 8 },
	{ label: 'Sep', value: 9 },
	{ label: 'Oct', value: 10 },
	{ label: 'Nov', value: 11 },
	{ label: 'Dec', value: 12 },
];

const roleColors: Record<string, string> = {
	ADMIN: '#333333',
	TEACHER: '#C5B4E3',
	STUDENT: '#F5B041',
	PARENT: '#E57373',
};

const aiColors: Record<string, string> = {
	lesson: '#F5B041',
	quiz: '#C5B4E3',
	exam: '#E57373',
};

const transactionColors: Record<string, string> = {
	SUCCESS: '#4CAF50',
	PENDING: '#F5B041',
	FAILED: '#E57373',
	TRIAL: '#7CB7D8',
};

const FEEDBACK_PAGE_SIZE = 3;

export default function AdminDashboardPage() {
	const now = new Date();
	const [dateMode, setDateMode] = useState<DateFilterMode>('month');
	const [compareMode] = useState<CompareMode>('none');
	const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
	const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
	const [selectedQuarter, setSelectedQuarter] = useState<number>(
		Math.floor(now.getMonth() / 3) + 1,
	);
	const [selectedDay, setSelectedDay] = useState<string>(now.toISOString().split('T')[0]);
	const [rangeFrom, setRangeFrom] = useState<string | undefined>();
	const [rangeTo, setRangeTo] = useState<string | undefined>();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [feedbackPage, setFeedbackPage] = useState(1);

	const effectiveMode: DateFilterMode =
		dateMode === 'range' && rangeFrom && rangeTo ? 'range' : dateMode;

	const filters = {
		mode: effectiveMode,
		month: selectedMonth,
		year: selectedYear,
		quarter: selectedQuarter,
		day: selectedDay,
		compareMode,
		from: effectiveMode === 'range' ? rangeFrom : undefined,
		to: effectiveMode === 'range' ? rangeTo : undefined,
	};

	const {
		overview,
		userGrowth,
		roleDistribution,
		newUsersPerMonth,
		classroomMonthly,
		topClassrooms,
		aiUsage,
		revenue,
		transactionsMonthly,
		transactionStatus,
		recentTransactions,
		reviews,
		userSummary,
		recentUsers,
		isLoading,
	} = useAdminDashboard(filters);

	const rolePieData =
		roleDistribution?.map((item) => ({
			...item,
			fill: roleColors[item.role] ?? '#8D8D8D',
		})) ?? [];

	const aiUsagePieData =
		aiUsage?.map((item) => ({
			...item,
			fill: aiColors[item.feature] ?? '#8D8D8D',
		})) ?? [];

	const txStatusPieData =
		transactionStatus?.map((item) => ({
			...item,
			fill: transactionColors[item.status] ?? '#8D8D8D',
		})) ?? [];

	const reviewRatingData =
		reviews?.ratingBreakdown.map((item) => ({
			...item,
			label: `${item.rating} star`,
			fill: item.rating >= 4 ? '#4CAF50' : item.rating === 3 ? '#F5B041' : '#E57373',
		})) ?? [];

	const userSummaryCards =
		userSummary?.map((item) => ({
			...item,
			fill: roleColors[item.role] ?? '#8D8D8D',
		})) ?? rolePieData;

	const feedbackItems = reviews?.recentComments ?? [];
	const feedbackTotalPages = Math.max(1, Math.ceil(feedbackItems.length / FEEDBACK_PAGE_SIZE));
	const safeFeedbackPage = Math.min(feedbackPage, feedbackTotalPages);
	const visibleFeedback = feedbackItems.slice(
		(safeFeedbackPage - 1) * FEEDBACK_PAGE_SIZE,
		safeFeedbackPage * FEEDBACK_PAGE_SIZE,
	);

	const periodLabel = useMemo(() => {
		if (effectiveMode === 'range' && rangeFrom && rangeTo) return `${rangeFrom} - ${rangeTo}`;
		if (dateMode === 'day') return selectedDay;
		if (dateMode === 'quarter') return `Q${selectedQuarter} ${selectedYear}`;
		if (dateMode === 'year') return String(selectedYear);
		return `${monthOptions.find((m) => m.value === selectedMonth)?.label ?? selectedMonth} ${selectedYear}`;
	}, [
		dateMode,
		effectiveMode,
		rangeFrom,
		rangeTo,
		selectedDay,
		selectedMonth,
		selectedQuarter,
		selectedYear,
	]);

	const paidTransactions = overview?.paidTransactions ?? 0;
	const trialTransactions = overview?.trialTransactions ?? 0;
	const conversionRate =
		paidTransactions + trialTransactions > 0
			? (paidTransactions / (paidTransactions + trialTransactions)) * 100
			: 0;
	const parentCoverage =
		overview?.totalStudents && overview.totalStudents > 0
			? ((overview.totalParents ?? 0) / overview.totalStudents) * 100
			: 0;
	const avgRevenuePerPaid =
		paidTransactions > 0 ? (overview?.totalRevenue ?? 0) / paidTransactions : 0;

	return (
		<AdminGuard allowedRoles={['ADMIN']} redirectTo="/student">
			<div className="min-h-screen bg-[#FAF9F6] grid-paper">
				<header className="sticky top-0 z-50 border-b border-[#E0DCD5] bg-[#FAF9F6]/95 backdrop-blur-sm">
					<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
						<div className="flex items-center justify-between gap-4">
							<TeachifyIcon />
							<div className="hidden rounded-full border border-[#E0DCD5] bg-white px-3 py-1 text-xs text-[#666] shadow-sm sm:block">
								Updated {format(new Date(), 'dd MMM yyyy, HH:mm')}
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<SegmentedControl
								value={dateMode}
								options={[
									{ label: 'Day', value: 'day' },
									{ label: 'Month', value: 'month' },
									{ label: 'Quarter', value: 'quarter' },
									{ label: 'Year', value: 'year' },
									{ label: 'Range', value: 'range' },
								]}
								onChange={(value) => setDateMode(value as DateFilterMode)}
							/>

							{dateMode === 'day' && (
								<input
									type="date"
									value={selectedDay}
									onChange={(event) => setSelectedDay(event.target.value)}
									className="h-9 rounded-full border border-[#E0DCD5] bg-white px-3 text-xs text-[#333] shadow-sm outline-none focus:border-[#F5B041]"
								/>
							)}

							{dateMode === 'month' && (
								<>
									<select
										value={selectedMonth}
										onChange={(event) => setSelectedMonth(Number(event.target.value))}
										className="h-9 rounded-full border border-[#E0DCD5] bg-white px-3 text-xs text-[#333] shadow-sm outline-none focus:border-[#F5B041]"
									>
										{monthOptions.map((month) => (
											<option key={month.value} value={month.value}>
												{month.label}
											</option>
										))}
									</select>
									<YearInput value={selectedYear} onChange={setSelectedYear} />
								</>
							)}

							{dateMode === 'quarter' && (
								<>
									<select
										value={selectedQuarter}
										onChange={(event) => setSelectedQuarter(Number(event.target.value))}
										className="h-9 rounded-full border border-[#E0DCD5] bg-white px-3 text-xs text-[#333] shadow-sm outline-none focus:border-[#F5B041]"
									>
										<option value={1}>Q1</option>
										<option value={2}>Q2</option>
										<option value={3}>Q3</option>
										<option value={4}>Q4</option>
									</select>
									<YearInput value={selectedYear} onChange={setSelectedYear} />
								</>
							)}

							{dateMode === 'year' && <YearInput value={selectedYear} onChange={setSelectedYear} />}

							{dateMode === 'range' && (
								<div className="flex items-center gap-2 rounded-full border border-[#E0DCD5] bg-white px-3 py-1.5 shadow-sm">
									<input
										type="date"
										value={rangeFrom ?? ''}
										onChange={(event) => setRangeFrom(event.target.value || undefined)}
										className="w-32 bg-transparent text-xs text-[#333] outline-none"
									/>
									<span className="text-xs text-[#999]">to</span>
									<input
										type="date"
										value={rangeTo ?? ''}
										onChange={(event) => setRangeTo(event.target.value || undefined)}
										className="w-32 bg-transparent text-xs text-[#333] outline-none"
									/>
								</div>
							)}
						</div>
					</div>
				</header>

				<main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
					<section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
						<div className="rounded-2xl border border-[#E0DCD5] bg-white/90 p-5 shadow-sm">
							<p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#999]">
								Admin Command Center
							</p>
							<div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
								<div>
									<h1 className="font-sans text-3xl font-bold text-[#333]">System Overview</h1>
									<p className="mt-1 max-w-2xl text-sm text-[#666]">
										Monitor growth, classroom activity, AI usage and payment health in one place.
									</p>
								</div>
								<div className="flex items-center gap-2 rounded-xl bg-[#FAF9F6] px-3 py-2 text-sm text-[#555]">
									<CalendarDays className="h-4 w-4 text-[#F5B041]" />
									<span>{periodLabel}</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#F5B041]/45 bg-[#F5B041] p-3 text-[#333] shadow-sm">
							<MiniMetric label="Trial" value={trialTransactions} />
							<MiniMetric label="Paid" value={paidTransactions} />
							<MiniMetric label="Conv." value={`${conversionRate.toFixed(0)}%`} />
						</div>
					</section>

					<div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
						<SummaryCard
							label="Total Users"
							value={overview?.totalUsers ?? 0}
							delta={overview?.usersGrowth ?? 0}
							icon={Users}
						/>
						<SummaryCard
							label="Teachers"
							value={overview?.totalTeachers ?? 0}
							delta={overview?.teachersGrowth ?? 0}
							icon={GraduationCap}
						/>
						<SummaryCard
							label="Students"
							value={overview?.totalStudents ?? 0}
							delta={overview?.studentsGrowth ?? 0}
							icon={BookOpen}
						/>
						<SummaryCard
							label="Parents"
							value={overview?.totalParents ?? 0}
							delta={parentCoverage}
							deltaLabel="coverage"
							icon={Users}
						/>
						<SummaryCard
							label="Revenue"
							value={overview?.totalRevenue ?? 0}
							delta={overview?.revenueGrowth ?? 0}
							icon={CreditCard}
							isCurrency
						/>
						<SummaryCard
							label="Transactions"
							value={overview?.totalTransactions ?? 0}
							delta={overview?.transactionsGrowth ?? 0}
							icon={WalletCards}
						/>
					</div>

					<Tabs
						defaultValue="overview"
						className={cn(
							'grid gap-5 transition-all lg:items-start',
							sidebarOpen
								? 'lg:grid-cols-[256px_minmax(0,1fr)]'
								: 'lg:grid-cols-[80px_minmax(0,1fr)]',
						)}
					>
						<aside
							className={cn(
								'sticky top-24 hidden h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-[#E0DCD5] bg-white/95 shadow-sm ring-1 ring-black/5 transition-all lg:block',
								sidebarOpen ? 'w-64' : 'w-20',
							)}
						>
							<div className="flex h-full flex-col">
								<div className="flex items-center gap-2 border-b border-[#E0DCD5] p-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F5B041] shadow-sm shadow-[#F5B041]/30 ring-1 ring-black/5">
										<BookOpen className="h-5 w-5 text-[#333]" />
									</div>
									{sidebarOpen && (
										<div className="min-w-0">
											<p className="font-sans text-lg font-bold text-[#333]">Teachify</p>
											<p className="truncate text-xs text-[#999]">Admin dashboard</p>
										</div>
									)}
								</div>

								<div className="border-b border-[#E0DCD5] p-4">
									<button
										type="button"
										onClick={() => setSidebarOpen(!sidebarOpen)}
										className={cn(
											'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[#666] transition hover:bg-[#F0EDE8] hover:text-[#333]',
											!sidebarOpen && 'justify-center px-2',
										)}
									>
										<Menu className="h-5 w-5 shrink-0" />
										{sidebarOpen && <span>Collapse menu</span>}
									</button>
								</div>

								<TabsList className="flex h-auto flex-1 flex-col items-stretch justify-start gap-1 overflow-y-auto bg-transparent p-4">
									<TabButton
										value="overview"
										icon={LayoutGrid}
										label="Overview"
										collapsed={!sidebarOpen}
									/>
									<TabButton value="users" icon={Users} label="Users" collapsed={!sidebarOpen} />
									<TabButton
										value="learning"
										icon={GraduationCap}
										label="Learning"
										collapsed={!sidebarOpen}
									/>
									<TabButton
										value="revenue"
										icon={WalletCards}
										label="Revenue"
										collapsed={!sidebarOpen}
									/>
									<TabButton
										value="feedback"
										icon={MessageSquareText}
										label="Feedback"
										collapsed={!sidebarOpen}
									/>
									<TabButton
										value="subscriptions"
										icon={CreditCard}
										label="Plans"
										collapsed={!sidebarOpen}
									/>
								</TabsList>
							</div>
						</aside>

						<div className="min-w-0 space-y-5">
							<TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-2xl border border-[#E0DCD5] bg-white/90 p-2 shadow-sm lg:hidden">
								<TabButton value="overview" icon={LayoutGrid} label="Overview" />
								<TabButton value="users" icon={Users} label="Users" />
								<TabButton value="learning" icon={GraduationCap} label="Learning" />
								<TabButton value="revenue" icon={WalletCards} label="Revenue" />
								<TabButton value="feedback" icon={MessageSquareText} label="Feedback" />
								<TabButton value="subscriptions" icon={CreditCard} label="Plans" />
							</TabsList>

							<TabsContent value="overview" className="space-y-5">
								<div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
									<DashboardCard
										title="Revenue trend"
										description="Successful payment revenue in the selected window."
										icon={TrendingUp}
									>
										<ChartBlock isEmpty={!revenue?.length} emptyText="No revenue in this period.">
											<ChartContainer
												config={{ revenue: { label: 'Revenue', color: '#4CAF50' } }}
												className="h-[300px] w-full"
											>
												<AreaChart data={revenue ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="date" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Area
														type="monotone"
														dataKey="value"
														stroke="var(--color-revenue)"
														fill="var(--color-revenue)"
														fillOpacity={0.18}
														strokeWidth={2}
													/>
												</AreaChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>

									<DashboardCard
										title="Role distribution"
										description="Current user composition by role."
										icon={Users}
									>
										<ChartBlock isEmpty={!rolePieData.length} emptyText="No user role data.">
											<ChartContainer
												config={{
													TEACHER: { label: 'Teachers', color: roleColors.TEACHER },
													STUDENT: { label: 'Students', color: roleColors.STUDENT },
													PARENT: { label: 'Parents', color: roleColors.PARENT },
													ADMIN: { label: 'Admins', color: roleColors.ADMIN },
												}}
												className="h-[300px] w-full"
											>
												<PieChart>
													<ChartTooltip content={<ChartTooltipContent />} />
													<Pie
														data={rolePieData}
														dataKey="value"
														nameKey="role"
														innerRadius={55}
														outerRadius={88}
														paddingAngle={3}
													>
														{rolePieData.map((entry) => (
															<Cell key={entry.role} fill={entry.fill} />
														))}
													</Pie>
													<ChartLegend />
												</PieChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>
								</div>

								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
									<InsightCard
										label="New users"
										value={overview?.newUsersInPeriod ?? 0}
										helper="Signups in selected period"
										icon={Sparkles}
									/>
									<InsightCard
										label="Average class size"
										value={overview?.averageClassSize ?? 0}
										helper="Students per active classroom"
										icon={LayoutGrid}
									/>
									<InsightCard
										label="AI tokens"
										value={overview?.aiTokens ?? 0}
										helper="Estimated usage volume"
										icon={Bot}
									/>
									<InsightCard
										label="Avg revenue / paid"
										value={avgRevenuePerPaid}
										helper="Per successful transaction"
										icon={CreditCard}
										isCurrency
									/>
								</div>
							</TabsContent>

							<TabsContent value="users" className="space-y-5">
								<div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
									<DashboardCard
										title="User growth"
										description="Daily signup momentum in the selected window."
										icon={TrendingUp}
									>
										<ChartBlock
											isEmpty={!userGrowth?.length}
											emptyText="No new users in this period."
										>
											<ChartContainer
												config={{ users: { label: 'Users', color: '#F5B041' } }}
												className="h-[310px] w-full"
											>
												<LineChart data={userGrowth ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="date" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Line
														type="monotone"
														dataKey="value"
														stroke="var(--color-users)"
														strokeWidth={2}
														dot={{ r: 3 }}
													/>
												</LineChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>

									<DashboardCard
										title="Monthly signups"
										description="Signup volume grouped by month."
										icon={BarChart3}
									>
										<ChartBlock
											isEmpty={!newUsersPerMonth?.length}
											emptyText="No monthly signup data."
										>
											<ChartContainer
												config={{ users: { label: 'New users', color: '#C5B4E3' } }}
												className="h-[310px] w-full"
											>
												<BarChart data={newUsersPerMonth ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="month" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar dataKey="value" fill="var(--color-users)" radius={[8, 8, 0, 0]} />
												</BarChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>
								</div>

								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
									{userSummaryCards.map((item) => (
										<div
											key={item.role}
											className="rounded-2xl border border-[#E0DCD5] bg-white/90 p-4 shadow-sm"
										>
											<div className="flex items-center justify-between gap-3">
												<span
													className="h-3 w-3 rounded-full"
													style={{ backgroundColor: item.fill }}
												/>
												<RoleBadge role={item.role} />
											</div>
											<p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#999]">
												{item.role.toLowerCase()} accounts
											</p>
											<p className="mt-2 font-sans text-3xl font-bold text-[#333]">
												{compactNumber(item.value)}
											</p>
										</div>
									))}
								</div>

								<DashboardCard
									title="System users"
									description="Recent users by role, status and available AI token balance."
									icon={Users}
								>
									<div className="overflow-x-auto rounded-xl border border-[#E0DCD5] bg-white">
										<table className="min-w-full text-sm">
											<thead className="bg-[#FAF9F6] text-xs uppercase tracking-[0.14em] text-[#999]">
												<tr>
													<th className="px-4 py-3 text-left">User</th>
													<th className="px-4 py-3 text-left">Role</th>
													<th className="px-4 py-3 text-left">Status</th>
													<th className="px-4 py-3 text-right">AI Tokens</th>
													<th className="px-4 py-3 text-left">Joined</th>
												</tr>
											</thead>
											<tbody>
												{(recentUsers ?? []).map((user) => (
													<tr
														key={user.id}
														className="border-t border-[#F0EDE8] hover:bg-[#FAF9F6]"
													>
														<td className="px-4 py-3">
															<p className="font-medium text-[#333]">{user.name}</p>
															<p className="text-xs text-[#999]">{user.email}</p>
														</td>
														<td className="px-4 py-3">
															<RoleBadge role={user.role} />
														</td>
														<td className="px-4 py-3">
															<span
																className={cn(
																	'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
																	user.isActive
																		? 'border-[#C8E6C9] bg-[#E8F5E9] text-[#2E7D32]'
																		: 'border-[#FFCDD2] bg-[#FEECEC] text-[#C62828]',
																)}
															>
																{user.isActive ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="px-4 py-3 text-right font-mono text-[#333]">
															{compactNumber(user.credit)}
														</td>
														<td className="px-4 py-3 text-[#555]">
															{format(new Date(user.createdAt), 'dd MMM yyyy')}
														</td>
													</tr>
												))}
												{(!recentUsers || recentUsers.length === 0) && (
													<tr>
														<td colSpan={5} className="px-4 py-8 text-center text-sm text-[#999]">
															No users found for the selected period.
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								</DashboardCard>
							</TabsContent>

							<TabsContent value="learning" className="space-y-5">
								<div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
									<DashboardCard
										title="Classroom creation"
										description="New teaching spaces created in this period."
										icon={LayoutGrid}
									>
										<ChartBlock
											isEmpty={!classroomMonthly?.length}
											emptyText="No classrooms created in this period."
										>
											<ChartContainer
												config={{ classrooms: { label: 'Classrooms', color: '#F5B041' } }}
												className="h-[300px] w-full"
											>
												<BarChart data={classroomMonthly ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="month" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar
														dataKey="value"
														fill="var(--color-classrooms)"
														radius={[8, 8, 0, 0]}
													/>
												</BarChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>

									<DashboardCard
										title="AI feature mix"
										description="Which AI capabilities teachers are using."
										icon={Bot}
									>
										<ChartBlock isEmpty={!aiUsagePieData.length} emptyText="No AI usage data.">
											<ChartContainer
												config={{
													lesson: { label: 'Lessons', color: aiColors.lesson },
													quiz: { label: 'Quizzes', color: aiColors.quiz },
													exam: { label: 'Exams', color: aiColors.exam },
												}}
												className="h-[300px] w-full"
											>
												<PieChart>
													<ChartTooltip content={<ChartTooltipContent />} />
													<Pie
														data={aiUsagePieData}
														dataKey="value"
														nameKey="feature"
														innerRadius={52}
														outerRadius={88}
														paddingAngle={3}
													>
														{aiUsagePieData.map((entry) => (
															<Cell key={entry.feature} fill={entry.fill} />
														))}
													</Pie>
													<ChartLegend />
												</PieChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>
								</div>

								<DashboardCard
									title="Top active classrooms"
									description="Engagement score from recent classroom activity logs."
									icon={Activity}
								>
									<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
										{(topClassrooms ?? []).map((classroom, index) => (
											<div
												key={classroom.name}
												className="rounded-xl border border-[#E0DCD5] bg-[#FAF9F6] p-4"
											>
												<div className="flex items-center justify-between gap-3">
													<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333] text-xs font-semibold text-white">
														{index + 1}
													</span>
													<span className="rounded-full bg-white px-2 py-1 text-xs text-[#666]">
														{classroom.score} pts
													</span>
												</div>
												<p className="mt-4 line-clamp-2 text-sm font-semibold text-[#333]">
													{classroom.name}
												</p>
											</div>
										))}
										{(!topClassrooms || topClassrooms.length === 0) && (
											<p className="rounded-xl border border-dashed border-[#E0DCD5] p-6 text-sm text-[#666]">
												No classroom activity yet.
											</p>
										)}
									</div>
								</DashboardCard>
							</TabsContent>

							<TabsContent value="revenue" className="space-y-5">
								<div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
									<DashboardCard
										title="Transaction volume"
										description="All transaction events, including trials and payment attempts."
										icon={BarChart3}
									>
										<ChartBlock
											isEmpty={!transactionsMonthly?.length}
											emptyText="No transaction events in this period."
										>
											<ChartContainer
												config={{ transactions: { label: 'Transactions', color: '#C5B4E3' } }}
												className="h-[300px] w-full"
											>
												<BarChart data={transactionsMonthly ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="month" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar
														dataKey="value"
														fill="var(--color-transactions)"
														radius={[8, 8, 0, 0]}
													/>
												</BarChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>

									<DashboardCard
										title="Payment status"
										description="Distribution of transaction states."
										icon={WalletCards}
									>
										<ChartBlock
											isEmpty={!txStatusPieData.length}
											emptyText="No payment status data."
										>
											<ChartContainer
												config={{
													SUCCESS: { label: 'Success', color: transactionColors.SUCCESS },
													PENDING: { label: 'Pending', color: transactionColors.PENDING },
													FAILED: { label: 'Failed', color: transactionColors.FAILED },
													TRIAL: { label: 'Trial', color: transactionColors.TRIAL },
												}}
												className="h-[300px] w-full"
											>
												<PieChart>
													<ChartTooltip content={<ChartTooltipContent />} />
													<Pie
														data={txStatusPieData}
														dataKey="value"
														nameKey="status"
														innerRadius={52}
														outerRadius={88}
														paddingAngle={3}
													>
														{txStatusPieData.map((entry) => (
															<Cell key={entry.status} fill={entry.fill} />
														))}
													</Pie>
													<ChartLegend />
												</PieChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>
								</div>

								<DashboardCard
									title="Recent transactions"
									description="Latest payment and trial events across the platform."
									icon={CreditCard}
								>
									<div className="overflow-x-auto rounded-xl border border-[#E0DCD5] bg-white">
										<table className="min-w-full text-sm">
											<thead className="bg-[#FAF9F6] text-xs uppercase tracking-[0.14em] text-[#999]">
												<tr>
													<th className="px-4 py-3 text-left">User</th>
													<th className="px-4 py-3 text-left">Type</th>
													<th className="px-4 py-3 text-right">Amount</th>
													<th className="px-4 py-3 text-left">Date</th>
													<th className="px-4 py-3 text-left">Status</th>
												</tr>
											</thead>
											<tbody>
												{(recentTransactions ?? []).map((tx) => (
													<tr key={tx.id} className="border-t border-[#F0EDE8] hover:bg-[#FAF9F6]">
														<td className="px-4 py-3">
															<div className="flex items-center gap-2">
																<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C5B4E3] text-xs font-semibold text-white">
																	{tx.userInitials}
																</div>
																<div>
																	<p className="font-medium text-[#333]">{tx.userName}</p>
																	<p className="text-xs text-[#999]">{tx.email}</p>
																</div>
															</div>
														</td>
														<td className="px-4 py-3 text-[#555]">{tx.planName}</td>
														<td className="px-4 py-3 text-right font-mono text-[#333]">
															{formatCurrency(tx.amount)}
														</td>
														<td className="px-4 py-3 text-[#555]">
															{format(new Date(tx.createdAt), 'dd MMM yyyy, HH:mm')}
														</td>
														<td className="px-4 py-3">
															<StatusBadge status={tx.status} />
														</td>
													</tr>
												))}
												{(!recentTransactions || recentTransactions.length === 0) && (
													<tr>
														<td colSpan={5} className="px-4 py-8 text-center text-sm text-[#999]">
															No transactions found for the selected period.
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								</DashboardCard>
							</TabsContent>

							<TabsContent value="feedback" className="space-y-5">
								<div className="grid gap-4 md:grid-cols-3">
									<InsightCard
										label="Reviewers"
										value={reviews?.totalReviews ?? 0}
										helper="Users who rated AI output"
										icon={Users}
									/>
									<InsightCard
										label="Average rating"
										value={reviews?.averageRating ?? 0}
										helper="Mean score from 1 to 5"
										icon={Star}
									/>
									<InsightCard
										label="Comments"
										value={reviews?.commentsCount ?? 0}
										helper="Written comments and feedback"
										icon={MessageSquareText}
									/>
								</div>

								<div className="grid items-start gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
									<DashboardCard
										title="Rating distribution"
										description="How users rate AI generated learning content."
										icon={Star}
									>
										<ChartBlock
											isEmpty={!reviewRatingData.some((item) => item.value > 0)}
											emptyText="No ratings in this period."
										>
											<ChartContainer
												config={{ value: { label: 'Reviews', color: '#F5B041' } }}
												className="h-[300px] w-full"
											>
												<BarChart data={reviewRatingData}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="label" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} allowDecimals={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar dataKey="value" radius={[8, 8, 0, 0]}>
														{reviewRatingData.map((entry) => (
															<Cell key={entry.rating} fill={entry.fill} />
														))}
													</Bar>
												</BarChart>
											</ChartContainer>
										</ChartBlock>
									</DashboardCard>

									<DashboardCard
										title="Recent feedback"
										description="Latest comments attached to rated AI interactions."
										icon={MessageSquareText}
									>
										<div className="flex min-h-[300px] flex-col">
											<div className="space-y-3">
												{visibleFeedback.map((item) => (
													<div
														key={item.id}
														className="rounded-xl border border-[#E0DCD5] bg-[#FAF9F6] p-4"
													>
														<div className="flex flex-wrap items-start justify-between gap-3">
															<div>
																<p className="font-medium text-[#333]">{item.userName}</p>
																<p className="text-xs text-[#999]">
																	{item.email || item.role} · {item.feature}
																</p>
															</div>
															<RatingBadge rating={item.rating} />
														</div>
														{item.comment && (
															<p className="mt-3 line-clamp-3 rounded-lg bg-white px-3 py-2 text-sm text-[#555]">
																{item.comment}
															</p>
														)}
														{item.feedback && (
															<p className="mt-2 line-clamp-2 text-sm text-[#666]">
																{item.feedback}
															</p>
														)}
														<p className="mt-3 text-xs text-[#999]">
															{format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm')}
														</p>
													</div>
												))}
											</div>
											{feedbackItems.length === 0 && (
												<div className="rounded-xl border border-dashed border-[#E0DCD5] bg-[#FAF9F6] p-8 text-center text-sm text-[#666]">
													No written feedback in this period.
												</div>
											)}
											{feedbackItems.length > FEEDBACK_PAGE_SIZE && (
												<div className="mt-auto flex flex-col gap-3 border-t border-[#F0EDE8] pt-4 sm:flex-row sm:items-center sm:justify-between">
													<p className="text-xs text-[#999]">
														Page {safeFeedbackPage} of {feedbackTotalPages} · {feedbackItems.length}{' '}
														comments
													</p>
													<div className="flex items-center gap-2">
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="rounded-xl"
															disabled={safeFeedbackPage <= 1}
															onClick={() => setFeedbackPage((page) => Math.max(1, page - 1))}
														>
															<ChevronLeft className="mr-1 h-4 w-4" />
															Prev
														</Button>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="rounded-xl"
															disabled={safeFeedbackPage >= feedbackTotalPages}
															onClick={() =>
																setFeedbackPage((page) => Math.min(feedbackTotalPages, page + 1))
															}
														>
															Next
															<ChevronRight className="ml-1 h-4 w-4" />
														</Button>
													</div>
												</div>
											)}
										</div>
									</DashboardCard>
								</div>
							</TabsContent>

							<TabsContent value="subscriptions" className="space-y-5">
								<SubscriptionPlanManagement />
							</TabsContent>
						</div>
					</Tabs>

					{isLoading && (
						<div className="fixed bottom-4 right-4 rounded-full border border-[#E0DCD5] bg-white px-4 py-2 text-xs text-[#666] shadow-lg">
							Refreshing dashboard...
						</div>
					)}
				</main>
			</div>
		</AdminGuard>
	);
}

function SegmentedControl({
	value,
	options,
	onChange,
}: {
	value: string;
	options: Array<{ label: string; value: string }>;
	onChange: (value: string) => void;
}) {
	return (
		<div className="flex items-center gap-1 rounded-full border border-[#E0DCD5] bg-white p-1 shadow-sm">
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={cn(
						'rounded-full px-3 py-1.5 text-xs font-medium transition',
						value === option.value ? 'bg-[#333] text-white' : 'text-[#666] hover:bg-[#F0EDE8]',
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

function YearInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
	return (
		<input
			type="number"
			value={value}
			onChange={(event) => onChange(Number(event.target.value))}
			className="h-9 w-24 rounded-full border border-[#E0DCD5] bg-white px-3 text-xs text-[#333] shadow-sm outline-none focus:border-[#F5B041]"
		/>
	);
}

function TabButton({
	value,
	icon: Icon,
	label,
	collapsed,
}: {
	value: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	label: string;
	collapsed?: boolean;
}) {
	return (
		<TabsTrigger
			value={value}
			className={cn(
				'gap-2 rounded-xl px-3 py-2 text-sm data-[state=active]:bg-[#F5B041]/20 data-[state=active]:font-semibold data-[state=active]:text-[#333] data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-[#F5B041]/25',
				collapsed ? 'w-full justify-center px-2' : 'w-full justify-start',
			)}
		>
			<Icon className="h-4 w-4" />
			{!collapsed && <span>{label}</span>}
		</TabsTrigger>
	);
}

type SummaryCardProps = {
	label: string;
	value: number;
	delta: number;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	isCurrency?: boolean;
	deltaLabel?: string;
};

function SummaryCard({
	label,
	value,
	delta,
	icon: Icon,
	isCurrency,
	deltaLabel,
}: SummaryCardProps) {
	const positive = delta >= 0;
	const formatted = isCurrency ? formatCurrency(value) : compactNumber(value);
	const deltaText =
		deltaLabel === 'cost' ? formatCurrency(delta) : `${Math.abs(delta).toFixed(1)}%`;

	return (
		<Card className="overflow-hidden border-[#E0DCD5] bg-white/95 shadow-sm">
			<CardContent className="p-4">
				<div className="mb-4 flex items-center justify-between gap-3">
					<span className="truncate text-xs font-medium uppercase tracking-[0.14em] text-[#999]">
						{label}
					</span>
					<span className="rounded-xl bg-[#FAF9F6] p-2">
						<Icon className="h-4 w-4 text-[#333]" />
					</span>
				</div>
				<p className="truncate font-sans text-2xl font-bold text-[#333]">{formatted}</p>
				<p
					className={cn(
						'mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium',
						positive ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FEECEC] text-[#C62828]',
					)}
				>
					{deltaLabel ? `${deltaText} ${deltaLabel}` : `${positive ? '+' : '-'}${deltaText}`}
				</p>
			</CardContent>
		</Card>
	);
}

function MiniMetric({ label, value }: { label: string; value: number | string }) {
	return (
		<div className="rounded-xl bg-white/35 p-3 ring-1 ring-white/35">
			<p className="text-[11px] uppercase tracking-[0.14em] text-[#5F4A1F]">{label}</p>
			<p className="mt-2 font-sans text-xl font-bold">{value}</p>
		</div>
	);
}

function InsightCard({
	label,
	value,
	helper,
	icon: Icon,
	isCurrency,
}: {
	label: string;
	value: number;
	helper: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	isCurrency?: boolean;
}) {
	return (
		<div className="rounded-2xl border border-[#E0DCD5] bg-white/90 p-4 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.14em] text-[#999]">{label}</p>
					<p className="mt-2 font-sans text-2xl font-bold text-[#333]">
						{isCurrency ? formatCurrency(value) : compactNumber(value)}
					</p>
				</div>
				<span className="rounded-xl bg-[#F5B041]/15 p-2">
					<Icon className="h-4 w-4 text-[#333]" />
				</span>
			</div>
			<p className="mt-3 text-sm text-[#666]">{helper}</p>
		</div>
	);
}

function DashboardCard({
	title,
	description,
	icon: Icon,
	children,
}: {
	title: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	children: React.ReactNode;
}) {
	return (
		<Card className="border-[#E0DCD5] bg-white/95 shadow-sm">
			<CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
				<div>
					<CardTitle className="font-sans text-base text-[#333]">{title}</CardTitle>
					<CardDescription className="mt-1 text-sm text-[#666]">{description}</CardDescription>
				</div>
				<span className="rounded-xl bg-[#FAF9F6] p-2">
					<Icon className="h-4 w-4 text-[#333]" />
				</span>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

function ChartBlock({
	isEmpty,
	emptyText,
	children,
}: {
	isEmpty: boolean;
	emptyText: string;
	children: React.ReactNode;
}) {
	if (isEmpty) {
		return (
			<div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-[#E0DCD5] bg-[#FAF9F6] text-sm text-[#666]">
				{emptyText}
			</div>
		);
	}

	return children;
}

function RoleBadge({ role }: { role: string }) {
	const color = roleColors[role] ?? '#8D8D8D';

	return (
		<span
			className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
			style={{
				borderColor: `${color}55`,
				backgroundColor: `${color}18`,
				color,
			}}
		>
			{role}
		</span>
	);
}

function RatingBadge({ rating }: { rating: number }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full border border-[#FFECB3] bg-[#FFF8E1] px-2.5 py-1 text-xs font-semibold text-[#B7791F]">
			<Star className="h-3.5 w-3.5 fill-[#F5B041] text-[#F5B041]" />
			{rating}/5
		</span>
	);
}

function StatusBadge({ status }: { status: string }) {
	return (
		<span
			className={cn(
				'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
				status === 'SUCCESS' && 'border-[#C8E6C9] bg-[#E8F5E9] text-[#2E7D32]',
				status === 'PENDING' && 'border-[#FFECB3] bg-[#FFF8E1] text-[#FF8F00]',
				status === 'FAILED' && 'border-[#FFCDD2] bg-[#FEECEC] text-[#C62828]',
				status === 'TRIAL' && 'border-[#D5EAF4] bg-[#EDF7FB] text-[#2F7194]',
			)}
		>
			{status}
		</span>
	);
}

function compactNumber(value: number) {
	return new Intl.NumberFormat('en-US', {
		notation: Math.abs(value) >= 10000 ? 'compact' : 'standard',
		maximumFractionDigits: 1,
	}).format(value);
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(value);
}
