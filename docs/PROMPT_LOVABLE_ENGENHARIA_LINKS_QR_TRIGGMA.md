# Prompt Lovable - Engenharia de Links + QR Triggma (Execucao Continua)

Cole todo este prompt no Lovable:

```txt
MODO EXECUÇÃO CONTÍNUA (SEM PAUSAS / SEM PERGUNTAS)
Execute tudo abaixo sem pedir confirmação intermediária, sem dividir em etapas de aprovação e sem parar no meio. Se faltar detalhe, assuma padrão SaaS seguro e continue.

OBJETIVO
Implementar engenharia completa de links personalizados Triggma para assinantes (empresas), com geração automática de QR Code com logo Triggma e tracking fim a fim.

DOMÍNIO E BRANDING
- Domínio oficial: triggma.com.br
- Logo oficial do QR/link preview: triggma-logo-icon.svg (marca Triggma)
- Remover qualquer vestígio visual de marca externa no fluxo público.

PADRÕES DE LINKS (MVP)
1) Cliente: /r/{codigo}
2) Campanha: /c/{campanha}
3) Empresa: /@{empresa}
4) Recompensa: /g/{recompensa}

EXEMPLOS
- https://triggma.com.br/r/ana23
- https://triggma.com.br/c/indique100
- https://triggma.com.br/@oficinaalpha
- https://triggma.com.br/g/desconto50

IMPLEMENTAÇÃO OBRIGATÓRIA
1. Multi-tenant rigoroso por tenant_id.
2. No cadastro de cliente: gerar referral_code único + link + QR (PNG/SVG) automático.
3. Na criação de campanha: gerar slug único + link + QR (PNG/SVG) automático.
4. Criar área no painel da empresa para:
   - copiar link
   - baixar QR PNG
   - baixar QR SVG
5. Rotas públicas funcionando:
   - /r/:code
   - /c/:slug
   - /g/:slug
   - /@:tenant
6. Captura de leads com atribuição ao cliente indicador.
7. Conversão manual de lead com crédito automático de pontos.
8. Dashboard com cliques, leads e conversões por link/campanha.

BANCO / REGRAS
- Tabelas mínimas: referral_links, qr_assets, link_events (além das tabelas já existentes de tenant, customer, campaign, lead, conversion).
- Unicidade por tenant para referral_code e slug.
- Proibir dupla conversão da mesma lead.
- Persistir tracking (utm, source, click_id) quando aplicável.

QR CODE COM LOGO
- Correção de erro alta (nível H).
- Logo Triggma central.
- Exportar PNG e SVG.
- Validar leitura em Android e iOS.

SEGURANÇA
- Validação server-side
- Rate limiting em endpoints públicos
- Anti-spam no formulário de lead
- Auditoria e logs de eventos críticos

PERFORMANCE
- Cache para resolução de slug (/r e /c)
- CDN/storage para arquivos QR
- Paginação nas listagens do painel
- Otimização de consultas de eventos e leads

TESTES OBRIGATÓRIOS
1. Criar 100 clientes e garantir links únicos.
2. Testar leitura QR em mobile.
3. Clique em link -> captura lead -> conversão -> pontos.
4. Confirmar isolamento entre tenants.
5. Testar download PNG/SVG no painel.

SAÍDA FINAL (ÚNICA)
Entregar:
1) O que foi implementado
2) Arquivos/telas alterados
3) Resultado dos testes
4) Pendências reais (somente bloqueios inevitáveis)
Não fazer perguntas abertas.
```
