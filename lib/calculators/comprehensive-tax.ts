import { roundToWon } from '../calc-utils/math'
import {
  COMPREHENSIVE_TAX_DEDUCTIONS,
  COMPREHENSIVE_FAIR_MARKET_RATIO,
  RURAL_SPECIAL_TAX_ON_COMP_TAX,
  AGE_DEDUCTION_RATES,
  HOLDING_DEDUCTION_RATES,
  MAX_COMBINED_DEDUCTION,
  getComprehensiveTaxFromBrackets,
} from '../calc-constants/comprehensive-tax-rates'

export interface ComprehensiveTaxInput {
  readonly totalAssessedValue: number
  readonly isSingleHomeOwner: boolean
  readonly ownerAge: number
  readonly holdingYears: number
}

export interface ComprehensiveTaxResult {
  readonly deduction: number
  readonly taxBase: number
  readonly calculatedTax: number
  readonly ageDeductionRate: number
  readonly holdingDeductionRate: number
  readonly totalDeductionRate: number
  readonly taxDeduction: number
  readonly comprehensiveTax: number
  readonly localEducationTax: number
  readonly totalTax: number
  readonly effectiveRate: number
}

const getAgeDeductionRate = (age: number): number => {
  if (age >= 70) return AGE_DEDUCTION_RATES.over70
  if (age >= 65) return AGE_DEDUCTION_RATES.age65to70
  if (age >= 60) return AGE_DEDUCTION_RATES.age60to65
  return AGE_DEDUCTION_RATES.under60
}

const getHoldingDeductionRate = (years: number): number => {
  if (years >= 15) return HOLDING_DEDUCTION_RATES.over15
  if (years >= 10) return HOLDING_DEDUCTION_RATES.year10to15
  if (years >= 5) return HOLDING_DEDUCTION_RATES.year5to10
  return HOLDING_DEDUCTION_RATES.under5
}

export const calculateComprehensiveTax = (input: ComprehensiveTaxInput): ComprehensiveTaxResult => {
  const { totalAssessedValue, isSingleHomeOwner, ownerAge, holdingYears } = input
  if (totalAssessedValue <= 0) throw new Error('공시가격 합산액은 0보다 커야 합니다.')

  const deduction = isSingleHomeOwner
    ? COMPREHENSIVE_TAX_DEDUCTIONS.singleHomeOwner
    : COMPREHENSIVE_TAX_DEDUCTIONS.general

  const taxableValue = Math.max(0, totalAssessedValue - deduction)
  const taxBase = roundToWon(taxableValue * COMPREHENSIVE_FAIR_MARKET_RATIO)
  const calculatedTax = roundToWon(getComprehensiveTaxFromBrackets(taxBase))

  let ageDeductionRate = 0
  let holdingDeductionRate = 0
  let totalDeductionRate = 0
  let taxDeduction = 0

  if (isSingleHomeOwner) {
    ageDeductionRate = getAgeDeductionRate(ownerAge)
    holdingDeductionRate = getHoldingDeductionRate(holdingYears)
    totalDeductionRate = Math.min(ageDeductionRate + holdingDeductionRate, MAX_COMBINED_DEDUCTION)
    taxDeduction = roundToWon(calculatedTax * totalDeductionRate)
  }

  const comprehensiveTax = calculatedTax - taxDeduction
  const localEducationTax = roundToWon(comprehensiveTax * RURAL_SPECIAL_TAX_ON_COMP_TAX)
  const totalTax = comprehensiveTax + localEducationTax
  const effectiveRate = totalAssessedValue > 0 ? (totalTax / totalAssessedValue) * 100 : 0

  return {
    deduction, taxBase, calculatedTax,
    ageDeductionRate: Math.round(ageDeductionRate * 100),
    holdingDeductionRate: Math.round(holdingDeductionRate * 100),
    totalDeductionRate: Math.round(totalDeductionRate * 100),
    taxDeduction, comprehensiveTax, localEducationTax,
    totalTax, effectiveRate: Math.round(effectiveRate * 1000) / 1000,
  }
}
