'use client';

import { ArrowLeft, Bell, BookOpen, Clock, FileWarning, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ClassData, currentTeacher } from '@/lib/mock-data';

interface ClassListViewProps {
	classes: ClassData[];
	onSelectClass: (classId: string) => void;
}

export default function ClassListView({ classes, onSelectClass }: ClassListViewProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const filteredClasses = classes.filter(
		(c) =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.subject.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-[#FAF9F6] grid-paper">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard" className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-[#F5B041] flex items-center justify-center">
								<BookOpen className="w-5 h-5 text-[#333]" />
							</div>
							<span className="font-sans font-bold text-xl text-[#333]">Teachify</span>
						</Link>
					</div>

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
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-6xl mx-auto px-6 py-10">
				{/* Back Link & Title */}
				<div className="mb-8">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333] mb-4"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Dashboard
					</Link>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="font-sans font-bold text-3xl text-[#333]">My Classes</h1>
							<p className="font-serif text-lg text-[#666]">Select a class to manage</p>
						</div>

						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button className="bg-[#F5B041] hover:bg-[#E5A030] text-[#333] font-semibold rounded-xl">
									<Plus className="w-4 h-4 mr-2" />
									Create New Class
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md bg-white rounded-2xl">
								<DialogHeader>
									<DialogTitle className="font-sans font-bold text-xl">
										Create New Class
									</DialogTitle>
									<DialogDescription className="text-[#666]">
										Add a new class to your roster.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="className">Class Name</Label>
										<Input id="className" placeholder="e.g., Class 7A" className="rounded-xl" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="subject">Subject</Label>
										<Input id="subject" placeholder="e.g., Mathematics" className="rounded-xl" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="grade">Grade Level</Label>
										<Input id="grade" placeholder="e.g., Grade 7" className="rounded-xl" />
									</div>
								</div>
								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsDialogOpen(false)}
										className="rounded-xl"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										className="bg-[#F5B041] hover:bg-[#E5A030] text-[#333] rounded-xl"
										onClick={() => setIsDialogOpen(false)}
									>
										Create Class
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* Search */}
				<div className="relative mb-8 max-w-md">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
					<Input
						placeholder="Search classes..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl bg-white border-[#E0DCD5]"
					/>
				</div>

				{/* Class Grid */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredClasses.map((classItem) => (
						<button
							type="button"
							key={classItem.id}
							onClick={() => onSelectClass(classItem.id)}
							className="text-left group"
						>
							<div
								className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#F5B041]/30"
								style={{
									transform: `rotate(${classItem.rotation}deg)`,
								}}
							>
								{/* Color Badge */}
								<div
									className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
									style={{ backgroundColor: classItem.color }}
								>
									<Users className="w-4 h-4 text-[#333]" />
								</div>

								<div className="mb-4">
									<h3 className="font-sans font-bold text-xl text-[#333] group-hover:text-[#F5B041] transition-colors">
										{classItem.name}
									</h3>
									<p className="text-sm text-[#666]">{classItem.subject}</p>
									<p className="text-xs text-[#999] font-medium mt-1">{classItem.grade}</p>
								</div>

								<div className="flex items-center gap-4 text-sm text-[#666] mb-4">
									<div className="flex items-center gap-1">
										<Users className="w-4 h-4" />
										<span>{classItem.studentCount} students</span>
									</div>
								</div>

								{/* Indicators */}
								<div className="flex flex-wrap gap-2">
									{classItem.pendingGrading > 0 && (
										<span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#F5B041]/20 text-[#B8860B]">
											<FileWarning className="w-3 h-3" />
											{classItem.pendingGrading} to grade
										</span>
									)}
									{classItem.upcomingDeadlines > 0 && (
										<span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#E57373]/20 text-[#C62828]">
											<Clock className="w-3 h-3" />
											{classItem.upcomingDeadlines} deadlines
										</span>
									)}
								</div>
							</div>
						</button>
					))}
				</div>

				{filteredClasses.length === 0 && (
					<div className="text-center py-16">
						<div className="w-16 h-16 rounded-full bg-[#F0EDE8] flex items-center justify-center mx-auto mb-4">
							<Search className="w-8 h-8 text-[#999]" />
						</div>
						<p className="text-[#666]">No classes found matching your search.</p>
					</div>
				)}
			</main>
		</div>
	);
}
