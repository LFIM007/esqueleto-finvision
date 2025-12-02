import type { CompanyData } from "./corporate-storage"
import { getDespesasPorTipo, getSaldoVirada } from "./corporate-storage"

export interface RelatorioData {
  empresa: {
    razaoSocial: string
    cnpj: string
    endereco: string
    periodo: string
  }
  resumo: {
    totalReceitas: number
    totalDespesas: number
    resultado: number
    saldoVirada: number
    saldoFinal: number
  }
  despesasPorTipo: {
    fixas: {
      total: number
      percentual: number
      items: Array<{ descricao: string; valor: number; categoria: string }>
    }
    variaveis: {
      total: number
      percentual: number
      items: Array<{ descricao: string; valor: number; categoria: string }>
    }
  }
  receitas: CompanyData["receitas"]
  despesas: CompanyData["despesas"]
  porDepartamento: Array<{
    nome: string
    receitas: number
    despesas: number
    saldo: number
    orcamento: number
    utilizacao: number
  }>
  impostos: Array<{
    nome: string
    aliquota: number
    baseCalculo: number
    valorDevido: number
  }>
}

export function prepararRelatorio(data: CompanyData, dataInicio: string, dataFim: string): RelatorioData {
  // Filtrar por período
  const receitas = data.receitas.filter((r) => r.data >= dataInicio && r.data <= dataFim)
  const despesas = data.despesas.filter((d) => d.data >= dataInicio && d.data <= dataFim)

  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0)
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)
  const resultado = totalReceitas - totalDespesas

  // Análise de despesas fixas e variáveis
  const despesasPorTipo = getDespesasPorTipo()
  const despesasFixasDetalhadas = despesas.filter((d) =>
    ["Folha de Pagamento", "Aluguel", "Impostos"].includes(d.categoria),
  )
  const despesasVariaveisDetalhadas = despesas.filter(
    (d) => !["Folha de Pagamento", "Aluguel", "Impostos"].includes(d.categoria),
  )

  // Análise por departamento
  const porDepartamento = data.departamentos.map((dept) => {
    const receitasDept = receitas.filter((r) => r.departamento === dept.nome).reduce((sum, r) => sum + r.valor, 0)
    const despesasDept = despesas.filter((d) => d.departamento === dept.nome).reduce((sum, d) => sum + d.valor, 0)

    return {
      nome: dept.nome,
      receitas: receitasDept,
      despesas: despesasDept,
      saldo: receitasDept - despesasDept,
      orcamento: dept.orcamento,
      utilizacao: dept.orcamento > 0 ? (despesasDept / dept.orcamento) * 100 : 0,
    }
  })

  // Cálculo de impostos
  const impostos = data.impostos.map((imp) => {
    let baseCalculo = 0
    if (imp.nome.toLowerCase().includes("receita") || imp.nome.toLowerCase().includes("faturamento")) {
      baseCalculo = totalReceitas
    } else if (imp.nome.toLowerCase().includes("lucro")) {
      baseCalculo = Math.max(0, resultado)
    } else {
      baseCalculo = totalReceitas
    }

    return {
      nome: imp.nome,
      aliquota: imp.aliquota,
      baseCalculo,
      valorDevido: (baseCalculo * imp.aliquota) / 100,
    }
  })

  const saldoVirada = getSaldoVirada()
  const saldoFinal = saldoVirada + resultado

  return {
    empresa: {
      razaoSocial: data.razaoSocial || "Empresa não configurada",
      cnpj: data.cnpj || "",
      endereco: `${data.endereco.logradouro}, ${data.endereco.numero} - ${data.endereco.cidade}/${data.endereco.estado}`,
      periodo: `${new Date(dataInicio).toLocaleDateString("pt-BR")} a ${new Date(dataFim).toLocaleDateString("pt-BR")}`,
    },
    resumo: {
      totalReceitas,
      totalDespesas,
      resultado,
      saldoVirada,
      saldoFinal,
    },
    despesasPorTipo: {
      fixas: {
        total: despesasPorTipo.fixas.total,
        percentual: despesasPorTipo.fixas.percentual,
        items: despesasFixasDetalhadas.map((d) => ({
          descricao: d.descricao,
          valor: d.valor,
          categoria: d.categoria,
        })),
      },
      variaveis: {
        total: despesasPorTipo.variaveis.total,
        percentual: despesasPorTipo.variaveis.percentual,
        items: despesasVariaveisDetalhadas.map((d) => ({
          descricao: d.descricao,
          valor: d.valor,
          categoria: d.categoria,
        })),
      },
    },
    receitas,
    despesas,
    porDepartamento,
    impostos,
  }
}

