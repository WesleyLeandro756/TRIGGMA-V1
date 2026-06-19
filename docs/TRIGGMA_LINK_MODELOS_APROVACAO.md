# Triggma Link System - Modelos para Aprovacao

Documento de aprovacao visual e estrategica para links curtos, memoraveis e automaticos no painel Triggma.

## Objetivo

Padronizar links da plataforma para:

- Clientes compartilharem com facilidade
- Empresas terem identidade forte de marca
- Sistema gerar tudo automaticamente apos cadastro/login
- Melhorar conversao em indicacao, leads e assinatura

## Marca e identidade

- Dominio principal: `triggma.com.br`
- Logo principal para links/QR e preview: `branding/triggma-logo-icon.svg`

---

## Modelos de links (versoes para aprovar)

## Modelo A - Ultra curto por cliente

Padrao:

- `https://triggma.com.br/r/{codigo}`

Exemplos:

- https://triggma.com.br/r/ana
- https://triggma.com.br/r/joao23
- https://triggma.com.br/r/cliente98

Uso: compartilhamento rapido no WhatsApp e Instagram.

---

## Modelo B - Cliente + campanha

Padrao:

- `https://triggma.com.br/r/{codigo}?c={campanha}`

Exemplos:

- https://triggma.com.br/r/ana?c=outono
- https://triggma.com.br/r/joao23?c=indique100

Uso: medir conversao por campanha sem alongar URL principal.

---

## Modelo C - Empresa personalizada (@slug)

Padrao:

- `https://triggma.com.br/@{empresa}`

Exemplos:

- https://triggma.com.br/@oficinaalpha
- https://triggma.com.br/@clinicavida

Uso: pagina institucional da empresa dentro da Triggma.

---

## Modelo D - Empresa + cliente

Padrao:

- `https://triggma.com.br/@{empresa}/r/{codigo}`

Exemplos:

- https://triggma.com.br/@oficinaalpha/r/ana
- https://triggma.com.br/@clinicavida/r/pedro

Uso: reforcar marca da empresa em cada indicacao.

---

## Modelo E - Campanha curta publica

Padrao:

- `https://triggma.com.br/c/{campanha}`

Exemplos:

- https://triggma.com.br/c/indique100
- https://triggma.com.br/c/clientevip

Uso: campanha promovida em ads, social e QR impresso.

---

## Modelo F - Recompensa direta

Padrao:

- `https://triggma.com.br/g/{recompensa}`

Exemplos:

- https://triggma.com.br/g/desconto50
- https://triggma.com.br/g/troca-oleo

Uso: pagina de recompensa para aumentar desejo de resgate.

---

## Modelo G - Link curto premium com hash

Padrao:

- `https://triggma.com.br/t/{hash}`

Exemplos:

- https://triggma.com.br/t/k82m
- https://triggma.com.br/t/x7ap

Uso: links extremamente curtos para campanhas de alta escala.

---

## Modelo H - Multiunidade enterprise

Padrao:

- `https://triggma.com.br/u/{unidade}/r/{codigo}`

Exemplos:

- https://triggma.com.br/u/sp-matriz/r/ana
- https://triggma.com.br/u/rj-zona-sul/r/carla

Uso: empresas nacionais com filiais e equipe regional.

---

## Recomendacao principal (para lancamento)

Combinar:

1. **Modelo A** (link curto padrao de cliente)
2. **Modelo E** (campanha curta)
3. **Modelo C** (marca da empresa)

Resultado:

- Simples para usuario final
- Forte para branding
- Escalavel para analytics

---

## Fluxo automatico no painel (sem operacao manual)

Ao cadastrar cliente:

1. Sistema gera `customer_referral_code`.
2. Sistema gera URL curta padrao (`/r/{codigo}`).
3. Sistema gera QR Code com logo Triggma.
4. Sistema associa campanha ativa default.
5. Sistema salva em "Meus Links" no portal cliente.

Ao criar campanha:

1. Sistema gera `campaign_slug`.
2. Sistema cria URL publica (`/c/{campanha}`).
3. Sistema disponibiliza QR PNG/SVG com nome da empresa + campanha.

Ao marcar conversao:

1. Sistema identifica origem por link/codigo.
2. Credita pontos automaticos.
3. Atualiza dashboard em tempo real.

---

## Estrutura tecnica sugerida (resumo)

Campos minimos:

- `tenant_slug`
- `customer_referral_code`
- `campaign_slug`
- `short_hash` (opcional para modelo G)

Rotas:

- `/r/:code`
- `/c/:campaign`
- `/g/:reward`
- `/@:tenant`
- `/@:tenant/r/:code`
- `/t/:hash`
- `/u/:unit/r/:code`

Regras:

- Unicidade por tenant
- Protecao anti-duplicidade de lead
- Tracking UTM automatico
- Fallback para landing padrao quando slug inativo

---

## O que aprovar agora

1. Qual modelo principal de link de cliente: **A** ou **D**
2. Se campanha curta fica em **/c/** (recomendado)
3. Se teremos hash premium **/t/** no MVP
4. Se enterprise usa **/u/{unidade}/**

Depois da aprovacao, eu gero o prompt final para o Lovable com implementacao direta.
