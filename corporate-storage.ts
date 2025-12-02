export interface CompanyData {
  // Dados Cadastrais
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  setor: string
  regimeTributario: string
  porte: string
  telefone: string
  email: string
  site?: string
  dataAbertura?: string

  // Endereço
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    pais: string
  }

  // Configurações Financeiras
  contasBancarias: Array<{
    banco: string
    agencia: string
    conta: string
    tipo: string
    saldoInicial: number
  }>
  formasPagamento: string[]

  // Funcionários
  funcionarios: Array<{
    nome: string
    cpf: string
    cargo: string
    departamento: string
    salario: number
    dataAdmissao: string
    email: string
    telefone: string
    status: string
    beneficios?: string
  }>

  // Departamentos
  departamentos: Array<{
    nome: string
    orcamento: number
    responsavel: string
  }>

  // Impostos
  impostos: Array<{
    nome: string
    aliquota: number
    periodicidade: string
  }>

  // Orçamento
  orcamento: {
    receitaMeta: number
    despesaMaxima: number
    lucroMeta: number
    reservaEmergencia: number
  }

  // Categorias
  categoriasReceita: string[]
  categoriasDespesa: string[]

  // Transações Corporativas
  receitas: Array<{
    id: string
    descricao: string
    valor: number
    categoria: string
    data: string
    conta: string
    departamento: string
    cliente?: string
    notaFiscal?: string
  }>
  despesas: Array<{
    id: string
    descricao: string
    valor: number
    categoria: string
    data: string
    conta: string
    departamento: string
    fornecedor?: string
    notaFiscal?: string
    tipo: "fixa" | "variavel" // Add despesas fixas/variáveis tracking
  }>
}

const CORPORATE_STORAGE_KEY = "finvision_corporate_data"

const defaultCompanyData: CompanyData = {
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  setor: "",
  regimeTributario: "simples",
  porte: "micro",
  telefone: "",
  email: "",
  endereco: {
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
  },
  contasBancarias: [],
  formasPagamento: ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito", "Boleto"],
  funcionarios: [],
  departamentos: [
    { nome: "Administrativo", orcamento: 0, responsavel: "" },
    { nome: "Operacional", orcamento: 0, responsavel: "" },
    { nome: "Financeiro", orcamento: 0, responsavel: "" },
  ],
  impostos: [],
  orcamento: {
    receitaMeta: 0,
    despesaMaxima: 0,
    lucroMeta: 0,
    reservaEmergencia: 0,
  },
  categoriasReceita: ["Vendas de Produtos", "Prestação de Serviços", "Receitas Financeiras", "Outras Receitas"],
  categoriasDespesa: [
    "Folha de Pagamento",
    "Aluguel",
    "Fornecedores",
    "Impostos",
    "Marketing",
    "Utilidades",
    "Manutenção",
    "Despesas Financeiras",
    "Outras Despesas",
  ],
  receitas: [],
  despesas: [],
}

export function getCompanyData(): CompanyData {
  if (typeof window === "undefined") {
    return defaultCompanyData
  }

  const stored = localStorage.getItem(CORPORATE_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(CORPORATE_STORAGE_KEY, JSON.stringify(defaultCompanyData))
    return defaultCompanyData
  }

  return JSON.parse(stored)
}

export function saveCompanyData(data: CompanyData) {
  if (typeof window === "undefined") return
  localStorage.setItem(CORPORATE_STORAGE_KEY, JSON.stringify(data))
}

export function addReceita(receita: Omit<CompanyData["receitas"][0], "id">) {
  const data = getCompanyData()
  const newReceita = {
    ...receita,
    id: Date.now().toString(),
  }
  data.receitas.unshift(newReceita)
  saveCompanyData(data)
  return newReceita
}

export function addDespesa(despesa: Omit<CompanyData["despesas"][0], "id">) {
  const data = getCompanyData()
  const newDespesa = {
    ...despesa,
    id: Date.now().toString(),
  }
  data.despesas.unshift(newDespesa)
  saveCompanyData(data)
  return newDespesa
}

export function deleteReceita(id: string) {
  const data = getCompanyData()
  data.receitas = data.receitas.filter((r) => r.id !== id)
  saveCompanyData(data)
}

export function deleteDespesa(id: string) {
  const data = getCompanyData()
  data.despesas = data.despesas.filter((d) => d.id !== id)
  saveCompanyData(data)
}

export function getSaldoCorporativo(): number {
  const data = getCompanyData()
  const totalReceitas = data.receitas.reduce((sum, r) => sum + r.valor, 0)
  const totalDespesas = data.despesas.reduce((sum, d) => sum + d.valor, 0)
  const saldoInicial = data.contasBancarias.reduce((sum, c) => sum + c.saldoInicial, 0)
  return saldoInicial + totalReceitas - totalDespesas
}

