import { describe, expect, it } from "vitest";
import { DescriptionLabel } from ".";
import { render, screen } from "@testing-library/react";

describe("render correct template in DescriptionLabel component", () => {
	it("should render correct default template", () => {
		// Arrange
		const template =
			"Your customer will be charged $0.00 immediately and then $0.00 every 1 days until they cancel.";
		render(<DescriptionLabel data={{}} />);

		// Act
		const templateElement = screen.getByText(template);

		// Assert
		expect(templateElement).not.toBeNull();
	});

	it("should render correct template 'No Trial with never-ending subscription'", () => {
		// Arrange
		const template =
			"Your customer will be charged $10.00 immediately and then $25.00 every 1 months until they cancel.";
		const data = {
			initialPrice: 10,
			billingFrequencyNumber: 1,
			billingFrequencySelect: "months",
			paymentCycleResult: 25,
			trialPeriodSelect: "none",
			duration: "neverEnds",
		};
		render(<DescriptionLabel data={data} />);

		// Act
		const templateElement = screen.getByText(template);

		// Assert
		expect(templateElement).not.toBeNull();
	});

	it("should render correct template 'Trial with never ending subscription'", () => {
		// Arrange
		const template =
			"Your customer will be charged $25.00 immediately for their 14 days trial, and then $25.00 every 1 months until they cancel.";
		const data = {
			initialPrice: 25,
			billingFrequencyNumber: 1,
			billingFrequencySelect: "months",
			paymentCycleResult: 25,
			trialPeriodNumber: 14,
			trialPeriodSelect: "days",
			duration: "neverEnds",
		};
		render(<DescriptionLabel data={data} />);

		// Act
		const templateElement = screen.getByText(template);

		// Assert
		expect(templateElement).not.toBeNull();
	});

	it("should render correct placeholders template 'Trial with never ending subscription'", () => {
		// Arrange
		const template =
			"Your customer will be charged $0.00 immediately for their ?? days trial, and then $0.00 every 1 days until they cancel.";
		const data = {
			initialPrice: null,
			billingFrequencyNumber: 1,
			billingFrequencySelect: "days",
			paymentCycleResult: null,
			trialPeriodSelect: "days",
			duration: "neverEnds",
		};
		render(<DescriptionLabel data={data} />);

		// Act
		const templateElement = screen.getByText(template);

		// Assert
		expect(templateElement).not.toBeNull();
	});

	it("should render correct template 'Trial with ending subscription'", () => {
		// Arrange
		const template =
			"Your customer will be charged $49.90 immediately for their 1 weeks trial, and then $25.70 every 1 months, 1 times. The total amount paid will be $75.60.";
		const data = {
			initialPrice: 49.9,
			billingFrequencyNumber: 1,
			billingFrequencySelect: "months",
			paymentCycleResult: 25.7,
			trialPeriodNumber: 1,
			trialPeriodSelect: "weeks",
			duration: "customize",
			billingCycle: 1,
		};
		render(<DescriptionLabel data={data} />);

		// Act
		const templateElement = screen.getByText(template);

		// Assert
		expect(templateElement).not.toBeNull();
	});

	it("should render correct placeholders for template 'Trial with ending subscription' when not all data is provided", () => {
		// Arrange
		const template =
			"Your customer will be charged $0.00 immediately for their ?? days trial, and then $0.00 every 1 days, 2 times. The total amount paid will be $0.00.";
		const data = {
			initialPrice: null,
			billingFrequencyNumber: 1,
			billingFrequencySelect: "days",
			paymentCycleResult: null,
			trialPeriodSelect: "days",
			duration: "customize",
			billingCycle: 2,
		};
		render(<DescriptionLabel data={data} />);

		// Act
		const templateElement = screen.getByText(template);

		// Assert
		expect(templateElement).not.toBeNull();
	});
});
