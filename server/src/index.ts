import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import {
  db,
  initDb,
  newId,
  newReferralCode,
  newSlug,
  newVoucherCode,
} from "./db.js";
import { requireAuth, signToken } from "./auth.js";

initDb();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 4000);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);

function creditPoints(
  tenantId: string,
  customerId: string,
  points: number,
  origin: string,
  referenceId: string,
  description: string,
) {
  db.prepare(
    `INSERT INTO point_ledger (id, tenant_id, customer_id, type, origin, reference_id, points, description)
     VALUES (?, ?, ?, 'credit', ?, ?, ?, ?)`,
  ).run(newId(), tenantId, customerId, origin, referenceId, points, description);
  db.prepare(
    "UPDATE customers SET points_balance = points_balance + ? WHERE id = ? AND tenant_id = ?",
  ).run(points, customerId, tenantId);
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* ----------------------------- Auth ----------------------------- */

app.post("/api/auth/register-company", (req, res) => {
  const { companyName, name, email, password } = req.body ?? {};
  if (!companyName || !name || !email || !password) {
    return res.status(400).json({ error: "missing_fields" });
  }
  let slug = slugify(companyName) || "empresa";
  let suffix = 0;
  while (
    db.prepare("SELECT 1 FROM tenants WHERE slug = ?").get(suffix ? `${slug}-${suffix}` : slug)
  ) {
    suffix += 1;
  }
  if (suffix) slug = `${slug}-${suffix}`;

  const tenantId = newId();
  db.prepare(
    "INSERT INTO tenants (id, name, slug, plan, status) VALUES (?, ?, ?, 'free', 'active')",
  ).run(tenantId, companyName, slug);
  const userId = newId();
  db.prepare(
    `INSERT INTO tenant_users (id, tenant_id, name, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?, 'tenant_admin')`,
  ).run(userId, tenantId, name, email, bcrypt.hashSync(password, 10));

  const token = signToken({ sub: userId, tenantId, role: "tenant_admin", name });
  res.json({ token, tenant: { id: tenantId, name: companyName, slug }, user: { name, email } });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const user = db
    .prepare("SELECT * FROM tenant_users WHERE email = ?")
    .get(email) as any;
  if (!user || !bcrypt.compareSync(password ?? "", user.password_hash)) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(user.tenant_id) as any;
  const token = signToken({
    sub: user.id,
    tenantId: user.tenant_id,
    role: "tenant_admin",
    name: user.name,
  });
  res.json({
    token,
    tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan },
    user: { name: user.name, email: user.email },
  });
});

app.post("/api/auth/customer-login", (req, res) => {
  const { tenantSlug, referralCode } = req.body ?? {};
  const tenant = db.prepare("SELECT * FROM tenants WHERE slug = ?").get(tenantSlug) as any;
  if (!tenant) return res.status(404).json({ error: "tenant_not_found" });
  const customer = db
    .prepare("SELECT * FROM customers WHERE tenant_id = ? AND referral_code = ?")
    .get(tenant.id, (referralCode ?? "").toUpperCase()) as any;
  if (!customer) return res.status(401).json({ error: "invalid_code" });
  const token = signToken({
    sub: customer.id,
    tenantId: tenant.id,
    role: "customer",
    name: customer.name,
  });
  res.json({ token, customer: { id: customer.id, name: customer.name } });
});

app.get("/api/me", requireAuth(), (req, res) => {
  const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(req.auth!.tenantId) as any;
  res.json({ auth: req.auth, tenant });
});

/* ------------------------- Company panel ------------------------- */

