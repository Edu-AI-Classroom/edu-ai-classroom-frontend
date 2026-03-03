const palette = [
	'#F5B041',
	'#A8D5BA',
	'#C5B4E3',
	'#E57373',
	'#7FD1B9',
	'#F3C969',
	'#9CC2E5',
	'#F2A7C5',
];

function hashSeed(seed: string): number {
	let hash = 0;
	for (let i = 0; i < seed.length; i += 1) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export function getAvatarColor(seed: string): string {
	if (!seed) return palette[0];
	const index = hashSeed(seed) % palette.length;
	return palette[index];
}
