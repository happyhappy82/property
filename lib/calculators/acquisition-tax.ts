import { roundToWon } from '../calc-utils/math'
import {
  getSingleHomeTaxRate,
  LOCAL_EDUCATION_TAX_RATE,
  RURAL_SPECIAL_TAX_RATE,
  FIRST_TIME_BUYER_DISCOUNT,
} from '../calc-constants/acquisition-tax-rates'

export interface AcquisitionTaxInput {
  readonly purchasePrice: number
  readonly housingCount: 1 | 2 | 3
  readonly isRegulated: boolean
  readonly isFirstTimeBuyer: boolean
}

export interface AcquisitionTaxResult {
  readonly acquisitionTax: number
  readonly localEducationTax: number
  readonly ruralSpecialTax: number
  readonly totalTax: number
  readonly effectiveRate: number
  readonly firstTimeBuyerDiscount: number
  readonly taxRate: number
}

export const getAcquisitionTaxRate = (
  price: number,
  housingCount: 1 | 2 | 3,
  isRegulated: boolean
): number => {
  if (housingCount === 1) return getSingleHomeTaxRate(price)
  if (housingCount === 2) return isRegulated ? 0.08 : getSingleHomeTaxRate(price)
  return isRegulated ? 0.12 : 0.08
}

export const calculateAcquisitionTax = (input: AcquisitionTaxInput): AcquisitionTaxResult => {
  const { purchasePrice, housingCount, isRegulated, isFirstTimeBuyer } = input
  if (purchasePrice <= 0) throw new Error('매매가는 0보다 커야 합니다.')

  const taxRate = getAcquisitionTaxRate(purchasePrice, housingCount, isRegulated)
  let acquisitionTax = roundToWon(purchasePrice * taxRate)

  const discount = isFirstTimeBuyer && housingCount === 1
    ? Math.min(FIRST_TIME_BUYER_DISCOUNT, acquisitionTax)
    : 0
  acquisitionTax = acquisitionTax - discount

  const localEducationTax = roundToWon(acquisitionTax * LOCAL_EDUCATION_TAX_RATE)
  const ruralSpecialTax = purchasePrice > 600_000_000
    ? roundToWon(purchasePrice * RURAL_SPECIAL_TAX_RATE)
    : 0

  const totalTax = acquisitionTax + localEducationTax + ruralSpecialTax
  const effectiveRate = purchasePrice > 0 ? (totalTax / purchasePrice) * 100 : 0

  return {
    acquisitionTax,
    localEducationTax,
    ruralSpecialTax,
    totalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    firstTimeBuyerDiscount: discount,
    taxRate: Math.round(taxRate * 10000) / 100,
  }
}
