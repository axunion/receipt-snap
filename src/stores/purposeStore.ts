import { fetchPurposes } from "@/services/apiService";
import type { PurposeOption } from "@/types/expense";
import { createResource, createRoot } from "solid-js";

function createPurposeStore() {
	const [purposes] = createResource<PurposeOption[]>(fetchPurposes);

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
