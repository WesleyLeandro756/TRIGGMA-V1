# Arquitetura SaaS Multi-Tenant - Triggma Growth V1

## 1. Principios arquiteturais

- Isolamento logico de dados por tenant (empresa)
- Escalabilidade horizontal por modulo
- Observabilidade nativa (logs, auditoria, metricas)
- Seguranca por padrao (secure by default)
- Simplicidade operacional para MVP

## 2. Camadas do sistema

1. **Camada de apresentacao**
   - Painel Super Admin
   - Painel Empresa
   - Portal Cliente
   - Landing pages publicas de campanhas/indicacao
2. **Camada de aplicacao**
   - Servicos de dominio (clientes, campanhas, leads, pontos, resgates, ranking)
   - Servico de billing SaaS (Mercado Pago)
   - Servico de QR Code
3. **Camada de dados**
   - Banco relacional multi-tenant
   - Armazenamento de midias (logos, artes, assets)
   - Tabela de auditoria e trilha de eventos

## 3. Estrategia de tenant

## 3.1 Chave de tenant

Toda entidade transacional deve carregar:

- `tenant_id` (obrigatorio)

## 3.2 Isolamento de dados

- Filtro obrigatorio por `tenant_id` em todas as consultas
- Chaves unicas compostas com `tenant_id` para evitar colisoes entre empresas
- Validacoes de acesso no backend e nao apenas no frontend

## 3.3 Controle de acesso (RBAC)

- `super_admin`
- `tenant_admin` (empresa)
- `tenant_user` (colaborador empresa)
- `customer` (cliente final)

## 4. Modulos de dominio (MVP)

1. **Tenant & Assinatura**
   - Cadastro de empresa
   - Plano atual
   - Limites por plano
2. **Clientes**
   - CRUD, importacao CSV, busca e filtros
3. **Campanhas**
   - CRUD e ciclo de vida
4. **Indicacao e landing publica**
   - Link unico, captura de lead, anti-duplicidade
5. **Leads e Conversoes**
   - Pipeline de status e conversao manual
6. **Pontos**
   - Credito automatico por conversao
   - Extrato de pontos
7. **Recompensas e Resgates**
   - Catalogo, voucher, QR Code e status do resgate
8. **Ranking**
   - Classificacao periodica por tenant
9. **Triggma Marketing**
   - Biblioteca de campanhas prontas por segmento

## 5. Fluxo principal do produto

1. Empresa cria campanha com regra de pontos
2. Cliente recebe link/QR de indicacao
3. Lead preenche pagina publica e entra no funil
4. Empresa marca lead como convertido
5. Sistema credita pontos automaticamente ao cliente indicador
6. Cliente usa pontos para resgate
7. Sistema gera voucher + QR Code do resgate

## 6. Cobranca SaaS (escopo MVP)

- Integracao com Mercado Pago para assinatura da empresa
- Sem checkout para cliente final
- Sem pagamento de recompensa para cliente final

## 7. Seguranca e compliance tecnico

## 7.1 Controles obrigatorios

- TLS/HTTPS em todos os ambientes
- Rate limiting por IP e por endpoint publico
- Validacao server-side de formularios
- Idempotencia para endpoints sensiveis (conversao e resgate)
- Protecao anti-spam em formularios publicos

## 7.2 Auditoria

Auditar eventos como:

- Criacao/edicao de campanha
- Mudanca de status de lead
- Conversao de lead
- Credito/debito de pontos
- Criacao/utilizacao/expiracao de voucher

## 8. Observabilidade

- Logs estruturados com `tenant_id`, `user_id`, `trace_id`
- Painel de erro e latencia por modulo
- Alertas para falhas de conversao e inconsistencias de pontos

## 9. Preparacao para IA futura

Criar interfaces e pontos de extensao, sem IA complexa no MVP:

- `campaign_recommendation_provider`
- `reward_recommendation_provider`
- `retention_strategy_provider`

Implementacao inicial: stubs com respostas neutras e sem impacto no fluxo principal.
