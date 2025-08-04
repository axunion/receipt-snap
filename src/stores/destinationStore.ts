import { fetchDestinations } from "@/services/apiService";
import type { SelectOption } from "@/types";
import { createResource, createRoot } from "solid-js";

function createDestinationStore() {
	const [destinations, { refetch }] =
		createResource<SelectOption[]>(fetchDestinations);

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
