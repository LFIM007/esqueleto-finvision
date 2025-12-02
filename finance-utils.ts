export interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  paymentMethod?: string
}

export interface FinancialData {
  salary: number
  transactions: Transaction[]
  goals: Goal[]
  settings: {
    necessities: number // 50%
    wants: number // 30%
    savings: number // 20%
  }
}

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  deadline: string
  category: string
}

export const defaultSettings = {
  necessities: 50,
  wants: 30,
  savings: 20,
}

export function calculateBudget(salary: number, settings = defaultSettings) {
  return {
    necessities: (salary * settings.necessities) / 100,
    wants: (salary * settings.wants) / 100,
    savings: (salary * settings.savings) / 100,
  }
}

export function calculateSpentByCategory(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === "expense")

  const byCategory: Record<string, number> = {}

  expenses.forEach((transaction) => {
    if (!byCategory[transaction.category]) {
      byCategory[transaction.category] = 0
    }
    byCategory[transaction.category] += transaction.amount
  })

  return byCategory
}

export function calculateMonthlyTotal(transactions: Transaction[], type: "income" | "expense") {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0)
}

export function getFinancialScore(
  salary: number,
  spent: number,
  saved: number,
): { score: number; level: string; message: string } {
  const savingsRate = (saved / salary) * 100
  const spendingRate = (spent / salary) * 100

  let score = 100

  // Penalizar gastos excessivos
  if (spendingRate > 80) score -= 30
  else if (spendingRate > 70) score -= 20
  else if (spendingRate > 60) score -= 10

  // Recompensar economia
  if (savingsRate >= 20) score += 0
  else if (savingsRate >= 15) score -= 10
  else if (savingsRate >= 10) score -= 20
  else score -= 30

  score = Math.max(0, Math.min(100, score))

  let level = "Excelente"
  let message = "Suas finanças estão muito bem organizadas!"

  if (score < 40) {
    level = "Crítico"
    message = "Atenção! É hora de revisar seus gastos urgentemente."
  } else if (score < 60) {
    level = "Regular"
    message = "Você pode melhorar. Revise seus gastos e tente economizar mais."
  } else if (score < 80) {
    level = "Bom"
    message = "Bom trabalho! Continue assim e tente economizar um pouco mais."
  }

  return { score, level, message }
}

export function generateAIInsight(data: FinancialData): string {
  const budget = calculateBudget(data.salary)
  const spent = calculateMonthlyTotal(data.transactions, "expense")
  const saved = data.salary - spent

  const insights: string[] = []

  // Análise de gastos
  if (spent > budget.necessities + budget.wants) {
    insights.push(
      `Você gastou R$ ${(spent - (budget.necessities + budget.wants)).toFixed(2)} a mais que o recomendado este mês.`,
    )
  }

  // Análise de economia
  if (saved < budget.savings) {
    insights.push(`Tente economizar mais R$ ${(budget.savings - saved).toFixed(2)} para atingir sua meta de 20%.`)
  } else {
    insights.push(`Parabéns! Você economizou R$ ${saved.toFixed(2)} este mês.`)
  }

  // Análise por categoria
  const byCategory = calculateSpentByCategory(data.transactions)
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

  if (topCategory) {
    insights.push(`Sua maior categoria de gastos é "${topCategory[0]}" com R$ ${topCategory[1].toFixed(2)}.`)
  }

  return insights.join(" ")
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
) {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12

  let total = principal
  const data: { month: number; value: number }[] = [{ month: 0, value: principal }]

  for (let i = 1; i <= months; i++) {
    total = (total + monthlyContribution) * (1 + monthlyRate)
    if (i % 12 === 0 || i === months) {
      data.push({ month: i, value: total })
    }
  }

  return {
    finalValue: total,
    totalInvested: principal + monthlyContribution * months,
    totalInterest: total - (principal + monthlyContribution * months),
    data,
  }
}
