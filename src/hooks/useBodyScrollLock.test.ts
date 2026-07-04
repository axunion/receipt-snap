import { renderHook } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { useBodyScrollLock } from "./useBodyScrollLock";

describe("useBodyScrollLock", () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.style.cssText = "";
    Object.defineProperty(window, "scrollY", {
      value: 250,
      writable: true,
      configurable: true,
    });
    scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {}) as ReturnType<typeof vi.spyOn>;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("locks body scroll and saves scroll position when active", () => {
    renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-250px");
    expect(document.body.style.width).toBe("100%");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores styles and scroll position when deactivated", () => {
    const [active, setActive] = createSignal(true);
    renderHook(() => useBodyScrollLock(active));

    setActive(false);

    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.width).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(scrollToSpy).toHaveBeenCalledWith(0, 250);
  });

  it("restores styles and scroll position on unmount", () => {
    const { cleanup } = renderHook(() => useBodyScrollLock(true));

    cleanup();

    expect(document.body.style.position).toBe("");
    expect(scrollToSpy).toHaveBeenCalledWith(0, 250);
  });

  it("does nothing when shouldLock is false", () => {
    renderHook(() => useBodyScrollLock(true, false));

    expect(document.body.style.position).toBe("");
    expect(document.body.style.overflow).toBe("");
  });
});
