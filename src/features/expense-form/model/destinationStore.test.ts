const { fetchDestinationsMock } = vi.hoisted(() => ({
	fetchDestinationsMock: vi.fn(),
}));

vi.mock("@/services", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/services")>();
	return { ...actual, fetchDestinations: fetchDestinationsMock };
});

import { destinationStore } from "./destinationStore";

describe("destinationStore", () => {
	beforeEach(async () => {
		fetchDestinationsMock.mockReset();
		// Reset the singleton resource to a known empty state so tests that
		// omit refetch() do not inherit stale data from a preceding test.
		fetchDestinationsMock.mockResolvedValue({ result: "done", data: [] });
		destinationStore.refetch();
		await vi.waitFor(() => expect(destinationStore.loading()).toBe(false));
	});

	it("returns destinations and null error on success response", async () => {
		fetchDestinationsMock.mockResolvedValue({
			result: "done",
			data: [
				{ value: "p1", label: "Project Alpha" },
				{ value: "p2", label: "Project Beta" },
			],
		});

		destinationStore.refetch();

		await vi.waitFor(() => {
			expect(destinationStore.loading()).toBe(false);
		});

		expect(destinationStore.destinations()).toEqual([
			{ value: "p1", label: "Project Alpha" },
			{ value: "p2", label: "Project Beta" },
		]);
		expect(destinationStore.error()).toBeNull();
	});

	it("returns empty destinations and error string on error response", async () => {
		fetchDestinationsMock.mockResolvedValue({
			result: "error",
			error: "Failed to load destinations",
		});

		destinationStore.refetch();

		await vi.waitFor(() => {
			expect(destinationStore.loading()).toBe(false);
		});

		expect(destinationStore.destinations()).toEqual([]);
		expect(destinationStore.error()).toBe("Failed to load destinations");
	});

	describe("getDestinationLabel", () => {
		it("returns label for a matching value", async () => {
			fetchDestinationsMock.mockResolvedValue({
				result: "done",
				data: [{ value: "p1", label: "Project Alpha" }],
			});

			destinationStore.refetch();
			await vi.waitFor(() => expect(destinationStore.loading()).toBe(false));

			expect(destinationStore.getDestinationLabel("p1")).toBe("Project Alpha");
		});

		it("returns empty string when value does not match", async () => {
			fetchDestinationsMock.mockResolvedValue({
				result: "done",
				data: [{ value: "p1", label: "Project Alpha" }],
			});

			destinationStore.refetch();
			await vi.waitFor(() => expect(destinationStore.loading()).toBe(false));

			expect(destinationStore.getDestinationLabel("nonexistent")).toBe("");
		});
	});

	it("refetch triggers loading then settles with new data", async () => {
		fetchDestinationsMock.mockResolvedValue({
			result: "done",
			data: [{ value: "p1", label: "First" }],
		});
		destinationStore.refetch();
		await vi.waitFor(() => expect(destinationStore.loading()).toBe(false));
		expect(destinationStore.destinations()).toHaveLength(1);

		fetchDestinationsMock.mockResolvedValue({
			result: "done",
			data: [
				{ value: "p1", label: "First" },
				{ value: "p2", label: "Second" },
			],
		});
		destinationStore.refetch();

		await vi.waitFor(() => {
			expect(destinationStore.destinations()).toHaveLength(2);
		});
		expect(destinationStore.destinations()[1].label).toBe("Second");
	});
});
