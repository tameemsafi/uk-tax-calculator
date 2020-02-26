import {
	TaxSettings,
	StudentLoanPlans,
	CalculatorOptions,
	TaxRate,
	IncomeTax,
	IncomeTaxBreakdown,
	TaxBreakdownItem,
	NationalInsurance,
	NationalInsuranceBreakdown
} from './Interfaces';

import { TAX_SETTINGS } from './Settings';

export default class Calculator {
	private taxSettings: TaxSettings = TAX_SETTINGS;

	private options: CalculatorOptions = {
		age: 30,
		studentLoanPlan: StudentLoanPlans.NO_PLAN,
		blind: false,
		pensionContributions: 0.0
	};

	private grossIncome: number;

	/**
   * Initialize a new calculator instance
   * 
   * @param grossIncome amount of gross income
   */
	constructor(grossIncome: number) {
		this.grossIncome = grossIncome;
	}

	/**
   * Change calculator options
   * 
   * @param options Options for calculator
   */
	setOptions(options: CalculatorOptions) {
		this.options = Object.assign({}, this.options, options);
	}

	/**
   * Returns the current calculator options
   */
	getOptions(): CalculatorOptions {
		return this.options;
	}

	/**
   * Returns the current tax year settings
   */
	getSettings(): TaxSettings {
		return this.taxSettings;
	}

	/**
   * Returns gross income as weekly figure rounded to 2 decimal places
   */
	getGrossWeekly(): number {
		let grossWeekly: number = this.grossIncome / 52;
		return this.getAmountRounded(grossWeekly);
	}

	/**
   * Returns a full breakdown of net income and tax deductions
   */
	getTaxBreakdown() {
		return {
			netIncome: {
				yearly: this.getTotalNetPayPerYear(),
				monthly: this.getTotalNetPayPerMonth(),
				weekly: this.getTotalNetPayPerWeek(),
				daily: this.getTotalNetPayPerDay()
			},
			personalAllowance: this.getPersonalAllowance(),
			paye: this.getIncomeTaxBreakdown(),
			nationalInsurance: this.getNationalInsuranceBreakdown(),
			studentLoan: {
				plan:

						this.options.studentLoanPlan === StudentLoanPlans.PLAN_1 ? 'PLAN_1' :
						this.options.studentLoanPlan === StudentLoanPlans.PLAN_2 ? 'PLAN_2' :
						'NO_PLAN',
				threshold: this.getStudentLoanRepaymentThreshold(),
				rate: this.getStudentLoanRepaymentRate(),
				repayment: this.getTotalStudentLoanRepayment()
			}
		};
	}

	/**
   * Returns the age related contributions
   */
	getAgeRelatedContributions(): number {
		if (this.options.age < 65) {
			return 0;
		}
		if (this.options.age < 75) {
			return this.taxSettings.allowance.basic - this.taxSettings.allowance.age_65_74;
		}
		return this.taxSettings.allowance.basic - this.taxSettings.allowance.age_75_over;
	}

	/**
   * Returns the age related taper deductions
   */
	getAgeRelatedTaperDeductions(): number {
		let incomeMinusTaperThreshold: number = this.grossIncome - this.taxSettings.allowance.thresholds.taper;
		if (incomeMinusTaperThreshold < 0) {
			return 0;
		}
		let halfIncomeMinusTaperThreshold: number = incomeMinusTaperThreshold / 2;
		let ageRelatedContributions: number = this.getAgeRelatedContributions();
		if (halfIncomeMinusTaperThreshold > ageRelatedContributions) {
			return ageRelatedContributions;
		}
		return halfIncomeMinusTaperThreshold;
	}

	/**
   * Returns personal allowance after adjusting for age
   */
	getAllowanceAfterAgeAdjust(): number {
		let ageAllowance: number = this.taxSettings.allowance.basic + this.getAgeRelatedContributions();
		return ageAllowance - this.getAgeRelatedTaperDeductions();
	}

	/**
   * Returns the total taper deductions
   */
	getTaperDeductions(): number {
		let incomeMinusPensionContributions: number = this.grossIncome - this.options.pensionContributions;
		let incomeMinusPensionMinusTaperThreshold: number =
			incomeMinusPensionContributions - this.taxSettings.allowance.thresholds.taper;
		if (incomeMinusPensionMinusTaperThreshold < 0) {
			return 0;
		}
		let halfIncomeMinusPensionMinusTaperThreshold: number = incomeMinusPensionMinusTaperThreshold / 2;
		let allowanceAfterAgeAdjust: number = this.getAllowanceAfterAgeAdjust();
		if (halfIncomeMinusPensionMinusTaperThreshold > allowanceAfterAgeAdjust) {
			return allowanceAfterAgeAdjust;
		}
		return halfIncomeMinusPensionMinusTaperThreshold;
	}

