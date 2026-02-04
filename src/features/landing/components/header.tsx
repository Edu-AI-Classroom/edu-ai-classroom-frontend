'use client';

import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<a href="/" className="flex items-center gap-2">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B041]">
						<BookOpen className="h-5 w-5 text-charcoal" />
					</div>
					<span className="font-sans text-xl font-bold text-charcoal">Teachify</span>
				</a>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-8 md:flex">
					<a
						href="#features"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						How It Works
					</a>
					<a
						href="#canvas"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						Canvas
					</a>
					<a
						href="#students"
						className="text-sm font-semibold text-charcoal/80 transition-colors hover:text-charcoal"
					>
						Students
					</a>
				</nav>

				{/* CTA Buttons */}
				<div className="hidden items-center gap-3 md:flex">
					<Button variant="ghost" className="font-semibold text-charcoal">
						Log In
					</Button>
					<Button className="rounded-full bg-[#F5B041] font-semibold text-charcoal hover:bg-[#F5B041]/90">
						Get Started
					</Button>
				</div>

				{/* Mobile Menu Button */}
				<button
					type="button"
					className="md:hidden"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{mobileMenuOpen ? (
						<X className="h-6 w-6 text-charcoal" />
					) : (
						<Menu className="h-6 w-6 text-charcoal" />
					)}
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="border-t border-border bg-cream md:hidden">
					<nav className="container mx-auto flex flex-col gap-4 p-4">
						<a href="#features" className="font-semibold text-charcoal">
							Features
						</a>
						<a href="#how-it-works" className="font-semibold text-charcoal">
							How It Works
						</a>
						<a href="#canvas" className="font-semibold text-charcoal">
							Canvas
						</a>
						<a href="#students" className="font-semibold text-charcoal">
							Students
						</a>
						<hr className="border-border" />
						<Button variant="ghost" className="w-full justify-start font-semibold text-charcoal">
							Log In
						</Button>
						<Button className="w-full rounded-full bg-[#F5B041] font-semibold text-charcoal hover:bg-[#F5B041]/90">
							Get Started
						</Button>
					</nav>
				</div>
			)}
		</header>
	);
}
