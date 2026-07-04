import { expenseFormStore } from "./expenseFormStore";

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils")>();
  return {
    ...actual,
    loadUserName: vi.fn().mockReturnValue(""),
    formatDateForInput: vi.fn().mockReturnValue("2025-01-01"),
  };
});

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

describe("expenseFormStore", () => {
  beforeEach(resetStore);

  it("setters update corresponding getters", () => {
    expenseFormStore.setName("Taro");
    expenseFormStore.setAmount("1200");
    expenseFormStore.setDate("2025-06-15");
    expenseFormStore.setDetails("Lunch meeting");
    expenseFormStore.setDestination("project_a");
    expenseFormStore.setNotes("With team");

    expect(expenseFormStore.name()).toBe("Taro");
    expect(expenseFormStore.amount()).toBe("1200");
    expect(expenseFormStore.date()).toBe("2025-06-15");
    expect(expenseFormStore.details()).toBe("Lunch meeting");
    expect(expenseFormStore.destination()).toBe("project_a");
    expect(expenseFormStore.notes()).toBe("With team");
  });

  it("setReceiptFile stores and retrieves a File", () => {
    const file = new File(["data"], "receipt.jpg", { type: "image/jpeg" });
    expenseFormStore.setReceiptFile(file);
    expect(expenseFormStore.receiptFile()).toBe(file);
  });

  it("setSubmitState stores loading and result", () => {
    expenseFormStore.setSubmitState({ isLoading: true, result: null });
    expect(expenseFormStore.submitState().isLoading).toBe(true);
    expect(expenseFormStore.submitState().result).toBeNull();

    expenseFormStore.setSubmitState({
      isLoading: false,
      result: { result: "done" },
    });
    expect(expenseFormStore.submitState().isLoading).toBe(false);
    expect(expenseFormStore.submitState().result).toEqual({ result: "done" });
  });

  describe("removeReceipt", () => {
    it("sets receiptFile to null", () => {
      const file = new File(["data"], "r.jpg", { type: "image/jpeg" });
      expenseFormStore.setReceiptFile(file);
      expenseFormStore.removeReceipt();
      expect(expenseFormStore.receiptFile()).toBeNull();
    });

    it("does not change noImageReason", () => {
      expenseFormStore.setNoImageReason("Lost");
      expenseFormStore.removeReceipt();
      expect(expenseFormStore.noImageReason()).toBe("Lost");
    });
  });

  describe("clearReceipt", () => {
    it("sets receiptFile to null and noImageReason to empty string", () => {
      const file = new File(["data"], "r.jpg", { type: "image/jpeg" });
      expenseFormStore.setReceiptFile(file);
      expenseFormStore.setNoImageReason("Lost");

      expenseFormStore.clearReceipt();

      expect(expenseFormStore.receiptFile()).toBeNull();
      expect(expenseFormStore.noImageReason()).toBe("");
    });
  });

  describe("resetForm", () => {
    it("resets amount, date, details, destination, notes, noImageReason, receiptFile, submitState", () => {
      const file = new File(["data"], "r.jpg", { type: "image/jpeg" });
      expenseFormStore.setAmount("9999");
      expenseFormStore.setDate("2020-01-01");
      expenseFormStore.setDetails("Some details");
      expenseFormStore.setDestination("project_x");
      expenseFormStore.setNotes("Some notes");
      expenseFormStore.setNoImageReason("Lost receipt");
      expenseFormStore.setReceiptFile(file);
      expenseFormStore.setSubmitState({
        isLoading: false,
        result: { result: "done" },
      });

      expenseFormStore.resetForm();

      expect(expenseFormStore.amount()).toBe("");
      expect(expenseFormStore.date()).toBe("2025-01-01");
      expect(expenseFormStore.details()).toBe("");
      expect(expenseFormStore.destination()).toBe("");
      expect(expenseFormStore.notes()).toBe("");
      expect(expenseFormStore.noImageReason()).toBe("");
      expect(expenseFormStore.receiptFile()).toBeNull();
      expect(expenseFormStore.submitState()).toEqual({
        isLoading: false,
        result: null,
      });
    });

    it("does not reset name", () => {
      expenseFormStore.setName("Hanako");
      expenseFormStore.resetForm();
      expect(expenseFormStore.name()).toBe("Hanako");
    });

    it("does not reset isExternalName", () => {
      expenseFormStore.setIsExternalName(true);
      expenseFormStore.resetForm();
      expect(expenseFormStore.isExternalName()).toBe(true);
    });
  });

  describe("getFormData", () => {
    it("returns a snapshot of all current field values", () => {
      const file = new File(["data"], "r.jpg", { type: "image/jpeg" });
      expenseFormStore.setName("Taro");
      expenseFormStore.setAmount("3000");
      expenseFormStore.setDate("2025-03-15");
      expenseFormStore.setDetails("Taxi");
      expenseFormStore.setDestination("project_b");
      expenseFormStore.setNotes("Late night");
      expenseFormStore.setNoImageReason("");
      expenseFormStore.setReceiptFile(file);

      const data = expenseFormStore.getFormData();

      expect(data).toEqual({
        name: "Taro",
        amount: "3000",
        date: "2025-03-15",
        details: "Taxi",
        destination: "project_b",
        notes: "Late night",
        noImageReason: "",
        receiptFile: file,
      });
    });
  });
});