app.get("/api/dashboard", requireAuth("tenant_admin", "tenant_user"), (req, res) => {
  const t = req.auth!.tenantId;
  const totals = db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM customers WHERE tenant_id = @t) AS customers,
        (SELECT COUNT(*) FROM campaigns WHERE tenant_id = @t AND status = 'active') AS active_campaigns,
        (SELECT COUNT(*) FROM leads WHERE tenant_id = @t) AS leads,
        (SELECT COUNT(*) FROM conversions WHERE tenant_id = @t) AS conversions,
        (SELECT COALESCE(SUM(points),0) FROM point_ledger WHERE tenant_id = @t AND type = 'credit') AS points_distributed,
        (SELECT COUNT(*) FROM redemptions WHERE tenant_id = @t) AS redemptions`,
    )
    .get({ t });
  res.json(totals);
});

function campaignWithStats(t: string, row: any) {
  const conversions = (
    db
      .prepare("SELECT COUNT(*) AS n FROM conversions WHERE tenant_id = ? AND campaign_id = ?")
      .get(t, row.id) as any
  ).n;
  return { ...row, conversions };
}

app.get("/api/campaigns", requireAuth("tenant_admin", "tenant_user"), (req, res) => {
  const t = req.auth!.tenantId;
  const rows = db
    .prepare("SELECT * FROM campaigns WHERE tenant_id = ? ORDER BY created_at DESC")
    .all(t) as any[];
  res.json(rows.map((r) => campaignWithStats(t, r)));
});

app.post("/api/campaigns", requireAuth("tenant_admin"), (req, res) => {
  const t = req.auth!.tenantId;
  const { name, reward_description, points_per_conversion, goal, start_date, end_date, status } =
    req.body ?? {};
  if (!name) return res.status(400).json({ error: "name_required" });
  if (start_date && end_date && end_date < start_date) {
    return res.status(400).json({ error: "end_before_start" });
  }
  const id = newId();
  db.prepare(
    `INSERT INTO campaigns (id, tenant_id, name, reward_description, points_per_conversion, goal, start_date, end_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    t,
    name,
    reward_description ?? null,
    Number(points_per_conversion) || 50,
    Number(goal) || 100,
    start_date ?? null,
    end_date ?? null,
    status ?? "active",
  );
  const row = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id);
  res.status(201).json(campaignWithStats(t, row));
});

app.patch("/api/campaigns/:id", requireAuth("tenant_admin"), (req, res) => {
  const t = req.auth!.tenantId;
  const existing = db
    .prepare("SELECT * FROM campaigns WHERE id = ? AND tenant_id = ?")
    .get(req.params.id, t) as any;
  if (!existing) return res.status(404).json({ error: "not_found" });
  const status = req.body?.status ?? existing.status;
  db.prepare("UPDATE campaigns SET status = ? WHERE id = ? AND tenant_id = ?").run(
    status,
    req.params.id,
    t,
  );
  res.json(campaignWithStats(t, { ...existing, status }));
});

app.get("/api/rewards", requireAuth("tenant_admin", "tenant_user"), (req, res) => {
  const t = req.auth!.tenantId;
  res.json(
    db.prepare("SELECT * FROM rewards WHERE tenant_id = ? ORDER BY points_required").all(t),
  );
});

app.post("/api/rewards", requireAuth("tenant_admin"), (req, res) => {
  const t = req.auth!.tenantId;
  const { name, reward_type, points_required, quantity_available } = req.body ?? {};
  if (!name || !points_required) return res.status(400).json({ error: "missing_fields" });
  const id = newId();
  db.prepare(
    `INSERT INTO rewards (id, tenant_id, name, reward_type, points_required, quantity_available, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
  ).run(
    id,
    t,
    name,
    reward_type ?? "benefit",
    Number(points_required),
    Number(quantity_available) || 100,
  );
  res.status(201).json(db.prepare("SELECT * FROM rewards WHERE id = ?").get(id));
});

app.get("/api/customers", requireAuth("tenant_admin", "tenant_user"), (req, res) => {
  const t = req.auth!.tenantId;
  res.json(
    db.prepare("SELECT * FROM customers WHERE tenant_id = ? ORDER BY created_at DESC").all(t),
  );
});

app.post("/api/customers", requireAuth("tenant_admin"), (req, res) => {
  const t = req.auth!.tenantId;
  const { name, whatsapp, email } = req.body ?? {};
  if (!name) return res.status(400).json({ error: "name_required" });
  if (email) {
    const dup = db
      .prepare("SELECT 1 FROM customers WHERE tenant_id = ? AND email = ?")
      .get(t, email);
    if (dup) return res.status(409).json({ error: "duplicate_email" });
  }
  let code = newReferralCode();
  while (db.prepare("SELECT 1 FROM customers WHERE tenant_id = ? AND referral_code = ?").get(t, code)) {
    code = newReferralCode();
  }
  const id = newId();
  db.prepare(
    `INSERT INTO customers (id, tenant_id, name, whatsapp, email, referral_code, points_balance)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
  ).run(id, t, name, whatsapp ?? null, email ?? null, code);
  res.status(201).json(db.prepare("SELECT * FROM customers WHERE id = ?").get(id));
});

