'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type * as React from 'react';

import { cn } from '@/lib/utils/utils';

type WithChildren<T> = Omit<T, 'children'> & {
	children?: React.ReactNode;
};

type AvatarRootCompatProps = WithChildren<React.ComponentProps<typeof AvatarPrimitive.Root>> & {
	className?: string;
};

type AvatarImageCompatProps = React.ComponentProps<typeof AvatarPrimitive.Image> & {
	className?: string;
	src?: string;
	alt?: string;
};

type AvatarFallbackCompatProps = WithChildren<
	React.ComponentProps<typeof AvatarPrimitive.Fallback>
> & {
	className?: string;
};

function Avatar({ className, ...props }: AvatarRootCompatProps) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
			{...(props as any)}
		/>
	);
}

function AvatarImage({ className, ...props }: AvatarImageCompatProps) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn('aspect-square size-full', className)}
			{...(props as any)}
		/>
	);
}

function AvatarFallback({ className, ...props }: AvatarFallbackCompatProps) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
			{...(props as any)}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
