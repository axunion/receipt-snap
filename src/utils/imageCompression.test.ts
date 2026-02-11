import {
	QUALITY_PRESETS,
	RESOLUTION_PRESETS,
	SUPPORTED_FORMATS,
} from "@/constants/compression";
import { getCompressionOptions } from "./imageCompression";

describe("getCompressionOptions", () => {
	it("returns RECEIPT resolution preset", () => {
		const options = getCompressionOptions();
		expect(options.maxWidth).toBe(RESOLUTION_PRESETS.RECEIPT.width);
		expect(options.maxHeight).toBe(RESOLUTION_PRESETS.RECEIPT.height);
	});

	it("returns STANDARD quality preset", () => {
		const options = getCompressionOptions();
		expect(options.quality).toBe(QUALITY_PRESETS.STANDARD);
	});

	it("returns JPEG output format", () => {
		const options = getCompressionOptions();
		expect(options.format).toBe(SUPPORTED_FORMATS.OUTPUT_FORMAT);
	});

	it("returns exact expected values", () => {
		expect(getCompressionOptions()).toEqual({
			maxWidth: 900,
			maxHeight: 1600,
			quality: 0.7,
			format: "image/jpeg",
		});
	});
});
