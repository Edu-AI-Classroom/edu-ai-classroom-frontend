'use client';

import { Backpack, CheckCircle, FolderOpen, Grid3X3, Lightbulb, Lock, Share2 } from 'lucide-react';
import { StickerIcon } from './sticker-icon';

export function CanvasSection() {
	return (
		<section id="canvas" className="py-20 md:py-28">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="mx-auto max-w-2xl text-center">
					<span className="font-serif text-xl text-[#F5B041]">Our Core Feature</span>
					<h2 className="mt-2 text-balance font-sans text-3xl font-extrabold text-charcoal md:text-4xl lg:text-5xl">
						The Canvas Creator
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						{'Your creative workspace for building amazing educational content.'}
					</p>
				</div>

				{/* Two Column Layout */}
				<div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
					{/* Left - Canvas Mockup */}
					<div className="relative">
						{/* Canvas UI Mockup */}
						<div className="relative rounded-2xl border-4 border-charcoal/10 bg-card p-4 shadow-2xl">
							{/* Toolbar */}
							<div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary p-2">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 rounded-full bg-[#E57373]" />
									<div className="h-3 w-3 rounded-full bg-[#F5B041]" />
									<div className="h-3 w-3 rounded-full bg-[#A8D5BA]" />
								</div>
								<div className="flex-1 text-center font-serif text-sm text-muted-foreground">
									Canvas Editor
								</div>
							</div>

							{/* Canvas Grid */}
							<div className="grid grid-cols-3 gap-3">
								{/* Template blocks */}
								<div className="aspect-square rounded-lg bg-[#C5B4E3]/30 p-3">
									<div className="h-full rounded border-2 border-dashed border-[#C5B4E3] flex items-center justify-center">
										<span className="text-xs font-semibold text-[#C5B4E3]">Header</span>
									</div>
								</div>
								<div className="col-span-2 aspect-[2/1] rounded-lg bg-[#A8D4E6]/30 p-3">
									<div className="h-full rounded border-2 border-dashed border-[#A8D4E6] flex items-center justify-center">
										<span className="text-xs font-semibold text-[#A8D4E6]">Content Block</span>
									</div>
								</div>
								<div className="col-span-2 aspect-[2/1] rounded-lg bg-[#A8D5BA]/30 p-3">
									<div className="h-full rounded border-2 border-dashed border-[#A8D5BA] flex items-center justify-center">
										<span className="text-xs font-semibold text-[#A8D5BA]">Assignment</span>
									</div>
								</div>
								<div className="aspect-square rounded-lg bg-[#F5B041]/30 p-3">
									<div className="h-full rounded border-2 border-dashed border-[#F5B041] flex items-center justify-center">
										<span className="text-xs font-semibold text-[#F5B041]">Quiz</span>
									</div>
								</div>
							</div>

							{/* Bottom toolbar */}
							<div className="mt-4 flex items-center justify-between rounded-lg bg-secondary p-2">
								<div className="flex gap-2">
									<div className="h-6 w-6 rounded bg-[#C5B4E3]/50" />
									<div className="h-6 w-6 rounded bg-[#A8D4E6]/50" />
									<div className="h-6 w-6 rounded bg-[#A8D5BA]/50" />
								</div>
								<span className="font-serif text-xs text-muted-foreground">Drag to add</span>
							</div>
						</div>

						{/* Decorative Stickers around the canvas */}
						<div className="absolute -left-6 top-1/4 rotate-[-12deg]">
							<StickerIcon bgColor="bg-[#F5B041]" className="h-14 w-14">
								<Lightbulb className="h-6 w-6 text-charcoal" />
							</StickerIcon>
						</div>
						<div className="absolute -right-4 top-8 rotate-[8deg]">
							<StickerIcon bgColor="bg-[#A8D5BA]" className="h-12 w-12">
								<CheckCircle className="h-5 w-5 text-charcoal" />
							</StickerIcon>
						</div>
						<div className="absolute -bottom-4 right-1/4 rotate-[15deg]">
							<StickerIcon bgColor="bg-[#C5B4E3]" className="h-14 w-14">
								<Backpack className="h-6 w-6 text-charcoal" />
							</StickerIcon>
						</div>
					</div>

					{/* Right - To-Do List Style Content */}
					<div className="relative">
						{/* Notepad style container */}
						<div className="rounded-lg bg-card p-6 shadow-lg notebook-margin ml-4">
							<h3 className="font-serif text-2xl text-charcoal">{'What you can do ✏️'}</h3>

							{/* Template Layouts */}
							<div className="mt-6">
								<div className="flex items-center gap-3">
									<StickerIcon bgColor="bg-[#A8D4E6]" className="h-10 w-10">
										<Grid3X3 className="h-4 w-4 text-charcoal" />
									</StickerIcon>
									<h4 className="font-sans text-lg font-bold text-charcoal">Template Layouts</h4>
								</div>
								<ul className="mt-3 space-y-2 pl-14">
									{[
										'Pre-built layouts for lessons & exams',
										'Customizable grid-based design',
										'Responsive for all devices',
									].map((item) => (
										<li key={item} className="flex items-start gap-2 text-muted-foreground">
											<span className="mt-1 h-4 w-4 flex-shrink-0 rounded border-2 border-[#A8D5BA]" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Content Bank */}
							<div className="mt-8">
								<div className="flex items-center gap-3">
									<StickerIcon bgColor="bg-[#C5B4E3]" className="h-10 w-10">
										<FolderOpen className="h-4 w-4 text-charcoal" />
									</StickerIcon>
									<h4 className="font-sans text-lg font-bold text-charcoal">Content Bank</h4>
								</div>
								<ul className="mt-3 space-y-2 pl-14">
									{[
										'Centralized storage for all your content',
										'Easy search and organization',
										'Reuse blocks across lessons',
									].map((item) => (
										<li key={item} className="flex items-start gap-2 text-muted-foreground">
											<span className="mt-1 h-4 w-4 flex-shrink-0 rounded border-2 border-[#A8D5BA]" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Sharing Options */}
							<div className="mt-8">
								<div className="flex items-center gap-3">
									<StickerIcon bgColor="bg-[#F5B041]" className="h-10 w-10">
										<Share2 className="h-4 w-4 text-charcoal" />
									</StickerIcon>
									<h4 className="font-sans text-lg font-bold text-charcoal">Sharing Options</h4>
								</div>
								<div className="mt-3 flex flex-wrap gap-3 pl-14">
									<span className="inline-flex items-center gap-1.5 rounded-full bg-[#A8D5BA]/30 px-3 py-1 text-sm font-medium text-charcoal">
										<Share2 className="h-3 w-3" /> Public
									</span>
									<span className="inline-flex items-center gap-1.5 rounded-full bg-[#C5B4E3]/30 px-3 py-1 text-sm font-medium text-charcoal">
										<Lock className="h-3 w-3" /> Private
									</span>
									<span className="inline-flex items-center gap-1.5 rounded-full bg-[#A8D4E6]/30 px-3 py-1 text-sm font-medium text-charcoal">
										<Share2 className="h-3 w-3" /> School-wide
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
