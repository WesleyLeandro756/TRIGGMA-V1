# PROMPT LOVABLE - UPGRADE PROFISSIONAL (SITE + APP + ADMIN + SUPORTE)

> Cole este prompt inteiro no Lovable para executar sem pausas e elevar o Triggma para padrao de lancamento comercial.

---

## MODO DE EXECUCAO (OBRIGATORIO)

Ative **MODO EXECUCAO CONTINUA**:

1. Nao pedir confirmacao entre etapas.
2. Nao pausar com perguntas abertas.
3. Nao dividir em "proximos passos" sem executar.
4. Se faltar detalhe, assumir default SaaS seguro e continuar.
5. Corrigir automaticamente erros e seguir.
6. Entregar uma resposta final consolidada.

---

## CONTEXTO

Produto: **Triggma Growth V1**  
Objetivo: transformar o site atual em maquina de conversao e deixar o painel admin pronto para suporte e operacao real.

---

## META PRINCIPAL

Deixar o projeto pronto para lancamento com:

- Site marketing forte e convincente
- Fluxo claro de assinatura e trial
- FAQ, suporte e WhatsApp
- Reconhecimento de dispositivo (web/app)
- Painel admin robusto para suporte a clientes
- Revisao e correcao completa do produto

---

## 1) AUDITORIA E CORRECAO FIM A FIM

Revisar todo o produto e corrigir erros:

- Autenticacao e permissao por perfil (Super Admin, Empresa, Cliente)
- Clientes, campanhas, links e QR
- Leads, conversoes, pontos, resgates
- Dashboard, ranking e portal do cliente
- Assinatura e bloqueio apos trial

Executar testes de fluxo completo e corrigir automaticamente.

---

## 2) SITE MARKETING DE ALTA CONVERSAO (REFAZER ESTRUTURA)

Construir/ajustar homepage com estrutura comercial forte:

1. Hero claro com promessa de valor.
2. Subheadline com resultado de negocio.
3. CTA primario ("Comecar teste gratis 14 dias") e secundario ("Ver demo").
4. Bloco "Como funciona em 3 passos".
5. Bloco de beneficios por segmento (oficina, clinica, restaurante etc).
6. Bloco de funcionalidades principais (indicacao, QR, pontos, resgate, ranking).
7. Bloco de ROI/resultado (simulador simples).
8. Bloco de prova social (depoimentos e logos placeholders se necessario).
9. Bloco de comparativo "sem Triggma x com Triggma".
10. Bloco de planos e precos.
11. FAQ completo.
12. Rodape profissional com contato, termos e privacidade.

Copywriting:

- Linguagem direta para donos de negocio no Brasil
- Foco em: atrair clientes novos + manter clientes atuais
- Mostrar ganho financeiro e recorrencia

---

## 3) PLANOS, TRIAL E ASSINATURA

Implementar parte comercial completa:

1. Trial gratis de **14 dias**.
2. Ao fim do trial: bloqueio controlado (somente leitura) ate assinatura.
3. Exibir planos no site:
   - Gratis
   - Starter
   - Business
   - Enterprise
4. Checkout de assinatura com Mercado Pago (empresa -> Triggma).
5. Regras de bloqueio/desbloqueio por status da assinatura.
6. Tela de billing no painel empresa (plano atual, renovacao, historico basico).

---

## 4) CUPONS

Implementar modulo de cupons de assinatura:

- Campo de cupom no checkout
- Cupom por percentual ou valor fixo
- Validade, limite total e limite por tenant
- Status ativo/inativo/expirado
- Registro de uso em auditoria

Cupom inicial obrigatorio:

- `TRG11`
- Comportamento: adicionar dias extras gratis conforme regra de negocio definida

---

## 5) DETECCAO WEB VS APP APOS LOGIN

Quando usuario logar, detectar dispositivo e oferecer experiencia correta:

1. **iOS**: mostrar banner/modal com botao "Baixar para iPhone" (link App Store).
2. **Android**: mostrar banner/modal "Baixar para Android" (link Play Store).
3. **Desktop/Notebook**: direcionar para versao web e opcao "instalar app" (PWA, se habilitado).
4. Permitir "nao mostrar novamente".
5. Configurar links de store via variaveis/setting admin para facilitar manutencao.

---

## 6) SUPORTE PROFISSIONAL (SITE + PRODUTO)

Implementar:

1. Botao flutuante de WhatsApp no site e no painel.
2. Pagina de suporte com:
   - FAQ
   - Guia rapido ("Primeiros passos")
   - Contato por WhatsApp
   - Canal de email
3. Tela de abertura de chamado (ticket) para clientes logados.

---

## 7) PAINEL ADMIN PARA SUPORTE OPERACIONAL

Criar/ajustar painel admin para time interno Triggma:

1. Lista de empresas (tenants) com busca e filtros.
2. Visualizar status de assinatura e trial por empresa.
3. Visualizar chamados/suporte por empresa.
4. Acoes de suporte:
   - responder chamado
   - alterar status/prioridade
   - registrar nota interna
5. Acesso assistido (impersonacao segura) com auditoria:
   - "Entrar como empresa" para diagnostico
   - registrar quem acessou, quando e motivo
6. Painel de auditoria (eventos criticos).

---

## 8) UX/UI E BRANDING PROFISSIONAL

Melhorar design sem descaracterizar marca:

- Visual premium, limpo e confiavel
- Melhor tipografia, contraste e espacamento
- Componentes consistentes
- CTA sempre visivel em pontos-chave
- Melhor navegacao mobile

Manter:

- Logo Triggma
- Paleta da marca
- Identidade existente

---

## 9) PERFORMANCE, SEO E CONFIANCA

Aplicar melhorias:

- Performance de carregamento (home e dashboard)
- SEO basico (title, description, OG tags)
- Paginas legais: termos, privacidade, contato
- Instrumentacao de eventos de conversao (ex: clique em CTA, inicio trial, assinatura)

---

## 10) SEGURANCA MINIMA OBRIGATORIA

Garantir:

- Validacao server-side
- Rate limiting
- Anti-spam
- Protecao contra duplicidade
- Isolamento multi-tenant por tenant_id
- Logs estruturados e auditoria

---

## TESTES OBRIGATORIOS ANTES DE ENCERRAR

1. Fluxo completo de onboarding ate assinatura.
2. Trial 14 dias -> expiracao -> bloqueio -> assinatura -> desbloqueio.
3. Aplicacao de cupom no checkout.
4. Botao WhatsApp e canais de suporte.
5. Fluxo admin de suporte e impersonacao auditada.
6. Responsividade em desktop/tablet/mobile.

---

## FORMATO DE ENTREGA FINAL (RESPOSTA UNICA)

Ao terminar, retornar:

1. Resumo do que foi implementado.
2. Lista de paginas/telas alteradas.
3. Status das integracoes e assinaturas.
4. Resultado dos testes.
5. Pendencias reais (somente bloqueios inevitaveis).

Nao retornar perguntas abertas.
Nao encerrar no meio.
