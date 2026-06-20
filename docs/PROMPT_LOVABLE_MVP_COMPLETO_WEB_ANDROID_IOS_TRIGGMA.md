# PROMPT MESTRE - MVP COMPLETO TRIGGMA (WEB + ANDROID + IOS)

> Cole este prompt inteiro no Lovable para executar o projeto completo sem baguncar o produto.

---

## MODO DE EXECUCAO (OBRIGATORIO)

Trabalhar em **MODO EXECUCAO CONTINUA**:

1. Nao pausar para perguntas intermediarias.
2. Nao dividir em etapas de aprovacao.
3. Nao voltar para brainstorm.
4. Reaproveitar tudo que ja esta no ar da Triggma e ajustar apenas o necessario.
5. Se faltar detalhe, assumir padrao SaaS seguro e simples.
6. Entregar resposta final unica com tudo implementado e testado.

---

## OBJETIVO DO PROJETO

Finalizar a Triggma como ferramenta:

- Rapida
- Pratica
- Facil de usar
- Escalavel
- Com marketing forte para atrair clientes

Entregar MVP completo para:

- Web (principal)
- Android
- iOS

Sem perder identidade Triggma e sem poluir a experiencia.

---

## DIRETRIZES DE PRODUTO (SEM BAGUNCA)

1. Interface limpa, moderna e objetiva.
2. Menos telas complexas, mais fluxo direto.
3. Reutilizar componentes para manter padrao visual.
4. Mobile-first sem quebrar desktop.
5. Sempre priorizar o fluxo principal:
   - cliente indicado -> lead -> conversao -> pontos -> resgate -> resultado.

---

## ESCOPO MVP OBRIGATORIO

## 1) AUTENTICACAO E LOGIN PROFISSIONAL

- Login profissional para:
  - Super Admin
  - Empresa
  - Cliente
- Google login 100% Triggma (sem referencia Lovable).
- Tela de login com branding Triggma.
- Recuperacao de senha segura.
- Sessao e redirecionamento corretos por perfil.

## 2) PAINEL EMPRESA (CORE)

- Dashboard com KPIs:
  - clientes cadastrados
  - clientes ativos
  - indicacoes
  - conversoes
  - pontos emitidos
  - pontos resgatados
  - campanhas ativas
- Graficos de crescimento, conversao e engajamento.

## 3) CLIENTES

- Cadastro manual
- Importacao CSV
- Busca/filtros
- Geracao automatica de:
  - link de indicacao
  - QR Code (PNG/SVG)

## 4) CAMPANHAS

- Criar/editar campanha
- Definir pontos por conversao
- Link curto de campanha
- QR da campanha

## 5) LINKS E QR TRIGGMA

Padroes:

- `/r/{codigo}`
- `/c/{campanha}`
- `/@{empresa}`

Regras:

- Geracao automatica
- Tracking de clique/leads/conversao
- QR com logo oficial Triggma

## 6) LEADS E CONVERSAO

- Captura de lead na pagina publica
- Status: novo, contatado, convertido, perdido
- Conversao manual
- Credito automatico de pontos ao indicador

## 7) RECOMPENSAS E RESGATES

- Catalogo de recompensas
- Resgate por pontos
- Gerar voucher + codigo unico + QR
- Status do resgate (disponivel, utilizado, expirado)

## 8) PORTAL DO CLIENTE

- Pontos atuais
- Historico de pontos
- Recompensas
- Meu link
- Meu QR
- Ranking

## 9) PLANOS E ASSINATURA

Manter planos e tornar gerenciavel no admin:

- Inicia: R$ 99,00
- Media Empresa: R$ 249,90
- Media Grande: R$ 499,99
- Empresa Nacional: A consultar

Regras:

- Sem fidelidade (mostrar no site)
- Trial 14 dias
- Bloqueio controlado apos trial
- Reativacao automatica apos pagamento aprovado

## 10) CHECKOUT MERCADO PAGO

- Ativar checkout de assinatura
- Rotas de retorno:
  - success
  - pending
  - failure
- Webhook com idempotencia
- Atualizacao automatica de status da assinatura no painel
- Testes fim a fim obrigatorios

## 11) MODULO TRIGGMA MARKETING (BONUS ASSINANTE)

- Biblioteca de dicas e estrategias prontas para empresa
- Plano de conteudo: 3x por semana
- Area bonus Telegram para assinantes
- Conteudos por segmento (oficina, clinica, restaurante etc.)

## 12) SUPORTE E CONFIANCA

- FAQ
- Botao de WhatsApp
- Contato suporte
- Paginas legais publicas:
  - politica de privacidade
  - termos de uso

## 13) RODAPE E MARCA

- Inserir links:
  - Instagram
  - Facebook
  - YouTube
  - Telegram
  - LinkedIn
- Tudo editavel no painel admin.

---

## WEB + ANDROID + IOS (ARQUITETURA DE ENTREGA)

Implementar com base unica de produto:

1. Web responsivo completo.
2. PWA instalavel para uso mobile imediato.
3. Build/app wrappers para Android e iOS com mesmas funcionalidades principais.
4. Navegacao e layout adaptados por dispositivo sem duplicar regras de negocio.

Obrigatorio:

- Nao baguncar a UX entre plataformas.
- Mesma identidade e mesmo fluxo principal.

---

## PERFORMANCE E ESCALABILIDADE

Aplicar:

- Cache de consultas criticas
- Paginacao nas listas
- Lazy load em telas pesadas
- Otimizacao de queries/indices
- Logs estruturados + auditoria
- Rate limit e anti-spam
- Multi-tenant rigoroso por tenant_id

---

## TESTES FINAIS OBRIGATORIOS (ANTES DE ENCERRAR)

1. Login por perfil
2. Fluxo completo indicacao -> lead -> conversao -> pontos -> resgate
3. Links e QR funcionando em mobile
4. Trial 14 dias -> bloqueio -> assinatura -> desbloqueio
5. Checkout Mercado Pago (success/pending/failure)
6. Webhook atualizando assinatura
7. Responsividade desktop/tablet/mobile
8. Verificacao Android/iOS/PWA

Se falhar qualquer item, corrigir e retestar.

---

## FORMATO DE ENTREGA FINAL (RESPOSTA UNICA)

Entregar:

1. O que foi implementado e ajustado
2. Lista de telas/arquivos alterados
3. Resultado dos testes por modulo
4. Status de web, android e ios
5. Status do checkout Mercado Pago
6. Pendencias reais (somente bloqueios inevitaveis)

Nao fazer perguntas abertas.
Nao encerrar sem concluir o escopo.
