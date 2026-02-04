'use client';

import { Heart, Rocket, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StickerIcon } from './sticker-icon';

export function CTASection() {
	return (
		<section className="py-20 md:py-28 grid-paper">
			<div className="container mx-auto px-4">
				<div className="relative mx-auto max-w-4xl rounded-3xl bg-card p-8 shadow-2xl md:p-12 lg:p-16">
					{/* Decorative stickers */}
					<div className="absolute -left-6 -top-6 rotate-[-15deg]">
						<StickerIcon bgColor="bg-[#F5B041]" className="h-16 w-16">
							<Star className="h-7 w-7 text-charcoal" fill="currentColor" />
						</StickerIcon>
					</div>
					<div className="absolute -right-4 top-8 rotate-[12deg]">
						<StickerIcon bgColor="bg-[#C5B4E3]" className="h-14 w-14">
							<Heart className="h-6 w-6 text-charcoal" fill="currentColor" />
						</StickerIcon>
					</div>
					<div className="absolute -bottom-4 left-1/4 rotate-[-8deg]">
						<StickerIcon bgColor="bg-[#A8D5BA]" className="h-12 w-12">
							<Sparkles className="h-5 w-5 text-charcoal" />
						</StickerIcon>
					</div>

					{/* Content */}
					<div className="text-center">
						<h2 className="font-serif text-2xl text-[#F5B041] md:text-3xl">
							{'Ready to transform your classroom? ✨'}
						</h2>
						<h3 className="mt-4 text-balance font-sans text-3xl font-extrabold text-charcoal md:text-4xl lg:text-5xl">
							Start Your Teaching Journey Today
						</h3>
						<p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
							Join thousands of educators who are already creating amazing learning experiences.
							{"It's"} free to get started!
						</p>

						{/* CTA Button - Sticker Style */}
						<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<Button
								size="lg"
								className="group relative rounded-full bg-[#F5B041] px-10 py-7 text-lg font-bold text-charcoal shadow-lg transition-all hover:scale-105 hover:bg-[#F5B041]/90 hover:shadow-xl"
							>
								<Rocket className="mr-2 h-6 w-6 transition-transform group-hover:-translate-y-1" />
								Get Started Free
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="rounded-full border-2 border-charcoal/20 px-8 py-7 text-lg font-bold text-charcoal bg-transparent hover:bg-charcoal/5"
							>
								Schedule a Demo
							</Button>
						</div>

						{/* Trust note */}
						<p className="mt-8 text-sm text-muted-foreground">
							{
								'🎓 No credit card required • Free forever for basic features • Join 10,000+ teachers'
							}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
