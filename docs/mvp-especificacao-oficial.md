# TRIGGMA GROWTH V1 - ESPECIFICACAO OFICIAL MVP

## 1. Visao do produto

A Triggma e uma plataforma SaaS para crescimento empresarial baseada em:

- Indicacao de clientes
- Fidelizacao
- Recompensas
- Engajamento
- Retencao

### 1.1 O que a Triggma nao e

- Banco digital
- Carteira digital
- Gateway financeiro
- Plataforma de pagamentos para clientes finais
- Marketplace de afiliados

### 1.2 O que a Triggma e

Uma plataforma que transforma clientes em promotores da marca.

## 2. Escopo de arquitetura

- Ambiente alvo: Lovable Cloud
- Modelo: SaaS Multi-Tenant
- Isolamento: cada empresa opera em tenant isolado (dados e configuracoes)

### 2.1 Perfis de acesso

1. **Super Admin**
   - Controle global da plataforma
   - Gestao de tenants, planos e auditoria
2. **Empresa**
   - Gestao de clientes, campanhas, recompensas, leads e conversoes
3. **Cliente**
   - Acesso ao portal de pontos, resgates, historico e links de indicacao

## 3. Identidade visual e UX/UI

### 3.1 Obrigatorio

- Manter logo Triggma
- Manter paleta de cores atual
- Manter branding atual

### 3.2 Modernizacao permitida

- Melhorar UX/UI com referencia em:
  - Stripe
  - Notion
  - Linear
  - HubSpot

## 4. Dominio e links da marca

- Todos os links devem usar a marca Triggma
- Nao usar encurtadores externos

### 4.1 Padrao de links

- `https://triggma.com/r/{codigo_cliente}`
- `https://triggma.com/campanha/{codigo_campanha}`
- `https://triggma.com/recompensa/{codigo_recompensa}`

## 5. QR Code

Todo link compartilhavel deve possuir QR Code com:

- Logo Triggma centralizada
- Nome da empresa
- Nome da campanha (quando aplicavel)

Download obrigatorio em:

- PNG
- SVG

## 6. Planos SaaS

### 6.1 Gratis

- Ate 100 clientes
- 1 campanha ativa
- 1 usuario empresa

### 6.2 Starter

- Ate 1.000 clientes
- Ate 5 campanhas
- Ate 3 usuarios empresa

### 6.3 Business

- Ate 10.000 clientes
- Campanhas ilimitadas
- Ate 10 usuarios empresa

### 6.4 Enterprise

- Limites ilimitados
- Multiunidades
- Suporte prioritario

## 7. Modulos MVP

## 7.1 Dashboard

### KPIs obrigatorios

- Clientes cadastrados
- Clientes ativos
- Indicacoes
- Conversoes
- Pontos emitidos
- Pontos resgatados
- Campanhas ativas

### Graficos obrigatorios

- Crescimento
- Conversoes
- Engajamento

## 7.2 Clientes

### Cadastro

- Nome
- WhatsApp
- Email
- Data de cadastro
- Pontuacao atual

### Operacoes

- Importacao via CSV
- Cadastro manual
- Busca avancada
- Filtros por status, data e campanha

## 7.3 Campanhas

A empresa cria campanhas com:

- Nome
- Descricao
- Recompensa
- Quantidade de pontos por conversao
- Data de inicio
- Data de fim
- Status (rascunho, ativa, pausada, encerrada)

Exemplo de campanha:

> "Indique um amigo e ganhe 100 pontos."

## 7.4 Links de indicacao

- Geracao automatica por cliente
- Codigo unico por cliente e por tenant
- Link padrao: `https://triggma.com/r/{codigo_cliente}`

## 7.5 Pagina publica de destino

Deve exibir:

- Logo Triggma
- Logo da empresa
- Nome da campanha
- Beneficios da oferta

Deve capturar:

- Nome
- WhatsApp
- Email

CTA obrigatorio:

- Botao `Participar`

## 7.6 Leads

Status obrigatorios:

- Novo
- Contatado
- Convertido
- Perdido

Requisito:

- Historico completo por lead (quem alterou, quando e observacoes)

## 7.7 Conversoes

- Marcacao manual pela empresa
- Ao converter lead, gerar pontos automaticamente conforme configuracao da campanha

## 7.8 Sistema de pontos

Regra base:

- `1 conversao = N pontos` (N configuravel por campanha)

Requisitos:

- Lancamento automatico de pontos na conversao
- Registro em extrato de pontos (credito e debito)

## 7.9 Catalogo de recompensas

Empresa cria itens do tipo:

- Produto
- Servico
- Desconto
- Beneficio

Campos obrigatorios:

- Nome
- Descricao
- Pontos necessarios
- Quantidade disponivel

## 7.10 Resgates

Ao resgatar, o sistema gera:

- Voucher
- Codigo unico
- QR Code

Status:

- Disponivel
- Utilizado
- Expirado

## 7.11 Portal do cliente

Login simplificado e area do cliente com:

- Pontos atuais
- Historico de pontos
- Recompensas disponiveis
- Meu link de indicacao
- Meu QR Code de indicacao

## 7.12 Ranking

Categorias:

- Mais indicacoes
- Mais conversoes
- Mais pontos

Niveis:

- Bronze
- Prata
- Ouro
- Diamante

## 7.13 Triggma Marketing

Modulo MVP com biblioteca de campanhas prontas por segmento:

- Oficina
- Clinica
- Restaurante
- Academia
- Imobiliaria
- Energia Solar
- Assistencia Tecnica
- E-commerce

Cada segmento deve incluir:

- Campanhas prontas
- Textos para WhatsApp
- Textos para Instagram
- Artes modelo
- Estrategias de divulgacao

## 8. Assistente IA (fase futura)

Preparar arquitetura sem IA complexa no MVP.

Reservar estrutura para:

- Sugestao de campanhas
- Sugestao de recompensas
- Sugestao de promocoes
- Estrategias de retencao

## 9. Cobranca SaaS

Gateway de assinatura: Mercado Pago.

Escopo permitido:

- Empresa paga assinatura da Triggma

Escopo proibido:

- Nao processar pagamentos de clientes finais
- Nao processar pagamento de recompensas

Fluxo:

- Empresa -> paga Triggma
- Cliente final -> nao paga Triggma

## 10. Seguranca

Implementar no MVP:

- HTTPS
- Logs de aplicacao
- Auditoria de eventos
- Rate limiting
- Anti-spam
- Validacao de formularios
- Protecao contra duplicidade de cadastros e leads

## 11. Responsividade

Obrigatorio:

- Desktop
- Tablet
- Mobile (mobile-first)

## 12. Testes obrigatorios do MVP

Executar e validar:

- Cadastro de empresa
- Cadastro de cliente
- Campanhas
- Links de indicacao
- QR Code
- Leads
- Conversoes
- Pontos
- Resgates
- Ranking
- Assinaturas SaaS

Todo erro identificado deve ser corrigido antes da proxima etapa.

## 13. Objetivo final do MVP

Ao concluir o MVP, a empresa deve conseguir:

1. Cadastrar clientes
2. Criar campanha
3. Gerar links de indicacao
4. Captar novos clientes
5. Converter leads em vendas
6. Entregar pontos
7. Fidelizar clientes
8. Gerar novas indicacoes
9. Acompanhar resultados em dashboard

## 14. Principio orientador

**Menos complexidade. Mais geracao de clientes. Mais fidelizacao. Mais recorrencia para as empresas.**