app.get("/api/leads", requireAuth("tenant_admin", "tenant_user"), (req, res) => {
  const t = req.auth!.tenantId;
  const rows = db
    .prepare(
      `SELECT l.*, c.name AS campaign_name, cu.name AS referrer_name
       FROM leads l
       LEFT JOIN campaigns c ON c.id = l.campaign_id
       LEFT JOIN customers cu ON cu.id = l.referrer_customer_id
       WHERE l.tenant_id = ? ORDER BY l.created_at DESC`,
    )
    .all(t);
  res.json(rows);
});

app.post("/api/leads/:id/convert", requireAuth("tenant_admin", "tenant_user"), (req, res) => {
  const t = req.auth!.tenantId;
  const lead = db
    .prepare("SELECT * FROM leads WHERE id = ? AND tenant_id = ?")
    .get(req.params.id, t) as any;
  if (!lead) return res.status(404).json({ error: "not_found" });
  const already = db
    .prepare("SELECT 1 FROM conversions WHERE tenant_id = ? AND lead_id = ?")
    .get(t, lead.id);
  if (already) return res.status(409).json({ error: "already_converted" });

  const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(lead.campaign_id) as any;
  const tx = db.transaction(() => {
    db.prepare("UPDATE leads SET status = 'converted' WHERE id = ?").run(lead.id);
    const convId = newId();
    db.prepare(
      `INSERT INTO conversions (id, tenant_id, lead_id, campaign_id, referrer_customer_id)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(convId, t, lead.id, lead.campaign_id, lead.referrer_customer_id);
    if (lead.referrer_customer_id) {
      creditPoints(
        t,
        lead.referrer_customer_id,
        campaign?.points_per_conversion ?? 50,
        "conversion",
        convId,
        `Conversao: ${lead.name}`,
      );
    }
  });
  tx();
  res.json({ ok: true });
});

/* ------------------------- Public landing ------------------------ */

app.get("/api/r/:slug", (req, res) => {
  const link = db
    .prepare("SELECT * FROM referral_links WHERE slug = ?")
    .get(req.params.slug) as any;
  if (!link) return res.status(404).json({ error: "not_found" });
  const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(link.tenant_id) as any;
  const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(link.campaign_id) as any;
  const referrer = db.prepare("SELECT * FROM customers WHERE id = ?").get(link.customer_id) as any;
  res.json({
    tenant: { name: tenant.name, slug: tenant.slug },
    campaign: { name: campaign.name, reward_description: campaign.reward_description },
    referrer: { name: referrer.name },
  });
});

app.post("/api/r/:slug/lead", (req, res) => {
  const link = db
    .prepare("SELECT * FROM referral_links WHERE slug = ?")
    .get(req.params.slug) as any;
  if (!link) return res.status(404).json({ error: "not_found" });
  const { name, whatsapp, email } = req.body ?? {};
  if (!name) return res.status(400).json({ error: "name_required" });
  // anti-duplicate within tenant by email/whatsapp
  if (email || whatsapp) {
    const dup = db
      .prepare(
        `SELECT 1 FROM leads WHERE tenant_id = ? AND campaign_id = ?
         AND ((email IS NOT NULL AND email = ?) OR (whatsapp IS NOT NULL AND whatsapp = ?))`,
      )
      .get(link.tenant_id, link.campaign_id, email ?? "", whatsapp ?? "");
    if (dup) return res.status(409).json({ error: "duplicate_lead" });
  }
  const id = newId();
  db.prepare(
    `INSERT INTO leads (id, tenant_id, campaign_id, referrer_customer_id, name, whatsapp, email, status, source_link_slug)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
  ).run(
    id,
    link.tenant_id,
    link.campaign_id,
    link.customer_id,
    name,
    whatsapp ?? null,
    email ?? null,
    link.slug,
  );
  res.status(201).json({ ok: true });
});

/* ------------------------- Client portal ------------------------- */

app.get("/api/customer/me", requireAuth("customer"), (req, res) => {
  const t = req.auth!.tenantId;
  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ? AND tenant_id = ?")
    .get(req.auth!.sub, t) as any;
  const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(t) as any;
  let link = db
    .prepare("SELECT * FROM referral_links WHERE tenant_id = ? AND customer_id = ?")
    .get(t, customer.id) as any;
  if (!link) {
    const campaign = db
      .prepare("SELECT * FROM campaigns WHERE tenant_id = ? AND status = 'active' ORDER BY created_at LIMIT 1")
      .get(t) as any;
    if (campaign) {
      let slug = `${slugify(customer.name)}-${newSlug()}`;
      const id = newId();
      db.prepare(
        `INSERT INTO referral_links (id, tenant_id, customer_id, campaign_id, slug) VALUES (?, ?, ?, ?, ?)`,
      ).run(id, t, customer.id, campaign.id, slug);
      link = { slug };
    }
  }
  const referrals = db
    .prepare(
      `SELECT l.name, l.status, c.converted_at, cap.points_per_conversion AS points
       FROM leads l
       LEFT JOIN conversions c ON c.lead_id = l.id
       LEFT JOIN campaigns cap ON cap.id = l.campaign_id
       WHERE l.tenant_id = ? AND l.referrer_customer_id = ?
       ORDER BY l.created_at DESC`,
    )
    .all(t, customer.id);
  res.json({
    customer: {
      id: customer.id,
      name: customer.name,
      points_balance: customer.points_balance,
      referral_code: customer.referral_code,
    },
    tenant: { name: tenant.name, slug: tenant.slug },
    referralSlug: link?.slug ?? null,
    referrals,
  });
});

app.get("/api/customer/rewards", requireAuth("customer"), (req, res) => {
  const t = req.auth!.tenantId;
  res.json(
    db
      .prepare(
        "SELECT * FROM rewards WHERE tenant_id = ? AND status = 'active' ORDER BY points_required",
      )
      .all(t),
  );
});

app.post("/api/customer/rewards/:id/redeem", requireAuth("customer"), (req, res) => {
  const t = req.auth!.tenantId;
  const reward = db
    .prepare("SELECT * FROM rewards WHERE id = ? AND tenant_id = ?")
    .get(req.params.id, t) as any;
  if (!reward) return res.status(404).json({ error: "not_found" });
  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ? AND tenant_id = ?")
    .get(req.auth!.sub, t) as any;
  if (customer.points_balance < reward.points_required) {
    return res.status(400).json({ error: "insufficient_points" });
  }
  if (reward.quantity_available <= 0) {
    return res.status(400).json({ error: "out_of_stock" });
  }
  let voucher = newVoucherCode();
  while (db.prepare("SELECT 1 FROM redemptions WHERE voucher_code = ?").get(voucher)) {
    voucher = newVoucherCode();
  }
  const redemptionId = newId();
  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO redemptions (id, tenant_id, reward_id, customer_id, voucher_code, status)
       VALUES (?, ?, ?, ?, ?, 'available')`,
    ).run(redemptionId, t, reward.id, customer.id, voucher);
    db.prepare("UPDATE rewards SET quantity_available = quantity_available - 1 WHERE id = ?").run(
      reward.id,
    );
    db.prepare(
      `INSERT INTO point_ledger (id, tenant_id, customer_id, type, origin, reference_id, points, description)
       VALUES (?, ?, ?, 'debit', 'redeem_adjustment', ?, ?, ?)`,
    ).run(newId(), t, customer.id, redemptionId, reward.points_required, `Resgate: ${reward.name}`);
    db.prepare("UPDATE customers SET points_balance = points_balance - ? WHERE id = ?").run(
      reward.points_required,
      customer.id,
    );
  });
  tx();
  res.status(201).json({ voucher_code: voucher, reward: reward.name });
});

app.get("/api/customer/redemptions", requireAuth("customer"), (req, res) => {
  const t = req.auth!.tenantId;
  res.json(
    db
      .prepare(
        `SELECT r.voucher_code, r.status, r.redeemed_at, rw.name AS reward_name, rw.points_required
         FROM redemptions r JOIN rewards rw ON rw.id = r.reward_id
         WHERE r.tenant_id = ? AND r.customer_id = ? ORDER BY r.redeemed_at DESC`,
      )
      .all(t, req.auth!.sub),
  );
});

export { app };

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  app.listen(PORT, () => {
    console.log(`[triggma] API on http://localhost:${PORT}`);
  });
}
