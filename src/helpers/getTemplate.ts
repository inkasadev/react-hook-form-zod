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

	console.log("initialPrice", initialPrice);
	initialPrice = isNaN(initialPrice!) ? 0 : initialPrice;
	paymentCycleResult = isNaN(paymentCycleResult!) ? 0 : paymentCycleResult;
	billingCycle = isNaN(billingCycle!) ? 0 : billingCycle;

	const USDollar = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	const initialPriceInDollars = USDollar.format(initialPrice!);
	const paymentCycleInDollars = USDollar.format(paymentCycleResult!);

	// No Trial with never-ending subscription
	if (trialPeriodSelect === "none" && duration === "neverEnds") {
		template = `Your customer will be charged ${initialPriceInDollars} immediately and then
    ${paymentCycleInDollars} every ${billingFrequencyNumber} ${billingFrequencySelect} until they cancel.`;
	}

	// Trial with never ending subscription
	if (trialPeriodSelect !== "none" && duration === "neverEnds") {
		template = `Your customer will be charged ${initialPriceInDollars} immediately for their ${
			isNaN(trialPeriodNumber!) ? "??" : trialPeriodNumber
		} ${trialPeriodSelect} trial, and then ${paymentCycleInDollars} every ${billingFrequencyNumber} ${billingFrequencySelect} until
    they cancel.`;
	}

	// Trial with ending subscription
	if (trialPeriodSelect !== "none" && duration === "customize") {
		const totalAmountPaid =
			initialPrice! +
			paymentCycleResult * billingFrequencyNumber * billingCycle!;
		const totalAmountPaidInDollars = USDollar.format(totalAmountPaid);

		template = `Your customer will be charged ${initialPriceInDollars} immediately for their ${
			isNaN(trialPeriodNumber!) ? "??" : trialPeriodNumber
		} ${trialPeriodSelect} trial, and then ${paymentCycleInDollars} every ${billingFrequencyNumber} ${billingFrequencySelect}, ${billingCycle} times. The total amount paid will be ${totalAmountPaidInDollars}.`;
	}

	return template;
};
