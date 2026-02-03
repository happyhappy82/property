import { roundToWon } from '../calc-utils/math'

export interface RentConvertInput {
  readonly jeonseDeposit?: number
  readonly monthlyDeposit: number
  readonly monthlyRent?: number
  readonly conversionRate: number
}

export interface RentConvertResult {
  readonly monthlyRent?: number
  readonly jeonseEquivalent?: number
  readonly conversionRate: number
}

export const convertJeonseToMonthly = (input: RentConvertInput): RentConvertResult => {
  const { jeonseDeposit, monthlyDeposit, conversionRate } = input
  if (conversionRate <= 0) throw new Error('전환율은 0보다 커야 합니다.')
  if (jeonseDeposit === undefined) throw new Error('전세보증금을 입력해주세요.')
  if (monthlyDeposit >= jeonseDeposit) throw new Error('월세보증금은 전세보증금보다 작아야 합니다.')

  const rateDecimal = conversionRate / 100
  const monthly = roundToWon(((jeonseDeposit - monthlyDeposit) * rateDecimal) / 12)

  return { monthlyRent: monthly, conversionRate }
}

export const convertMonthlyToJeonse = (input: RentConvertInput): RentConvertResult => {
  const { monthlyDeposit, monthlyRent, conversionRate } = input
  if (conversionRate <= 0) throw new Error('전환율은 0보다 커야 합니다.')
  if (monthlyRent === undefined || monthlyRent <= 0) throw new Error('월세를 입력해주세요.')

  const rateDecimal = conversionRate / 100
  const jeonse = roundToWon(monthlyDeposit + (monthlyRent * 12) / rateDecimal)

  return { jeonseEquivalent: jeonse, conversionRate }
}
