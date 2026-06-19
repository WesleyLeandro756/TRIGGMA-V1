# Engenharia Completa - Links Personalizados + QR com Logo Triggma (Lovable)

## 1) Objetivo

Implementar no Triggma um sistema de links curtos, personalizados por empresa e cliente, com geracao automatica de QR Code com logo Triggma central, para uso por assinantes (empresas) dentro de arquitetura SaaS multi-tenant.

Resultado esperado:

1. Cada cliente recebe link unico automaticamente.
2. Cada campanha gera link publico automaticamente.
3. Cada link possui QR Code em PNG e SVG.
4. Tudo aparece no painel da empresa sem operacao manual.
5. Tracking completo de cliques, leads e conversoes.

---

## 2) Padrao de URLs (recomendado para MVP)

## 2.1 Link de indicacao do cliente (principal)

- `https://triggma.com.br/r/{codigo}`

Exemplo:

- `https://triggma.com.br/r/ana23`

## 2.2 Link de campanha publica

- `https://triggma.com.br/c/{campanha}`

Exemplo:

- `https://triggma.com.br/c/indique100`

## 2.3 Link institucional da empresa (branding)

- `https://triggma.com.br/@{empresa}`

Exemplo:

- `https://triggma.com.br/@oficinaalpha`

## 2.4 Link de recompensa

- `https://triggma.com.br/g/{recompensa}`

Exemplo:

- `https://triggma.com.br/g/desconto50`

---

## 3) Arquitetura de dados (multi-tenant)

Entidades minimas:

1. `tenants`
   - `id`, `name`, `slug`, `plan`, `status`
2. `customers`
   - `id`, `tenant_id`, `name`, `email`, `whatsapp`, `referral_code`
3. `campaigns`
   - `id`, `tenant_id`, `name`, `slug`, `status`, `points_per_conversion`
4. `referral_links`
   - `id`, `tenant_id`, `customer_id`, `campaign_id`, `slug`, `short_url`, `active`
5. `qr_assets`
   - `id`, `tenant_id`, `entity_type`, `entity_id`, `png_url`, `svg_url`, `version`
6. `link_events`
   - `id`, `tenant_id`, `link_id`, `event_type`, `ip_hash`, `user_agent`, `utm_json`, `created_at`
7. `leads`
   - `id`, `tenant_id`, `campaign_id`, `referrer_customer_id`, `name`, `email`, `whatsapp`, `status`
8. `conversions`
   - `id`, `tenant_id`, `lead_id`, `campaign_id`, `referrer_customer_id`, `converted_at`

Indices obrigatorios:

- Unico (`tenant_id`, `referral_code`)
- Unico (`tenant_id`, `campaign.slug`)
- Unico (`tenant_id`, `referral_links.slug`)
- Unico (`tenant_id`, `conversions.lead_id`) para evitar dupla conversao

---

## 4) Fluxo automatico (sem operacao manual)

## 4.1 Ao cadastrar cliente

1. Gerar `referral_code` unico no tenant.
2. Criar link `https://triggma.com.br/r/{codigo}`.
3. Gerar QR PNG/SVG com logo Triggma.
4. Salvar em `referral_links` + `qr_assets`.
5. Exibir em "Clientes > Link e QR" e no "Portal do Cliente".

## 4.2 Ao criar campanha

1. Gerar `slug` unico da campanha.
2. Criar link publico `/c/{campanha}`.
3. Gerar QR da campanha com:
   - Logo Triggma no centro
   - Nome da empresa
   - Nome da campanha
4. Exibir em "Campanhas > Compartilhar".

## 4.3 Ao clicar no link

1. Resolver slug -> tenant + origem.
2. Registrar `link_events` (click/view).
3. Redirecionar para landing publica.
4. Preservar UTM e source para atribuicao.

## 4.4 Ao captar lead

1. Salvar lead com referencia do `referrer_customer_id`.
2. Aplicar anti-duplicidade por email/whatsapp.
3. Atualizar funil da empresa.

## 4.5 Ao converter lead

1. Garantir idempotencia (uma conversao por lead).
2. Creditar pontos automaticos ao cliente indicador.
3. Atualizar dashboard e ranking.

---

## 5) Engenharia do QR Code com logo Triggma

## 5.1 Requisitos visuais

