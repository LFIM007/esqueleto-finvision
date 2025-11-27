# Guia de Instalação FinVision no VSCode

Este guia explica como executar o FinVision localmente no VSCode.

## Pré-requisitos

- Node.js 18.x ou superior ([Download](https://nodejs.org/))
- VSCode ([Download](https://code.visualstudio.com/))
- Git (opcional)

## Passo 1: Verificar Node.js

Abra o terminal e verifique se o Node.js está instalado:

\`\`\`bash
node --version
npm --version
\`\`\`

Se não estiver instalado, baixe em https://nodejs.org/

## Passo 2: Instalar Dependências

No terminal do VSCode (Terminal > New Terminal), execute:

\`\`\`bash
npm install
\`\`\`

Isso instalará todas as dependências do projeto listadas em `package.json`.

## Passo 3: Executar o Projeto

Após a instalação, inicie o servidor de desenvolvimento:

\`\`\`bash
npm run dev
\`\`\`

O projeto estará disponível em: http://localhost:3000

## Passo 4: Acessar o Sistema

1. Abra seu navegador em http://localhost:3000
2. Cadastre-se ou faça login
3. Escolha o plano (PF, MEI ou Corporativo)
4. Comece a usar o FinVision!

## Estrutura do Projeto

\`\`\`
finvision/
├── app/                    # Páginas do Next.js
│   ├── page.tsx           # Landing page
│   ├── login/             # Login
│   ├── cadastro/          # Cadastro
│   ├── dashboard/         # Dashboard pessoal
│   ├── corporativo/       # Painel corporativo
│   ├── transacoes/        # Transações
│   ├── metas/             # Metas pessoais
│   └── investimentos/     # Simulador de investimentos
├── components/            # Componentes React
├── lib/                   # Utilitários e lógica
│   ├── storage.ts        # Armazenamento pessoal
│   ├── corporate-storage.ts  # Armazenamento corporativo
│   └── finance-utils.ts  # Cálculos financeiros
└── public/               # Arquivos estáticos
\`\`\`

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI
- **localStorage** - Armazenamento local (sem backend)

## Solução de Problemas

### Erro: "Cannot find module"

Execute novamente:
\`\`\`bash
npm install
\`\`\`

### Erro: "Port 3000 is already in use"

Use uma porta diferente:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Erro: "React Hook useEffect has a missing dependency"

Ignore este aviso ou adicione `// eslint-disable-next-line` acima do useEffect

### Tela branca após login

1. Abra o Console do navegador (F12)
2. Verifique se há erros
3. Limpe o localStorage: `localStorage.clear()` no console
4. Faça login novamente

## Deploy em Produção

### Vercel (Recomendado)

1. Crie uma conta em https://vercel.com
2. Conecte seu repositório GitHub
3. Clique em "Deploy"
4. Pronto! Seu site estará no ar

### Build Local

Para criar um build de produção:

\`\`\`bash
npm run build
npm start
\`\`\`

## Funcionalidades

### Pessoal (PF/MEI)
- Dashboard com nota financeira
- Controle de transações (receitas e despesas)
- Método 50/30/20
- Metas financeiras
- Simulador de investimentos
- Assistente IA
- Exportação de dados

### Corporativo
- Cadastro completo da empresa
- Gestão de funcionários e departamentos
- Controle de receitas e despesas por departamento
- Orçamento e limites por departamento
- Análise de despesas fixas e variáveis
- Relatórios em PDF para contabilidade
- Metas corporativas
- Saldo de virada automático
- Reset mensal com histórico
- Calendário em tempo real
- Múltiplas contas bancárias

## Suporte

Para dúvidas ou problemas:
1. Verifique este guia
2. Consulte a documentação do Next.js: https://nextjs.org/docs
3. Verifique o Console do navegador para erros

## Licença

Este projeto é privado e proprietário.
\`\`\`

```tsx file="" isHidden
