import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import assert from "node:assert/strict";

// Isolated DB so the seed runs fresh for this test.
const tmpDb = path.join(os.tmpdir(), `triggma-test-${Date.now()}.db`);
process.env.TRIGGMA_DB = tmpDb;
process.env.PORT = "4555";

const BASE = "http://localhost:4555/api";

async function http(method: string, p: string, body?: unknown, token?: string) {
  const res = await fetch(`${BASE}${p}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

async function waitForHealth() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("server did not start");
}

let passed = 0;
function check(name: string, cond: boolean) {
  assert.ok(cond, name);
  passed += 1;
  console.log(`  ok - ${name}`);
}

async function main() {
  const { app } = await import("../index.js");
  const server = app.listen(4555);
  await waitForHealth();

  try {
    // 1. Company login (seeded demo admin)
    const login = await http("POST", "/auth/login", {
      email: "admin@demo.com",
      password: "triggma123",
    });
    check("company login returns token", login.status === 200 && !!login.body.token);
    const token = login.body.token as string;

    // 2. Dashboard KPIs
    const dash = await http("GET", "/dashboard", undefined, token);
    check("dashboard has conversions", dash.status === 200 && dash.body.conversions >= 3);

    // 3. Create a campaign
    const camp = await http(
      "POST",
      "/campaigns",
      { name: "Teste E2E", points_per_conversion: 75, goal: 50 },
      token,
    );
    check("campaign created", camp.status === 201 && camp.body.conversions === 0);

    // 4. Reject invalid campaign dates
    const badCamp = await http(
      "POST",
      "/campaigns",
      { name: "Bad", start_date: "2025-12-31", end_date: "2025-01-01" },
      token,
    );
    check("campaign rejects end<start", badCamp.status === 400);

    // 5. Public referral resolves (seeded slug joaosilva)
    const ref = await http("GET", "/r/joaosilva");
    check("referral link resolves referrer", ref.status === 200 && ref.body.referrer.name === "Joao Silva");

    // 6. Capture a lead through the public link
    const lead = await http("POST", "/r/joaosilva/lead", {
      name: "Lead E2E",
      email: "lead.e2e@example.com",
    });
    check("public lead captured", lead.status === 201);

    // 7. Anti-duplicate lead
    const dupLead = await http("POST", "/r/joaosilva/lead", {
      name: "Lead E2E",
      email: "lead.e2e@example.com",
    });
    check("duplicate lead blocked", dupLead.status === 409);

    // 8. Find the new lead and convert it -> credits referrer points
    const me = await http("POST", "/auth/customer-login", { tenantSlug: "demo", referralCode: "JOAO01" });
    const beforeBalance = (
      await http("GET", "/customer/me", undefined, me.body.token)
    ).body.customer.points_balance as number;

    const leads = await http("GET", "/leads", undefined, token);
    const target = (leads.body as any[]).find((l) => l.email === "lead.e2e@example.com");
    const conv = await http("POST", `/leads/${target.id}/convert`, {}, token);
    check("lead converted", conv.status === 200);

    const dupConv = await http("POST", `/leads/${target.id}/convert`, {}, token);
    check("lead cannot convert twice", dupConv.status === 409);

    const afterBalance = (
      await http("GET", "/customer/me", undefined, me.body.token)
    ).body.customer.points_balance as number;
    check(
      "points credited on conversion (+50)",
      afterBalance === beforeBalance + 50,
    );

    // 9. Customer redeems a reward (Cafe gratis = 200 pts)
    const rewards = await http("GET", "/customer/rewards", undefined, me.body.token);
    const cheap = (rewards.body as any[]).find((r) => r.points_required === 200);
    const redeem = await http("POST", `/customer/rewards/${cheap.id}/redeem`, {}, me.body.token);
    check("reward redeemed -> voucher", redeem.status === 201 && /^TRG-/.test(redeem.body.voucher_code));

    const afterRedeem = (
      await http("GET", "/customer/me", undefined, me.body.token)
    ).body.customer.points_balance as number;
    check("points debited on redeem (-200)", afterRedeem === afterBalance - 200);

    // 10. Insufficient points blocked (Servico premium = 1200)
    const pricey = (rewards.body as any[]).find((r) => r.points_required === 1200);
    const failRedeem = await http("POST", `/customer/rewards/${pricey.id}/redeem`, {}, me.body.token);
    check("insufficient points blocked", failRedeem.status === 400);

    // 11. Plan usage endpoint
    const plan = await http("GET", "/plan", undefined, token);
    check(
      "plan endpoint reports business plan + limits",
      plan.status === 200 && plan.body.plan === "business" && plan.body.limits.customers === 10000,
    );

    // 12. Reward CRUD (create -> patch -> delete)
    const newReward = await http(
      "POST",
      "/rewards",
      { name: "Reward E2E", points_required: 150, reward_type: "product", quantity_available: 5 },
      token,
    );
    check("reward created", newReward.status === 201);
    const patchedReward = await http(
      "PATCH",
      `/rewards/${newReward.body.id}`,
      { points_required: 175, quantity_available: 9 },
      token,
    );
    check(
      "reward updated",
      patchedReward.status === 200 && patchedReward.body.points_required === 175 && patchedReward.body.quantity_available === 9,
    );
    const delReward = await http("DELETE", `/rewards/${newReward.body.id}`, undefined, token);
    check("reward deleted", delReward.status === 200);

    // 13. Campaign edit + delete protections
    const camps = await http("GET", "/campaigns", undefined, token);
    const editable = (camps.body as any[]).find((c) => c.name === "Teste E2E");
    const editedCampaign = await http(
      "PATCH",
      `/campaigns/${editable.id}`,
      { name: "Teste E2E (editado)", points_per_conversion: 90 },
      token,
    );
    check(
      "campaign edited",
      editedCampaign.status === 200 && editedCampaign.body.name === "Teste E2E (editado)" && editedCampaign.body.points_per_conversion === 90,
    );
    const seededCampaign = (camps.body as any[]).find((c) => c.conversions > 0);
    const blockedDelete = await http("DELETE", `/campaigns/${seededCampaign.id}`, undefined, token);
    check("campaign with conversions cannot be deleted", blockedDelete.status === 409);

    // 14. Customer edit
    const newCustomer = await http(
      "POST",
      "/customers",
      { name: "Cliente E2E", email: "cliente.e2e@example.com" },
      token,
    );
    check("customer created", newCustomer.status === 201);
    const editedCustomer = await http(
      "PATCH",
      `/customers/${newCustomer.body.id}`,
      { name: "Cliente E2E Renomeado" },
      token,
    );
    check("customer edited", editedCustomer.status === 200 && editedCustomer.body.name === "Cliente E2E Renomeado");

    // 15. CNPJ/CPF validation on company signup
    const badDoc = await http("POST", "/auth/register-company", {
      companyName: "Empresa Inválida",
      name: "Dono",
      email: `baddoc.${Date.now()}@example.com`,
      password: "secret123",
      document: "11.111.111/1111-11",
    });
    check("invalid CNPJ rejected on signup", badDoc.status === 400 && badDoc.body.error === "invalid_document");

    // 16. Plan limit enforcement on a fresh FREE tenant (1 active campaign allowed)
    const reg = await http("POST", "/auth/register-company", {
      companyName: "Empresa Free E2E",
      name: "Dono",
      email: `free.e2e.${Date.now()}@example.com`,
      password: "secret123",
      document: "11.222.333/0001-81",
    });
    check("valid CNPJ accepted on signup", reg.status === 200 && !!reg.body.token);
    const freeToken = reg.body.token as string;
    const firstCampaign = await http("POST", "/campaigns", { name: "C1", status: "active" }, freeToken);
    check("free tenant: first active campaign allowed", firstCampaign.status === 201);
    const secondCampaign = await http("POST", "/campaigns", { name: "C2", status: "active" }, freeToken);
    check("free tenant: second active campaign blocked by plan limit", secondCampaign.status === 403 && secondCampaign.body.error === "plan_limit");

    // 17. Auth enforcement
    const noAuth = await http("GET", "/dashboard");
    check("dashboard requires auth", noAuth.status === 401);

    console.log(`\nAll ${passed} checks passed ✅`);
  } finally {
    server.close();
    try {
      fs.rmSync(tmpDb, { force: true });
      fs.rmSync(`${tmpDb}-wal`, { force: true });
      fs.rmSync(`${tmpDb}-shm`, { force: true });
    } catch {
      /* ignore */
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\nTEST FAILED:", err.message);
    process.exit(1);
  });
