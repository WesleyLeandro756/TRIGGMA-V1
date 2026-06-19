# PROMPT LOVABLE - LANCAMENTO MVP TRIGGMA (EXECUCAO CONTINUA)

> Cole este prompt inteiro no Lovable para executar tudo sem pausas e sem perguntas intermediarias.

---

## MODO OBRIGATORIO DE EXECUCAO

Voce esta em **MODO EXECUCAO CONTINUA**.

Regras:

1. Nao pausar para pedir confirmacao.
2. Nao perguntar "deseja que eu continue?".
3. Nao quebrar em etapas de aprovacao.
4. Se faltar detalhe, assumir default SaaS seguro e continuar.
5. Corrigir erros automaticamente e seguir.
6. Entregar apenas resultado final consolidado.
7. Minimizar mensagens intermediarias para reduzir consumo de creditos.

---

## CONTEXTO

Projeto: **Triggma Growth V1**.

As chaves de API ja foram conectadas.  
Seu trabalho e validar tudo, corrigir falhas e deixar o sistema pronto para lancamento.

---

## OBJETIVO PRINCIPAL

Fazer revisao tecnica completa do app web + app cliente, corrigir erros, melhorar UX/UI, ativar regras de assinatura/cupom e deixar ambiente pronto para go-live.

---

## ESCOPO FECHADO (EXECUTAR TUDO)

## 1) TESTE E VALIDACAO GERAL (FIM A FIM)

Validar todos os fluxos:

- Autenticacao e autorizacao (Super Admin, Empresa, Cliente)
- Cadastro e importacao de clientes
- Campanhas
- Links de indicacao + QR Code
- Landing publica e captura de lead
- Leads e mudanca de status
- Conversao manual
- Credito automatico de pontos
- Catalogo de recompensas
- Resgates (voucher + codigo + QR + status)
- Dashboard e ranking
- Assinatura SaaS

Se houver erro, corrigir e retestar automaticamente.

## 2) VALIDACAO DAS INTEGRACOES/API

Testar e confirmar funcionamento das integracoes configuradas no projeto (sem expor segredos):

- Resend (envio de e-mail e webhooks)
- Mercado Pago (assinatura da empresa)
- Banco de dados
- Auth/session
- Outras APIs existentes no projeto

Criar fallback e tratamento de erro para indisponibilidade de API.

## 3) CUPONS E TRIAL

Implementar regra comercial:

1. **Trial gratis padrao de 15 dias** para novas empresas.
2. Criar cupom: **TRG11**
3. Regra do cupom TRG11: adiciona **+15 dias gratis** ao trial/assinatura conforme politica.
4. Exibir campo de cupom no checkout/assinatura.
5. Validar cupom com seguranca:
   - opcao de limite de uso global
   - opcao de 1 uso por tenant
   - data de expiracao configuravel
6. Registrar uso do cupom em auditoria.

## 4) CUPONS DE DESCONTO DE ASSINATURA

Criar estrutura para cupons promocionais em assinaturas:

- percentual ou valor fixo
- validade
- limite de uso
- status (ativo/inativo/expirado)
- aplicacao no plano selecionado

## 5) MELHORIAS DE UX/UI E ESTETICA

Melhorar qualidade visual do Web MVP e app:

- Interface moderna, limpa e profissional
- Hierarquia visual clara
- Melhor contraste e legibilidade
- Componentes consistentes
- Melhorias em dashboard, onboarding e paginas de conversao

Branding:

- Manter identidade Triggma
- Deixar logo com apresentacao mais profissional e simplificada (sem descaracterizar marca)

## 6) PERFORMANCE E EFICIENCIA

Aplicar melhorias de performance:

- reduzir carregamentos desnecessarios
- otimizar consultas e renderizacao
- melhorar tempo de resposta nas telas principais
- garantir boa experiencia em mobile

## 7) SUPORTE E AJUDA AO USUARIO

Criar secao profissional de ajuda:

- "Duvidas frequentes" (FAQ)
- "Como funciona" (instrucao curta de uso)
- "Suporte via WhatsApp" com botao visivel
- Link configuravel do WhatsApp no painel admin

## 8) PAINEL ADMIN TRIGGMA

Revisar e finalizar painel admin para operacao real:

- gestao de empresas/tenants
- planos e assinaturas
- controle de cupons
- visao de suporte/clientes
- logs e auditoria

Garantir que o admin consiga operar sem depender de desenvolvimento.

## 9) SEGURANCA E CONFIABILIDADE

Garantir:

- validacao server-side
- rate limiting em endpoints publicos
- anti-spam
- anti-duplicidade de cadastro/lead
- isolamento multi-tenant por tenant_id
- logs estruturados de erro

---

## TESTES OBRIGATORIOS ANTES DE FINALIZAR

Executar bateria final de testes e corrigir:

1. Fluxo completo empresa -> campanha -> lead -> conversao -> pontos -> resgate
2. Fluxo completo de assinatura com trial e cupom TRG11
3. Aplicacao de cupom de desconto em assinatura
4. Funcao de suporte via WhatsApp
5. Responsividade desktop/tablet/mobile

---

## CONTRATO DE ENTREGA (RESPOSTA FINAL UNICA)

Ao finalizar, devolver apenas:

1. Resumo do que foi implementado/corrigido
2. Lista objetiva de arquivos/telas alterados
3. Resultado dos testes finais
4. Status das APIs (ok/falha corrigida/pendente externo)
5. Regras finais de trial e cupom ativas
6. Pendencias reais (somente bloqueios inevitaveis)

Nao devolver perguntas abertas.
Nao devolver plano sem execucao.
Nao encerrar sem concluir todo o escopo.

---

## COMANDO CURTO DE RETOMADA (SE PAUSAR)

`Continue exatamente de onde parou, sem perguntas e sem etapas de aprovacao. Corrija automaticamente qualquer erro e finalize todo o escopo restante.`
