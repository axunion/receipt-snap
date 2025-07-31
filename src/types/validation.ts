export interface FieldErrors {
	name?: string;
	amount?: string;
	date?: string;
	details?: string;
	destination?: string;
	receipt?: string;
}

export type TouchedFields = Partial<Record<keyof FieldErrors, boolean>>;
