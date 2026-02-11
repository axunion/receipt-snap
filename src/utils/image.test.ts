import {
	calculateRatio,
	fileToBase64,
	formatFileSize,
	generateCompressedFileName,
	isHEICFormat,
} from "./image";

function createFile(name: string, type: string): File {
	return new File(["dummy"], name, { type });
}

// -- isHEICFormat --

describe("isHEICFormat", () => {
	it("returns true for image/heic MIME type", () => {
		expect(isHEICFormat(createFile("photo.jpg", "image/heic"))).toBe(true);
	});

	it("returns true for image/heif MIME type", () => {
		expect(isHEICFormat(createFile("photo.jpg", "image/heif"))).toBe(true);
	});

	it("returns true for .heic extension (MIME unknown)", () => {
		expect(isHEICFormat(createFile("photo.heic", ""))).toBe(true);
	});

	it("returns true for .heif extension (MIME unknown)", () => {
		expect(isHEICFormat(createFile("photo.heif", ""))).toBe(true);
	});

	it("returns true for .HEIC extension (case insensitive)", () => {
		expect(isHEICFormat(createFile("photo.HEIC", ""))).toBe(true);
	});

	it("returns false for JPEG", () => {
		expect(isHEICFormat(createFile("photo.jpg", "image/jpeg"))).toBe(false);
	});

	it("returns false for PNG", () => {
		expect(isHEICFormat(createFile("photo.png", "image/png"))).toBe(false);
	});
});

// -- generateCompressedFileName --

describe("generateCompressedFileName", () => {
	it("replaces extension and appends _compressed", () => {
		expect(generateCompressedFileName("photo.png", "image/jpeg")).toBe(
			"photo_compressed.jpeg",
		);
	});

	it("handles filename with multiple dots", () => {
		expect(generateCompressedFileName("my.photo.raw.png", "image/jpeg")).toBe(
			"my.photo.raw_compressed.jpeg",
		);
	});

	it("handles filename without extension", () => {
		expect(generateCompressedFileName("photo", "image/jpeg")).toBe(
			"photo_compressed.jpeg",
		);
	});
});

// -- formatFileSize --

describe("formatFileSize", () => {
	it("returns '0 Bytes' for 0", () => {
		expect(formatFileSize(0)).toBe("0 Bytes");
	});

	it("formats bytes", () => {
		expect(formatFileSize(500)).toBe("500 Bytes");
	});

	it("formats kilobytes", () => {
		expect(formatFileSize(1024)).toBe("1 KB");
	});

	it("formats megabytes", () => {
		expect(formatFileSize(1048576)).toBe("1 MB");
	});

	it("formats fractional kilobytes", () => {
		expect(formatFileSize(1536)).toBe("1.5 KB");
	});
});

// -- calculateRatio --

describe("calculateRatio", () => {
	it("returns 50 for 50% reduction", () => {
		expect(calculateRatio(1000, 500)).toBe(50);
	});

	it("returns 0 for same size", () => {
		expect(calculateRatio(1000, 1000)).toBe(0);
	});

	it("returns 100 for full compression", () => {
		expect(calculateRatio(1000, 0)).toBe(100);
	});

	it("returns 0 when original size is 0 (guard)", () => {
		expect(calculateRatio(0, 0)).toBe(0);
	});

	it("returns negative for size increase", () => {
		expect(calculateRatio(100, 150)).toBe(-50);
	});
});

// -- fileToBase64 --

describe("fileToBase64", () => {
	it("converts a text file to base64", async () => {
		const file = new File(["hello"], "test.txt", { type: "text/plain" });
		const result = await fileToBase64(file);
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
		// "hello" -> base64 is "aGVsbG8="
		expect(result).toBe("aGVsbG8=");
	});
});
