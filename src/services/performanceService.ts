export async function measureAsync<T>(
	operation: () => Promise<T>,
	operationName?: string,
): Promise<{ result: T; duration: number }> {
	const startTime = performance.now();

	try {
		const result = await operation();
		const duration = performance.now() - startTime;

		if (import.meta.env.DEV && operationName) {
			console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
		}

		return { result, duration };
	} catch (error) {
		const duration = performance.now() - startTime;
		if (operationName) {
			console.error(
				`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`,
				error,
			);
		}
		throw error;
	}
}
