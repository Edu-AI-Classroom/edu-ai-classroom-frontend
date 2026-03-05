'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/common/queryClient';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster position="top-right" richColors closeButton duration={4000} />
			</QueryClientProvider>
		</NextThemesProvider>
	);
}
