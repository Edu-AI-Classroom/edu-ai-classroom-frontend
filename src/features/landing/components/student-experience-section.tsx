'use client';

import { BookOpen, CheckCircle, Globe, Sparkles, Star, TrendingUp } from 'lucide-react';
import { StickerIcon } from './sticker-icon';

export function StudentExperienceSection() {
	return (
		<section id="students" className="py-20 md:py-28">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<span className="font-serif text-xl text-[#F5B041]">For Students</span>
					<h2 className="mt-2 text-balance font-sans text-3xl font-extrabold text-charcoal md:text-4xl lg:text-5xl">
						Guided Learning
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Learn better with AI-powered step-by-step guidance that helps you truly understand.
					</p>
				</div>

				{/* Overlapping Cards Layout */}
				<div className="mt-16 relative">
					<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
						{/* Left Side - Overlapping cards */}
						<div className="relative min-h-[400px]">
							{/* Card 1 - Student Progress */}
							<div className="polaroid absolute left-0 top-0 w-[280px] rotate-[-4deg] z-10 md:w-[320px]">
								<div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-[#A8D5BA] to-[#A8D4E6] p-4">
									<div className="h-full rounded bg-white/90 p-4">
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-[#C5B4E3]" />
											<div>
												<p className="font-sans text-sm font-bold text-charcoal">Sarah M.</p>
												<p className="text-xs text-muted-foreground">Grade 7</p>
											</div>
										</div>
										<div className="mt-4 space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-xs text-muted-foreground">Math</span>
												<span className="text-xs font-bold text-[#A8D5BA]">92%</span>
											</div>
											<div className="h-2 rounded-full bg-muted">
												<div className="h-2 rounded-full bg-[#A8D5BA]" style={{ width: '92%' }} />
											</div>
											<div className="flex items-center justify-between">
												<span className="text-xs text-muted-foreground">Science</span>
												<span className="text-xs font-bold text-[#A8D4E6]">87%</span>
											</div>
											<div className="h-2 rounded-full bg-muted">
												<div className="h-2 rounded-full bg-[#A8D4E6]" style={{ width: '87%' }} />
											</div>
										</div>
									</div>
								</div>
								<p className="mt-2 text-center font-serif text-lg text-charcoal">
									{'Keep it up! 🌟'}
								</p>
							</div>

							{/* Card 2 - AI Guidance */}
							<div className="polaroid absolute right-0 top-16 w-[260px] rotate-[3deg] z-20 md:right-8 md:w-[300px]">
								<div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-[#C5B4E3] to-[#F2C4CE] p-4">
									<div className="h-full rounded bg-white/90 p-4">
										<div className="flex items-center gap-2 mb-3">
											<Sparkles className="h-5 w-5 text-[#F5B041]" />
											<span className="font-sans text-sm font-bold text-charcoal">AI Helper</span>
										</div>
										<div className="rounded-lg bg-[#F5B041]/10 p-3">
											<p className="text-xs text-charcoal">
												{
													'"Let\'s break this down! First, try to identify the variables in the equation..."'
												}
											</p>
										</div>
										<div className="mt-3 flex gap-2">
											<span className="rounded-full bg-[#A8D5BA]/30 px-2 py-1 text-xs">Hint</span>
											<span className="rounded-full bg-[#A8D4E6]/30 px-2 py-1 text-xs">
												Step-by-step
											</span>
										</div>
									</div>
								</div>
								<p className="mt-2 text-center font-serif text-lg text-charcoal">
									{'Always here to help! 💡'}
								</p>
							</div>

							{/* Card 3 - Auto Grading */}
							<div className="polaroid absolute bottom-0 left-8 w-[240px] rotate-[-2deg] z-30 md:left-16 md:w-[280px]">
								<div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-[#F5B041] to-[#F2C4CE] p-4">
									<div className="h-full rounded bg-white/90 p-4">
										<div className="flex items-center justify-between mb-3">
											<span className="font-sans text-sm font-bold text-charcoal">Quiz Result</span>
											<CheckCircle className="h-5 w-5 text-[#A8D5BA]" />
										</div>
										<div className="text-center">
											<span className="font-sans text-4xl font-extrabold text-[#A8D5BA]">A+</span>
											<p className="mt-1 text-xs text-muted-foreground">Auto-graded</p>
										</div>
										<div className="mt-3 flex justify-center gap-1">
											{[1, 2, 3, 4, 5].map((i) => (
												<Star key={i} className="h-4 w-4 fill-[#F5B041] text-[#F5B041]" />
											))}
										</div>
									</div>
								</div>
								<p className="mt-2 text-center font-serif text-lg text-charcoal">
									{'Instant feedback! ⚡'}
								</p>
							</div>

							{/* Globe Sticker */}
							<div className="absolute -right-4 bottom-8 rotate-12 hidden lg:block">
								<StickerIcon bgColor="bg-[#A8D4E6]" className="h-20 w-20">
									<Globe className="h-10 w-10 text-charcoal" />
								</StickerIcon>
							</div>
						</div>

						{/* Right Side - Content */}
						<div className="flex flex-col justify-center lg:pl-8">
							<div className="space-y-6">
								{/* Feature 1 */}
								<div className="flex gap-4">
									<StickerIcon bgColor="bg-[#C5B4E3]" className="h-12 w-12 flex-shrink-0">
										<Sparkles className="h-5 w-5 text-charcoal" />
									</StickerIcon>
									<div>
										<h3 className="font-sans text-lg font-bold text-charcoal">
											Step-by-Step AI Guidance
										</h3>
										<p className="mt-1 text-muted-foreground">
											Stuck on a problem? Our AI breaks it down into manageable steps, helping you
											learn the {'"how"'} not just the {'"what."'}
										</p>
									</div>
								</div>

								{/* Feature 2 */}
								<div className="flex gap-4">
									<StickerIcon bgColor="bg-[#A8D5BA]" className="h-12 w-12 flex-shrink-0">
										<TrendingUp className="h-5 w-5 text-charcoal" />
									</StickerIcon>
									<div>
										<h3 className="font-sans text-lg font-bold text-charcoal">Progress Tracking</h3>
										<p className="mt-1 text-muted-foreground">
											Watch your skills grow! Visual progress charts help you and your parents see
											how far {"you've"} come.
										</p>
									</div>
								</div>

								{/* Feature 3 */}
								<div className="flex gap-4">
									<StickerIcon bgColor="bg-[#F5B041]" className="h-12 w-12 flex-shrink-0">
										<CheckCircle className="h-5 w-5 text-charcoal" />
									</StickerIcon>
									<div>
										<h3 className="font-sans text-lg font-bold text-charcoal">Instant Feedback</h3>
										<p className="mt-1 text-muted-foreground">
											No more waiting for grades! Get automatic feedback on quizzes and assignments
											right away.
										</p>
									</div>
								</div>

								{/* Feature 4 */}
								<div className="flex gap-4">
									<StickerIcon bgColor="bg-[#A8D4E6]" className="h-12 w-12 flex-shrink-0">
										<BookOpen className="h-5 w-5 text-charcoal" />
									</StickerIcon>
									<div>
										<h3 className="font-sans text-lg font-bold text-charcoal">All in One Place</h3>
										<p className="mt-1 text-muted-foreground">
											Lessons, assignments, meetings — everything you need is organized and easy to
											find.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
