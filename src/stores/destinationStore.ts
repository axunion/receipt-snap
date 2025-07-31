import { fetchDestinations } from "@/services/apiService";
import type { SelectOption } from "@/types/ui";
import { createResource, createRoot } from "solid-js";

function createDestinationStore() {
	const [destinations] = createResource<SelectOption[]>(fetchDestinations);

	const getDestinationLabel = (value: string): string => {
		const destination = destinations()?.find((d) => d.value === value);
		return destination?.label || value;
	};

	return {
		destinations,
		getDestinationLabel,
	};
}

export const destinationStore = createRoot(() => createDestinationStore());
