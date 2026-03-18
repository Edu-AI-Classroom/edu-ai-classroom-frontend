export type ClassStudentQuizStat = {
	studentId: number;
	avgGradePct: number; // 0..100
	submittedCount: number;
	totalAssigned: number;
	submittedPct: number; // 0..100
};
