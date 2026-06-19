# PROMPT MESTRE LOVABLE - TRIGGMA GROWTH V1 (MVP)

> **Como usar no Lovable.dev:** copie e cole este arquivo inteiro como prompt principal do projeto.

---

## 0) CONTEXTO E OBJETIVO

Quero que voce desenvolva o **MVP completo da Triggma Growth V1** dentro do ambiente Lovable Cloud.

A Triggma e uma plataforma SaaS para crescimento empresarial com foco em:

- Indicacao de clientes
- Fidelizacao
- Recompensas
- Engajamento
- Retencao

### A Triggma NAO e:

- Banco digital
- Carteira digital
- Gateway financeiro para clientes finais
- Plataforma de pagamentos para recompensas
- Marketplace de afiliados

### A Triggma E:

Uma plataforma que transforma clientes em promotores da marca.

---

## 1) REGRAS GERAIS DE PRODUTO

1. Construir com arquitetura **SaaS Multi-Tenant**.
2. Cada empresa (tenant) deve ter ambiente e dados isolados.
3. A plataforma deve ser simples, rapida, profissional e escalavel.
4. Foco absoluto em:
   - Menos complexidade
   - Mais geracao de clientes
   - Mais fidelizacao
   - Mais recorrencia para as empresas

---

## 2) PERFIS DE ACESSO

Implementar perfis:

1. **Super Admin**
   - Controle global da plataforma
   - Gestao de empresas (tenants), planos, auditoria
2. **Empresa**
   - Gestao de clientes, campanhas, leads, conversoes, pontos e recompensas
3. **Cliente**
   - Portal com pontos, historico, resgates, link de indicacao e QR Code

---

## 3) IDENTIDADE VISUAL E UX/UI

Obrigatorio manter:

- Logo Triggma
- Paleta de cores atual
- Branding atual

Modernizar apenas UX/UI com inspiracao em:

- Stripe
- Notion
- Linear
- HubSpot

Design responsivo obrigatorio:

- Desktop
- Tablet
- Mobile (mobile-first)

---

## 4) DOMINIO, LINKS E QR CODE

Todos os links devem usar a marca Triggma (sem encurtadores externos):

- `https://triggma.com/r/{codigo_cliente}`
- `https://triggma.com/campanha/{codigo_campanha}`
- `https://triggma.com/recompensa/{codigo_recompensa}`

Todo link compartilhavel deve ter QR Code contendo:

- Logo Triggma centralizada
- Nome da empresa
- Campanha (quando aplicavel)

Download obrigatorio de QR Code:

- PNG
- SVG

---

## 5) PLANOS SAAS (LIMITES)

### Gratis
- 100 clientes
- 1 campanha
- 1 usuario

### Starter
- 1.000 clientes
- 5 campanhas
- 3 usuarios

### Business
- 10.000 clientes
- Campanhas ilimitadas
- 10 usuarios

### Enterprise
- Ilimitado
- Multiunidades
- Suporte prioritario

---

## 6) MODULOS MVP (IMPLEMENTAR)

## 6.1 Dashboard

KPIs obrigatorios:

- Clientes cadastrados
- Clientes ativos
- Indicacoes
- Conversoes
- Pontos emitidos
- Pontos resgatados
- Campanhas ativas

Graficos:

- Crescimento
- Conversoes
- Engajamento

## 6.2 Clientes

Cadastro com:

- Nome
- WhatsApp
- Email
- Data de cadastro
- Pontuacao

Funcionalidades:

- Cadastro manual
- Importacao CSV
- Busca avancada
- Filtros

## 6.3 Campanhas

Empresa cria campanha com:

- Nome
- Descricao
- Recompensa
- Quantidade de pontos
- Data inicio
- Data fim
- Status

Exemplo:

"Indique um amigo e ganhe 100 pontos."

## 6.4 Links de Indicacao

- Gerar automaticamente
- Codigo unico por cliente (por tenant)
- URL padrao Triggma

## 6.5 Pagina Publica de Captura (landing)

Exibir:

- Logo Triggma
- Logo Empresa
- Campanha
- Beneficios

Capturar:

- Nome
- WhatsApp
- Email

Botao CTA:

- Participar

## 6.6 Leads

Status:

- Novo
- Contatado
- Convertido
- Perdido

Requisito:

- Historico completo de mudancas de status

## 6.7 Conversoes

- Empresa marca manualmente lead convertido
- Sistema gera pontos automaticamente ao cliente indicador

## 6.8 Sistema de Pontos

Regra base configuravel por campanha:

- `1 conversao = N pontos`

Obrigatorio:

- Credito automatico na conversao
- Extrato de pontos (credito/debito)

## 6.9 Catalogo de Recompensas

Empresa cria:

- Produtos
- Servicos
- Descontos
- Beneficios

Campos:

- Nome
- Descricao
- Pontos necessarios
- Quantidade disponivel

## 6.10 Resgates

Cliente resgata recompensa e sistema gera:

- Voucher
- Codigo unico
- QR Code

Status:

- Disponivel
- Utilizado
- Expirado

## 6.11 Portal do Cliente

Login simplificado.

