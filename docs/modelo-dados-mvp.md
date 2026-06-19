# Modelo de Dados MVP - Triggma Growth V1

## 1. Entidades principais

## 1.1 Tenant (empresa)

- `id` (uuid)
- `name`
- `slug`
- `plan` (`free`, `starter`, `business`, `enterprise`)
- `status` (`active`, `suspended`, `cancelled`)
- `created_at`
- `updated_at`

## 1.2 TenantUser (usuarios da empresa)

- `id`
- `tenant_id`
- `name`
- `email`
- `role` (`tenant_admin`, `tenant_user`)
- `status`
- `created_at`

## 1.3 Customer (cliente final)

- `id`
- `tenant_id`
- `name`
- `whatsapp`
- `email`
- `referral_code` (unico por tenant)
- `points_balance` (cache de saldo)
- `created_at`
- `updated_at`

Indices sugeridos:

- unico (`tenant_id`, `email`)
- unico (`tenant_id`, `whatsapp`)
- unico (`tenant_id`, `referral_code`)

## 1.4 Campaign

- `id`
- `tenant_id`
- `name`
- `description`
- `reward_description`
- `points_per_conversion`
- `start_date`
- `end_date`
- `status` (`draft`, `active`, `paused`, `closed`)
- `created_by`
- `created_at`

## 1.5 ReferralLink

- `id`
- `tenant_id`
- `customer_id`
- `campaign_id`
- `slug` (codigo publico)
- `url` (`https://triggma.com/r/{slug}`)
- `qr_code_png_url`
- `qr_code_svg_url`
- `created_at`

Indice:

- unico (`tenant_id`, `slug`)

## 1.6 Lead

- `id`
- `tenant_id`
- `campaign_id`
- `referrer_customer_id` (quem indicou)
- `name`
- `whatsapp`
- `email`
- `status` (`new`, `contacted`, `converted`, `lost`)
- `source_link_slug`
- `created_at`
- `updated_at`

Indices sugeridos:

- (`tenant_id`, `campaign_id`, `status`)
- (`tenant_id`, `email`)
- (`tenant_id`, `whatsapp`)

## 1.7 LeadStatusHistory

- `id`
- `tenant_id`
- `lead_id`
- `from_status`
- `to_status`
- `changed_by`
- `notes`
- `created_at`

## 1.8 Conversion

- `id`
- `tenant_id`
- `lead_id` (unico por lead convertido)
- `campaign_id`
- `referrer_customer_id`
- `converted_by`
- `converted_at`

Restricao:

- unico (`tenant_id`, `lead_id`)

## 1.9 PointLedger (extrato)

- `id`
- `tenant_id`
- `customer_id`
- `type` (`credit`, `debit`)
- `origin` (`conversion`, `redeem_adjustment`, `manual_adjustment`)
- `reference_id` (id da conversao/resgate)
- `points`
- `description`
- `created_at`

## 1.10 Reward

- `id`
- `tenant_id`
- `name`
- `description`
- `reward_type` (`product`, `service`, `discount`, `benefit`)
- `points_required`
- `quantity_available`
- `status` (`active`, `inactive`)
- `created_at`

## 1.11 Redemption

- `id`
- `tenant_id`
- `reward_id`
- `customer_id`
- `voucher_code` (unico)
- `qr_code_png_url`
- `qr_code_svg_url`
- `status` (`available`, `used`, `expired`)
- `expires_at`
- `redeemed_at`
- `used_at`

Indices:

- unico (`tenant_id`, `voucher_code`)
- (`tenant_id`, `customer_id`, `status`)

## 1.12 RankingSnapshot

- `id`
- `tenant_id`
- `period` (ex: `2026-06`)
- `category` (`most_referrals`, `most_conversions`, `most_points`)
- `customer_id`
- `position`
- `score`
- `level` (`bronze`, `silver`, `gold`, `diamond`)
- `generated_at`

## 1.13 MarketingTemplate

- `id`
- `category` (`oficina`, `clinica`, `restaurante`, `academia`, `imobiliaria`, `energia_solar`, `assistencia_tecnica`, `ecommerce`)
- `campaign_name`
- `campaign_copy`
- `whatsapp_copy`
- `instagram_copy`
- `asset_url`
- `strategy_notes`
- `created_at`

## 1.14 Subscription (empresa -> Triggma)

- `id`
- `tenant_id`
- `plan`
- `provider` (`mercado_pago`)
- `provider_subscription_id`
- `status` (`trialing`, `active`, `past_due`, `cancelled`)
- `started_at`
- `renewal_at`
- `cancelled_at`

## 1.15 AuditLog

- `id`
- `tenant_id` (nullable apenas para super_admin global)
- `actor_user_id`
- `actor_role`
- `action`
- `entity`
- `entity_id`
- `metadata_json`
- `created_at`

## 2. Regras de negocio criticas

1. Toda query de dados empresariais deve filtrar `tenant_id`.
2. Um lead nao pode ser convertido duas vezes.
3. Conversao gera credito de pontos automaticamente conforme `points_per_conversion`.
4. Resgate so pode ocorrer com saldo suficiente e estoque disponivel.
5. Voucher deve ser unico por tenant.
6. Formulario publico deve evitar duplicidade por email/whatsapp em janela configuravel.

## 3. Limites por plano (enforcement)

- `free`: ate 100 clientes, 1 campanha ativa, 1 usuario
- `starter`: ate 1.000 clientes, 5 campanhas, 3 usuarios
- `business`: ate 10.000 clientes, campanhas ilimitadas, 10 usuarios
- `enterprise`: ilimitado + multiunidade
