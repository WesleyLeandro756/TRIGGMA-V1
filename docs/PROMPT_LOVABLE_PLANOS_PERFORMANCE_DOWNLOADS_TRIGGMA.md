# PROMPT LOVABLE - PLANOS, PERFORMANCE, DOWNLOADS E LANCAMENTO MVP

> Cole este prompt inteiro no Lovable para executar sem pausas e concluir tudo.

---

## MODO DE EXECUCAO (OBRIGATORIO)

Ativar **MODO EXECUCAO CONTINUA**:

1. Nao pedir confirmacao entre etapas.
2. Nao pausar com "posso continuar?".
3. Nao devolver apenas plano; executar e entregar.
4. Se faltar detalhe, assumir padrao SaaS seguro.
5. Corrigir erros automaticamente e seguir.
6. Entregar resposta final unica e consolidada.

---

## OBJETIVO

Finalizar o Triggma para lancamento com:

- Login admin robusto
- Planos comerciais configurados e ajustaveis no painel
- Performance melhor (mais rapido)
- Pacotes/downloads de versao MVP para Android, iOS e notebook/desktop
- Rodape com redes sociais
- Teste final completo com funcionalidades habilitadas

---

## 1) LOGIN ADMIN (OBRIGATORIO)

Implementar/ajustar tela de login admin:

- Rota exclusiva: `/admin/login`
- Campos: email + senha
- Validacao server-side
- Protecao de tentativa (rate limit e lock temporario)
- Recuperacao de senha segura
- Sessao e permissao por perfil (somente admin acessa painel admin)
- Auditoria de login (sucesso/falha, horario, usuario)

---

## 2) PLANOS COMERCIAIS (4 PLANOS)

Criar e exibir no site e no billing:

1. **Inicia (Pequenas Empresas)** - `R$ 99,00`
2. **Media Empresa** - `R$ 249,90`
3. **Media Grande** - `R$ 499,99`
4. **Empresa Nacional** - `A consultar`

Regras:

- Todos os planos devem ser **ajustaveis pelo painel admin** (preco, nome, descricao, beneficios, status).
- Plano "A consultar" deve permitir:
  - texto livre ("A consultar")
  - opcional de valor numerico interno
  - botao de contato comercial
- Criar tela admin para editar planos sem deploy.

---

## 3) ASSINATURA, TRIAL E CUPOM

Implementar:

- Trial MVP de 14 dias
- Apos fim do trial: bloqueio controlado ate assinatura ativa
- Integracao de assinatura (Mercado Pago) para empresa -> Triggma
- Campo de cupom no checkout
- Suporte a cupons de desconto e cupons de dias extras

Cupom obrigatorio inicial:

- `TRG11` = adicionar +15 dias gratis

---

## 4) PERFORMANCE (SITE/APP MAIS RAPIDO)

Otimizar para reduzir lentidao:

- reduzir chamadas repetidas de API
- cache para dados estaveis
- paginacao em listas grandes
- lazy loading em telas pesadas
- otimizar consultas e indices
- reduzir bundle/asset desnecessario
- melhorar tempo de carregamento inicial

Entregar medicao antes/depois nas paginas principais.

---

## 5) DOWNLOADS MVP (ANDROID / IOS / NOTEBOOK)

Criar area "Downloads" no site e no painel:

- Botao baixar Android (APK/AAB)
- Botao baixar iOS (IPA/TestFlight link quando aplicavel)
- Botao versao notebook/desktop (instalador ou PWA instalavel)

Regras:

- Gerar e disponibilizar artefatos atualizados
- Mostrar versao/build/date em cada download
- Se iOS exigir publicacao externa, exibir instrucoes claras de distribuicao
- Garantir fallback para PWA instalavel em desktop/notebook

---

## 6) RODAPE COM REDES SOCIAIS

Adicionar no rodape do site:

- Instagram
- Facebook
- YouTube
- Telegram
- LinkedIn

Regras:

- Links editaveis pelo admin/settings
- Abrir em nova aba
- Manter layout profissional e responsivo

---

## 7) UX/UI PROFISSIONAL

Melhorar visual geral sem descaracterizar Triggma:

- design moderno e limpo
- tipografia e contraste melhores
- CTA claros para assinatura
- paginas mais completas e persuasivas
- navegacao simples em mobile e desktop

---

## 8) TESTES FINAIS (OBRIGATORIO)

Executar e corrigir ate passar:

1. Login admin e permissao
2. CRUD e edicao de planos no admin
3. Exibicao de planos no site e checkout
4. Trial 14 dias + bloqueio + assinatura
5. Aplicacao cupom TRG11
6. Fluxo fim a fim (cliente -> campanha -> lead -> conversao -> pontos -> resgate)
7. Links de downloads Android/iOS/notebook
8. Rodape com redes sociais
9. Responsividade desktop/tablet/mobile
10. Performance das telas principais

---

## FORMATO DE ENTREGA FINAL (RESPOSTA UNICA)

Retornar somente:

1. Resumo do que foi implementado
2. Lista de arquivos/telas alterados
3. Resultado dos testes
4. Status de downloads por plataforma (android/ios/notebook)
5. Status dos planos e configuracao admin
6. Pendencias reais (apenas bloqueios inevitaveis)

Nao parar no meio.
Nao fazer perguntas abertas.
