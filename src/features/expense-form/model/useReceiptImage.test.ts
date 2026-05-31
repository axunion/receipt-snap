import { renderHook } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { useReceiptImage } from "./useReceiptImage";

const {
	validateImageFileMock,
	compressImageMock,
	calculateRatioMock,
	formatFileSizeMock,
	getCompressionOptionsMock,
} = vi.hoisted(() => ({
	validateImageFileMock: vi.fn(),
	compressImageMock: vi.fn(),
	calculateRatioMock: vi.fn(),
	formatFileSizeMock: vi.fn(),
	getCompressionOptionsMock: vi.fn(),
}));

vi.mock("@/utils", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils")>();
	return {
		...actual,
		validateImageFile: validateImageFileMock,
		compressImage: compressImageMock,
		calculateRatio: calculateRatioMock,
		formatFileSize: formatFileSizeMock,
		getCompressionOptions: getCompressionOptionsMock,
	};
});

function makeFile(name = "test.jpg", type = "image/jpeg") {
	return new File(["data"], name, { type });
}

describe("useReceiptImage", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		validateImageFileMock.mockReset();
		compressImageMock.mockReset();
		calculateRatioMock.mockReset();
		formatFileSizeMock.mockReset();
		getCompressionOptionsMock.mockReset();
		URL.createObjectURL = vi.fn().mockReturnValue("blob:test-url");
		URL.revokeObjectURL = vi.fn();
	});

	describe("handleFileSelect — validation failure", () => {
		it("sets error and does not call onImageCapture when validation fails", async () => {
			const [selectedFile] = createSignal<File | null>(null);
			const onImageCapture = vi.fn();
			validateImageFileMock.mockReturnValue({
				isValid: false,
				error: "File type not supported",
			});

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture }),
			);

			await result.handleFileSelect(makeFile());

			expect(result.error()).toBe("File type not supported");
			expect(onImageCapture).not.toHaveBeenCalled();
			expect(result.imagePreview()).toBe("");
		});

		it("uses a fallback error message when validation returns no error string", async () => {
			const [selectedFile] = createSignal<File | null>(null);
			validateImageFileMock.mockReturnValue({ isValid: false });

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture: vi.fn() }),
			);

			await result.handleFileSelect(makeFile());

			expect(result.error()).toBe("Invalid file");
		});
	});

	describe("handleFileSelect — warning/info propagation", () => {
		it("preserves info after successful compression when onImageCapture updates selectedFile", async () => {
			// Real usage: onImageCapture calls setReceiptFile(file) in the parent,
			// making selectedFile non-null. The createEffect only clears state
			// when selectedFile() === null, so info persists after a successful select.
			const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
			const compressed = makeFile("c.jpg");
			validateImageFileMock.mockReturnValue({
				isValid: true,
				info: "HEIC will be converted to JPEG",
			});
			getCompressionOptionsMock.mockReturnValue({});
			compressImageMock.mockResolvedValue(compressed);
			calculateRatioMock.mockReturnValue(50);
			formatFileSizeMock.mockReturnValue("2MB");

			const onImageCapture = vi.fn((f: File) => setSelectedFile(f));
			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture }),
			);

			await result.handleFileSelect(makeFile("photo.heic", "image/heic"));

			expect(result.info()).toBe("HEIC will be converted to JPEG");
		});
	});

	describe("handleFileSelect — compression success", () => {
		it("calls onImageCapture with compressed file, sets imagePreview and compressionInfo", async () => {
			const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
			const original = makeFile("orig.jpg");
			const compressed = makeFile("compressed.jpg");

			validateImageFileMock.mockReturnValue({ isValid: true });
			getCompressionOptionsMock.mockReturnValue({ quality: 0.7 });
			compressImageMock.mockResolvedValue(compressed);
			calculateRatioMock.mockReturnValue(40);
			formatFileSizeMock.mockReturnValue("1KB");

			// Mirrors real usage: parent updates receiptFile when onImageCapture fires,
			// keeping selectedFile non-null so the cleanup effect does not trigger.
			const onImageCapture = vi.fn((f: File) => setSelectedFile(f));
			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture }),
			);

			await result.handleFileSelect(original);

			expect(compressImageMock).toHaveBeenCalledWith(original, {
				quality: 0.7,
			});
			expect(onImageCapture).toHaveBeenCalledWith(compressed);
			expect(result.imagePreview()).toBe("blob:test-url");
			expect(result.compressionInfo()).toMatchObject({
				originalSize: original.size,
				compressedSize: compressed.size,
				ratio: 40,
			});
			expect(result.isCompressing()).toBe(false);
			expect(result.error()).toBe("");
		});

		it("revokes the previous objectURL before creating a new one", async () => {
			const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
			const onImageCapture = vi.fn((f: File) => setSelectedFile(f));

			validateImageFileMock.mockReturnValue({ isValid: true });
			getCompressionOptionsMock.mockReturnValue({});
			compressImageMock.mockResolvedValue(makeFile("c.jpg"));
			calculateRatioMock.mockReturnValue(30);
			formatFileSizeMock.mockReturnValue("1KB");

			const createObjectURLMock = vi.fn();
			createObjectURLMock
				.mockReturnValueOnce("blob:first-url")
				.mockReturnValueOnce("blob:second-url");
			URL.createObjectURL = createObjectURLMock;

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture }),
			);

			await result.handleFileSelect(makeFile("a.jpg"));
			expect(result.imagePreview()).toBe("blob:first-url");

			await result.handleFileSelect(makeFile("b.jpg"));

			expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:first-url");
			expect(result.imagePreview()).toBe("blob:second-url");
		});
	});

	describe("handleFileSelect — compression error branches", () => {
		beforeEach(() => {
			validateImageFileMock.mockReturnValue({ isValid: true });
			getCompressionOptionsMock.mockReturnValue({});
		});

		it("sets HEIC-specific error message", async () => {
			const [selectedFile] = createSignal<File | null>(null);
			compressImageMock.mockRejectedValue(
				new Error("HEIC file format not supported"),
			);

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture: vi.fn() }),
			);

			await result.handleFileSelect(makeFile("photo.heic", "image/heic"));

			expect(result.error()).toContain("HEIC形式をサポートしていません");
			expect(result.isCompressing()).toBe(false);
		});

		it("sets load-failure error message", async () => {
			const [selectedFile] = createSignal<File | null>(null);
			compressImageMock.mockRejectedValue(new Error("Failed to load image"));

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture: vi.fn() }),
			);

			await result.handleFileSelect(makeFile());

			expect(result.error()).toContain("画像の読み込みに失敗しました");
		});

		it("sets generic error for other Error instances", async () => {
			const [selectedFile] = createSignal<File | null>(null);
			compressImageMock.mockRejectedValue(new Error("Something unexpected"));

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture: vi.fn() }),
			);

			await result.handleFileSelect(makeFile());

			expect(result.error()).toContain("画像の処理に失敗しました");
		});

		it("sets unexpected error message for non-Error throws", async () => {
			const [selectedFile] = createSignal<File | null>(null);
			compressImageMock.mockRejectedValue("string error");

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture: vi.fn() }),
			);

			await result.handleFileSelect(makeFile());

			expect(result.error()).toContain("予期しないエラーが発生しました");
		});
	});

	describe("createEffect — clears state when selectedFile becomes null externally", () => {
		it("revokes objectURL and clears preview, error, warning, info, compressionInfo", async () => {
			// Start with non-null selectedFile to avoid premature effect clearing.
			// The effect only clears when selectedFile transitions from non-null → null.
			const originalFile = makeFile("orig.jpg");
			const compressed = makeFile("c.jpg");
			const [selectedFile, setSelectedFile] = createSignal<File | null>(
				originalFile,
			);
			const onImageCapture = vi.fn();

			validateImageFileMock.mockReturnValue({ isValid: true });
			getCompressionOptionsMock.mockReturnValue({});
			compressImageMock.mockResolvedValue(compressed);
			calculateRatioMock.mockReturnValue(30);
			formatFileSizeMock.mockReturnValue("1KB");

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture }),
			);

			await result.handleFileSelect(originalFile);
			expect(result.imagePreview()).toBe("blob:test-url");
			expect(result.compressionInfo()).not.toBeNull();

			// Simulate parent calling clearReceipt() → receiptFile becomes null
			setSelectedFile(null);

			expect(result.imagePreview()).toBe("");
			expect(result.compressionInfo()).toBeNull();
			expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test-url");
		});
	});

	describe("clearImage", () => {
		it("revokes objectURL and resets all state", async () => {
			// Start non-null so the effect doesn't interfere with the compression step.
			const [selectedFile] = createSignal<File | null>(makeFile());
			validateImageFileMock.mockReturnValue({ isValid: true });
			getCompressionOptionsMock.mockReturnValue({});
			compressImageMock.mockResolvedValue(makeFile("c.jpg"));
			calculateRatioMock.mockReturnValue(20);
			formatFileSizeMock.mockReturnValue("1KB");

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture: vi.fn() }),
			);

			await result.handleFileSelect(makeFile());
			expect(result.imagePreview()).toBe("blob:test-url");

			result.clearImage();

			expect(result.imagePreview()).toBe("");
			expect(result.error()).toBe("");
			expect(result.warning()).toBe("");
			expect(result.info()).toBe("");
			expect(result.compressionInfo()).toBeNull();
			expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test-url");
		});
	});

	describe("handleTabChange", () => {
		it('calls onReceiptRemoved and clears image when switching to "no-image"', async () => {
			const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
			const onReceiptRemoved = vi.fn();

			validateImageFileMock.mockReturnValue({ isValid: true });
			getCompressionOptionsMock.mockReturnValue({});
			compressImageMock.mockResolvedValue(makeFile("c.jpg"));
			calculateRatioMock.mockReturnValue(20);
			formatFileSizeMock.mockReturnValue("1KB");

			const onImageCapture = vi.fn((f: File) => setSelectedFile(f));
			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onImageCapture, onReceiptRemoved }),
			);

			await result.handleFileSelect(makeFile());
			expect(result.imagePreview()).toBe("blob:test-url");

			result.setActiveTab("no-image");

			expect(onReceiptRemoved).toHaveBeenCalledOnce();
			expect(result.activeTab()).toBe("no-image");
			expect(result.imagePreview()).toBe("");
		});

		it('does not call onReceiptRemoved when switching to "camera"', () => {
			const [selectedFile] = createSignal<File | null>(null);
			const onReceiptRemoved = vi.fn();

			const { result } = renderHook(() =>
				useReceiptImage({ selectedFile, onReceiptRemoved }),
			);

			result.setActiveTab("camera");

			expect(onReceiptRemoved).not.toHaveBeenCalled();
			expect(result.activeTab()).toBe("camera");
		});
	});
});
