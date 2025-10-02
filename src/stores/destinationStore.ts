import { createMemo, createResource, createRoot } from "solid-js";
import { fetchDestinations } from "@/services";
import type { DestinationResponse } from "@/types";

function createDestinationStore() {
	const [destinationResponse, { refetch }] =
		createResource<DestinationResponse>(fetchDestinations);

	const destinations = createMemo(() => {
		const response = destinationResponse();
		return response?.result === "done" ? response.data : [];
	});

	const error = createMemo(() => {
		const response = destinationResponse();
		return response?.result === "error" ? response.error : null;
	});

	const loading = createMemo(() => destinationResponse.loading);

	const getDestinationLabel = (value: string): string => {
		const destination = destinations().find((d) => d.value === value);
		return destination?.label || "";
	};

	return {
		destinations,
		error,
		loading,
		refetch,
		getDestinationLabel,
	};
}

export const destinationStore = createRoot(() => createDestinationStore());
