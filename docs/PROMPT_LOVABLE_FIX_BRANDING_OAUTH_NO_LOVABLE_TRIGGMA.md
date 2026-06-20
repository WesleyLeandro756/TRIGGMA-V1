# Prompt Lovable - Correcao Definitiva de Branding/OAuth (Sem Lovable Visivel)

Cole este prompt inteiro no Lovable:

```txt
MODO EXECUÇÃO CONTÍNUA (SEM PAUSAS / SEM PERGUNTAS)
Executar tudo sem pedir confirmação intermediária. Não dividir em etapas de aprovação. Corrigir erros automaticamente e entregar apenas resultado final consolidado.

CONTEXTO
A Triggma já está no ar, mas ainda aparece referência “Lovable” para usuários:
- badge/overlay "Edit with Lovable"
- tela Google OAuth mostrando “Prosseguir para Lovable” em alguns aparelhos
Objetivo: remover 100% qualquer referência Lovable para usuário final.

OBJETIVO FINAL
Fluxo 100% Triggma:
Landing Triggma -> Login Triggma -> Painel Triggma -> Assinatura -> Checkout Mercado Pago
Sem qualquer texto, logo, domínio, script, redirecionamento ou client_id de Lovable.

TAREFAS OBRIGATÓRIAS

1) REMOÇÃO VISUAL LOVABLE (FRONTEND)
- Remover script/widget/badge "Edit with Lovable" de todas as páginas públicas e autenticadas.
- Revisar layout global (footer, floating buttons, scripts de injeção, snippets de preview).
- Confirmar que não existe string “Lovable” no HTML renderizado em produção.
- Garantir que branding é exclusivamente Triggma.

2) GOOGLE OAUTH 100% TRIGGMA
- Confirmar uso de GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET da Triggma (não do Lovable).
- Ajustar callback URLs para domínio triggma.com.br.
- Revisar configuração do provedor auth (Supabase/Firebase/back-end) para remover IDs antigos.
- Garantir que na tela do Google apareça “Prosseguir para Triggma”.
- Validar em 3 cenários: navegador limpo, anônimo e celular.

3) DOMÍNIO E REDIRECIONAMENTOS
- Revisar canonical/base URL para triggma.com.br.
- Remover redirects para domínios de preview/editor.
- Bloquear acesso de usuário final a URLs internas de edição.
- Forçar rotas de autenticação e app para domínio principal.

4) VARIÁVEIS E CHAVES (PRODUÇÃO)
- Verificar que todas as credenciais usadas em produção são da Triggma:
  - Auth
  - Mercado Pago
  - Resend/Email
  - Webhooks
- Não expor segredos no frontend.
- Confirmar leitura correta de env por ambiente.

5) FLUXO ASSINATURA -> CHECKOUT MERCADO PAGO
- Garantir botão assinar redirecionando corretamente ao checkout Mercado Pago.
- Testar retorno:
  - success
  - pending
  - failure
- Confirmar atualização de status da assinatura no painel.
- Validar webhook e idempotência.

6) TESTE FIM A FIM (OBRIGATÓRIO)
Executar e corrigir:
- Home sem vestígios Lovable
- Login Google sem “Prosseguir para Lovable”
- Login em 3 dispositivos (incluindo mobile)
- Navegação completa até painel do assinante
- Assinatura e checkout Mercado Pago funcionando
- Logout e novo login consistentes

7) HARDENING
- Rate limit em endpoints de auth
- Logs/auditoria para login e assinatura
- Tratamento de erro amigável no fluxo de login

SAÍDA FINAL (UMA ÚNICA RESPOSTA)
Entregar:
1. Lista de correções aplicadas
2. Arquivos/telas alterados
3. Evidências dos testes em web e mobile
4. Confirmação explícita: “Não há mais referência Lovable para usuários finais”
5. Pendências reais (somente bloqueios inevitáveis)
Sem perguntas abertas.
```