Exibir:

- Pontos
- Historico
- Recompensas
- Meu Link
- Meu QR Code

## 6.12 Ranking

Categorias:

- Mais indicacoes
- Mais conversoes
- Mais pontos

Niveis:

- Bronze
- Prata
- Ouro
- Diamante

## 6.13 Triggma Marketing

Criar modulo com biblioteca de campanhas prontas por categoria:

- Oficina
- Clinica
- Restaurante
- Academia
- Imobiliaria
- Energia Solar
- Assistencia Tecnica
- E-commerce

Cada categoria precisa de:

- Campanhas prontas
- Textos WhatsApp
- Textos Instagram
- Artes modelo
- Estrategias de divulgacao

---

## 7) ASSISTENTE IA (FASE FUTURA)

Preparar arquitetura para IA, mas **nao implementar IA complexa no MVP**.

Criar apenas estrutura/extensoes para futuro:

- Sugestao de campanhas
- Sugestao de recompensas
- Sugestao de promocoes
- Estrategias de retencao

---

## 8) COBRANCA SAAS

Usar **Mercado Pago** somente para assinatura da Triggma pela empresa.

Fluxo permitido:

- Empresa -> paga Triggma

Fluxo proibido:

- Cliente final pagar Triggma
- Pagamento de recompensas dentro da plataforma

---

## 9) SEGURANCA OBRIGATORIA

Implementar:

- HTTPS
- Logs estruturados
- Auditoria de eventos criticos
- Rate limiting
- Anti-spam
- Validacao de formularios (server-side)
- Protecao contra duplicidade de lead/cliente
- Isolamento estrito por tenant (`tenant_id` em todas entidades)

---

## 10) ARQUITETURA TECNICA (MULTI-TENANT)

Aplicar padrao:

1. Todas entidades de negocio com `tenant_id`
2. Todas queries filtradas por `tenant_id`
3. RBAC por perfil (super_admin, tenant_admin, tenant_user, customer)
4. Chaves unicas compostas por tenant para evitar colisoes
5. Auditoria para:
   - Criacao/edicao de campanha
   - Mudanca de status de lead
   - Conversao
   - Credito/debito de pontos
   - Criacao/uso de voucher

---

## 11) MODELO DE DADOS MINIMO (ENTIDADES)

Criar (ou equivalente) com os campos essenciais:

- Tenant
- TenantUser
- Customer
- Campaign
- ReferralLink
- Lead
- LeadStatusHistory
- Conversion
- PointLedger
- Reward
- Redemption
- RankingSnapshot
- MarketingTemplate
- Subscription
- AuditLog

Regras de negocio criticas:

1. Lead nao pode converter duas vezes.
2. Conversao credita pontos automaticamente.
3. Resgate so ocorre com saldo suficiente.
4. Voucher e unico por tenant.
5. Nao pode haver vazamento de dados entre empresas.

---

## 12) ORDEM DE IMPLEMENTACAO (BACKLOG EXECUTIVO)

### P0 (Core obrigatorio)

1. Fundacao multi-tenant + RBAC
2. Empresa e usuarios
3. Clientes (manual + CSV)
4. Campanhas
5. Links e QR de indicacao
6. Landing publica de captura
7. Leads + conversao manual
8. Pontos automaticos
9. Recompensas + resgates + voucher/QR
10. Portal do cliente

### P1 (Gestao e crescimento)

1. Dashboard KPI + graficos
2. Ranking
3. Triggma Marketing
4. Enforcamento de limites por plano

### P2 (Operacao e escala)

1. Assinatura Mercado Pago
2. Hardening de seguranca
3. Auditoria completa
4. Stubs de IA futura

---

## 13) TESTES OBRIGATORIOS (ANTES DE CONCLUIR MVP)

Executar testes de:

- Cadastro empresa
- Cadastro cliente
- Campanhas
- Links
- QR Code
- Leads
- Conversoes
- Pontos
- Resgates
- Ranking
- Assinaturas

Testes adicionais:

- Isolamento de tenant (nao pode cruzar dados)
- Rate limiting em endpoints publicos
- Anti-duplicidade de leads e clientes
- Responsividade desktop/tablet/mobile

---

## 14) CRITERIOS DE ACEITE FINAL

Ao terminar o MVP, uma empresa deve conseguir:

1. Cadastrar clientes
2. Criar campanha
3. Gerar links de indicacao
4. Captar novos clientes
5. Converter leads em vendas
6. Entregar pontos automaticamente
7. Fidelizar clientes
8. Gerar novas indicacoes
9. Acompanhar resultados no dashboard

Tudo isso dentro de uma plataforma SaaS simples, rapida, profissional e escalavel.

---

## 15) INSTRUCAO FINAL PARA O LOVABLE

Desenvolva o MVP completo da Triggma seguindo este documento como fonte oficial.

Priorize:

1. Simplicidade de uso
2. Fluxo fim a fim de indicacao -> conversao -> pontos -> resgate
3. Isolamento multi-tenant
4. Performance, seguranca e responsividade

Nao adicionar modulos fora do escopo antes de concluir os requisitos MVP acima.
