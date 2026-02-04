import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Caveat, Nunito } from 'next/font/google';
import type React from 'react';
import '@/app/globals.css';

const _nunito = Nunito({
	subsets: ['latin'],
	weight: ['400', '600', '700', '800'],
});
const _caveat = Caveat({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
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
		<html lang="en">
			<body className={`font-sans antialiased`}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
