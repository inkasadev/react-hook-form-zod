import { zodResolver } from "@hookform/resolvers/zod";
import cs from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DescriptionLabel } from "../DescriptionLabel/DescriptionLabel";
import styles from "./styles.module.css";

const SubscriptionFormSchema = z
	.object({
		initialPrice: z.number().min(0).optional().or(z.nan()),
		billingFrequencyNumber: z.number().min(1).int(),
		billingFrequencySelect: z.enum(["days", "weeks", "months"]),
		paymentCycleResult: z
			.number({
				invalid_type_error: "Please enter a valid number",
			})
			.min(1),
		trialPeriodNumber: z.number().min(0).optional().or(z.nan()),
		trialPeriodSelect: z.enum(["none", "days", "weeks", "months"]),
		duration: z.enum(["neverEnds", "customize"]),
		billingCycle: z.number().min(0).int().optional().or(z.nan()),
	})
	.superRefine(
		({ trialPeriodNumber, trialPeriodSelect, duration, billingCycle }, ctx) => {
			if (
				trialPeriodSelect !== "none" &&
				!Number.isInteger(trialPeriodNumber)
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Please enter a valid number",
					path: ["trialPeriodNumber"],
				});
			}

			if (duration === "customize" && !Number.isInteger(billingCycle)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Please enter a valid number",
					path: ["billingCycle"],
				});
			}
		},
	);

export type SubscriptionFormSchemaData = z.infer<typeof SubscriptionFormSchema>;

export const SubscriptionForm = () => {
	const [formExtras, setFormExtras] = useState({
		label: "Daily",
		hideBillingCycle: true,
	});
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<SubscriptionFormSchemaData>({
		resolver: zodResolver(SubscriptionFormSchema),
	});
	const watchTrialPeriodSelect = watch("trialPeriodSelect");

	const onSubmit = async (data: any) => {
		console.log(data);
	};

	const handleBillingFrequencySelectChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const {
			target: { value },
		} = e;
		const label =
			value === "days" ? "Daily" : value === "weeks" ? "Weekly" : "Monthly";

		setFormExtras((currentValues) => {
			return {
				...currentValues,
				label,
			};
		});
	};

	return (
		<div className={styles.subscriptionForm}>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
				<div className={styles.formGroup}>
					<label htmlFor="initialPrice" className={styles.label}>
						Initial Price
					</label>
					<input
						id="initialPrice"
						type="number"
						step="0.01"
						{...register("initialPrice", {
							valueAsNumber: true,
							min: 0,
							onChange: (e) => {
								setValue("paymentCycleResult", Number(e.target.value));
							},
						})}
						className={styles.input}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="billingFrequencyNumber" className={styles.label}>
						Billing Frequency
					</label>
					<div className={styles.inputGroup}>
						<input
							id="billingFrequencyNumber"
							type="number"
							{...register("billingFrequencyNumber", {
								valueAsNumber: true,
								value: 1,
							})}
							className={styles.input}
						/>

						<select
							defaultValue="days"
							{...register("billingFrequencySelect")}
							onChange={handleBillingFrequencySelectChange}
							className={styles.select}
						>
							<option value="days">Days</option>
							<option value="weeks">Weeks</option>
							<option value="months">Months</option>
						</select>
					</div>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="paymentCycleResult" className={styles.label}>
						{formExtras.label} Payment
					</label>
					<input
						id="paymentCycleResult"
						type="number"
						step="0.01"
						{...register("paymentCycleResult", {
							valueAsNumber: true,
						})}
						className={styles.input}
					/>
					{errors.paymentCycleResult && (
						<span className={styles.error}>
							{errors.paymentCycleResult.message}
						</span>
					)}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="trialPeriodNumber" className={styles.label}>
						Trial Period
					</label>
					<div className={styles.inputGroup}>
						<input
							id="trialPeriodNumber"
							type="number"
							{...register("trialPeriodNumber", {
								valueAsNumber: true,
							})}
							disabled={
								!!!watchTrialPeriodSelect || watchTrialPeriodSelect === "none"
							}
							className={styles.input}
						/>

						<select
							defaultValue="none"
							{...register("trialPeriodSelect")}
							className={styles.select}
						>
							<option value="none">None</option>
							<option value="days">Days</option>
							<option value="weeks">Weeks</option>
							<option value="months">Months</option>
						</select>
					</div>
					{errors.trialPeriodNumber && (
						<span className={styles.error}>
							{errors.trialPeriodNumber.message}
						</span>
					)}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="duration" className={styles.label}>
						Duration
					</label>
					<select
						id="duration"
						defaultValue="neverEnds"
						{...register("duration", {
							onChange: (e) => {
								const {
									target: { value },
								} = e;

								setFormExtras((currentValues) => {
									return {
										...currentValues,
										hideBillingCycle: value !== "customize",
									};
								});
							},
						})}
						className={styles.select}
					>
						<option value="neverEnds">Never Ends</option>
						<option value="customize">Customize</option>
					</select>
				</div>
				<div
					className={cs(styles.formGroup, {
						[styles.hide]: formExtras.hideBillingCycle,
					})}
				>
					<label htmlFor="billingCycle" className={styles.label}>
						Billing Cycle
					</label>
					<input
						id="billingCycle"
						type="number"
						{...register("billingCycle", {
							valueAsNumber: true,
						})}
						className={styles.input}
					/>
					{errors.billingCycle && (
						<span className={styles.error}>{errors.billingCycle.message}</span>
					)}
				</div>

				<button type="submit" className={styles.button}>
					Submit
				</button>
			</form>
			<DescriptionLabel data={watch()} />
		</div>
	);
};
