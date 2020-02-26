# UK Tax Calculator (2019/20)

This package allows you to calculate UK income tax. It also gives you a detailed breakdown of each part of the tax calculations.

## Installation

You can install the package via the NPM registry.

```
npm install uk-tax-calculator
```

```
yarn add uk-tax-calculator
```

## Setup

You will need to import the package into your project and then instantiate it with an income value;

```javascript
import TaxCalculator from 'uk-tax-calculator';

const incomeTax = new TaxCalculator(60000);

console.log( 'Net Yearly Income: ' + incomeTax.getTotalNetPayPerYear() );
```

## Options

defaults
```javascript
{
  age: 30,
  studentLoanPlan: 0,
  blind: false,
  pensionContributions: 0.00
}
```

#### age - Number
This options reprents the age of the person you are calculating the income tax form.

#### studentLoanPlan - Number
This option represents the student loan plan of the person you are calculating the income tax for.

```
0 - No plan
1 - Plan 1
2 - Plan 2
```

**Plan 1**
- English and Welsh students who started before 1 September 2012
- all Scottish and Northern Irish students
- You pay back 9% of your income over the minimum amount of **£17,775**.

**Plan 2**
- Plan 2 is for English and Welsh students who started on or after 1 September 2012.
- You pay back 9% of your income over the minimum amount of **£21,000**.

**No plan**
- No repayments will be made as you have no student loan

#### Blind - Boolean
This options represents whether or not the person is blind. Extra tax allowances are allocated for blind individuals.

#### pensionContributions - Number
This option represents the amount the person is paying into a pension.

## Methods

#### setOptions(object)

Allows to change the options

```javascript
import TaxCalculator from 'uk-tax-calculator';
const incomeTax = new TaxCalculator(60000);
incomeTax.setOptions({
  age: 50,
  blind: true,
  pensionContributions: 5000.00,
  studentLoanPlan: 1
});
```

#### getOptions
Returns the current calculator options

#### getSettings
Returns the current tax year settings

#### getTaxBreakdown
Returns a full breakdown of net income and tax deductions

```javascript
import TaxCalculator from 'uk-tax-calculator';
const incomeTax = new TaxCalculator(60000);
console.log( 
  incomeTax.getTaxBreakdown()
);
```


Returns
```javascript
{
    "netIncome":{
        "yearly":42576.32,
        "monthly":3548.03,
        "weekly":818.78,
        "daily":116.65
    },
    "personalAllowance":11500,
    "paye":{
        "rate_0":{
            "tax":0,
            "carry":48500
        },
        "rate_20":{
            "tax":6700,
            "carry":15000
        },
        "rate_40":{
            "tax":6000,
            "carry":0
        },
        "rate_45":{
            "tax":0,
            "carry":0
        }
    },
    "nationalInsurance":{
        "rate_0":{
            "tax":0,
            "carry":996.8499999999999
        },
        "rate_12":{
            "tax":85.08,
            "carry":287.8499999999999
        },
        "rate_2":{
            "tax":5.76,
            "carry":0
        }
   },
   "studentLoan":{
        "plan":"NO_PLAN",
        "threshold":0,
        "rate":0,
        "repayment":0
   }
}
```

#### getTotalNetPayPerYear
Returns total net pay per year rounded to 2 decimal places