import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  TrendingUp,
  Target,
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Wallet,
  Users,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinVision</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm" className="gap-2">
                Começar Grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Transforme sua vida financeira
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Visão financeira do seu futuro</h1>

              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Gerencie suas finanças com inteligência. Acompanhe gastos, estabeleça metas e construa um futuro
                financeiro sólido com o método 50/30/20.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/cadastro">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Testar Grátis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Ver Demonstração
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  100% gratuito
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl" />
              <Card className="relative p-6 backdrop-blur-sm bg-card/50">
                <img
                  src="/modern-financial-dashboard-with-charts.jpg"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-lg"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para controlar suas finanças de forma inteligente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Dashboard Inteligente",
                description: "Visualize suas finanças em tempo real com gráficos e insights personalizados",
              },
              {
                icon: Target,
                title: "Metas Financeiras",
                description: "Defina objetivos e acompanhe seu progresso com calculadoras inteligentes",
              },
              {
                icon: Shield,
                title: "Método 50/30/20",
                description: "Distribua sua renda de forma inteligente: necessidades, desejos e investimentos",
              },
              {
                icon: TrendingUp,
                title: "Investimentos",
                description: "Aprenda a investir com simuladores de juros compostos e dicas personalizadas",
              },
              {
                icon: Smartphone,
                title: "PWA - Use Offline",
                description: "Instale no seu celular e acesse mesmo sem internet",
              },
              {
                icon: Wallet,
                title: "Controle Total",
                description: "Registre gastos, acompanhe histórico e exporte relatórios completos",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolha o plano ideal para você</h2>
            <p className="text-lg text-muted-foreground">Comece gratuitamente e evolua conforme suas necessidades</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Pessoa Física */}
            <Card className="p-8 relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pessoa Física</h3>
                <p className="text-muted-foreground">Para uso pessoal</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">Grátis</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Dashboard completo",
                  "Método 50/30/20",
                  "Registro de gastos ilimitado",
                  "Gráficos e relatórios",
                  "Metas financeiras",
                  "Exportação de dados",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/cadastro?plan=pf">
                <Button className="w-full">Começar Agora</Button>
              </Link>
            </Card>

            {/* MEI */}
            <Card className="p-8 relative overflow-hidden border-primary shadow-lg scale-105">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                POPULAR
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">MEI / Autônomo</h3>
                <p className="text-muted-foreground">Para empreendedores</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 29</span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Tudo do plano Pessoa Física",
                  "Separação PF e PJ",
                  "Controle de receitas",
                  "Gestão de impostos",
                  "Fluxo de caixa",
                  "Assistente IA avançado",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/cadastro?plan=mei">
                <Button className="w-full">Começar Agora</Button>
              </Link>
            </Card>

            {/* Corporativo */}
            <Card className="p-8 relative overflow-hidden">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Corporativo</h3>
                </div>
                <p className="text-muted-foreground">Para empresas</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">Sob consulta</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Tudo dos planos anteriores",
                  "Painel RH completo",
                  "Gestão de funcionários",
                  "Controle de entrada/saída",
                  "Saúde financeira da equipe",
                  "Relatórios corporativos",
                  "Suporte prioritário",
                  "LGPD compliance",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/cadastro-empresa">
                <Button className="w-full">Cadastrar Empresa</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para transformar suas finanças?</h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a milhares de pessoas que já estão no controle do seu futuro financeiro
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" className="gap-2">
              Começar Gratuitamente
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">FinVision</span>
              </div>
              <p className="text-sm text-muted-foreground">Transformando vidas através da educação financeira</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#plans" className="hover:text-foreground">
                    Planos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Tutoriais
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#about" className="hover:text-foreground">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Termos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    LGPD
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 FinVision. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
