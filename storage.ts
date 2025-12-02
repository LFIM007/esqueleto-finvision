import type { FinancialData, Transaction, Goal } from "./finance-utils"
import { defaultSettings } from "./finance-utils"

const STORAGE_KEY = "finvision_data"

export function getFinancialData(): FinancialData {
  if (typeof window === "undefined") {
    return {
      salary: 0,
      transactions: [],
      goals: [],
      settings: defaultSettings,
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const defaultData: FinancialData = {
      salary: 0,
      transactions: [],
      goals: [],
      settings: defaultSettings,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    return defaultData
  }

  return JSON.parse(stored)
}

export function saveFinancialData(data: FinancialData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function updateSalary(salary: number) {
  const data = getFinancialData()
  data.salary = salary
  saveFinancialData(data)
}

export function addTransaction(transaction: Omit<Transaction, "id">) {
  const data = getFinancialData()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  }
  data.transactions.unshift(newTransaction)
  saveFinancialData(data)
  return newTransaction
}

export function deleteTransaction(id: string) {
  const data = getFinancialData()
  data.transactions = data.transactions.filter((t) => t.id !== id)
  saveFinancialData(data)
}

export function addGoal(goal: Omit<Goal, "id">) {
  const data = getFinancialData()
  const newGoal: Goal = {
    ...goal,
    id: Date.now().toString(),
  }
  data.goals.push(newGoal)
  saveFinancialData(data)
  return newGoal
}

export function updateGoal(id: string, updates: Partial<Goal>) {
  const data = getFinancialData()
  const index = data.goals.findIndex((g) => g.id === id)
  if (index !== -1) {
    data.goals[index] = { ...data.goals[index], ...updates }
    saveFinancialData(data)
  }
}

export function deleteGoal(id: string) {
  const data = getFinancialData()
  data.goals = data.goals.filter((g) => g.id !== id)
  saveFinancialData(data)
}

export function updateSettings(settings: Partial<typeof defaultSettings>) {
  const data = getFinancialData()
  data.settings = { ...data.settings, ...settings }
  saveFinancialData(data)
}

export function exportData(): string {
  const data = getFinancialData()
  return JSON.stringify(data, null, 2)
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    saveFinancialData(data)
    return true
  } catch (error) {
    console.error("Erro ao importar dados:", error)
    return false
  }
}
