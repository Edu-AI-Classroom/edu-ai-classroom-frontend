'use client';

import { BookOpen, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
	about: [
		{ label: 'Our Story', href: '#' },
		{ label: 'Team', href: '#' },
		{ label: 'Careers', href: '#' },
		{ label: 'Press', href: '#' },
	],
	product: [
		{ label: 'Features', href: '#features' },
		{ label: 'Pricing', href: '#' },
		{ label: 'Canvas', href: '#canvas' },
		{ label: 'Integrations', href: '#' },
	],
	support: [
		{ label: 'Help Center', href: '#' },
		{ label: 'Contact Us', href: '#' },
		{ label: 'Community', href: '#' },
		{ label: 'Tutorials', href: '#' },
	],
	legal: [
		{ label: 'Privacy Policy', href: '#' },
		{ label: 'Terms of Service', href: '#' },
		{ label: 'Cookie Policy', href: '#' },
		{ label: 'COPPA Compliance', href: '#' },
	],
};

const socialLinks = [
	{ icon: Twitter, href: '#', label: 'Twitter' },
	{ icon: Facebook, href: '#', label: 'Facebook' },
	{ icon: Instagram, href: '#', label: 'Instagram' },
	{ icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
	return (
		<footer className="border-t border-border bg-card">
			{/* Notebook edge decoration */}
			<div className="h-2 bg-gradient-to-r from-[#C5B4E3] via-[#F5B041] to-[#A8D5BA]" />

			<div className="container mx-auto px-4 py-12 md:py-16">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
					{/* Brand Column */}
					<div className="lg:col-span-2">
						<a href="/" className="flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B041]">
								<BookOpen className="h-5 w-5 text-charcoal" />
							</div>
							<span className="font-sans text-xl font-bold text-charcoal">Teachify</span>
						</a>
						<p className="mt-4 max-w-xs text-sm text-muted-foreground">
							Empowering educators with AI-powered tools to create amazing learning experiences.
							Smarter teaching, better learning.
						</p>

						{/* Social Links */}
						<div className="mt-6 flex gap-3">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										aria-label={social.label}
										className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-charcoal transition-colors hover:bg-[#F5B041]"
									>
										<Icon className="h-5 w-5" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Link Columns */}
					<div>
						<h4 className="font-sans font-bold text-charcoal">About</h4>
						<ul className="mt-4 space-y-3">
							{footerLinks.about.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-charcoal"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="font-sans font-bold text-charcoal">Product</h4>
						<ul className="mt-4 space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-charcoal"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="font-sans font-bold text-charcoal">Support</h4>
						<ul className="mt-4 space-y-3">
							{footerLinks.support.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-charcoal"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="font-sans font-bold text-charcoal">Legal</h4>
						<ul className="mt-4 space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-charcoal"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Teachify. Made with {'❤️'} for educators everywhere.
					</p>
					<p className="font-serif text-sm text-muted-foreground">
						{'"Teaching is the one profession that creates all other professions."'}
					</p>
				</div>
			</div>
		</footer>
	);
}
