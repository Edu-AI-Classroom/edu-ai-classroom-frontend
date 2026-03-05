import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export const TeachifyIcon = () => (
	<Link href="/" className="flex items-center gap-2">
		<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5B041]">
			<BookOpen className="h-5 w-5 text-charcoal" />
		</div>
		<span className="font-sans text-xl font-bold text-charcoal">Teachify</span>
	</Link>
);
