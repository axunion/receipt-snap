import { renderHook } from "@solidjs/testing-library";
import { expenseFormStore } from "./expenseFormStore";
import { useExpenseFormController } from "./useExpenseFormController";

const {
  loadUserNameMock,
  saveUserNameMock,
  submitExpenseMock,
  getReCaptchaTokenMock,
  fileToBase64Mock,
} = vi.hoisted(() => ({
  loadUserNameMock: vi.fn().mockReturnValue(""),
  saveUserNameMock: vi.fn(),
  submitExpenseMock: vi.fn(),
  getReCaptchaTokenMock: vi.fn(),
  fileToBase64Mock: vi.fn(),
}));

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils")>();
  return {
    ...actual,
    loadUserName: loadUserNameMock,
    saveUserName: saveUserNameMock,
    fileToBase64: fileToBase64Mock,
  };
});

vi.mock("@/services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services")>();
  return {
    ...actual,
    submitExpense: submitExpenseMock,
    getReCaptchaToken: getReCaptchaTokenMock,
  };
});

// vi.hoisted container — properties are mutated by the async mock factory
// so that tests can drive the reactive signal after renderHook.
const mockDest = vi.hoisted(() => ({
  setError: (_v: string | null) => {},
  refetchMock: vi.fn(),
  getDestinationLabelMock: vi.fn().mockReturnValue(""),
}));

vi.mock("./destinationStore", async () => {
  const { createSignal } = await import("solid-js");
  const [error, setError] = createSignal<string | null>(null);
  // Expose the setter through the hoisted container so tests can trigger
  // the reactive effect after the hook is already mounted.
  mockDest.setError = setError;
  return {
    destinationStore: {
      destinations: () => [],
      error,
      loading: () => false,
      refetch: mockDest.refetchMock,
      getDestinationLabel: mockDest.getDestinationLabelMock,
    },
  };
});

vi.mock("@/constants/config", () => ({
  CONFIG: {
    RECAPTCHA: { SITE_KEY: "" },
    API: { BASE_URL: "" },
    POSTMESSAGE: { ALLOWED_ORIGINS: new Set<string>() },
  },
}));

function resetStore() {
  expenseFormStore.setName("");
  expenseFormStore.setAmount("");
  expenseFormStore.setDate("2025-01-01");
  expenseFormStore.setDetails("");
  expenseFormStore.setDestination("");
  expenseFormStore.setNotes("");
  expenseFormStore.setNoImageReason("");
  expenseFormStore.setReceiptFile(null);
  expenseFormStore.setSubmitState({ isLoading: false, result: null });
  expenseFormStore.setIsExternalName(false);
}

describe("useExpenseFormController", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    loadUserNameMock.mockReset();
    saveUserNameMock.mockReset();
    submitExpenseMock.mockReset();
    getReCaptchaTokenMock.mockReset();
    fileToBase64Mock.mockReset();
    loadUserNameMock.mockReturnValue("");
    getReCaptchaTokenMock.mockResolvedValue("token");
    fileToBase64Mock.mockResolvedValue("base64");
    mockDest.setError(null);
    mockDest.refetchMock.mockReset();
    resetStore();
  });

  describe("showOnboarding initial state", () => {
    it("is true when user has no saved name", () => {
      loadUserNameMock.mockReturnValue("");
      const { result } = renderHook(() => useExpenseFormController());
      expect(result.showOnboarding()).toBe(true);
    });

    it("is false when user already has a saved name", () => {
      loadUserNameMock.mockReturnValue("Taro");
      const { result } = renderHook(() => useExpenseFormController());
      expect(result.showOnboarding()).toBe(false);
    });
  });

  it("closes showOnboarding when isExternalName becomes true", () => {
    const { result } = renderHook(() => useExpenseFormController());
    expect(result.showOnboarding()).toBe(true);

    expenseFormStore.setIsExternalName(true);

    expect(result.showOnboarding()).toBe(false);
  });

  it("shows destination error when error arrives after mount (reactive path)", () => {
    const { result } = renderHook(() => useExpenseFormController());
    expect(result.showDestinationError()).toBe(false);

    mockDest.setError("Failed to load destinations");

    expect(result.showDestinationError()).toBe(true);
  });

  describe("hasGeneralErrors", () => {
    it("is true after submitting an invalid form", async () => {
      const { result } = renderHook(() => useExpenseFormController());
      const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

      await result.handleSubmit(mockEvent);

      expect(result.hasGeneralErrors()).toBe(true);
    });

    it("is false before any fields are touched", () => {
      const { result } = renderHook(() => useExpenseFormController());
      expect(result.hasGeneralErrors()).toBe(false);
    });
  });

  describe("completeOnboarding", () => {
    it("does nothing when name is empty", () => {
      expenseFormStore.setName("");
      const { result } = renderHook(() => useExpenseFormController());

      result.completeOnboarding();

      expect(result.showOnboarding()).toBe(true);
      expect(saveUserNameMock).not.toHaveBeenCalled();
    });

    it("trims name, saves it, and closes onboarding when name is non-empty", () => {
      expenseFormStore.setName("  Hanako  ");
      const { result } = renderHook(() => useExpenseFormController());

      result.completeOnboarding();

      expect(expenseFormStore.name()).toBe("Hanako");
      expect(saveUserNameMock).toHaveBeenCalledWith("Hanako");
      expect(result.showOnboarding()).toBe(false);
    });
  });

  describe("openOnboarding", () => {
    it("opens onboarding when isExternalName is false", () => {
      loadUserNameMock.mockReturnValue("Taro");
      expenseFormStore.setIsExternalName(false);
      const { result } = renderHook(() => useExpenseFormController());
      expect(result.showOnboarding()).toBe(false);

      result.openOnboarding();

      expect(result.showOnboarding()).toBe(true);
    });

    it("does not open onboarding when isExternalName is true", () => {
      loadUserNameMock.mockReturnValue("Taro");
      expenseFormStore.setIsExternalName(true);
      const { result } = renderHook(() => useExpenseFormController());

      result.openOnboarding();

      expect(result.showOnboarding()).toBe(false);
    });
  });

  describe("retryDestinationLoad", () => {
    it("closes the destination error modal and calls refetch", () => {
      const { result } = renderHook(() => useExpenseFormController());
      mockDest.setError("Some error");
      expect(result.showDestinationError()).toBe(true);

      result.retryDestinationLoad();

      expect(result.showDestinationError()).toBe(false);
      expect(mockDest.refetchMock).toHaveBeenCalled();
    });
  });

  describe("handleSubmit", () => {
    it("calls preventDefault on the event", async () => {
      const { result } = renderHook(() => useExpenseFormController());
      const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

      await result.handleSubmit(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalledOnce();
    });
  });

  describe("isSubmitting", () => {
    it("reflects submitState.isLoading from the store", () => {
      const { result } = renderHook(() => useExpenseFormController());
      expect(result.isSubmitting()).toBe(false);

      expenseFormStore.setSubmitState({ isLoading: true, result: null });
      expect(result.isSubmitting()).toBe(true);
    });
  });
});
