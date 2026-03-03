'use client';

import {
	Bell,
	BookOpen,
	ChevronRight,
	Clock,
	FileCheck,
	FolderOpen,
	LayoutGrid,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { classes, currentTeacher } from '@/lib/mock-data';

const features = [
	{
		id: 'classroom',
		title: 'Classroom Management',
		description: 'Manage your classes, students, assignments, and grades all in one place.',
		icon: Users,
		href: '/classroom',
		color: '#F5B041',
		stats: `${classes.length} Classes`,
	},
	{
		id: 'canvas',
		title: 'Lesson Canvas',
		description: 'Design interactive lessons with our AI-powered drag-and-drop builder.',
		icon: LayoutGrid,
		href: '/canvas',
		color: '#A8D5BA',
		stats: '12 Lessons',
	},
	{
		id: 'library',
		title: 'Content Library',
		description: 'Access and organize your teaching materials, resources, and media.',
		icon: FolderOpen,
		href: '/library',
		color: '#C5B4E3',
		stats: '48 Resources',
	},
];

const quickInsights = [
	{ label: 'Pending Grading', value: 25, icon: FileCheck, color: '#F5B041' },
	{ label: 'Upcoming Deadlines', value: 10, icon: Clock, color: '#E57373' },
	{ label: 'Total Students', value: 109, icon: Users, color: '#A8D5BA' },
];

export default function TeacherDashboard() {
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);

	return (
		<div className="min-h-screen bg-[#FAF9F6] grid-paper">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-xl bg-[#F5B041] flex items-center justify-center">
							<BookOpen className="w-5 h-5 text-[#333]" />
						</div>
						<span className="font-sans font-bold text-xl text-[#333]">Teachify</span>
					</Link>

					<div className="flex items-center gap-4">
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="w-5 h-5 text-[#666]" />
							<span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E57373] text-white text-xs rounded-full flex items-center justify-center">
								3
							</span>
						</Button>

						<div className="flex items-center gap-3 pl-4 border-l border-[#E0DCD5]">
							<div className="w-10 h-10 rounded-full bg-[#C5B4E3] flex items-center justify-center text-white font-semibold">
								{currentTeacher.name
									.split(' ')
									.map((n) => n[0])
									.join('')}
							</div>
							<div className="hidden sm:block">
								<p className="font-sans font-semibold text-sm text-[#333]">{currentTeacher.name}</p>
								<p className="text-xs text-[#666]">{currentTeacher.role}</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-6xl mx-auto px-6 py-10">
				{/* Welcome Section */}
				<div className="mb-10">
					<h1 className="font-sans font-bold text-3xl text-[#333] mb-2">
						Good morning, {currentTeacher.name.split(' ')[1]}!
					</h1>
					<p className="font-serif text-xl text-[#666]">Ready to make learning magical today?</p>
				</div>

				{/* Feature Launchpad */}
				<section className="mb-12">
					<h2 className="font-sans font-bold text-lg text-[#333] mb-6 flex items-center gap-2">
						<span className="w-2 h-6 rounded-full bg-[#F5B041]" />
						Feature Launchpad
					</h2>

					<div className="grid md:grid-cols-3 gap-6">
						{features.map((feature) => (
							<Link
								key={feature.id}
								href={feature.href}
								className="group"
								onMouseEnter={() => setHoveredCard(feature.id)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								<div
									className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#F5B041]/30"
									style={{
										transform:
											hoveredCard === feature.id
												? 'rotate(0deg) scale(1.02)'
												: `rotate(${feature.id === 'classroom' ? -1 : feature.id === 'canvas' ? 0.5 : -0.5}deg)`,
									}}
								>
									{/* Sticker Icon */}
									<div
										className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 sticker"
										style={{ backgroundColor: feature.color }}
									>
										<feature.icon className="w-7 h-7 text-[#333]" />
									</div>

									<h3 className="font-sans font-bold text-lg text-[#333] mb-2">{feature.title}</h3>
									<p className="text-sm text-[#666] mb-4 leading-relaxed">{feature.description}</p>

									<div className="flex items-center justify-between">
										<span className="text-xs font-semibold text-[#666] bg-[#F0EDE8] px-3 py-1 rounded-full">
											{feature.stats}
										</span>
										<ChevronRight className="w-5 h-5 text-[#666] group-hover:text-[#F5B041] group-hover:translate-x-1 transition-all" />
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* Quick Insights */}
				<section>
					<h2 className="font-sans font-bold text-lg text-[#333] mb-6 flex items-center gap-2">
						<span className="w-2 h-6 rounded-full bg-[#A8D5BA]" />
						Quick Insights
					</h2>

					<div className="grid sm:grid-cols-3 gap-4">
						{quickInsights.map((insight, index) => (
							<div
								key={insight.label}
								className="bg-white rounded-xl p-5 shadow-sm border border-[#E0DCD5]"
								style={{
									transform: `rotate(${index === 0 ? -0.5 : index === 1 ? 0.5 : -0.3}deg)`,
								}}
							>
								<div className="flex items-center gap-3">
									<div
										className="w-10 h-10 rounded-lg flex items-center justify-center"
										style={{ backgroundColor: `${insight.color}20` }}
									>
										<insight.icon className="w-5 h-5" style={{ color: insight.color }} />
									</div>
									<div>
										<p className="font-sans font-bold text-2xl text-[#333]">{insight.value}</p>
										<p className="text-xs text-[#666]">{insight.label}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-[#E0DCD5] mt-16">
				<div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-[#666]">© 2026 Teachify. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link href="#" className="text-sm text-[#666] hover:text-[#333]">
							Help
						</Link>
						<Link href="#" className="text-sm text-[#666] hover:text-[#333]">
							Privacy
						</Link>
						<Link href="#" className="text-sm text-[#666] hover:text-[#333]">
							Terms
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
