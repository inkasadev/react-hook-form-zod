import { SubscriptionFormSchemaData } from "../components/SubscriptionForm";

export const getTemplate = (data: SubscriptionFormSchemaData) => {
	let {
		initialPrice,
		billingFrequencyNumber,
		billingFrequencySelect,
		paymentCycleResult,
		trialPeriodNumber,
		trialPeriodSelect,
		duration,
		billingCycle,
	} = data;
	let template =
		"Your customer will be charged $0.00 immediately and then $0.00 every 1 days until they cancel.";

	let USDollar = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	initialPrice = isNaN(initialPrice!) ? 0 : initialPrice;
	paymentCycleResult = isNaN(paymentCycleResult!) ? 0 : paymentCycleResult;
	billingCycle = isNaN(billingCycle!) ? 0 : billingCycle;

	// No Trial with never-ending subscription
	if (trialPeriodSelect === "none" && duration === "neverEnds") {
		template = `Your customer will be charged ${USDollar.format(
			initialPrice!,
		)} immediately and then
    ${USDollar.format(
			paymentCycleResult!,
		)} every ${billingFrequencyNumber} ${billingFrequencySelect} until they cancel.`;
	}

	// Trial with never ending subscription
	if (trialPeriodSelect !== "none" && duration === "neverEnds") {
		template = `Your customer will be charged ${USDollar.format(
			initialPrice!,
		)} immediately for their ${
			isNaN(trialPeriodNumber!) ? "??" : trialPeriodNumber
		} ${trialPeriodSelect} trial, and then ${USDollar.format(
			paymentCycleResult!,
		)} every ${billingFrequencyNumber} ${billingFrequencySelect} until
    they cancel.`;
	}

	// Trial with ending subscription
	if (trialPeriodSelect !== "none" && duration === "customize") {
		let totalAmountPaid =
			initialPrice! +
			paymentCycleResult * billingFrequencyNumber * billingCycle!;
		template = `Your customer will be charged ${USDollar.format(
			initialPrice!,
		)} immediately for their ${
			isNaN(trialPeriodNumber!) ? "??" : trialPeriodNumber
		} ${trialPeriodSelect} trial, and then ${USDollar.format(
			paymentCycleResult!,
		)} every ${billingFrequencyNumber} ${billingFrequencySelect}, ${
			isNaN(billingCycle!) ? "??" : billingCycle
		} times. The total amount paid will be ${USDollar.format(
			totalAmountPaid,
		)}.`;
	}

	return template;
};
