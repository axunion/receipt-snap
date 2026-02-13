import { compressImage, getCompressionOptions } from "./imageCompression";

type BitmapLike = {
	width: number;
	height: number;
	close: () => void;
};

function mockCanvas(toBlobResult: Blob | null) {
	const drawImage = vi.fn();
	const fillRect = vi.fn();
	const ctx = {
		drawImage,
		fillRect,
		imageSmoothingEnabled: false,
		imageSmoothingQuality: "low",
		fillStyle: "#fff",
	} as unknown as CanvasRenderingContext2D;
	const canvas = {
		width: 0,
		height: 0,
		getContext: vi.fn().mockReturnValue(ctx),
		toBlob: vi.fn((callback: BlobCallback) => callback(toBlobResult)),
	} as unknown as HTMLCanvasElement;

	const originalCreateElement = document.createElement.bind(document);
	const createElementSpy = vi
		.spyOn(document, "createElement")
		.mockImplementation(((tagName: string) => {
			if (tagName.toLowerCase() === "canvas") {
				return canvas;
			}
			return originalCreateElement(tagName as keyof HTMLElementTagNameMap);
		}) as typeof document.createElement);

	return { canvas, drawImage, fillRect, createElementSpy };
}

function mockImageClass(mode: "load" | "error", width = 2000, height = 1000) {
	class MockImage {
		width = width;
		height = height;
		onload: ((this: GlobalEventHandlers, ev: Event) => unknown) | null = null;
		onerror: OnErrorEventHandler = null;
		private currentSrc = "";

		set src(value: string) {
			this.currentSrc = value;
			queueMicrotask(() => {
				if (mode === "load") {
					const onload = this.onload as ((ev: Event) => unknown) | null;
					onload?.(new Event("load"));
				} else {
					const errorHandler = this.onerror as
						| ((...args: unknown[]) => unknown)
						| null;
					errorHandler?.(new Event("error"));
				}
			});
		}

		get src() {
			return this.currentSrc;
		}
	}

	vi.stubGlobal("Image", MockImage as unknown as typeof Image);
}

describe("compressImage", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	it("compresses HEIC image with createImageBitmap path", async () => {
		const { createElementSpy } = mockCanvas(
			new Blob(["compressed"], { type: "image/jpeg" }),
		);
		const closeMock = vi.fn();
		const bitmap: BitmapLike = { width: 2400, height: 1800, close: closeMock };
		vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));
		const file = new File(["raw"], "photo.heic", { type: "image/heic" });

		const compressed = await compressImage(file, getCompressionOptions());

		expect(compressed).toBeInstanceOf(File);
		expect(compressed.name).toBe("photo_compressed.jpeg");
		expect(compressed.type).toBe("image/jpeg");
		expect(closeMock).toHaveBeenCalledTimes(1);
		createElementSpy.mockRestore();
	});

	it("rejects when canvas toBlob returns null in normal image path", async () => {
		const { createElementSpy } = mockCanvas(null);
		mockImageClass("load");
		vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-image");
		const revokeObjectURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => {});
		const file = new File(["raw"], "photo.png", { type: "image/png" });

		await expect(compressImage(file, getCompressionOptions())).rejects.toThrow(
			"Image compression failed",
		);
		expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-image");
		createElementSpy.mockRestore();
	});

	it("falls back to Image element when createImageBitmap fails", async () => {
		const { createElementSpy } = mockCanvas(
			new Blob(["compressed"], { type: "image/jpeg" }),
		);
		mockImageClass("load");
		vi.stubGlobal(
			"createImageBitmap",
			vi.fn().mockRejectedValue(new Error("bitmap not supported")),
		);
		const createObjectURLSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockReturnValue("blob:mock-image");
		const revokeObjectURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => {});
		const file = new File(["raw"], "photo.heic", { type: "image/heic" });

		const compressed = await compressImage(file, getCompressionOptions());

		expect(compressed).toBeInstanceOf(File);
		expect(createObjectURLSpy).toHaveBeenCalledWith(file);
		expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-image");
		createElementSpy.mockRestore();
	});

	it("rejects with HEIC-specific message when fallback image load fails", async () => {
		mockCanvas(new Blob(["unused"], { type: "image/jpeg" }));
		mockImageClass("error");
		vi.stubGlobal(
			"createImageBitmap",
			vi.fn().mockRejectedValue(new Error("bitmap not supported")),
		);
		vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:heic-failure");
		const revokeObjectURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => {});
		const file = new File(["raw"], "photo.heic", { type: "image/heic" });

		await expect(compressImage(file, getCompressionOptions())).rejects.toThrow(
			"HEIC file format not supported by this browser. Please try a JPEG or PNG file.",
		);
		expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:heic-failure");
	});
});
