import { fetchPurposes } from "@/services/apiService";
import type { SelectOption } from "@/types/ui";
import { createResource, createRoot } from "solid-js";

function createPurposeStore() {
	const [purposes] = createResource<SelectOption[]>(fetchPurposes);

	const getPurposeLabel = (value: string): string => {
		const purpose = purposes()?.find((p) => p.value === value);
		return purpose?.label || value;
	};

	return {
		purposes,
		getPurposeLabel,
	};
}

export const purposeStore = createRoot(() => createPurposeStore());
