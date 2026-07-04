import { fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders children when open", () => {
    render(() => (
      <Modal isOpen={true} ariaLabel="test dialog">
        <p>modal content</p>
      </Modal>
    ));

    expect(screen.getByText("modal content")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("renders nothing when closed", () => {
    render(() => (
      <Modal isOpen={false} ariaLabel="test dialog">
        <p>modal content</p>
      </Modal>
    ));

    expect(screen.queryByText("modal content")).not.toBeInTheDocument();
  });

  it("focuses the dialog content on open", () => {
    render(() => (
      <Modal isOpen={true} ariaLabel="test dialog">
        <p>modal content</p>
      </Modal>
    ));

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("calls onClose when Escape is pressed with focus inside the dialog", () => {
    const onClose = vi.fn();
    render(() => (
      <Modal isOpen={true} onClose={onClose} ariaLabel="test dialog">
        <p>modal content</p>
      </Modal>
    ));

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked, but not the content", () => {
    const onClose = vi.fn();
    render(() => (
      <Modal isOpen={true} onClose={onClose} ariaLabel="test dialog">
        <p>modal content</p>
      </Modal>
    ));

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    const backdrop = dialog.parentElement;
    if (!backdrop) throw new Error("backdrop not found");
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("restores focus to the previously focused element on close", () => {
    const [open, setOpen] = createSignal(false);
    render(() => (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          open modal
        </button>
        <Modal isOpen={open()} onClose={() => setOpen(false)} ariaLabel="test">
          <p>modal content</p>
        </Modal>
      </>
    ));

    const trigger = screen.getByRole("button", { name: "open modal" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(trigger).toHaveFocus();
  });
});
