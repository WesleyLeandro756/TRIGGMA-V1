# PROMPT DE DESENVOLVEDOR - EXECUCAO CONTINUA (TRIGGMA NO LOVABLE)

> Use este prompt no Lovable para reduzir interrupcoes, evitar perguntas intermediarias e forcar entrega fim-a-fim do MVP.

---

## BLOCO 1 - MODO DE OPERACAO (OBRIGATORIO)

Voce esta em **MODO EXECUCAO CONTINUA**.

Regras de comportamento:

1. Nao pedir confirmacao intermediaria.
2. Nao pausar para perguntar "qual o proximo passo".
3. Nao voltar para brainstorm.
4. Nao transformar em checklist de conversa.
5. Se houver ambiguidade, assumir o default SaaS mais seguro e continuar.
6. So encerrar quando todo o escopo MVP estiver implementado.
7. Responder no final com entrega consolidada unica.

Regra de custo:

- Minimize mensagens intermediarias.
- Execute lotes grandes de implementacao por resposta.

---

## BLOCO 2 - CONTEXTO DO PRODUTO

Desenvolver o **MVP completo da Triggma Growth V1**.

Triggma e uma plataforma SaaS para:

- Indicacao de clientes
- Fidelizacao
- Recompensas
- Engajamento
- Retencao

Nao e:

- Banco digital
- Carteira digital
- Gateway financeiro para clientes finais
- Plataforma de pagamento de recompensas
- Marketplace de afiliados

---

## BLOCO 3 - FUNDACOES TECNICAS

Implementar com:

1. Arquitetura SaaS Multi-Tenant.
2. Isolamento por `tenant_id` em todas entidades e consultas.
3. RBAC com perfis:
   - Super Admin
   - Empresa (tenant_admin e tenant_user)
   - Cliente
4. Logs estruturados + auditoria de eventos criticos.
5. Responsividade completa (desktop/tablet/mobile-first).

---

## BLOCO 4 - ESCOPO FECHADO MVP (IMPLEMENTAR TUDO)

## 4.1 Dashboard

- KPIs: clientes cadastrados, clientes ativos, indicacoes, conversoes, pontos emitidos, pontos resgatados, campanhas ativas.
- Graficos: crescimento, conversoes, engajamento.

## 4.2 Clientes

- Cadastro manual (nome, WhatsApp, email, data cadastro, pontuacao).
- Importacao CSV.
- Busca avancada e filtros.
- Anti-duplicidade por email/WhatsApp no tenant.

## 4.3 Campanhas

- CRUD com: nome, descricao, recompensa, pontos por conversao, data inicio/fim, status.
- Exemplo de regra: 1 conversao = 100 pontos.

## 4.4 Indicacao e links

- Gerar link unico por cliente no formato `https://triggma.com/r/{codigo}`.
- Sem encurtador externo.
- Gerar QR Code com logo Triggma, nome da empresa e campanha.
- Download PNG e SVG.

## 4.5 Landing publica (captura)

- Exibir logo Triggma, logo empresa, campanha e beneficios.
- Capturar nome, WhatsApp e email.
- Botao CTA: Participar.

## 4.6 Leads

- Status: novo, contatado, convertido, perdido.
- Historico completo de mudancas.

## 4.7 Conversoes

- Conversao manual pela empresa.
- Bloquear dupla conversao da mesma lead.
- Ao converter, creditar pontos automaticamente.

## 4.8 Pontos

- Extrato completo de creditos/debitos.
- Saldo consistente com extrato.

## 4.9 Recompensas e resgates

- Catalogo: produtos, servicos, descontos, beneficios.
- Campos: nome, descricao, pontos necessarios, quantidade disponivel.
- Resgate gera voucher + codigo unico + QR Code.
- Status: disponivel, utilizado, expirado.

## 4.10 Portal do cliente

- Login simplificado.
- Exibir pontos, historico, recompensas, meu link, meu QR.

## 4.11 Ranking

- Categorias: mais indicacoes, mais conversoes, mais pontos.
- Niveis: bronze, prata, ouro, diamante.

## 4.12 Triggma Marketing

Biblioteca por segmento:

- Oficina
- Clinica
- Restaurante
- Academia
- Imobiliaria
- Energia Solar
- Assistencia Tecnica
- E-commerce

Cada segmento com:

- Campanhas prontas
- Texto WhatsApp
- Texto Instagram
- Arte modelo
- Estrategia de divulgacao

## 4.13 Assinatura SaaS

- Mercado Pago somente para assinatura da empresa.
- Fluxo permitido: empresa -> Triggma.
- Fluxo proibido: cliente final pagar Triggma ou recompensa.

---

## BLOCO 5 - IDENTIDADE VISUAL

Obrigatorio:

- Manter logo Triggma
- Manter paleta da marca
- Manter branding da marca

Melhorar UX/UI com referencia em:

- Stripe
- Notion
- Linear
- HubSpot

---

## BLOCO 6 - SEGURANCA MINIMA

Implementar obrigatoriamente:

- HTTPS
- Validacao server-side
- Rate limiting
- Anti-spam
- Logs e auditoria
- Protecao contra duplicidade de cadastros/leads

---

## BLOCO 7 - PLANO DE EXECUCAO PASSO A PASSO (SEM PAUSAR)

Executar exatamente nesta ordem, sem perguntar entre etapas:

1. Criar base multi-tenant + RBAC.
2. Criar entidades/modelos e migracoes principais.
3. Implementar autenticacao e autorizacao por perfil.
4. Implementar modulo Clientes (CRUD + CSV + filtros).
5. Implementar modulo Campanhas.
6. Implementar links de indicacao e QR codes.
7. Implementar landing publica e captura de leads.
8. Implementar funil de leads e historico.
9. Implementar conversao manual + credito automatico de pontos.
10. Implementar extrato e saldo de pontos.
11. Implementar catalogo de recompensas.
12. Implementar resgate com voucher/codigo/QR.
13. Implementar portal do cliente.
14. Implementar ranking.
15. Implementar dashboard.
16. Implementar modulo Triggma Marketing.
17. Implementar assinatura Mercado Pago (somente empresa).
18. Aplicar hardening de seguranca.
19. Validar responsividade.
20. Executar testes finais de fluxo fim-a-fim.

Se um item falhar, corrigir e continuar automaticamente.

---

## BLOCO 8 - CONTRATO DE SAIDA (RESPOSTA FINAL UNICA)

Quando concluir, responder uma unica vez com:

1. Resumo do que foi implementado.
2. Lista de modulos concluídos.
3. Pendencias reais (somente bloqueios tecnicos inevitaveis).
4. Como executar/publicar.
5. Evidencias de validacao (testes e fluxos verificados).

Nao retornar:

- perguntas abertas
- "voce quer que eu continue?"
- proposta de etapas futuras sem executar as atuais

---

## BLOCO 9 - COMANDO DE RETOMADA (SE O LOVABLE PARAR)

Se o sistema pausar indevidamente, usar esta mensagem curta:

`Continue exatamente de onde parou, sem recapitular, sem perguntas, sem dividir em etapas de aprovacao. Assuma defaults tecnicos seguros e finalize todo o escopo MVP restante agora.`