export function gerarRelatorioPDF(relatorio: RelatorioData) {
  const { empresa, resumo, despesasPorTipo, receitas, despesas, porDepartamento, impostos } = relatorio

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório Financeiro - ${empresa.razaoSocial}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: white;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #10B981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 { color: #10B981; font-size: 28px; margin-bottom: 10px; }
    .header p { color: #666; font-size: 14px; }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #10B981;
      font-size: 20px;
      border-bottom: 2px solid #10B981;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      background: #f9fafb;
    }
    .card-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .card-value {
      font-size: 24px;
      font-weight: bold;
      color: #000;
    }
    .card-value.positive { color: #10B981; }
    .card-value.negative { color: #EF4444; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 13px;
    }
    table th {
      background: #10B981;
      color: white;
      padding: 10px;
      text-align: left;
      font-weight: 600;
    }
    table td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    table tr:nth-child(even) { background: #f9fafb; }
    .text-right { text-align: right; }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
    .highlight-box {
      background: #f0fdf4;
      border-left: 4px solid #10B981;
      padding: 15px;
      margin: 15px 0;
    }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  <div class="header">
    <h1>RELATÓRIO FINANCEIRO CORPORATIVO</h1>
    <p><strong>${empresa.razaoSocial}</strong></p>
    <p>CNPJ: ${empresa.cnpj} | ${empresa.endereco}</p>
    <p>Período: ${empresa.periodo}</p>
    <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
  </div>

  <div class="section">
    <h2>1. RESUMO EXECUTIVO</h2>
    <div class="grid">
      <div class="card">
        <div class="card-title">Saldo de Virada</div>
        <div class="card-value">R$ ${resumo.saldoVirada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
      </div>
      <div class="card">
        <div class="card-title">Total de Receitas</div>
        <div class="card-value positive">R$ ${resumo.totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
      </div>
      <div class="card">
        <div class="card-title">Total de Despesas</div>
        <div class="card-value negative">R$ ${resumo.totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
      </div>
      <div class="card">
        <div class="card-title">Resultado do Período</div>
        <div class="card-value ${resumo.resultado >= 0 ? "positive" : "negative"}">
          R$ ${resumo.resultado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div class="card">
        <div class="card-title">Saldo Final</div>
        <div class="card-value ${resumo.saldoFinal >= 0 ? "positive" : "negative"}">
          R$ ${resumo.saldoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>2. ANÁLISE DE DESPESAS FIXAS E VARIÁVEIS</h2>
    <div class="highlight-box">
      <p><strong>Total Geral de Despesas:</strong> R$ ${(despesasPorTipo.fixas.total + despesasPorTipo.variaveis.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
    </div>
    
    <h3 style="margin-top: 20px; color: #666;">Despesas Fixas</h3>
    <p><strong>Total:</strong> R$ ${despesasPorTipo.fixas.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
    (${despesasPorTipo.fixas.percentual.toFixed(1)}% do total)</p>
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Categoria</th>
          <th class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${despesasPorTipo.fixas.items
          .map(
            (item) => `
          <tr>
            <td>${item.descricao}</td>
            <td>${item.categoria}</td>
            <td class="text-right">R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <h3 style="margin-top: 20px; color: #666;">Despesas Variáveis</h3>
    <p><strong>Total:</strong> R$ ${despesasPorTipo.variaveis.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
    (${despesasPorTipo.variaveis.percentual.toFixed(1)}% do total)</p>
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Categoria</th>
          <th class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${despesasPorTipo.variaveis.items
          .map(
            (item) => `
          <tr>
            <td>${item.descricao}</td>
            <td>${item.categoria}</td>
            <td class="text-right">R$ ${item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <div class="section">
    <h2>3. RECEITAS DETALHADAS</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Departamento</th>
          <th>Cliente</th>
          <th>NF</th>
          <th class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${receitas
          .map(
            (r) => `
          <tr>
            <td>${new Date(r.data).toLocaleDateString("pt-BR")}</td>
            <td>${r.descricao}</td>
            <td>${r.categoria}</td>
            <td>${r.departamento || "-"}</td>
            <td>${r.cliente || "-"}</td>
            <td>${r.notaFiscal || "-"}</td>
            <td class="text-right">R$ ${r.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        `,
          )
          .join("")}
        <tr style="font-weight: bold; background: #f0fdf4;">
          <td colspan="6" class="text-right">TOTAL DE RECEITAS:</td>
          <td class="text-right">R$ ${resumo.totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <div class="section">
    <h2>4. DESPESAS DETALHADAS</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Departamento</th>
          <th>Fornecedor</th>
          <th>NF</th>
          <th class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${despesas
          .map(
            (d) => `
          <tr>
            <td>${new Date(d.data).toLocaleDateString("pt-BR")}</td>
            <td>${d.descricao}</td>
            <td>${d.categoria}</td>
            <td>${d.departamento || "-"}</td>
            <td>${d.fornecedor || "-"}</td>
            <td>${d.notaFiscal || "-"}</td>
            <td class="text-right">R$ ${d.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        `,
          )
          .join("")}
        <tr style="font-weight: bold; background: #fee2e2;">
          <td colspan="6" class="text-right">TOTAL DE DESPESAS:</td>
          <td class="text-right">R$ ${resumo.totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <div class="section">
    <h2>5. ANÁLISE POR DEPARTAMENTO</h2>
    <table>
      <thead>
        <tr>
          <th>Departamento</th>
          <th class="text-right">Receitas</th>
          <th class="text-right">Despesas</th>
          <th class="text-right">Saldo</th>
          <th class="text-right">Orçamento</th>
          <th class="text-right">Utilização</th>
        </tr>
      </thead>
      <tbody>
        ${porDepartamento
          .map(
            (dept) => `
          <tr>
            <td>${dept.nome}</td>
            <td class="text-right">R$ ${dept.receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td class="text-right">R$ ${dept.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td class="text-right ${dept.saldo >= 0 ? "positive" : "negative"}">
              R$ ${dept.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </td>
            <td class="text-right">R$ ${dept.orcamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td class="text-right">${dept.utilizacao.toFixed(1)}%</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>6. IMPOSTOS E TRIBUTOS</h2>
    <table>
      <thead>
        <tr>
          <th>Imposto</th>
          <th class="text-right">Alíquota</th>
          <th class="text-right">Base de Cálculo</th>
          <th class="text-right">Valor Devido</th>
        </tr>
      </thead>
      <tbody>
        ${impostos
          .map(
            (imp) => `
          <tr>
            <td>${imp.nome}</td>
            <td class="text-right">${imp.aliquota}%</td>
            <td class="text-right">R$ ${imp.baseCalculo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td class="text-right">R$ ${imp.valorDevido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
          </tr>
        `,
          )
          .join("")}
        <tr style="font-weight: bold;">
          <td colspan="3" class="text-right">TOTAL DE IMPOSTOS:</td>
          <td class="text-right">R$ ${impostos.reduce((sum, imp) => sum + imp.valorDevido, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Relatório gerado automaticamente pelo sistema FinVision</p>
    <p>Este documento é válido para fins contábeis e fiscais</p>
    <p>${empresa.razaoSocial} - CNPJ: ${empresa.cnpj}</p>
  </div>
</body>
</html>
`

  // Abrir em nova janela para impressão/download
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
}
