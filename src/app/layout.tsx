import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
	title: 'Edu AI Classroom',
	description: 'Nền tảng hỗ trợ giảng dạy và học tập sử dụng AI',
};

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={`${inter.variable} ${geistMono.variable} antialiased`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
