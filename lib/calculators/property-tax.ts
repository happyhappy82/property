import { roundToWon } from '../calc-utils/math'
import {
  FAIR_MARKET_VALUE_RATIO,
  CITY_PLANNING_TAX_RATE,
  PROPERTY_LOCAL_EDUCATION_TAX_RATE,
  getPropertyTaxFromBrackets,
} from '../calc-constants/property-tax-rates'

export interface PropertyTaxInput {
  readonly assessedValue: number
  readonly isUrbanArea: boolean
}

export interface PropertyTaxResult {
  readonly taxBase: number
  readonly propertyTax: number
  readonly cityPlanningTax: number
  readonly localEducationTax: number
  readonly totalTax: number
  readonly effectiveRate: number
}

export const calculatePropertyTax = (input: PropertyTaxInput): PropertyTaxResult => {
  const { assessedValue, isUrbanArea } = input
  if (assessedValue <= 0) throw new Error('공시가격은 0보다 커야 합니다.')

  const taxBase = roundToWon(assessedValue * FAIR_MARKET_VALUE_RATIO)
  const propertyTax = roundToWon(getPropertyTaxFromBrackets(taxBase))
  const cityPlanningTax = isUrbanArea ? roundToWon(taxBase * CITY_PLANNING_TAX_RATE) : 0
  const localEducationTax = roundToWon(propertyTax * PROPERTY_LOCAL_EDUCATION_TAX_RATE)
  const totalTax = propertyTax + cityPlanningTax + localEducationTax
  const effectiveRate = assessedValue > 0 ? (totalTax / assessedValue) * 100 : 0

  return {
    taxBase, propertyTax, cityPlanningTax, localEducationTax, totalTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  }
}
