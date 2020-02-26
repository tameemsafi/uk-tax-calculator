import { TaxSettings } from './Interfaces';

// PAYE
const payeBasic = 12500.0;
const payeMid = 50000.0;
const payeHigh = 150000;

// Allowance
const blind = 2450.0;

// NI
const niLow = 166.0;
const niHigh = 962.0;

export const TAX_SETTINGS: TaxSettings = {
	year: '2019/20',
	allowance: {
		basic: payeBasic,
		age_65_74: payeBasic,
		age_75_over: payeBasic,
		blind: blind,
		thresholds: {
			age: 27700.0,
			taper: 100000.0
		}
	},
	incomeTax: {
		rate_0: {
			start: 0.0,
			end: 0.0,
			rate: 0.0
		},
		rate_20: {
			start: 0.0,
			end: payeMid,
			rate: 0.2
		},
		rate_40: {
			start: payeMid,
			end: payeHigh,
			rate: 0.4
		},
		rate_45: {
			start: payeHigh,
			end: -1,
			rate: 0.45
		}
	},
	nationalInsurance: {
		pensionAge: 68,
		rate_0: {
			start: 0.0,
			end: niLow,
			rate: 0.0
		},
		rate_12: {
			start: niLow,
			end: niHigh,
			rate: 0.12
		},
		rate_2: {
			start: niHigh,
			end: -1,
			rate: 0.02
		}
	},
	studentLoan: {
		plan_1: {
			threshold: 17775.0,
			rate: 0.09
		},
		plan_2: {
			threshold: 21000.0,
			rate: 0.09
		}
	}
};
