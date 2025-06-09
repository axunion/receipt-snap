// Image resolution settings
export const RESOLUTION_PRESETS = {
	VERY_HIGH: { width: 800, height: 1200 },
	HIGH: { width: 700, height: 1000 },
	MEDIUM: { width: 600, height: 900 },
} as const;

// JPEG quality settings
export const QUALITY_PRESETS = {
	HIGH: 0.9,
	STANDARD: 0.7,
	MEDIUM: 0.5,
	LOW: 0.4,
} as const;

// File format support
export const SUPPORTED_FORMATS = {
	OUTPUT_FORMAT: "image/jpeg" as const,
	SUPPORTED_INPUTS: [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
		"image/heic",
		"image/heif",
	] as const,
	FILE_EXTENSIONS: [
		".jpg",
		".jpeg",
		".png",
		".webp",
		".heic",
		".heif",
	] as const,
} as const;

// Canvas settings
export const CANVAS_SETTINGS = {
	BACKGROUND_COLOR: "#ffffff",
	SMOOTHING_QUALITY: "high" as ImageSmoothingQuality,
} as const;
