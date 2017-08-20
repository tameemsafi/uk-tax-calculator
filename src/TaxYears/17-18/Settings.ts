import { TaxSettings } from './Interfaces';

export const TAX_SETTINGS: TaxSettings = {
  year: '2017/18',
  allowance: {
    basic: 11500.00,
    age_65_74: 11500.00,
    age_75_over: 11500.00,
    blind: 2320.00,
    thresholds: {
      age: 27700.00,
      taper: 100000.00,
    }
  },
  incomeTax: {
    rate_0: {
      start: 0.00,
      end: 0.00,
      rate: 0.00,
    },
    rate_20: {
      start: 0.00,
      end: 33500.00,
      rate: 0.20,
    },
    rate_40: {
      start: 33500.00,
      end: 150000.00,
      rate: 0.40,
    },
    rate_45: {
      start: 150000,
      end: -1,
      rate: 0.45,
    }
  },
  nationalInsurance: {
    pensionAge: 65,
    rate_0: {
      start: 0.00,
      end: 157.00,
      rate: 0.00,
    },
    rate_12: {
      start: 157.00,
      end: 866.00,
      rate: 0.12,
    },
    rate_2: {
      start: 866.00,
      end: -1,
      rate: 0.02,
    }
  },
  studentLoan: {
    plan_1: {
      threshold: 17775.00,
      rate: 0.09,
    },
    plan_2: {
      threshold: 21000.00,
      rate: 0.09,
    }
  }
};