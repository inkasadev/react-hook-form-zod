import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubscriptionForm } from ".";
import { act } from "react-dom/test-utils";

describe("render and update form fields", () => {
	it("should render and update 'Initial Price' field", () => {
		// Arrange
		render(<SubscriptionForm />);

		// Act
		const input = screen.queryByLabelText("Initial Price");
		fireEvent.change(input!, { target: { value: 10 } });

		// Assert
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue(10);
	});

	it("should render and update 'Billing Frequency' fields", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const input = screen.queryByLabelText("Billing Frequency");
		const select = getByTestId("billing-frequency-select");
		const selectOptions = select.children;
		fireEvent.change(select, { target: { value: "weeks" } });

		// Assert
		expect(input).toBeInTheDocument();
		expect(select).toBeInTheDocument();
		expect((select as HTMLSelectElement).value).toBe("weeks");
		expect((selectOptions[0] as HTMLOptionElement).selected).toBeFalsy();
		expect((selectOptions[1] as HTMLOptionElement).selected).toBeTruthy();
		expect((selectOptions[2] as HTMLOptionElement).selected).toBeFalsy();
	});

	it("should render and update 'Payment Cycle' field", () => {
		// Arrange
		render(<SubscriptionForm />);

		// Act
		const input = screen.queryByLabelText("Daily Payment");
		fireEvent.change(input!, { target: { value: 10 } });

		// Assert
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue(10);
	});

	it("should render and NOT update 'Trial Period' fields", () => {
		// Arrange
		render(<SubscriptionForm />);

		// Act
		const input = screen.queryByLabelText("Trial Period");

		// Assert
		expect(input).toBeInTheDocument();
		expect(input).toBeDisabled();
	});

	it("should render and update 'Trial Period' fields", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const input = screen.queryByLabelText("Trial Period");
		const select = getByTestId("trial-period-select");
		const selectOptions = select.children;
		fireEvent.change(select, { target: { value: "weeks" } });

		// Assert
		expect(input).toBeInTheDocument();
		expect(input).not.toBeDisabled();
		expect((select as HTMLSelectElement).value).toBe("weeks");
		expect((selectOptions[0] as HTMLOptionElement).selected).toBeFalsy();
		expect((selectOptions[1] as HTMLOptionElement).selected).toBeFalsy();
		expect((selectOptions[2] as HTMLOptionElement).selected).toBeTruthy();
		expect((selectOptions[3] as HTMLOptionElement).selected).toBeFalsy();
	});

	it("should render 'Duration' and NOT render 'Billing Cycle' field", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const select = getByTestId("duration-select");
		const input = screen.queryByLabelText("Billing Cycle");

		// Assert
		expect((select as HTMLSelectElement).value).toBe("neverEnds");
		expect(input).not.toBeInTheDocument();
	});

	it("should render and update 'Duration' and render and update 'Billing Cycle' field", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const select = getByTestId("duration-select");
		fireEvent.change(select, { target: { value: "customize" } });
		const input = screen.queryByLabelText("Billing Cycle");
		fireEvent.change(input!, { target: { value: 10 } });

		// Assert

		expect((select as HTMLSelectElement).value).toBe("customize");
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue(10);
	});
});

describe("custom behaviors", () => {
	it("should change 'Payment Cycle' label text from 'Daily Payment' to 'Daily Payment' based on the 'Billing Frequency' dropdown.", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const select = getByTestId("billing-frequency-select");
		fireEvent.change(select, { target: { value: "weeks" } });
		fireEvent.change(select, { target: { value: "days" } });
		const input = screen.queryByLabelText("Daily Payment");

		// Assert
		expect(input).toBeInTheDocument();
	});

	it("should change 'Payment Cycle' label text from 'Daily Payment' to 'Weekly Payment' based on the 'Billing Frequency' dropdown.", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const select = getByTestId("billing-frequency-select");
		fireEvent.change(select, { target: { value: "weeks" } });
		const input = screen.queryByLabelText("Weekly Payment");

		// Assert
		expect(input).toBeInTheDocument();
	});

	it("should change 'Payment Cycle' label text from 'Daily Payment' to 'Monthly Payment' based on the 'Billing Frequency' dropdown.", () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const select = getByTestId("billing-frequency-select");
		fireEvent.change(select, { target: { value: "months" } });
		const input = screen.queryByLabelText("Monthly Payment");

		// Assert
		expect(input).toBeInTheDocument();
	});

	it("should autofill the 'Payment Cycle' input to the initial payment if the initial payment has a value and THERE IS NO value yet for this field.", () => {
		// Arrange
		render(<SubscriptionForm />);

		// Act
		const initialPriceInput = screen.queryByLabelText("Initial Price");
		fireEvent.change(initialPriceInput!, { target: { value: 10 } });
		const paymentCycleInput = screen.queryByLabelText("Daily Payment");

		// Assert
		expect(initialPriceInput).toBeInTheDocument();
		expect(initialPriceInput).toHaveValue(10);
		expect(paymentCycleInput).toBeInTheDocument();
		expect(paymentCycleInput).toHaveValue(10);
	});

	it("should NOT autofill the 'Payment Cycle' input to the initial payment if the initial payment has a value and THERE IS value in this field.", () => {
		// Arrange
		render(<SubscriptionForm />);

		// Act
		const initialPriceInput = screen.queryByLabelText("Initial Price");
		const paymentCycleInput = screen.queryByLabelText("Daily Payment");
		fireEvent.change(paymentCycleInput!, { target: { value: 100 } });
		fireEvent.change(initialPriceInput!, { target: { value: 10 } });

		// Assert
		expect(initialPriceInput).toBeInTheDocument();
		expect(initialPriceInput).toHaveValue(10);
		expect(paymentCycleInput).toBeInTheDocument();
		expect(paymentCycleInput).toHaveValue(100);
	});
});

