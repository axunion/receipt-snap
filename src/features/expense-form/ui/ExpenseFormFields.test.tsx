import { render, screen } from "@solidjs/testing-library";
import type { FieldErrors, TouchedFields } from "@/types";
import {
  AmountField,
  DateField,
  DestinationField,
  DetailsField,
  NameField,
  NotesField,
} from "./ExpenseFormFields";

const noErrors = (): FieldErrors => ({});
const noTouched = (): TouchedFields => ({});

describe("form field label association", () => {
  it("associates the name label with its input", () => {
    render(() => (
      <NameField
        value=""
        onInput={() => {}}
        fieldErrors={noErrors}
        touchedFields={noTouched}
      />
    ));

    expect(screen.getByLabelText(/名前/)).toBeInstanceOf(HTMLInputElement);
  });

  it("associates the amount label with its input via aria-label", () => {
    render(() => (
      <AmountField
        value=""
        onInput={() => {}}
        fieldErrors={noErrors}
        touchedFields={noTouched}
      />
    ));

    expect(screen.getByLabelText("金額 (数字のみ)")).toBeInstanceOf(
      HTMLInputElement,
    );
  });

  it("associates the date label with its input", () => {
    render(() => (
      <DateField
        value=""
        onInput={() => {}}
        fieldErrors={noErrors}
        touchedFields={noTouched}
      />
    ));

    expect(screen.getByLabelText(/支払日/)).toBeInstanceOf(HTMLInputElement);
  });

  it("associates the details label with its input", () => {
    render(() => (
      <DetailsField
        value=""
        onInput={() => {}}
        fieldErrors={noErrors}
        touchedFields={noTouched}
      />
    ));

    expect(screen.getByLabelText(/内訳/)).toBeInstanceOf(HTMLInputElement);
  });

  it("associates the destination label with its select", () => {
    render(() => (
      <DestinationField
        value=""
        options={[{ value: "a", label: "Option A" }]}
        isLoading={false}
        onSelect={() => {}}
        fieldErrors={noErrors}
        touchedFields={noTouched}
      />
    ));

    expect(screen.getByLabelText(/対象/)).toBeInstanceOf(HTMLSelectElement);
  });

  it("associates the notes label with its textarea", () => {
    render(() => <NotesField value="" onInput={() => {}} />);

    expect(screen.getByLabelText(/備考/)).toBeInstanceOf(HTMLTextAreaElement);
  });
});
