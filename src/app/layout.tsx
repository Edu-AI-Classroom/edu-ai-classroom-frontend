import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Caveat, Fredoka } from 'next/font/google';
import type React from 'react';
import '@/app/globals.css';
import Providers from '@/components/providers/Providers';

const _fredoka = Fredoka({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-fredoka',
});
const _caveat = Caveat({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-caveat',
});

export const metadata: Metadata = {
	title: 'Teachify - AI-Powered Learning Management System',
	description:
		'Smarter Teaching. Better Learning. An AI-assisted LMS helping teachers design lessons, assignments, and exams with drag-and-drop Canvas.',
	generator: 'v0.app',
	icons: {
		icon: [
			{
				url: '/icon-light-32x32.png',
				media: '(prefers-color-scheme: light)',
			},
			{
				url: '/icon-dark-32x32.png',
				media: '(prefers-color-scheme: dark)',
			},
			{
				url: '/icon.svg',
				type: 'image/svg+xml',
			},
		],
		apple: '/apple-icon.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${_fredoka.variable} ${_caveat.variable} font-sans antialiased text-[#333333]`}
			>
				<Providers>
					{children}
					<Analytics />
				</Providers>
			</body>
		</html>
	);
}
