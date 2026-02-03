import { roundToWon, calculateMonthlyRate } from '../calc-utils/math'
import { LTV_LIMITS, DSR_LIMITS, STRESS_DSR } from '../calc-constants/loan-regulations'
import type { RepaymentMethod } from '../calc-types/calculator'

export interface LoanInput {
  readonly loanAmount: number
  readonly annualRate: number
  readonly loanTermYears: number
  readonly repaymentMethod: RepaymentMethod
}

export interface MonthlySchedule {
  readonly month: number
  readonly principal: number
  readonly interest: number
  readonly payment: number
  readonly remainingBalance: number
}

export interface LoanResult {
  readonly monthlyPayment: number
  readonly totalPayment: number
  readonly totalInterest: number
  readonly schedule: readonly MonthlySchedule[]
}

export interface LtvDtiDsrInput {
  readonly propertyValue: number
  readonly annualIncome: number
  readonly otherDebtPayment: number
  readonly region: 'capital' | 'non-capital'
  readonly isFirstTimeBuyer: boolean
  readonly financialInstitution: 'first' | 'second'
}

export interface LtvDtiDsrResult {
  readonly maxLoanByLtv: number
  readonly maxLoanByDsr: number
  readonly maxLoan: number
  readonly ltvLimit: number
  readonly dsrLimit: number
}

const buildEqualPrincipalInterest = (
  principal: number, monthlyRate: number, months: number
): MonthlySchedule[] => {
  if (monthlyRate === 0) {
    const mp = roundToWon(principal / months)
    let remaining = principal
    return Array.from({ length: months }, (_, i) => {
      const pmt = i === months - 1 ? remaining : mp
      remaining = remaining - pmt
      return { month: i + 1, principal: pmt, interest: 0, payment: pmt, remainingBalance: remaining }
    })
  }
  const payment = roundToWon(
    principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  )
  let remaining = principal
  return Array.from({ length: months }, (_, i) => {
    const interest = roundToWon(remaining * monthlyRate)
    const princ = i === months - 1 ? remaining : payment - interest
    remaining = Math.max(0, remaining - princ)
    return { month: i + 1, principal: princ, interest, payment: princ + interest, remainingBalance: remaining }
  })
}

const buildEqualPrincipal = (
  principal: number, monthlyRate: number, months: number
): MonthlySchedule[] => {
  const monthlyPrincipal = roundToWon(principal / months)
  let remaining = principal
  return Array.from({ length: months }, (_, i) => {
    const interest = roundToWon(remaining * monthlyRate)
    const princ = i === months - 1 ? remaining : monthlyPrincipal
    remaining = Math.max(0, remaining - princ)
    return { month: i + 1, principal: princ, interest, payment: princ + interest, remainingBalance: remaining }
  })
}

const buildBullet = (
  principal: number, monthlyRate: number, months: number
): MonthlySchedule[] => {
  return Array.from({ length: months }, (_, i) => {
    const interest = roundToWon(principal * monthlyRate)
    const princ = i === months - 1 ? principal : 0
    const bal = i === months - 1 ? 0 : principal
    return { month: i + 1, principal: princ, interest, payment: princ + interest, remainingBalance: bal }
  })
}

export const calculateLoanRepayment = (input: LoanInput): LoanResult => {
  const { loanAmount, annualRate, loanTermYears, repaymentMethod } = input
  if (loanAmount <= 0) throw new Error('대출금은 0보다 커야 합니다.')
  if (loanTermYears <= 0) throw new Error('대출기간은 0보다 커야 합니다.')

  const months = loanTermYears * 12
  const monthlyRate = calculateMonthlyRate(annualRate)

  let schedule: MonthlySchedule[]
  switch (repaymentMethod) {
    case 'equal-principal-interest':
      schedule = buildEqualPrincipalInterest(loanAmount, monthlyRate, months)
      break
    case 'equal-principal':
      schedule = buildEqualPrincipal(loanAmount, monthlyRate, months)
      break
    case 'bullet':
      schedule = buildBullet(loanAmount, monthlyRate, months)
      break
  }

  const totalPayment = schedule.reduce((sum, s) => sum + s.payment, 0)
  const totalInterest = totalPayment - loanAmount

  return {
    monthlyPayment: schedule[0].payment,
    totalPayment: roundToWon(totalPayment),
    totalInterest: roundToWon(totalInterest),
    schedule,
  }
}

export const calculateMaxLoan = (
  input: LtvDtiDsrInput, loanTermYears: number, annualRate: number
): LtvDtiDsrResult => {
  const ltvLimit = input.isFirstTimeBuyer ? LTV_LIMITS.firstTimeBuyer : LTV_LIMITS.none
  const dsrLimit = input.financialInstitution === 'first' ? DSR_LIMITS.firstTier : DSR_LIMITS.secondTier
  const maxLoanByLtv = roundToWon(input.propertyValue * ltvLimit)

  const stressAdd = input.region === 'capital' ? STRESS_DSR.capital : STRESS_DSR.nonCapital
  const effectiveRate = annualRate / 100 + stressAdd
  const monthlyRate = effectiveRate / 12
  const months = loanTermYears * 12

  const maxAnnualPayment = input.annualIncome * dsrLimit - input.otherDebtPayment
  const maxMonthlyPayment = maxAnnualPayment / 12

  let maxLoanByDsr: number
  if (monthlyRate === 0) {
    maxLoanByDsr = roundToWon(maxMonthlyPayment * months)
  } else {
    maxLoanByDsr = roundToWon(
      maxMonthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, months))
    )
  }

  maxLoanByDsr = Math.max(0, maxLoanByDsr)
  const maxLoan = Math.min(maxLoanByLtv, maxLoanByDsr)

  return { maxLoanByLtv, maxLoanByDsr, maxLoan, ltvLimit: ltvLimit * 100, dsrLimit: dsrLimit * 100 }
}
