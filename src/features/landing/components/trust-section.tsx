'use client';

import { Award, Shield, UserCheck } from 'lucide-react';
import { StickerIcon } from './sticker-icon';

export function TrustSection() {
	return (
		<section className="py-20 md:py-28 grid-paper">
			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-3xl">
					{/* Badge */}
					<div className="flex justify-center">
						<div className="relative">
							<StickerIcon bgColor="bg-[#F5B041]" className="h-24 w-24">
								<Award className="h-12 w-12 text-charcoal" />
							</StickerIcon>
							{/* "Certified" badge overlay */}
							<div className="absolute -bottom-2 -right-2 rotate-12 rounded-full bg-[#A8D5BA] px-3 py-1 shadow-md">
								<span className="font-serif text-sm font-bold text-charcoal">Certified</span>
							</div>
						</div>
					</div>

					{/* Section Header */}
					<div className="mt-8 text-center">
						<span className="font-serif text-xl text-[#F5B041]">Trust & Control</span>
						<h2 className="mt-2 text-balance font-sans text-3xl font-extrabold text-charcoal md:text-4xl lg:text-5xl">
							Teacher in Command
						</h2>
					</div>

					{/* Blockquote */}
					<div className="mt-12 relative">
						{/* Decorative quote marks */}
						<span className="absolute -left-4 -top-4 font-serif text-8xl text-[#F5B041]/20">
							{'"'}
						</span>

						<blockquote className="relative rounded-2xl bg-card p-8 shadow-lg md:p-12">
							<p className="text-center font-serif text-xl leading-relaxed text-charcoal md:text-2xl lg:text-3xl">
								{
									'AI is here to assist, not replace. Every piece of content, every lesson, every assignment — '
								}
								<span className="hand-underline">you approve it all.</span>
								{' Your expertise guides the learning journey.'}
							</p>

							{/* Signature */}
							<div className="mt-8 flex items-center justify-center gap-4">
								<div className="h-px w-12 bg-border" />
								<p className="font-serif text-lg text-muted-foreground italic">
									— The Teachify Promise
								</p>
								<div className="h-px w-12 bg-border" />
							</div>
						</blockquote>

						<span className="absolute -bottom-4 -right-4 font-serif text-8xl text-[#F5B041]/20">
							{'"'}
						</span>
					</div>

					{/* Trust Points */}
					<div className="mt-12 grid gap-6 md:grid-cols-3">
						{[
							{
								icon: Shield,
								title: 'Content Moderation',
								description: 'All AI suggestions require teacher approval',
								color: 'bg-[#C5B4E3]',
							},
							{
								icon: Award,
								title: 'Quality Assured',
								description: 'Teacher-verified content only',
								color: 'bg-[#A8D5BA]',
							},
							{
								icon: UserCheck,
								title: 'Full Control',
								description: 'Edit, customize, or reject any AI suggestion',
								color: 'bg-[#A8D4E6]',
							},
						].map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.title}
									className="flex flex-col items-center rounded-xl bg-card p-6 text-center shadow-md"
								>
									<StickerIcon bgColor={item.color} className="h-14 w-14">
										<Icon className="h-6 w-6 text-charcoal" />
									</StickerIcon>
									<h3 className="mt-4 font-sans text-lg font-bold text-charcoal">{item.title}</h3>
									<p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
