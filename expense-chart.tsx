"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateSpentByCategory } from "@/lib/finance-utils"
import type { Transaction } from "@/lib/finance-utils"

export function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const byCategory = calculateSpentByCategory(transactions)
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0)

  const colors = [
    "bg-primary",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma despesa registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(([category, amount], index) => {
              const percentage = (amount / total) * 100
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span className="text-muted-foreground">
                      R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index % colors.length]} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
