import { createResource, createRoot } from "solid-js";
import { fetchDestinations } from "@/services/apiService";
import type { DestinationData } from "@/types";

function createDestinationStore() {
	const [destinations, { refetch }] =
		createResource<DestinationData[]>(fetchDestinations);

	const getDestinationLabel = (value: string): string => {
		const destination = destinations()?.find((d) => d.value === value);
		return destination?.label || "";
	};

	return {
		destinations,
		refetch,
		getDestinationLabel,
	};
}

export const destinationStore = createRoot(() => createDestinationStore());
