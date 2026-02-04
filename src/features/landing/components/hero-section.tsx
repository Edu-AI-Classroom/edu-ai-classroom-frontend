'use client';

import { GraduationCap, Pencil, Play, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StickerIcon } from './sticker-icon';

export function HeroSection() {
	return (
		<section className="relative overflow-hidden py-16 md:py-24 grid-paper">
			<div className="container mx-auto px-4">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					{/* Left Side - Content */}
					<div className="relative z-10">
						{/* Decorative sticker */}
						<div className="absolute -left-4 -top-8 rotate-[-12deg]">
							<StickerIcon bgColor="bg-[#C5B4E3]" className="h-14 w-14">
								<Star className="h-6 w-6 text-charcoal" fill="currentColor" />
							</StickerIcon>
						</div>

						<h1 className="text-balance font-sans text-4xl font-extrabold leading-tight text-charcoal md:text-5xl lg:text-6xl">
							Smarter Teaching.
							<br />
							<span className="text-[#F5B041]">Better Learning.</span>
						</h1>

						<p className="mt-6 font-serif text-2xl text-charcoal/80 md:text-3xl">
							{'Your AI assistant for creating amazing lessons ✨'}
						</p>

						<p className="mt-4 max-w-md text-lg text-muted-foreground">
							Design lessons, assignments, and exams in minutes with our drag-and-drop Canvas. AI
							helps, but you stay in control.
						</p>

						<div className="mt-8 flex flex-wrap items-center gap-4">
							<Button
								size="lg"
								className="rounded-full bg-[#F5B041] px-8 font-bold text-charcoal shadow-lg transition-all hover:scale-105 hover:bg-[#F5B041]/90 hover:shadow-xl"
							>
								<Sparkles className="mr-2 h-5 w-5" />
								Get Started
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="rounded-full border-2 border-charcoal/20 bg-transparent px-8 font-bold text-charcoal hover:bg-charcoal/5"
							>
								<Play className="mr-2 h-5 w-5" />
								View Demo
							</Button>
						</div>

						{/* Trust badges */}
						<div className="mt-10 flex items-center gap-6">
							<div className="flex -space-x-2">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-[#C5B4E3] to-[#A8D4E6]"
									/>
								))}
							</div>
							<p className="text-sm text-muted-foreground">
								<span className="font-bold text-charcoal">10,000+</span> teachers already creating
							</p>
						</div>
					</div>

					{/* Right Side - Polaroid Image */}
					<div className="relative flex justify-center lg:justify-end">
						{/* Main Polaroid */}
						<div className="polaroid relative w-[320px] rotate-3 transition-transform hover:rotate-0 md:w-[380px]">
							<div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gradient-to-br from-[#A8D5BA] to-[#A8D4E6]">
								{/* Placeholder illustration */}
								<div className="absolute inset-0 flex flex-col items-center justify-center p-6">
									<div className="flex items-center gap-4">
										<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80">
											<GraduationCap className="h-10 w-10 text-[#C5B4E3]" />
										</div>
										<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80">
											<Pencil className="h-8 w-8 text-[#F5B041]" />
										</div>
									</div>
									<div className="mt-4 flex gap-2">
										{[1, 2, 3].map((i) => (
											<div key={i} className="h-12 w-12 rounded-full bg-white/60" />
										))}
									</div>
								</div>
							</div>
							<p className="mt-3 text-center font-serif text-xl text-charcoal">
								Learning made fun! 📚
							</p>
						</div>

						{/* Decorative stickers */}
						<div className="absolute -bottom-4 -left-4 rotate-[-8deg]">
							<StickerIcon bgColor="bg-[#F2C4CE]" className="h-16 w-16">
								<Pencil className="h-7 w-7 text-charcoal" />
							</StickerIcon>
						</div>
						<div className="absolute -right-2 top-4 rotate-[15deg]">
							<StickerIcon bgColor="bg-[#A8D4E6]" className="h-12 w-12">
								<Sparkles className="h-5 w-5 text-charcoal" />
							</StickerIcon>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