- Logo central: `branding/triggma-logo-icon.svg`
- Fundo limpo com contraste alto
- Exibir etiqueta de empresa e campanha abaixo (quando aplicavel)
- Exportacao obrigatoria:
  - PNG
  - SVG

## 5.2 Regras tecnicas

1. Gerar QR com nivel de correcao alto (ex: H) para suportar logo central.
2. Logo ocupar no maximo ~18% da area util do QR.
3. Incluir margem silenciosa (quiet zone) padrao.
4. Versionar assets em `qr_assets.version` ao mudar URL/identidade.
5. Testar leitura em Android e iOS antes de publicar.

## 5.3 Pipeline de geracao

1. Receber URL final assinada pelo tenant.
2. Gerar QR base.
3. Aplicar logo Triggma ao centro.
4. Renderizar PNG e SVG.
5. Salvar em storage/CDN.
6. Retornar URLs no painel.

---

## 6) Telas no painel da empresa (assinante)

## 6.1 Clientes

Colunas:

- Nome
- WhatsApp
- Pontos
- Meu Link
- Meu QR (acoes: baixar PNG/SVG, copiar link)

## 6.2 Campanhas

Bloco "Compartilhar campanha":

- URL da campanha
- QR da campanha
- Copiar link
- Download PNG/SVG

## 6.3 Dashboard

KPIs de links:

- Cliques por periodo
- Leads por link
- Conversao por campanha
- Top clientes por indicacao

## 6.4 Configuracoes

- Dominio principal usado (`triggma.com.br`)
- Logo em QR (fixa Triggma + opcional empresa)
- Parametros UTM padrao

---

## 7) API/Endpoints sugeridos

## 7.1 Empresa (autenticado)

- `POST /api/customers`
  - cria cliente + gera link/QR automatico
- `POST /api/campaigns`
  - cria campanha + gera link/QR automatico
- `GET /api/customers/:id/referral-link`
- `GET /api/campaigns/:id/share`
- `POST /api/qr/regenerate`
  - regenera QR em caso de ajuste visual

## 7.2 Publico

- `GET /r/:code`
- `GET /c/:slug`
- `GET /g/:slug`
- `GET /@:tenant`
- `POST /public/leads`

## 7.3 Eventos

- `POST /api/events/link-click`
- `POST /api/events/link-view`

Todos com validacao e rate limiting.

---

## 8) Seguranca e confiabilidade

Obrigatorio:

1. Isolamento por `tenant_id` em todas queries.
2. Validacao server-side de todos inputs.
3. Rate limit em endpoints publicos.
4. Anti-spam e anti-bot no formulario de lead.
5. Idempotencia em conversoes e pontuacao.
6. Logs estruturados + auditoria de eventos criticos.

---

## 9) Performance

1. Cache de resolucao de slug (`/r`, `/c`, `/g`).
2. CDN para QR PNG/SVG.
3. Escrita assíncrona de eventos de clique (fila).
4. Paginacao no painel em listas grandes.
5. Indices adequados nas tabelas de links/eventos/leads.

---

## 10) Ordem de implantacao no Lovable

1. Criar tabelas e indices.
2. Implementar servico de slug unico por tenant.
3. Implementar geracao QR com logo Triggma.
4. Implementar rotas publicas (`/r`, `/c`, `/g`, `/@tenant`).
5. Implementar captura de leads com tracking.
6. Implementar auto-pontos na conversao.
7. Conectar painel empresa (clientes/campanhas/dashboard).
8. Aplicar seguranca e rate limit.
9. Testes fim a fim.
10. Publicacao.

---

## 11) Testes obrigatorios de aceite

1. Gerar 100 links de clientes sem colisao.
2. Ler QR em Android/iOS para todos modelos.
3. Capturar lead via link e atribuir ao cliente correto.
4. Converter lead e creditar pontos automaticamente.
5. Validar isolacao entre 2 tenants diferentes.
6. Testar fallback para slug inativo/invalido.
7. Testar downloads PNG/SVG no painel.

---

## 12) Definicao de pronto

Implantacao pronta quando:

1. Links/QR sao gerados automaticamente no cadastro.
2. Empresa consegue copiar e baixar tudo no painel.
3. Tracking e conversao funcionam fim a fim.
4. Logo Triggma aparece corretamente em links compartilhados e QR.
5. Fluxo e estavel em web e mobile.
