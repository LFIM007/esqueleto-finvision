"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  LayoutDashboard,
  Receipt,
  Target,
  PiggyBank,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Users,
  Building2,
  FileText,
} from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    console.log("[v0] DashboardLayout mounted")
    const userData = localStorage.getItem("finvision_user")
    if (userData) {
      console.log("[v0] User data found in layout:", userData)
      setUser(JSON.parse(userData))
    }

    const isDark = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", String(newMode))
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("finvision_user")
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transações", href: "/transacoes", icon: Receipt },
    { name: "Metas", href: "/metas", icon: Target },
    { name: "Investimentos", href: "/investimentos", icon: PiggyBank },
    { name: "Assistente IA", href: "/assistente", icon: MessageSquare },
  ]

  if (user?.plan === "corp") {
    navigation.push({ name: "Painel Empresa", href: "/corporativo", icon: Users })
    navigation.push({ name: "Metas Empresariais", href: "/corporativo/metas", icon: Target })
    navigation.push({ name: "Relatórios", href: "/corporativo/relatorios", icon: FileText })
    navigation.push({ name: "Config. Empresa", href: "/corporativo/configuracoes", icon: Building2 })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinVision</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-card border-r transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinVision</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={toggleDarkMode}>
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 mr-3" />
                  Modo Claro
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 mr-3" />
                  Modo Escuro
                </>
              )}
            </Button>
            <Link href="/configuracoes">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-5 h-5 mr-3" />
                Configurações
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
