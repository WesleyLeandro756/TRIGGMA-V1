import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.TRIGGMA_DB ?? path.join(dataDir, "triggma.db");
export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export const newId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  16,
);
const slugAlphabet = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 7);
export const newSlug = () => slugAlphabet();
export const newReferralCode = () =>
  customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6)();
export const newVoucherCode = () =>
  `TRG-${customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8)()}`;

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      document TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tenant_users (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'tenant_admin',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (tenant_id, email)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      name TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      referral_code TEXT NOT NULL,
      points_balance INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (tenant_id, referral_code)
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      name TEXT NOT NULL,
      description TEXT,
      reward_description TEXT,
      points_per_conversion INTEGER NOT NULL DEFAULT 50,
      goal INTEGER NOT NULL DEFAULT 100,
      start_date TEXT,
      end_date TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS referral_links (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      customer_id TEXT NOT NULL REFERENCES customers(id),
      campaign_id TEXT NOT NULL REFERENCES campaigns(id),
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      campaign_id TEXT NOT NULL REFERENCES campaigns(id),
      referrer_customer_id TEXT REFERENCES customers(id),
      name TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      source_link_slug TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS conversions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      lead_id TEXT NOT NULL REFERENCES leads(id),
      campaign_id TEXT NOT NULL REFERENCES campaigns(id),
      referrer_customer_id TEXT REFERENCES customers(id),
      converted_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (tenant_id, lead_id)
    );

    CREATE TABLE IF NOT EXISTS point_ledger (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      customer_id TEXT NOT NULL REFERENCES customers(id),
      type TEXT NOT NULL,
      origin TEXT NOT NULL,
      reference_id TEXT,
      points INTEGER NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      name TEXT NOT NULL,
      description TEXT,
      reward_type TEXT NOT NULL DEFAULT 'benefit',
      points_required INTEGER NOT NULL,
      quantity_available INTEGER NOT NULL DEFAULT 100,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      reward_id TEXT NOT NULL REFERENCES rewards(id),
      customer_id TEXT NOT NULL REFERENCES customers(id),
      voucher_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'available',
      redeemed_at TEXT NOT NULL DEFAULT (datetime('now')),
      used_at TEXT
    );
  `);

  // Lightweight migration: add tenants.document to pre-existing databases.
  const cols = db.prepare("PRAGMA table_info(tenants)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "document")) {
    db.exec("ALTER TABLE tenants ADD COLUMN document TEXT");
  }

  const count = db.prepare("SELECT COUNT(*) AS n FROM tenants").get() as {
    n: number;
  };
  if (count.n === 0) seed();
}

function seed() {
  const tenantId = newId();
  db.prepare(
    "INSERT INTO tenants (id, name, slug, plan, status) VALUES (?, ?, ?, ?, ?)",
  ).run(tenantId, "Loja Demo Triggma", "demo", "business", "active");

  db.prepare(
    "INSERT INTO tenant_users (id, tenant_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(
    newId(),
    tenantId,
    "Marketing Admin",
    "admin@demo.com",
    bcrypt.hashSync("triggma123", 10),
    "tenant_admin",
  );

  const campaigns = [
    {
      name: "Indique e Ganhe Voucher",
      reward_description: "50 pontos por conversao",
      points: 50,
      goal: 200,
      conversions: 142,
      start: "2024-01-05",
      end: "2024-07-31",
      status: "active",
    },
    {
      name: "Black Friday Promo",
      reward_description: "120 pontos por conversao",
      points: 120,
      goal: 100,
      conversions: 58,
      start: "2024-11-01",
      end: "2024-11-30",
      status: "active",
    },
    {
      name: "Cliente VIP",
      reward_description: "200 pontos por conversao",
      points: 200,
      goal: 100,
      conversions: 27,
      start: "2025-02-10",
      end: "2025-05-31",
      status: "paused",
    },
  ];

  const campaignIds: string[] = [];
  const insCampaign = db.prepare(
    `INSERT INTO campaigns (id, tenant_id, name, reward_description, points_per_conversion, goal, start_date, end_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const c of campaigns) {
    const id = newId();
    campaignIds.push(id);
    insCampaign.run(
      id,
      tenantId,
      c.name,
      c.reward_description,
      c.points,
      c.goal,
      c.start,
      c.end,
      c.status,
    );
  }

  const rewards = [
    { name: "Voucher R$ 50", type: "discount", points: 500 },
    { name: "Cafe gratis", type: "product", points: 200 },
    { name: "Desconto 20%", type: "discount", points: 300 },
    { name: "Brinde exclusivo", type: "product", points: 800 },
    { name: "Servico premium", type: "service", points: 1200 },
    { name: "Cashback", type: "benefit", points: 1000 },
  ];
  const insReward = db.prepare(
    `INSERT INTO rewards (id, tenant_id, name, reward_type, points_required, quantity_available, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
  );
  for (const r of rewards) {
    insReward.run(newId(), tenantId, r.name, r.type, r.points, 100);
  }

  // Featured subscriber/customer "Joao Silva" matching the app mockup.
  const heroCustomerId = newId();
  db.prepare(
    `INSERT INTO customers (id, tenant_id, name, whatsapp, email, referral_code, points_balance)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    heroCustomerId,
    tenantId,
    "Joao Silva",
    "5511999990000",
    "joao.silva@email.com",
    "JOAO01",
    350,
  );

  // Referral link for the hero customer on the main campaign.
  db.prepare(
    `INSERT INTO referral_links (id, tenant_id, customer_id, campaign_id, slug)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(newId(), tenantId, heroCustomerId, campaignIds[0], "joaosilva");

  const insLead = db.prepare(
    `INSERT INTO leads (id, tenant_id, campaign_id, referrer_customer_id, name, whatsapp, email, status, source_link_slug, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'joaosilva', ?)`,
  );
  const insConv = db.prepare(
    `INSERT INTO conversions (id, tenant_id, lead_id, campaign_id, referrer_customer_id, converted_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const insLedger = db.prepare(
    `INSERT INTO point_ledger (id, tenant_id, customer_id, type, origin, reference_id, points, description, created_at)
     VALUES (?, ?, ?, 'credit', ?, ?, ?, ?, ?)`,
  );
  const insCustomer = db.prepare(
    `INSERT INTO customers (id, tenant_id, name, email, referral_code, points_balance, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  // Records a converted lead for a referrer, crediting the campaign points.
  function addConversion(
    referrerId: string,
    campaignId: string,
    points: number,
    leadName: string,
    date: string,
  ) {
    const leadId = newId();
    insLead.run(leadId, tenantId, campaignId, referrerId, leadName, null, null, "converted", date);
    const convId = newId();
    insConv.run(convId, tenantId, leadId, campaignId, referrerId, date);
    insLedger.run(
      newId(),
      tenantId,
      referrerId,
      "conversion",
      convId,
      points,
      `Conversao: ${leadName}`,
      date,
    );
  }

  // Hero customer's named converted friends (shown in the app mockup, +50 pts each).
  const friends = [
    { name: "Pedro Henrique", date: "2024-05-15" },
    { name: "Mariana Sousa", date: "2024-05-10" },
    { name: "Lucas Almeida", date: "2024-05-02" },
  ];
  for (const f of friends) {
    addConversion(heroCustomerId, campaignIds[0], 50, f.name, f.date);
  }
  // Welcome bonus so the ledger sum matches the displayed 350 pts balance (3*50 + 200).
  insLedger.run(
    newId(),
    tenantId,
    heroCustomerId,
    "manual_adjustment",
    null,
    200,
    "Bonus de boas-vindas",
    "2024-04-30",
  );

  // Open leads in the funnel for the company panel (convertible in the demo).
  const insOpenLead = db.prepare(
    `INSERT INTO leads (id, tenant_id, campaign_id, referrer_customer_id, name, status, source_link_slug, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'joaosilva', datetime('now'))`,
  );
  for (const l of [
    { name: "Ana Paula", status: "new" },
    { name: "Carlos Eduardo", status: "contacted" },
  ]) {
    insOpenLead.run(newId(), tenantId, campaignIds[0], heroCustomerId, l.name, l.status);
  }

  // Historical conversions so campaign counters match the mockups (142 / 58 / 27).
  // Each is attributed to its own generated promoter, keeping points consistent.
  const targets = [142, 58, 27];
  const existing = [friends.length, 0, 0];
  const buildHistory = db.transaction(() => {
    let n = 0;
    for (let ci = 0; ci < campaigns.length; ci++) {
      const extra = targets[ci] - existing[ci];
      for (let i = 0; i < extra; i++) {
        n += 1;
        const custId = newId();
        const points = campaigns[ci].points;
        insCustomer.run(
          custId,
          tenantId,
          `Promotor ${String(n).padStart(3, "0")}`,
          `promotor${n}@demo.com`,
          `P${String(n).padStart(5, "0")}`,
          points,
          "2024-06-01",
        );
        addConversion(custId, campaignIds[ci], points, `Indicado ${n}`, "2024-06-01");
      }
    }
  });
  buildHistory();

  console.log(
    `[seed] tenant=demo admin=admin@demo.com/triggma123 customer=JOAO01 (tenant slug: demo)`,
  );
}
