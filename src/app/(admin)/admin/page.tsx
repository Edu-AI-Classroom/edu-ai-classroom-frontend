'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from 'recharts';
import { Activity, CreditCard, GraduationCap, LayoutGrid, TrendingUp, Users } from 'lucide-react';

import { TeachifyIcon } from '@/components/common/Teachify';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminGuard } from '@/components/auth/admin-guard';
import { useAdminDashboard } from '@/hooks/queries/admin/use-admin-dashboard';
import { cn } from '@/lib/utils/utils';
import { SubscriptionPlanManagement } from '@/features/admin/subscription/subscription-plan-management';

type DateFilterMode = 'range' | 'month' | 'year' | 'quarter' | 'day';
type CompareMode = 'none' | 'month' | 'year' | 'quarter' | 'day';

export default function AdminDashboardPage() {
	const [dateMode, setDateMode] = useState<DateFilterMode>('month');
	const [compareMode, setCompareMode] = useState<CompareMode>('none');
	const [selectedMonth] = useState<number>(new Date().getMonth() + 1);
	const [selectedYear] = useState<number>(new Date().getFullYear());
	const [selectedQuarter] = useState<number>(Math.floor(new Date().getMonth() / 3) + 1);
	const [rangeFrom, setRangeFrom] = useState<string | undefined>();
	const [rangeTo, setRangeTo] = useState<string | undefined>();

	const effectiveMode: DateFilterMode =
		dateMode === 'range' && rangeFrom && rangeTo ? 'range' : 'month';

	const filters = {
		mode: effectiveMode === 'range' ? 'range' : dateMode,
		month: selectedMonth,
		year: selectedYear,
		quarter: selectedQuarter,
		day: new Date().toISOString().split('T')[0],
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
	} = useAdminDashboard(filters);

	const rolePieData =
		roleDistribution?.map((item) => ({
			...item,
			fill: `var(--color-${item.role})`,
		})) ?? [];

	const aiUsagePieData =
		aiUsage?.map((item) => ({
			...item,
			fill: `var(--color-${item.feature})`,
		})) ?? [];

	const txStatusPieData =
		transactionStatus?.map((item) => ({
			...item,
			fill: `var(--color-${item.status})`,
		})) ?? [];

	return (
		<AdminGuard allowedRoles={['ADMIN']} redirectTo="/student">
			<div className="min-h-screen bg-[#FAF9F6] grid-paper">
				<header className="sticky top-0 z-50 border-b border-[#E0DCD5] bg-[#FAF9F6]/95 backdrop-blur-sm">
					<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
						<div className="flex items-center gap-6">
							<TeachifyIcon />
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 rounded-full border border-[#E0DCD5] bg-white/90 px-3 py-1.5 shadow-sm">
								<button
									className={cn(
										'rounded-full px-3 py-1 text-xs font-medium',
										dateMode === 'day'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setDateMode('day')}
								>
									Day
								</button>
								<button
									className={cn(
										'rounded-full px-3 py-1 text-xs font-medium',
										dateMode === 'month'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setDateMode('month')}
								>
									Month
								</button>
								<button
									className={cn(
										'rounded-full px-3 py-1 text-xs font-medium',
										dateMode === 'quarter'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setDateMode('quarter')}
								>
									Quarter
								</button>
								<button
									className={cn(
										'rounded-full px-3 py-1 text-xs font-medium',
										dateMode === 'year'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setDateMode('year')}
								>
									Year
								</button>
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										'rounded-full px-3 py-1 text-xs',
										dateMode === 'range' && 'bg-[#333] text-white',
									)}
									onClick={() => setDateMode('range')}
								>
									Range
								</Button>
							</div>

							<div className="flex items-center gap-2 rounded-full border border-[#E0DCD5] bg-white/90 px-3 py-1.5 shadow-sm">
								<span className="text-[11px] uppercase tracking-[0.16em] text-[#999]">
									Compare
								</span>
								<button
									className={cn(
										'rounded-full px-2.5 py-1 text-xs',
										compareMode === 'none'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setCompareMode('none')}
								>
									Off
								</button>
								<button
									className={cn(
										'rounded-full px-2.5 py-1 text-xs',
										compareMode === 'day'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setCompareMode('day')}
								>
									vs yesterday
								</button>
								<button
									className={cn(
										'rounded-full px-2.5 py-1 text-xs',
										compareMode === 'month'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setCompareMode('month')}
								>
									vs last month
								</button>
								<button
									className={cn(
										'rounded-full px-2.5 py-1 text-xs',
										compareMode === 'quarter'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setCompareMode('quarter')}
								>
									vs last quarter
								</button>
								<button
									className={cn(
										'rounded-full px-2.5 py-1 text-xs',
										compareMode === 'year'
											? 'bg-[#333] text-white'
											: 'text-[#666] hover:bg-[#F0EDE8]',
									)}
									onClick={() => setCompareMode('year')}
								>
									vs last year
								</button>
							</div>

							{dateMode === 'range' && (
								<div className="flex items-center gap-2 rounded-full border border-[#E0DCD5] bg-white/90 px-3 py-1.5 text-xs shadow-sm">
									<span className="text-[11px] uppercase tracking-[0.14em] text-[#999]">
										Date range
									</span>
									<input
										type="date"
										className="rounded-full border border-transparent bg-transparent px-2 py-1 text-[11px] text-[#333] outline-none focus:border-[#F5B041]"
										value={rangeFrom ?? ''}
										onChange={(e) => setRangeFrom(e.target.value || undefined)}
									/>
									<span className="text-[#999]">–</span>
									<input
										type="date"
										className="rounded-full border border-transparent bg-transparent px-2 py-1 text-[11px] text-[#333] outline-none focus:border-[#F5B041]"
										value={rangeTo ?? ''}
										onChange={(e) => setRangeTo(e.target.value || undefined)}
									/>
								</div>
							)}
						</div>
					</div>
				</header>

				<main className="mx-auto max-w-6xl px-6 py-8">
					<Tabs defaultValue="overview" className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
						<div className="flex flex-col gap-4">
							<div>
								<p className="font-sans text-xs uppercase tracking-[0.18em] text-[#999]">
									Analytics
								</p>
								<h2 className="mt-1 font-sans text-lg font-semibold text-[#333]">
									Admin insights
								</h2>
							</div>
							<TabsList className="flex h-auto flex-col items-stretch gap-1 bg-transparent p-0">
								<TabsTrigger
									value="overview"
									className="justify-start rounded-xl px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									Overview
								</TabsTrigger>
								<TabsTrigger
									value="users"
									className="justify-start rounded-xl px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									Users
								</TabsTrigger>
								<TabsTrigger
									value="classrooms"
									className="justify-start rounded-xl px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									Classrooms &amp; AI
								</TabsTrigger>
								<TabsTrigger
									value="revenue"
									className="justify-start rounded-xl px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									Revenue &amp; Transactions
								</TabsTrigger>
								<TabsTrigger
									value="subscriptions"
									className="justify-start rounded-xl px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									Subscription Plans
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="overview" className="space-y-8">
							<section>
								<div className="mb-4 flex items-center justify-between gap-2">
									<h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#666]">
										Overview
									</h2>
									<p className="text-xs text-[#999]">
										Last update: {format(new Date(), 'dd MMM yyyy, HH:mm')}
									</p>
								</div>

								<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
										icon={Users}
									/>
									<SummaryCard
										label="Classrooms"
										value={overview?.totalClassrooms ?? 0}
										delta={overview?.classroomsGrowth ?? 0}
										icon={LayoutGrid}
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
										icon={Activity}
									/>
								</div>
							</section>

							<section className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#666]">
										User snapshot
									</h2>
								</div>

								<Card>
									<CardHeader>
										<CardTitle className="text-sm">User role distribution</CardTitle>
										<CardDescription>How users are distributed across roles.</CardDescription>
									</CardHeader>
									<CardContent>
										<ChartContainer
											config={{
												TEACHER: { label: 'Teachers', color: '#C5B4E3' },
												STUDENT: { label: 'Students', color: '#F5B041' },
												PARENT: { label: 'Parents', color: '#E57373' },
												ADMIN: { label: 'Admins', color: '#4CAF50' },
											}}
											className="aspect-[4/3]"
										>
											<PieChart>
												<ChartTooltip content={<ChartTooltipContent />} />
												<Pie
													data={rolePieData}
													dataKey="value"
													nameKey="role"
													innerRadius={40}
													outerRadius={70}
												/>
												<ChartLegend />
											</PieChart>
										</ChartContainer>
									</CardContent>
								</Card>
							</section>
						</TabsContent>

						<TabsContent value="users" className="space-y-8">
							<section className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#666]">
										User Analytics
									</h2>
								</div>

								<div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-sm">
												<TrendingUp className="h-4 w-4 text-[#F5B041]" />
												User growth over time
											</CardTitle>
											<CardDescription>
												Daily active users and signup momentum across the selected window.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ChartContainer
												config={{
													users: { label: 'Users', color: '#F5B041' },
												}}
												className="aspect-[16/9]"
											>
												<LineChart data={userGrowth ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="date" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Line
														type="monotone"
														dataKey="value"
														stroke="var(--color-users)"
														strokeWidth={2}
														dot={false}
													/>
												</LineChart>
											</ChartContainer>
										</CardContent>
									</Card>

								</div>

								<Card>
									<CardHeader>
										<CardTitle className="text-sm">New users per month</CardTitle>
										<CardDescription>
											Enrollment patterns across the current and comparison period.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ChartContainer
											config={{
												users: { label: 'New users', color: '#C5B4E3' },
											}}
											className="aspect-[16/9]"
										>
											<BarChart data={newUsersPerMonth ?? []}>
												<CartesianGrid strokeDasharray="3 3" vertical={false} />
												<XAxis dataKey="month" tickLine={false} axisLine={false} />
												<YAxis tickLine={false} axisLine={false} />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Bar dataKey="value" fill="var(--color-users)" radius={[8, 8, 0, 0]} />
											</BarChart>
										</ChartContainer>
									</CardContent>
								</Card>
							</section>
						</TabsContent>

						<TabsContent value="classrooms" className="space-y-8">
							<section className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#666]">
										Classroom & AI usage
									</h2>
								</div>

								<div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">Classrooms created per month</CardTitle>
											<CardDescription>
												Growth of teaching spaces across the platform.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ChartContainer
												config={{
													classrooms: { label: 'Classrooms', color: '#F5B041' },
												}}
												className="aspect-[16/9]"
											>
												<BarChart data={classroomMonthly ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="month" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar
														dataKey="value"
														fill="var(--color-classrooms)"
														radius={[8, 8, 0, 0]}
													/>
												</BarChart>
											</ChartContainer>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-sm">Top active classrooms</CardTitle>
											<CardDescription>Most engaged classrooms by recent activity.</CardDescription>
										</CardHeader>
										<CardContent>
											<ChartContainer
												config={{
													activity: { label: 'Activity score', color: '#C5B4E3' },
												}}
												className="aspect-[4/3]"
											>
												<BarChart
													data={topClassrooms ?? []}
													layout="vertical"
													margin={{ left: 80, right: 16, top: 16, bottom: 16 }}
												>
													<CartesianGrid strokeDasharray="3 3" horizontal={false} />
													<XAxis type="number" tickLine={false} axisLine={false} />
													<YAxis
														type="category"
														dataKey="name"
														tickLine={false}
														axisLine={false}
														width={120}
													/>
													<ChartTooltip content={<ChartTooltipContent />} />
													<Bar
														dataKey="score"
														fill="var(--color-activity)"
														radius={[0, 8, 8, 0]}
													/>
												</BarChart>
											</ChartContainer>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader>
										<CardTitle className="text-sm">AI feature usage</CardTitle>
										<CardDescription>
											How educators are using AI capabilities across lessons, quizzes and exams.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ChartContainer
											config={{
												lesson: { label: 'Lesson generation', color: '#F5B041' },
												quiz: { label: 'Quiz generation', color: '#C5B4E3' },
												exam: { label: 'Exam matrix', color: '#E57373' },
											}}
											className="aspect-[4/2]"
										>
											<PieChart>
												<ChartTooltip content={<ChartTooltipContent />} />
												<Pie
													data={aiUsagePieData}
													dataKey="value"
													nameKey="feature"
													innerRadius={50}
													outerRadius={80}
												/>
												<ChartLegend />
											</PieChart>
										</ChartContainer>
									</CardContent>
								</Card>
							</section>
						</TabsContent>

						<TabsContent value="revenue" className="space-y-8">
							<section className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#666]">
										Revenue & Transactions
									</h2>
								</div>

								<div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
									<Card>
										<CardHeader>
											<CardTitle className="text-sm">Revenue over time</CardTitle>
											<CardDescription>Recurring and one-off revenue streams.</CardDescription>
										</CardHeader>
										<CardContent>
											<ChartContainer
												config={{
													revenue: { label: 'Revenue', color: '#4CAF50' },
												}}
												className="aspect-[4/3]"
											>
												<LineChart data={revenue ?? []}>
													<CartesianGrid strokeDasharray="3 3" vertical={false} />
													<XAxis dataKey="date" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} />
													<ChartTooltip content={<ChartTooltipContent />} />
													<Line
														type="monotone"
														dataKey="value"
														stroke="var(--color-revenue)"
														strokeWidth={2}
														dot={false}
													/>
												</LineChart>
											</ChartContainer>
										</CardContent>
									</Card>

									<div className="grid gap-4">
										<Card>
											<CardHeader>
												<CardTitle className="text-sm">Monthly transactions</CardTitle>
												<CardDescription>Volume of payment events per month.</CardDescription>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={{
														transactions: { label: 'Transactions', color: '#C5B4E3' },
													}}
													className="aspect-[16/9]"
												>
													<BarChart data={transactionsMonthly ?? []}>
														<CartesianGrid strokeDasharray="3 3" vertical={false} />
														<XAxis dataKey="month" tickLine={false} axisLine={false} />
														<YAxis tickLine={false} axisLine={false} />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Bar
															dataKey="value"
															fill="var(--color-transactions)"
															radius={[8, 8, 0, 0]}
														/>
													</BarChart>
												</ChartContainer>
											</CardContent>
										</Card>

										<Card>
											<CardHeader>
												<CardTitle className="text-sm">Transaction status</CardTitle>
												<CardDescription>
													Conversion health of your payment pipeline.
												</CardDescription>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={{
														SUCCESS: { label: 'Success', color: '#4CAF50' },
														PENDING: { label: 'Pending', color: '#F5B041' },
														FAILED: { label: 'Failed', color: '#E57373' },
													}}
													className="aspect-[16/9]"
												>
													<PieChart>
														<ChartTooltip content={<ChartTooltipContent />} />
														<Pie
															data={txStatusPieData}
															dataKey="value"
															nameKey="status"
															innerRadius={40}
															outerRadius={70}
														/>
														<ChartLegend />
													</PieChart>
												</ChartContainer>
											</CardContent>
										</Card>
									</div>
								</div>

								<Card>
									<CardHeader>
										<CardTitle className="text-sm">Recent transactions</CardTitle>
										<CardDescription>
											Latest payments across plans, including status and amounts.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto rounded-2xl border border-[#E0DCD5] bg-white">
											<table className="min-w-full text-sm">
												<thead className="bg-[#FAF9F6] text-xs uppercase tracking-[0.16em] text-[#999]">
													<tr>
														<th className="px-4 py-3 text-left">User</th>
														<th className="px-4 py-3 text-left">Plan</th>
														<th className="px-4 py-3 text-right">Amount</th>
														<th className="px-4 py-3 text-left">Date</th>
														<th className="px-4 py-3 text-left">Status</th>
													</tr>
												</thead>
												<tbody>
													{(recentTransactions ?? []).map((tx) => (
														<tr
															key={tx.id}
															className="border-t border-[#F0EDE8] hover:bg-[#FAF9F6]"
														>
															<td className="px-4 py-3">
																<div className="flex items-center gap-2">
																	<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5B4E3] text-xs font-semibold text-white">
																		{tx.userInitials}
																	</div>
																	<div>
																		<div className="text-[13px] font-medium text-[#333]">
																			{tx.userName}
																		</div>
																		<div className="text-[11px] text-[#999]">
																			{tx.email}
																		</div>
																	</div>
																</div>
															</td>
															<td className="px-4 py-3 text-[13px] text-[#333]">
																{tx.planName}
															</td>
															<td className="px-4 py-3 text-right text-[13px] font-mono">
																{new Intl.NumberFormat('en-US', {
																	style: 'currency',
																	currency: 'VND',
																}).format(tx.amount)}
															</td>
															<td className="px-4 py-3 text-[13px] text-[#555]">
																{format(new Date(tx.createdAt), 'dd MMM yyyy, HH:mm')}
															</td>
															<td className="px-4 py-3">
																<span
																	className={cn(
																		'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
																		tx.status === 'SUCCESS' &&
																		'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]',
																		tx.status === 'PENDING' &&
																		'bg-[#FFF8E1] text-[#FF8F00] border border-[#FFECB3]',
																		tx.status === 'FAILED' &&
																		'bg-[#FEECEC] text-[#C62828] border border-[#FFCDD2]',
																	)}
																>
																	{tx.status}
																</span>
															</td>
														</tr>
													))}
													{(!recentTransactions || recentTransactions.length === 0) && (
														<tr>
															<td
																colSpan={5}
																className="px-4 py-6 text-center text-[13px] text-[#999]"
															>
																No transactions found for the selected period.
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>
							</section>
						</TabsContent>

						<TabsContent value="subscriptions" className="space-y-8">
							<SubscriptionPlanManagement />
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</AdminGuard>
	);
}

type SummaryCardProps = {
	label: string;
	value: number;
	delta: number;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	isCurrency?: boolean;
};

function SummaryCard({ label, value, delta, icon: Icon, isCurrency }: SummaryCardProps) {
	const positive = delta >= 0;

	const formatted = isCurrency
		? new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'VND',
			maximumFractionDigits: 0,
		}).format(value)
		: value.toLocaleString();

	return (
		<Card className="relative overflow-hidden border-[#E0DCD5] bg-white/90 shadow-sm">
			<CardContent className="flex flex-col gap-3 px-4 py-3.5">
				<div className="flex items-center justify-between">
					<span className="truncate text-[11px] uppercase tracking-[0.18em] text-[#999]" title={label}>{label}</span>
					<span className="shrink-0 rounded-full bg-[#F0EDE8] p-1.5">
						<Icon className="h-3.5 w-3.5 text-[#333]" />
					</span>
				</div>
				<div className="flex items-baseline justify-between gap-2 overflow-hidden">
					<span className="truncate font-sans text-xl font-semibold text-[#333]">{formatted}</span>
					<span
						className={cn(
							'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
							positive ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FEECEC] text-[#C62828]',
						)}
					>
						{positive ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

