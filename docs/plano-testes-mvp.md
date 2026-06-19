# Plano de Testes MVP - Triggma Growth V1

## 1. Objetivo

Validar os fluxos criticos do MVP com foco em:

- Confiabilidade funcional
- Seguranca minima obrigatoria
- Integridade de pontos e resgates
- Responsividade (desktop/tablet/mobile)

## 2. Matriz de testes funcionais

## 2.1 Cadastro de empresa

- Criar tenant com plano `free`
- Validar limites iniciais de clientes/campanhas/usuarios
- Verificar isolamento de dados entre tenants

## 2.2 Cadastro de cliente

- Cadastro manual com nome, WhatsApp e email validos
- Bloqueio de duplicidade por email/WhatsApp no mesmo tenant
- Importacao CSV com sucesso e com linhas invalidas

## 2.3 Campanhas

- Criar campanha com datas validas
- Bloquear campanha com data fim anterior a data inicio
- Alterar status de `draft` para `active`
- Bloquear excedente de campanhas conforme plano

## 2.4 Links de indicacao e QR Code

- Gerar link unico por cliente
- Validar formato de URL com dominio Triggma
- Gerar QR Code com exportacao PNG e SVG

## 2.5 Leads

- Captura de lead na landing publica
- Validacao de campos obrigatorios
- Protecao contra spam/duplicidade em curto intervalo
- Transicao de status: novo -> contatado -> convertido/perdido

## 2.6 Conversoes

- Marcacao manual de conversao pela empresa
- Garantir que mesma lead nao converte duas vezes
- Auditar usuario e horario da conversao

## 2.7 Pontos

- Credito automatico ao converter lead
- Extrato de pontos com referencia da conversao
- Consistencia entre extrato e saldo atual do cliente

## 2.8 Resgates

- Resgatar recompensa com saldo suficiente
- Bloquear resgate com saldo insuficiente
- Gerar voucher, codigo unico e QR Code
- Mudanca de status: disponivel -> utilizado/expirado

## 2.9 Ranking

- Atualizar ranking por categoria
- Classificar niveis (bronze/prata/ouro/diamante)
- Garantir ordenacao correta por score

## 2.10 Assinaturas SaaS

- Criar assinatura via Mercado Pago
- Sincronizar status de assinatura no tenant
- Garantir que cobranca e apenas empresa -> Triggma

## 3. Testes de seguranca

- Rate limiting em endpoints publicos
- Validacao server-side de formularios
- Tentativas de acesso cross-tenant (deve negar)
- Registro em auditoria para acoes criticas

## 4. Testes de responsividade

Executar smoke tests em:

- Desktop (>=1280px)
- Tablet (~768px)
- Mobile (<=430px)

Validar especialmente:

- Dashboard de KPIs
- Landing publica de campanhas
- Portal do cliente

## 5. Criterios de aceite do MVP

O MVP e aceito quando:

1. Todos os fluxos funcionais obrigatorios passam sem bloqueadores
2. Nao ha vazamento de dados entre tenants
3. Pontos e resgates estao consistentes com o extrato
4. Links e QR Codes funcionam em dominio Triggma
5. Assinatura SaaS funciona apenas no escopo empresa -> Triggma
