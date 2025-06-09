const metrics = new Map<string, number[]>();

/**
 * Measure performance of async operations
 */
async function measure<T>(operation: () => Promise<T>, operationName: string) {
	const startTime = performance.now();

	try {
		const result = await operation();
		const endTime = performance.now();
		const duration = endTime - startTime;

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

function recordMetric(operationName: string, duration: number) {
	if (!metrics.has(operationName)) {
		metrics.set(operationName, []);
	}

	const operationMetrics = metrics.get(operationName);
	if (!operationMetrics) return;
	operationMetrics.push(duration);

	// Keep only the latest 100 entries
	if (operationMetrics.length > 100) {
		operationMetrics.shift();
	}
}

function getStats(operationName: string) {
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

function getAllStats() {
	const result: Record<string, ReturnType<typeof getStats>> = {};

	for (const [operationName] of metrics) {
		result[operationName] = getStats(operationName);
	}

	return result;
}

function clearMetrics(operationName?: string) {
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
