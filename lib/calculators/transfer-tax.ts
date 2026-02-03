import { roundToWon } from '../calc-utils/math'
import {
  getTaxBracket,
  BASIC_DEDUCTION,
  LOCAL_INCOME_TAX_RATE,
  HIGH_VALUE_THRESHOLD,
  SHORT_TERM_RATES,
} from '../calc-constants/transfer-tax-rates'
import {
  getGeneralDeductionRate,
  getSingleHomeDeductionRate,
} from '../calc-constants/long-term-deduction'

export interface TransferTaxInput {
  readonly acquisitionPrice: number
  readonly transferPrice: number
  readonly expenses: number
  readonly holdingYears: number
  readonly residenceYears: number
  readonly housingCount: number
  readonly isSingleHousehold: boolean
  readonly isRegulated: boolean
}

export interface TransferTaxResult {
  readonly capitalGain: number
  readonly longTermDeduction: number
  readonly longTermDeductionRate: number
  readonly taxableIncome: number
  readonly taxBase: number
  readonly taxRate: number
  readonly progressiveDeduction: number
  readonly calculatedTax: number
  readonly localIncomeTax: number
  readonly totalTax: number
  readonly effectiveRate: number
  readonly isTaxExempt: boolean
  readonly taxExemptReason?: string
}

const checkTaxExemption = (input: TransferTaxInput): { exempt: boolean; reason?: string } => {
  const { transferPrice, holdingYears, residenceYears, housingCount, isSingleHousehold } = input
  if (
    isSingleHousehold && housingCount === 1 && holdingYears >= 2 &&
    residenceYears >= 2 && transferPrice <= HIGH_VALUE_THRESHOLD
  ) {
    return { exempt: true, reason: '1세대 1주택 비과세 (양도가 12억 이하, 2년 보유+거주)' }
  }
  return { exempt: false }
}

const calculateHighValueRatio = (transferPrice: number): number => {
  if (transferPrice <= HIGH_VALUE_THRESHOLD) return 1
  return (transferPrice - HIGH_VALUE_THRESHOLD) / transferPrice
}

export const calculateTransferTax = (input: TransferTaxInput): TransferTaxResult => {
  const exemption = checkTaxExemption(input)
  if (exemption.exempt) {
    return {
      capitalGain: 0, longTermDeduction: 0, longTermDeductionRate: 0,
      taxableIncome: 0, taxBase: 0, taxRate: 0, progressiveDeduction: 0,
      calculatedTax: 0, localIncomeTax: 0, totalTax: 0, effectiveRate: 0,
      isTaxExempt: true, taxExemptReason: exemption.reason,
    }
  }

  const rawGain = input.transferPrice - input.acquisitionPrice - input.expenses
  if (rawGain <= 0) {
    return {
      capitalGain: rawGain, longTermDeduction: 0, longTermDeductionRate: 0,
      taxableIncome: 0, taxBase: 0, taxRate: 0, progressiveDeduction: 0,
      calculatedTax: 0, localIncomeTax: 0, totalTax: 0, effectiveRate: 0,
      isTaxExempt: false, taxExemptReason: '양도차익 없음 (손실)',
    }
  }

  const isSingleHomeOwner = input.isSingleHousehold && input.housingCount === 1
  const highValueRatio = isSingleHomeOwner ? calculateHighValueRatio(input.transferPrice) : 1
  const capitalGain = roundToWon(rawGain * highValueRatio)

  let deductionRate: number
  if (input.holdingYears < 1) {
    deductionRate = 0
  } else if (isSingleHomeOwner) {
    deductionRate = getSingleHomeDeductionRate(input.holdingYears, input.residenceYears)
  } else {
    deductionRate = getGeneralDeductionRate(input.holdingYears)
  }

  const longTermDeduction = roundToWon(capitalGain * deductionRate)
  const taxableIncome = capitalGain - longTermDeduction
  const taxBase = Math.max(0, taxableIncome - BASIC_DEDUCTION)

  let taxRate: number
  let progressiveDeduction: number
  if (input.holdingYears < 1) {
    taxRate = SHORT_TERM_RATES.lessThanOneYear
    progressiveDeduction = 0
  } else {
    const bracket = getTaxBracket(taxBase)
    taxRate = bracket.rate
    progressiveDeduction = bracket.deduction
  }

  const calculatedTax = roundToWon(Math.max(0, taxBase * taxRate - progressiveDeduction))
  const localIncomeTax = roundToWon(calculatedTax * LOCAL_INCOME_TAX_RATE)
  const totalTax = calculatedTax + localIncomeTax
  const effectiveRate = rawGain > 0 ? Math.round((totalTax / rawGain) * 10000) / 100 : 0

  return {
    capitalGain, longTermDeduction, longTermDeductionRate: Math.round(deductionRate * 100),
    taxableIncome, taxBase, taxRate: Math.round(taxRate * 100),
    progressiveDeduction, calculatedTax, localIncomeTax,
    totalTax, effectiveRate, isTaxExempt: false,
  }
}
