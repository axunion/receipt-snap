const metrics: Map<string, number[]> = new Map();

async function measure<T>(
	operation: () => Promise<T>,
	operationName: string,
): Promise<{ result: T; duration: number }> {
	const startTime = performance.now();

	try {
		const result = await operation();
		const endTime = performance.now();
		const duration = endTime - startTime;

		// メトリクスを記録
		recordMetric(operationName, duration);

		if (import.meta.env.DEV) {
			console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
		}

		return { result, duration };
	} catch (error) {
		const endTime = performance.now();
		const duration = endTime - startTime;

		console.error(
			`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`,
			error,
		);
		throw error;
	}
}

function recordMetric(operationName: string, duration: number): void {
	if (!metrics.has(operationName)) {
		metrics.set(operationName, []);
	}

	const operationMetrics = metrics.get(operationName);
	if (!operationMetrics) return; // メトリクスが存在しない場合は何もしない
	operationMetrics.push(duration);

	// 最新の100件のみ保持
	if (operationMetrics.length > 100) {
		operationMetrics.shift();
	}
}

function getStats(operationName: string): {
	count: number;
	average: number;
	min: number;
	max: number;
} | null {
	const operationMetrics = metrics.get(operationName);
	if (!operationMetrics || operationMetrics.length === 0) {
		return null;
	}

	const count = operationMetrics.length;
	const sum = operationMetrics.reduce((a, b) => a + b, 0);
	const average = sum / count;
	const min = Math.min(...operationMetrics);
	const max = Math.max(...operationMetrics);

	return { count, average, min, max };
}

function getAllStats(): Record<string, ReturnType<typeof getStats>> {
	const result: Record<string, ReturnType<typeof getStats>> = {};

	for (const [operationName] of metrics) {
		result[operationName] = getStats(operationName);
	}

	return result;
}

function clearMetrics(operationName?: string): void {
	if (operationName) {
		metrics.delete(operationName);
	} else {
		metrics.clear();
	}
}

export const PerformanceService = {
	measure,
	getStats,
	getAllStats,
	clearMetrics,
};
