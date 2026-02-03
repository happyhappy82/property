export const formatKRW = (amount: number): string => {
  return `${formatNumber(Math.round(amount))}원`
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR')
}

export const formatPercent = (rate: number): string => {
  return `${rate}%`
}

export const formatManWon = (amount: number): string => {
  const absAmount = Math.abs(Math.round(amount))
  const sign = amount < 0 ? '-' : ''
  const eok = Math.floor(absAmount / 100_000_000)
  const man = Math.floor((absAmount % 100_000_000) / 10_000)
  const remainder = absAmount % 10_000

  let result = sign
  if (eok > 0) {
    result += `${formatNumber(eok)}억`
    if (man > 0) result += ` ${formatNumber(man)}만`
    if (remainder > 0) result += ` ${formatNumber(remainder)}`
    result += '원'
  } else if (man > 0) {
    result += `${formatNumber(man)}만`
    if (remainder > 0) result += ` ${formatNumber(remainder)}`
    result += '원'
  } else {
    result += `${formatNumber(absAmount)}원`
  }

  return result
}