	/**
   * Returns the allowed personal allowance
   */
	getPersonalAllowance(): number {
		return this.getAllowanceAfterAgeAdjust() - this.getTaperDeductions();
	}

	/**
   * Returns blind person allowance
   */
	getBlindAllowance(): number {
		if (this.options.blind === false) {
			return 0;
		}
		return this.taxSettings.allowance.blind;
	}

	/**
   * Returns the total allowances
   */
	getTotalAllowances(): number {
		return this.getPersonalAllowance() + this.getBlindAllowance();
	}

	/**
   * Returns the total taxable income
   */
	getTotalTaxableIncome(): number {
		let incomeMinusTotalAllowances: number = this.grossIncome - this.getTotalAllowances();
		return incomeMinusTotalAllowances - this.options.pensionContributions;
	}

	/**
   * Returns a break down of all income tax bands
   */
	getIncomeTaxBreakdown(): IncomeTaxBreakdown {
		let totalTaxableIncome: number = this.getTotalTaxableIncome();
		let incomeTaxRates: IncomeTax = this.taxSettings.incomeTax;
		let rate_0: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_0, totalTaxableIncome);
		let rate_20: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_20, rate_0.carry);
		let rate_40: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_40, rate_20.carry);
		let rate_45: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_45, rate_40.carry);
		return {
			rate_0,
			rate_20,
			rate_40,
			rate_45
		};
	}

	/**
   * Returns total income tax rounded to 2 decimal places
   */
	getTotalIncomeTax(): number {
		let incomeTaxBreakdown: IncomeTaxBreakdown = this.getIncomeTaxBreakdown();
		let totalIncomeTax: number =
			incomeTaxBreakdown.rate_0.tax +
			incomeTaxBreakdown.rate_20.tax +
			incomeTaxBreakdown.rate_40.tax +
			incomeTaxBreakdown.rate_45.tax;
		return this.getAmountRounded(totalIncomeTax);
	}

	/**
   * Returns the total tax for tax band
   * 
   * @param taxRate tax rate from settings
   * @param totalIncome total income before reaching tax band (can be carry left over from last band)
   */
	getTotalTaxForRateWithIncome(taxRate: TaxRate, totalIncome: number): TaxBreakdownItem {
		let incomeTaxRateDifference: number =

				taxRate.end === -1 ? totalIncome :
				this.getAmountRounded(taxRate.end - taxRate.start);
		let totalMinusDifference: number = totalIncome - incomeTaxRateDifference;
		let carry: number =

				totalMinusDifference > 0 ? totalMinusDifference :
				0;
		if (totalIncome > 0) {
			if (totalIncome >= incomeTaxRateDifference) {
				return {
					tax: this.getAmountRounded(incomeTaxRateDifference * taxRate.rate),
					carry
				};
			}
			return {
				tax: this.getAmountRounded(totalIncome * taxRate.rate),
				carry
			};
		}
		return {
			tax: 0,
			carry: carry
		};
	}

	/**
   * Returns a breakdown for all national insurance bands
   */
	getNationalInsuranceBreakdown(): NationalInsuranceBreakdown {
		let grossWeeklyIncome: number = this.getGrossWeekly();
		let nationalInsuranceBands: NationalInsurance = this.taxSettings.nationalInsurance;
		let rate_0: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(
			nationalInsuranceBands.rate_0,
			grossWeeklyIncome
		);
		let rate_12: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(nationalInsuranceBands.rate_12, rate_0.carry);
		let rate_2: TaxBreakdownItem = this.getTotalTaxForRateWithIncome(nationalInsuranceBands.rate_2, rate_12.carry);
		return {
			rate_0,
			rate_12,
			rate_2
		};
	}

	/**
   * Returns total weekly national insurance rounded to 2 decimal places
   */
	getTotalWeeklyNationalInsurance(): number {
		let nationalInsuranceBreakdown: NationalInsuranceBreakdown = this.getNationalInsuranceBreakdown();
		let totalWeeklyNationalInsurance: number =
			nationalInsuranceBreakdown.rate_0.tax +
			nationalInsuranceBreakdown.rate_12.tax +
			nationalInsuranceBreakdown.rate_2.tax;
		return this.getAmountRounded(totalWeeklyNationalInsurance);
	}

	/**
   * Returns total yearly national insurance
   */
	getTotalYearlyNationalInsurance(): number {
		let totalWeeklyNationalInsurance: number = this.getTotalWeeklyNationalInsurance() * 52;
		return this.getAmountRounded(totalWeeklyNationalInsurance);
	}

	/**
   * Returns national insurance age related deductions
   */
	getNationalInsuranceAgeRelatedDeductions(): number {
		let totalWeeklingNationalInsurance: number = this.getTotalWeeklyNationalInsurance();
		if (this.options.age >= this.taxSettings.nationalInsurance.pensionAge) {
			return this.getTotalYearlyNationalInsurance();
		}
		return 0;
	}

	/**
   * Returns total yearly national insurance with age deductions
   */
	getTotalYearlyNationalInsuranceWithAgeDeductions(): number {
		let totalNationalInsurance: number =
			this.getTotalYearlyNationalInsurance() - this.getNationalInsuranceAgeRelatedDeductions();
		return this.getAmountRounded(totalNationalInsurance);
	}

	/**
   * Returns student loan replayment plan threshold
   */
	getStudentLoanRepaymentThreshold(): number {
		if (this.options.studentLoanPlan === StudentLoanPlans.PLAN_1) {
			return this.taxSettings.studentLoan.plan_1.threshold;
		}
		if (this.options.studentLoanPlan === StudentLoanPlans.PLAN_2) {
			return this.taxSettings.studentLoan.plan_2.threshold;
		}
		return 0;
	}

	/**
   * Returns student loan replayment plan rate
   */
	getStudentLoanRepaymentRate(): number {
		if (this.options.studentLoanPlan === StudentLoanPlans.PLAN_1) {
			return this.taxSettings.studentLoan.plan_1.rate;
		}
		if (this.options.studentLoanPlan === StudentLoanPlans.PLAN_2) {
			return this.taxSettings.studentLoan.plan_2.rate;
		}
		return 0;
	}

	/**
   * Returns income above student loan threshold
   */
	getIncomeAboveStudentLoanThreshold(): number {
		let studentLoanThreshold: number = this.getStudentLoanRepaymentThreshold();
		let incomeMinusThreshold: number = this.grossIncome - studentLoanThreshold;
		if (incomeMinusThreshold < 0) {
			return 0;
		}
		return incomeMinusThreshold;
	}

	/**
   * Returns total student loan replayment for year rounded to 2 decimal places
   */
	getTotalStudentLoanRepayment(): number {
		if (this.options.studentLoanPlan === StudentLoanPlans.NO_PLAN) {
			return 0;
		}
		let studentLoanRepaymentTotal: number =
			this.getIncomeAboveStudentLoanThreshold() * this.getStudentLoanRepaymentRate();
		return this.getAmountRounded(studentLoanRepaymentTotal);
	}

	/**
   * Returns total tax deductions rounded to 2 decimal places
   */
	getTotalTaxDeductions(): number {
		let totalTaxDeductions: number =
			this.getTotalIncomeTax() +
			this.getTotalStudentLoanRepayment() +
			this.getTotalYearlyNationalInsuranceWithAgeDeductions();
		return this.getAmountRounded(totalTaxDeductions);
	}

	/**
   * Returns total net pay per year rounded to 2 decimal places
   */
	getTotalNetPayPerYear(): number {
		let totalNetPay: number = this.grossIncome - this.getTotalTaxDeductions() - this.options.pensionContributions;
		return this.getAmountRounded(totalNetPay);
	}

	/**
   * Returns total net pay per month rounded to 2 decimal places
   */
	getTotalNetPayPerMonth(): number {
		let totalNetPayPerYear: number = this.getTotalNetPayPerYear();
		return this.getAmountRounded(totalNetPayPerYear / 12);
	}

	/**
   * Returns total net pay per week rounded to 2 decimal places
   */
	getTotalNetPayPerWeek(): number {
		let totalNetPayPerYear: number = this.getTotalNetPayPerYear();
		return this.getAmountRounded(totalNetPayPerYear / 52);
	}

	/**
   * Returns total net pay per day rounded to 2 decimal places
   */
	getTotalNetPayPerDay(): number {
		let totalNetPayPerYear: number = this.getTotalNetPayPerYear();
		return this.getAmountRounded(totalNetPayPerYear / 365);
	}

	/**
   * Returns two decimal number converted from original input float number
   * 
   * @param amount floating number
   */
	getAmountRounded(amount: number): number {
		return Math.round(amount * 100) / 100;
	}
}
