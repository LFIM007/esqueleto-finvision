"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSalary } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { DollarSign } from "lucide-react"

export function SalarySetup({ onComplete }: { onComplete: () => void }) {
  const [salary, setSalary] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(salary.replace(/[^\d,]/g, "").replace(",", "."))

    if (amount > 0) {
      updateSalary(amount)
      toast({
        title: "Salário configurado!",
        description: "Agora você pode começar a usar o FinVision",
      })
      onComplete()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao FinVision!</CardTitle>
          <CardDescription>Para começar, nos informe sua renda mensal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Renda Mensal (R$)</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Você poderá alterar este valor depois nas configurações</p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Começar a usar
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Método 50/30/20</p>
            <p className="text-xs text-muted-foreground">
              Vamos ajudá-lo a distribuir sua renda em 50% para necessidades, 30% para desejos e 20% para investimentos
              e poupança.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