describe("errors", () => {
	it("should render error message when 'Payment Cycle' is empty", async () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const form = getByTestId("form");
		act(() => {
			fireEvent.submit(form);
		});

		// Assert
		await waitFor(() => {
			const error = screen.queryByText("Please enter a valid number");
			expect(error).toBeInTheDocument();
		});
	});

	it("should render error message when 'Trial Period' value is empty and 'Trial Period' select is not None", async () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const form = getByTestId("form");
		const paymentCycleInput = screen.queryByLabelText("Daily Payment");
		fireEvent.change(paymentCycleInput!, { target: { value: 10 } });

		const select = getByTestId("trial-period-select");
		fireEvent.change(select, { target: { value: "weeks" } });

		act(() => {
			fireEvent.submit(form);
		});

		// Assert
		await waitFor(() => {
			const error = screen.queryByText("Please enter a valid number");
			expect(error).toBeInTheDocument();
		});
	});

	it("should render error message when 'Billing Cycle' value is empty and 'Duration' select is 'customize'", async () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const form = getByTestId("form");
		const paymentCycleInput = screen.queryByLabelText("Daily Payment");
		fireEvent.change(paymentCycleInput!, { target: { value: 10 } });

		const select = getByTestId("duration-select");
		fireEvent.change(select, { target: { value: "customize" } });

		act(() => {
			fireEvent.submit(form);
		});

		// Assert
		await waitFor(() => {
			const error = screen.queryByText("Please enter a valid number");
			expect(error).toBeInTheDocument();
		});
	});

	it("should NOT render error message when 'Payment Cycle' is NOT empty", async () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const form = getByTestId("form");
		const input = screen.queryByLabelText("Daily Payment");
		fireEvent.change(input!, { target: { value: 10 } });
		act(() => {
			fireEvent.submit(form);
		});

		// Assert
		await waitFor(() => {
			const error = screen.queryByText("Please enter a valid number");
			expect(error).not.toBeInTheDocument();
		});
	});

	it("should NOT render error message when 'Trial Period' value is NOT empty and 'Trial Period' select is not None", async () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const form = getByTestId("form");
		const paymentCycleInput = screen.queryByLabelText("Daily Payment");
		fireEvent.change(paymentCycleInput!, { target: { value: 10 } });

		const input = screen.queryByLabelText("Trial Period");
		const select = getByTestId("trial-period-select");
		fireEvent.change(select, { target: { value: "weeks" } });
		fireEvent.change(input!, { target: { value: 10 } });

		act(() => {
			fireEvent.submit(form);
		});

		// Assert
		await waitFor(() => {
			const error = screen.queryByText("Please enter a valid number");
			expect(error).not.toBeInTheDocument();
		});
	});

	it("should NOT render error message when 'Billing Cycle' value is NOT empty and 'Duration' select is 'customize'", async () => {
		// Arrange
		const { getByTestId } = render(<SubscriptionForm />);

		// Act
		const form = getByTestId("form");
		const paymentCycleInput = screen.queryByLabelText("Daily Payment");
		fireEvent.change(paymentCycleInput!, { target: { value: 10 } });

		const select = getByTestId("duration-select");
		fireEvent.change(select, { target: { value: "customize" } });
		const input = screen.queryByLabelText("Billing Cycle");
		fireEvent.change(input!, { target: { value: 10 } });

		act(() => {
			fireEvent.submit(form);
		});

		// Assert
		await waitFor(() => {
			const error = screen.queryByText("Please enter a valid number");
			expect(error).not.toBeInTheDocument();
		});
	});
});