export function checkAndResetMonthly() {
  if (typeof window === "undefined") return

  const lastResetKey = "finvision_corporate_last_reset"
  const lastReset = localStorage.getItem(lastResetKey)
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  if (lastReset !== currentMonth) {
    const data = getCompanyData()

    // Salvar saldo atual antes do reset
    const saldoAtual = getSaldoCorporativo()

    // Arquivar transações do mês anterior
    const historicalKey = `finvision_corporate_history_${lastReset || "inicial"}`
    const historicoMensal = {
      mes: lastReset || "inicial",
      receitas: data.receitas,
      despesas: data.despesas,
      saldoFinal: saldoAtual,
      dataArquivamento: new Date().toISOString(),
    }
    localStorage.setItem(historicalKey, JSON.stringify(historicoMensal))

    // Resetar receitas e despesas
    data.receitas = []
    data.despesas = []

    // Atualizar saldo inicial nas contas bancárias para manter o saldo
    if (data.contasBancarias.length > 0) {
      data.contasBancarias[0].saldoInicial = saldoAtual
    }

    saveCompanyData(data)
    localStorage.setItem(lastResetKey, currentMonth)
  }
}

export function getMonthlyHistory() {
  if (typeof window === "undefined") return []

  const history = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("finvision_corporate_history_")) {
      const data = localStorage.getItem(key)
      if (data) {
        history.push(JSON.parse(data))
      }
    }
  }

  return history.sort((a, b) => b.mes.localeCompare(a.mes))
}

export interface FiltrosRelatorio {
  dataInicio?: string
  dataFim?: string
  categoria?: string
  departamento?: string
  valorMin?: number
  valorMax?: number
}

export function filtrarReceitas(filtros: FiltrosRelatorio) {
  const data = getCompanyData()
  let receitas = [...data.receitas]

  if (filtros.dataInicio) {
    receitas = receitas.filter((r) => r.data >= filtros.dataInicio!)
  }
  if (filtros.dataFim) {
    receitas = receitas.filter((r) => r.data <= filtros.dataFim!)
  }
  if (filtros.categoria) {
    receitas = receitas.filter((r) => r.categoria === filtros.categoria)
  }
  if (filtros.departamento) {
    receitas = receitas.filter((r) => r.departamento === filtros.departamento)
  }
  if (filtros.valorMin !== undefined) {
    receitas = receitas.filter((r) => r.valor >= filtros.valorMin!)
  }
  if (filtros.valorMax !== undefined) {
    receitas = receitas.filter((r) => r.valor <= filtros.valorMax!)
  }

  return receitas
}

export function filtrarDespesas(filtros: FiltrosRelatorio) {
  const data = getCompanyData()
  let despesas = [...data.despesas]

  if (filtros.dataInicio) {
    despesas = despesas.filter((d) => d.data >= filtros.dataInicio!)
  }
  if (filtros.dataFim) {
    despesas = despesas.filter((d) => d.data <= filtros.dataFim!)
  }
  if (filtros.categoria) {
    despesas = despesas.filter((d) => d.categoria === filtros.categoria)
  }
  if (filtros.departamento) {
    despesas = despesas.filter((d) => d.departamento === filtros.departamento)
  }
  if (filtros.valorMin !== undefined) {
    despesas = despesas.filter((d) => d.valor >= filtros.valorMin!)
  }
  if (filtros.valorMax !== undefined) {
    despesas = despesas.filter((d) => d.valor <= filtros.valorMax!)
  }

  return despesas
}

export function getDespesasPorTipo() {
  const data = getCompanyData()

  const despesasFixas = data.despesas.filter((d) => ["Folha de Pagamento", "Aluguel", "Impostos"].includes(d.categoria))

  const despesasVariaveis = data.despesas.filter(
    (d) => !["Folha de Pagamento", "Aluguel", "Impostos"].includes(d.categoria),
  )

  const totalFixas = despesasFixas.reduce((sum, d) => sum + d.valor, 0)
  const totalVariaveis = despesasVariaveis.reduce((sum, d) => sum + d.valor, 0)
  const totalGeral = totalFixas + totalVariaveis

  return {
    fixas: {
      despesas: despesasFixas,
      total: totalFixas,
      percentual: totalGeral > 0 ? (totalFixas / totalGeral) * 100 : 0,
    },
    variaveis: {
      despesas: despesasVariaveis,
      total: totalVariaveis,
      percentual: totalGeral > 0 ? (totalVariaveis / totalGeral) * 100 : 0,
    },
    totalGeral,
  }
}

export function getSaldoVirada() {
  if (typeof window === "undefined") return 0

  const saldoViradaKey = "finvision_corporate_saldo_virada"
  const stored = localStorage.getItem(saldoViradaKey)

  if (stored) {
    return Number.parseFloat(stored)
  }

  return 0
}

export function setSaldoVirada(saldo: number) {
  if (typeof window === "undefined") return
  localStorage.setItem("finvision_corporate_saldo_virada", saldo.toString())
}
