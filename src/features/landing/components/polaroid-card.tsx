'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/utils';

interface PolaroidCardProps {
	src: string;
	alt: string;
	caption?: string;
	rotation?: number;
	className?: string;
}

export function PolaroidCard({ src, alt, caption, rotation = 2, className }: PolaroidCardProps) {
	return (
		<div
			className={cn('polaroid rounded-sm transition-transform hover:scale-105', className)}
			style={{ transform: `rotate(${rotation}deg)` }}
		>
			<div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-muted">
				<Image src={src || '/placeholder.svg'} alt={alt} fill className="object-cover" />
			</div>
			{caption && <p className="mt-3 text-center font-serif text-lg text-charcoal">{caption}</p>}
		</div>
	);
}
