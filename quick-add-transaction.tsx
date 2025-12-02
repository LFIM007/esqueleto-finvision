"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { addTransaction } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const EXPENSE_CATEGORIES = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Entretenimento",
  "Compras",
  "Restaurantes",
  "Educação",
  "Outros",
]

const INCOME_CATEGORIES = ["Salário", "Freelance", "Investimentos", "Outros"]

const PAYMENT_METHODS = ["Dinheiro", "Débito", "Crédito", "PIX", "Transferência"]

export function QuickAddTransaction({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "expense" as "expense" | "income",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addTransaction({
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
    })

    toast({
      title: "Transação adicionada!",
      description: `${formData.type === "income" ? "Receita" : "Despesa"} de R$ ${Number.parseFloat(formData.amount).toFixed(2)}`,
    })

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
    })

    setOpen(false)
    onAdd()
  }

  const categories = formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
          <DialogDescription>Registre uma nova receita ou despesa</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.type === "expense"
                  ? "border-destructive bg-destructive/10"
                  : "border-border hover:border-destructive/50"
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "income", category: "" })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.type === "income" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              Receita
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço no restaurante"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Forma de Pagamento</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Adicionar Transação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
