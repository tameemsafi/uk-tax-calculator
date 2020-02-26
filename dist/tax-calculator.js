(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TaxCalculator"] = factory();
	else
		root["TaxCalculator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", { value: true });
var Settings_1 = __webpack_require__(1);
var Calculator = function () {
    /**
     * Initialize a new calculator instance
     *
     * @param grossIncome amount of gross income
     */
    function Calculator(grossIncome) {
        this.taxSettings = Settings_1.TAX_SETTINGS;
        this.options = {
            age: 30,
            studentLoanPlan: 0 /* NO_PLAN */
            , blind: false,
            pensionContributions: 0.00
        };
        this.grossIncome = grossIncome;
    }
    /**
     * Change calculator options
     *
     * @param options Options for calculator
     */
    Calculator.prototype.setOptions = function (options) {
        this.options = _extends({}, this.options, options);
    };
    /**
     * Returns the current calculator options
     */
    Calculator.prototype.getOptions = function () {
        return this.options;
    };
    /**
     * Returns the current tax year settings
     */
    Calculator.prototype.getSettings = function () {
        return this.taxSettings;
    };
    /**
     * Returns gross income as weekly figure rounded to 2 decimal places
     */
    Calculator.prototype.getGrossWeekly = function () {
        var grossWeekly = this.grossIncome / 52;
        return this.getAmountRounded(grossWeekly);
    };
    /**
     * Returns a full breakdown of net income and tax deductions
     */
    Calculator.prototype.getTaxBreakdown = function () {
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
                plan: this.options.studentLoanPlan === 1 /* PLAN_1 */ ? 'PLAN_1' : this.options.studentLoanPlan === 2 /* PLAN_2 */ ? 'PLAN_2' : 'NO_PLAN',
                threshold: this.getStudentLoanRepaymentThreshold(),
                rate: this.getStudentLoanRepaymentRate(),
                repayment: this.getTotalStudentLoanRepayment()
            }
        };
    };
    /**
     * Returns the age related contributions
     */
    Calculator.prototype.getAgeRelatedContributions = function () {
        if (this.options.age < 65) {
            return 0;
        }
        if (this.options.age < 75) {
            return this.taxSettings.allowance.basic - this.taxSettings.allowance.age_65_74;
        }
        return this.taxSettings.allowance.basic - this.taxSettings.allowance.age_75_over;
    };
    /**
     * Returns the age related taper deductions
     */
    Calculator.prototype.getAgeRelatedTaperDeductions = function () {
        var incomeMinusTaperThreshold = this.grossIncome - this.taxSettings.allowance.thresholds.taper;
        if (incomeMinusTaperThreshold < 0) {
            return 0;
        }
        var halfIncomeMinusTaperThreshold = incomeMinusTaperThreshold / 2;
        var ageRelatedContributions = this.getAgeRelatedContributions();
        if (halfIncomeMinusTaperThreshold > ageRelatedContributions) {
            return ageRelatedContributions;
        }
        return halfIncomeMinusTaperThreshold;
    };
    /**
     * Returns personal allowance after adjusting for age
     */
    Calculator.prototype.getAllowanceAfterAgeAdjust = function () {
        var ageAllowance = this.taxSettings.allowance.basic + this.getAgeRelatedContributions();
        return ageAllowance - this.getAgeRelatedTaperDeductions();
    };
    /**
     * Returns the total taper deductions
     */
    Calculator.prototype.getTaperDeductions = function () {
        var incomeMinusPensionContributions = this.grossIncome - this.options.pensionContributions;
        var incomeMinusPensionMinusTaperThreshold = incomeMinusPensionContributions - this.taxSettings.allowance.thresholds.taper;
        if (incomeMinusPensionMinusTaperThreshold < 0) {
            return 0;
        }
        var halfIncomeMinusPensionMinusTaperThreshold = incomeMinusPensionMinusTaperThreshold / 2;
        var allowanceAfterAgeAdjust = this.getAllowanceAfterAgeAdjust();
        if (halfIncomeMinusPensionMinusTaperThreshold > allowanceAfterAgeAdjust) {
            return allowanceAfterAgeAdjust;
        }
        return halfIncomeMinusPensionMinusTaperThreshold;
    };
    /**
     * Returns the allowed personal allowance
     */
    Calculator.prototype.getPersonalAllowance = function () {
        return this.getAllowanceAfterAgeAdjust() - this.getTaperDeductions();
    };
    /**
     * Returns blind person allowance
     */
    Calculator.prototype.getBlindAllowance = function () {
        if (this.options.blind === false) {
            return 0;
        }
        return this.taxSettings.allowance.blind;
    };
    /**
     * Returns the total allowances
     */
    Calculator.prototype.getTotalAllowances = function () {
        return this.getPersonalAllowance() + this.getBlindAllowance();
    };
    /**
     * Returns the total taxable income
     */
    Calculator.prototype.getTotalTaxableIncome = function () {
        var incomeMinusTotalAllowances = this.grossIncome - this.getTotalAllowances();
        return incomeMinusTotalAllowances - this.options.pensionContributions;
    };
    /**
     * Returns a break down of all income tax bands
     */
    Calculator.prototype.getIncomeTaxBreakdown = function () {
        var totalTaxableIncome = this.getTotalTaxableIncome();
        var incomeTaxRates = this.taxSettings.incomeTax;
        var rate_0 = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_0, totalTaxableIncome);
        var rate_20 = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_20, rate_0.carry);
        var rate_40 = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_40, rate_20.carry);
        var rate_45 = this.getTotalTaxForRateWithIncome(incomeTaxRates.rate_45, rate_40.carry);
        return {
            rate_0: rate_0,
            rate_20: rate_20,
            rate_40: rate_40,
            rate_45: rate_45
        };
    };
    /**
     * Returns total income tax rounded to 2 decimal places
     */
    Calculator.prototype.getTotalIncomeTax = function () {
        var incomeTaxBreakdown = this.getIncomeTaxBreakdown();
        var totalIncomeTax = incomeTaxBreakdown.rate_0.tax + incomeTaxBreakdown.rate_20.tax + incomeTaxBreakdown.rate_40.tax + incomeTaxBreakdown.rate_45.tax;
        return this.getAmountRounded(totalIncomeTax);
    };
    /**
     * Returns the total tax for tax band
     *
     * @param taxRate tax rate from settings
     * @param totalIncome total income before reaching tax band (can be carry left over from last band)
     */
    Calculator.prototype.getTotalTaxForRateWithIncome = function (taxRate, totalIncome) {
        var incomeTaxRateDifference = taxRate.end === -1 ? totalIncome : this.getAmountRounded(taxRate.end - taxRate.start);
        var totalMinusDifference = totalIncome - incomeTaxRateDifference;
        var carry = totalMinusDifference > 0 ? totalMinusDifference : 0;
        if (totalIncome > 0) {
            if (totalIncome >= incomeTaxRateDifference) {
                return {
                    tax: this.getAmountRounded(incomeTaxRateDifference * taxRate.rate),
                    carry: carry
                };
            }
            return {
                tax: this.getAmountRounded(totalIncome * taxRate.rate),
                carry: carry
            };
        }
        return {
            tax: 0,
            carry: carry
        };
    };
    /**
     * Returns a breakdown for all national insurance bands
     */
    Calculator.prototype.getNationalInsuranceBreakdown = function () {
        var grossWeeklyIncome = this.getGrossWeekly();
        var nationalInsuranceBands = this.taxSettings.nationalInsurance;
        var rate_0 = this.getTotalTaxForRateWithIncome(nationalInsuranceBands.rate_0, grossWeeklyIncome);
        var rate_12 = this.getTotalTaxForRateWithIncome(nationalInsuranceBands.rate_12, rate_0.carry);
        var rate_2 = this.getTotalTaxForRateWithIncome(nationalInsuranceBands.rate_2, rate_12.carry);
        return {
            rate_0: rate_0,
            rate_12: rate_12,
            rate_2: rate_2
        };
    };
    /**
     * Returns total weekly national insurance rounded to 2 decimal places
     */
    Calculator.prototype.getTotalWeeklyNationalInsurance = function () {
        var nationalInsuranceBreakdown = this.getNationalInsuranceBreakdown();
        var totalWeeklyNationalInsurance = nationalInsuranceBreakdown.rate_0.tax + nationalInsuranceBreakdown.rate_12.tax + nationalInsuranceBreakdown.rate_2.tax;
        return this.getAmountRounded(totalWeeklyNationalInsurance);
    };
    /**
     * Returns total yearly national insurance
     */
    Calculator.prototype.getTotalYearlyNationalInsurance = function () {
        var totalWeeklyNationalInsurance = this.getTotalWeeklyNationalInsurance() * 52;
        return this.getAmountRounded(totalWeeklyNationalInsurance);
    };
    /**
     * Returns national insurance age related deductions
     */
    Calculator.prototype.getNationalInsuranceAgeRelatedDeductions = function () {
        var totalWeeklingNationalInsurance = this.getTotalWeeklyNationalInsurance();
        if (this.options.age >= this.taxSettings.nationalInsurance.pensionAge) {
            return this.getTotalYearlyNationalInsurance();
        }
        return 0;
    };
    /**
     * Returns total yearly national insurance with age deductions
     */
    Calculator.prototype.getTotalYearlyNationalInsuranceWithAgeDeductions = function () {
        var totalNationalInsurance = this.getTotalYearlyNationalInsurance() - this.getNationalInsuranceAgeRelatedDeductions();
        return this.getAmountRounded(totalNationalInsurance);
    };
    /**
     * Returns student loan replayment plan threshold
     */
    Calculator.prototype.getStudentLoanRepaymentThreshold = function () {
        if (this.options.studentLoanPlan === 1 /* PLAN_1 */) {
                return this.taxSettings.studentLoan.plan_1.threshold;
            }
        if (this.options.studentLoanPlan === 2 /* PLAN_2 */) {
                return this.taxSettings.studentLoan.plan_2.threshold;
            }
        return 0;
    };
    /**
     * Returns student loan replayment plan rate
     */
    Calculator.prototype.getStudentLoanRepaymentRate = function () {
        if (this.options.studentLoanPlan === 1 /* PLAN_1 */) {
                return this.taxSettings.studentLoan.plan_1.rate;
            }
        if (this.options.studentLoanPlan === 2 /* PLAN_2 */) {
                return this.taxSettings.studentLoan.plan_2.rate;
            }
        return 0;
    };
    /**
     * Returns income above student loan threshold
     */
    Calculator.prototype.getIncomeAboveStudentLoanThreshold = function () {
        var studentLoanThreshold = this.getStudentLoanRepaymentThreshold();
        var incomeMinusThreshold = this.grossIncome - studentLoanThreshold;
        if (incomeMinusThreshold < 0) {
            return 0;
        }
        return incomeMinusThreshold;
    };
    /**
     * Returns total student loan replayment for year rounded to 2 decimal places
     */
    Calculator.prototype.getTotalStudentLoanRepayment = function () {
        if (this.options.studentLoanPlan === 0 /* NO_PLAN */) {
                return 0;
            }
        var studentLoanRepaymentTotal = this.getIncomeAboveStudentLoanThreshold() * this.getStudentLoanRepaymentRate();
        return this.getAmountRounded(studentLoanRepaymentTotal);
    };
    /**
     * Returns total tax deductions rounded to 2 decimal places
     */
    Calculator.prototype.getTotalTaxDeductions = function () {
        var totalTaxDeductions = this.getTotalIncomeTax() + this.getTotalStudentLoanRepayment() + this.getTotalYearlyNationalInsuranceWithAgeDeductions();
        return this.getAmountRounded(totalTaxDeductions);
    };
    /**
     * Returns total net pay per year rounded to 2 decimal places
     */
    Calculator.prototype.getTotalNetPayPerYear = function () {
        var totalNetPay = this.grossIncome - this.getTotalTaxDeductions() - this.options.pensionContributions;
        return this.getAmountRounded(totalNetPay);
    };
    /**
     * Returns total net pay per month rounded to 2 decimal places
     */
    Calculator.prototype.getTotalNetPayPerMonth = function () {
        var totalNetPayPerYear = this.getTotalNetPayPerYear();
        return this.getAmountRounded(totalNetPayPerYear / 12);
    };
    /**
     * Returns total net pay per week rounded to 2 decimal places
     */
    Calculator.prototype.getTotalNetPayPerWeek = function () {
        var totalNetPayPerYear = this.getTotalNetPayPerYear();
        return this.getAmountRounded(totalNetPayPerYear / 52);
    };
    /**
     * Returns total net pay per day rounded to 2 decimal places
     */
    Calculator.prototype.getTotalNetPayPerDay = function () {
        var totalNetPayPerYear = this.getTotalNetPayPerYear();
        return this.getAmountRounded(totalNetPayPerYear / 365);
    };
    /**
     * Returns two decimal number converted from original input float number
     *
     * @param amount floating number
     */
    Calculator.prototype.getAmountRounded = function (amount) {
        return Math.round(amount * 100) / 100;
    };
    return Calculator;
}();
exports.default = Calculator;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.TAX_SETTINGS = {
    year: '2017/18',
    allowance: {
        basic: 11500.0,
        age_65_74: 11500.0,
        age_75_over: 11500.0,
        blind: 2320.0,
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
            end: 33500.0,
            rate: 0.2
        },
        rate_40: {
            start: 33500.0,
            end: 150000.0,
            rate: 0.4
        },
        rate_45: {
            start: 150000,
            end: -1,
            rate: 0.45
        }
    },
    nationalInsurance: {
        pensionAge: 65,
        rate_0: {
            start: 0.0,
            end: 157.0,
            rate: 0.0
        },
        rate_12: {
            start: 157.0,
            end: 866.0,
            rate: 0.12
        },
        rate_2: {
            start: 866.0,
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

/***/ })
/******/ ]);
});