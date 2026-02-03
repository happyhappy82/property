import { roundToWon, roundTo } from '../calc-utils/math'

export interface InvestmentReturnInput {
  readonly purchasePrice: number
  readonly currentPrice: number
  readonly totalInvestment: number
  readonly annualRentalIncome: number
  readonly annualExpenses: number
  readonly holdingYears: number
  readonly loanAmount: number
  readonly loanInterestRate: number
}

export interface InvestmentReturnResult {
  readonly totalGain: number
  readonly netRentalIncome: number
  readonly totalRentalIncome: number
  readonly annualLoanInterest: number
  readonly totalLoanInterest: number
  readonly totalProfit: number
  readonly roi: number
  readonly annualizedReturn: number
  readonly capRate: number
  readonly leverageEffect: number
}

export const calculateInvestmentReturn = (input: InvestmentReturnInput): InvestmentReturnResult => {
  const { purchasePrice, currentPrice, totalInvestment, annualRentalIncome,
    annualExpenses, holdingYears, loanAmount, loanInterestRate } = input

  if (purchasePrice <= 0) throw new Error('매입가는 0보다 커야 합니다.')
  if (totalInvestment <= 0) throw new Error('총 투자금은 0보다 커야 합니다.')
  if (holdingYears < 1) throw new Error('보유기간은 1년 이상이어야 합니다.')

  const totalGain = roundToWon(currentPrice - purchasePrice)
  const netRentalIncome = roundToWon(annualRentalIncome - annualExpenses)
  const totalRentalIncome = roundToWon(netRentalIncome * holdingYears)
  const annualLoanInterest = roundToWon(loanAmount * (loanInterestRate / 100))
  const totalLoanInterest = roundToWon(annualLoanInterest * holdingYears)
  const totalProfit = totalGain + totalRentalIncome - totalLoanInterest
  const roi = totalInvestment > 0 ? roundTo((totalProfit / totalInvestment) * 100, 2) : 0
  const annualizedReturn = holdingYears > 0 ? roundTo(roi / holdingYears, 2) : 0
  const capRate = purchasePrice > 0 ? roundTo((netRentalIncome / purchasePrice) * 100, 2) : 0
  const leverageEffect = totalInvestment > 0 ? roundTo(purchasePrice / totalInvestment, 2) : 0

  return {
    totalGain, netRentalIncome, totalRentalIncome, annualLoanInterest,
    totalLoanInterest, totalProfit, roi, annualizedReturn, capRate, leverageEffect,
  }
}
