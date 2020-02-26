export interface TaxSettings {
	readonly year: string;
	readonly allowance: Allowance;
	readonly incomeTax: IncomeTax;
	readonly nationalInsurance: NationalInsurance;
	readonly studentLoan: StudentLoan;
}

export interface Allowance {
	readonly basic: number;
	readonly age_65_74: number;
	readonly age_75_over: number;
	readonly blind: number;
	readonly thresholds: AllowanceThresholds;
}

export interface AllowanceThresholds {
	readonly age: number;
	readonly taper: number;
}

export interface IncomeTax {
	readonly rate_0: TaxRate;
	readonly rate_20: TaxRate;
	readonly rate_40: TaxRate;
	readonly rate_45: TaxRate;
}

export interface TaxRate {
	readonly start: number;
	readonly end: number;
	readonly rate: number;
}

export interface NationalInsurance {
	readonly pensionAge: number;
	readonly rate_0: TaxRate;
	readonly rate_12: TaxRate;
	readonly rate_2: TaxRate;
}

export interface StudentLoan {
	readonly plan_1: StudentLoanPlanSetting;
	readonly plan_2: StudentLoanPlanSetting;
}

export interface StudentLoanPlanSetting {
	readonly threshold: number;
	readonly rate: number;
}

export interface CalculatorOptions {
	age: number;
	studentLoanPlan: StudentLoanPlans;
	blind: boolean;
	pensionContributions: number;
}

export const enum StudentLoanPlans {
	NO_PLAN,
	PLAN_1,
	PLAN_2
}

export interface IncomeTaxBreakdown {
	readonly rate_0: TaxBreakdownItem;
	readonly rate_20: TaxBreakdownItem;
	readonly rate_40: TaxBreakdownItem;
	readonly rate_45: TaxBreakdownItem;
}

export interface TaxBreakdownItem {
	readonly tax: number;
	readonly carry: number;
}

export interface NationalInsuranceBreakdown {
	readonly rate_0: TaxBreakdownItem;
	readonly rate_12: TaxBreakdownItem;
	readonly rate_2: TaxBreakdownItem;
}
