export type DestinationSuccessResponse = {
	result: "done";
	data: {
		value: string;
		label: string;
	}[];
};

export type DestinationErrorResponse = {
	result: "error";
	error: string;
};

export type DestinationResponse =
	| DestinationSuccessResponse
	| DestinationErrorResponse;

export type SubmitSuccessResponse = {
	result: "done";
};

export type SubmitErrorResponse = {
	result: "error";
	error: string;
};

export type SubmitResponse = SubmitSuccessResponse | SubmitErrorResponse;

export type ApiResponse = DestinationResponse | SubmitResponse;
