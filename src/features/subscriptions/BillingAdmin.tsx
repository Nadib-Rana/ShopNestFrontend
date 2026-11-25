import { FormEvent, useEffect, useState } from "react"
import { money } from "@/utils/format"
import { clearRegisteredUser, getRegisteredUser } from "@/utils/auth"
import { getStoreSettings } from "@/repositories/settingsStore"
import { canCallProtectedApi } from "@/services/backendSync"
import { shopnestApi } from "@/services/shopnestApi"

type PaymentStatus = "Under Review" | "Approved" | "Rejected" | "Requires More Information"
type Payment = {
  id: string
  dbId?: string
  transaction: string
  sender: string
  amount: number
  plan: string
  period: string
  date: string
  status: PaymentStatus
  reason?: string
  seller: string
  store: string
}

const defaultPlans = [
  { id: "monthly", name: "Monthly", price: 500, period: "30 days", saving: 0 },
  { id: "quarterly", name: "Quarterly", price: 1350, period: "90 days", saving: 150, recommended: true },
  { id: "yearly", name: "Yearly", price: 4800, period: "365 days", saving: 1200 },
]
const initialPayments: Payment[] = [
  { id: "PAY-2048", transaction: "TXN8A4K29P", sender: "01XXX XXX 448", amount: 1350, plan: "Quarterly", period: "90 days", date: "May 24, 2025", status: "Under Review", seller: "Saif Rahman", store: "Trendora Fashion" },
  { id: "PAY-2047", transaction: "TXN3N9Q11M", sender: "01XXX XXX 921", amount: 500, plan: "Monthly", period: "30 days", date: "May 23, 2025", status: "Approved", seller: "Farhana Noor", store: "Bloom Beauty" },
  { id: "PAY-2046", transaction: "TXN7Z2P55B", sender: "01XXX XXX 104", amount: 4800, plan: "Yearly", period: "365 days", date: "May 22, 2025", status: "Rejected", reason: "The transaction reference could not be matched. Please verify and resubmit.", seller: "Imran Kabir", store: "Nova Electronics" },
]
const key = "shopnest-prototype-payments"
const getPayments = (): Payment[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") || initialPayments
  } catch {
    return initialPayments
  }
}
const setStored = (items: Payment[]) => localStorage.setItem(key, JSON.stringify(items))

function mapApiPaymentStatus(status?: string): PaymentStatus {
  const s = String(status || "").toUpperCase()
  if (s === "APPROVED") return "Approved"
  if (s === "REJECTED") return "Rejected"
  if (s === "REQUIRES_MORE_INFO") return "Requires More Information"
  return "Under Review"
}

function mapApiPayment(raw: Record<string, unknown>): Payment {
  const plan = (raw.plan as Record<string, unknown> | undefined) || {}
  const store = (raw.store as Record<string, unknown> | undefined) || {}
  const owner = (store.owner as Record<string, unknown> | undefined) || {}
  const ownerName =
    `${String(owner.firstName || "").trim()} ${String(owner.lastName || "").trim()}`.trim() ||
    String(owner.email || "Seller")
  const rawDate = raw.paymentDate || raw.createdAt
  const formattedDate = rawDate
    ? new Date(String(rawDate)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—"

  return {
    id: String(raw.referenceCode || raw.id || "PAY-0000"),
    dbId: String(raw.id || ""),
    transaction: String(raw.transactionId || ""),
    sender: String(raw.senderAccount || ""),
    amount: Number(raw.amount || 0),
    plan: String(plan.name || raw.planId || "Plan"),
    period: plan.durationDays ? `${plan.durationDays} days` : "30 days",
    date: formattedDate,
    status: mapApiPaymentStatus(String(raw.status || "")),
    reason: raw.adminReason ? String(raw.adminReason) : undefined,
    seller: ownerName,
    store: String(store.name || "Store"),
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className={`ba-badge ${String(children).toLowerCase().replaceAll(" ", "-")}`}><i />{children}</span>
}

export function SellerBilling({ path, go, notify }: { path: string; go: (p: string) => void; notify: (m: string) => void }) {
  const [plans, setPlans] = useState(defaultPlans)
  const [payments, setPayments] = useState<Payment[]>(() => (canCallProtectedApi() ? [] : getPayments()))
  const [selected, setSelected] = useState(defaultPlans[1])
  const [amount, setAmount] = useState(String(defaultPlans[1].price))
  const [review, setReview] = useState<Record<string, string> | null>(null)
  const [storeInfo, setStoreInfo] = useState<{ status?: string; trialDaysRemaining?: number; trialEndsAt?: string } | null>(null)

  useEffect(() => {
    setAmount(String(selected.price))
  }, [selected])

  useEffect(() => {
    if (!canCallProtectedApi()) return
    void Promise.allSettled([
      shopnestApi.billing.listPlans().then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map((p: Record<string, unknown>) => ({
            id: String(p.id),
            name: String(p.name),
            price: Number(p.price),
            period: `${p.durationDays} days`,
            saving: Number(p.saving || 0),
            recommended: Boolean(p.recommended),
          }))
          setPlans(mapped)
          setSelected(mapped.find((x) => x.recommended) || mapped[0])
        }
      }),
      shopnestApi.billing.listPayments().then((res) => {
        if (Array.isArray(res)) {
          setPayments(res.map((item) => mapApiPayment(item as Record<string, unknown>)))
        }
      }),
      shopnestApi.stores.getMyStore().then((res) => {
        if (res && typeof res === "object") {
          setStoreInfo(res as { status?: string; trialDaysRemaining?: number; trialEndsAt?: string })
        }
      }),
    ])
  }, [])

  const detail = path.split("/")[3]
  const currentUser = getRegisteredUser()
  const currentStore = getStoreSettings().storeName || "Trendora Fashion"
  const currentSeller = currentUser?.name || "Saif Rahman"
  const sellerPayments = canCallProtectedApi()
    ? payments
    : payments.filter((p) => p.seller === currentSeller || p.seller === "Saif Rahman")
  const hasActiveSubscription =
    storeInfo?.status === "ACTIVE" || sellerPayments.some((p) => p.status === "Approved")
  const trialDays = storeInfo?.trialDaysRemaining ?? 5
  const persist = (next: Payment[]) => {
    setPayments(next)
    if (!canCallProtectedApi()) setStored(next)
  }

  if (detail === "history") {
    return (
      <BillingPage title="Payment history" subtitle="Track all manual subscription submissions." go={go}>
        <PaymentTable payments={sellerPayments} onOpen={(id) => go(`/seller/subscription/${id}`)} />
      </BillingPage>
    )
  }
  if (detail?.startsWith("PAY-")) {
    const payment = sellerPayments.find((p) => p.id === detail) || sellerPayments[0]
    if (!payment) {
      return (
        <BillingPage title="Payment not found" subtitle="No manual payment submission exists yet." go={go}>
          <button className="primary" onClick={() => go("/seller/subscription/pay")}>Submit a new payment</button>
        </BillingPage>
      )
    }
    return (
      <BillingPage title={`Payment ${payment.id}`} subtitle="Manual payment verification record." go={go}>
        <PaymentDetail payment={payment} />
        {payment.status === "Rejected" && (
          <button className="primary" onClick={() => go("/seller/subscription/pay")}>Submit a new payment</button>
        )}
      </BillingPage>
    )
  }
  if (detail === "confirmation") {
    return (
      <BillingPage title="Submission received" subtitle="Awaiting Super Admin verification." go={go}>
        <div className="ba-confirm">
          <div>✓</div>
          <Badge>Under Review</Badge>
          <h2>Your payment is awaiting manual review.</h2>
          <p>An administrator must compare your transaction reference with merchant records. Submission does not activate a subscription until approved.</p>
          <button className="primary" onClick={() => go("/seller/subscription/history")}>View payment status</button>
        </div>
      </BillingPage>
    )
  }
  if (detail === "pay") {
    const submit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const d = new FormData(e.currentTarget)
      const txn = String(d.get("transaction")).trim().toUpperCase()
      if (payments.some((p) => p.transaction === txn)) return notify("This transaction ID has already been submitted")
      setReview({
        transaction: txn,
        sender: String(d.get("sender")),
        amount: String(d.get("amount")),
        date: String(d.get("date")),
        provider: String(d.get("provider") || "Mobile Banking"),
      })
    }
    if (review) {
      return (
        <BillingPage title="Review payment" subtitle="Confirm the details before sending for manual review." go={go}>
          <div className="ba-review ba-card">
            <h3>{selected.name} plan</h3>
            <dl>
              <div><dt>Transaction ID</dt><dd>{review.transaction}</dd></div>
              <div><dt>Sender</dt><dd>{review.sender}</dd></div>
              <div><dt>Amount</dt><dd>{money(Number(review.amount))}</dd></div>
              <div><dt>Payment date</dt><dd>{review.date}</dd></div>
              <div><dt>Status after submission</dt><dd><Badge>Under Review</Badge></dd></div>
            </dl>
            <div className="ba-actions">
              <button className="secondary" onClick={() => setReview(null)}>Edit details</button>
              <button
                className="primary"
                onClick={async () => {
                  if (canCallProtectedApi()) {
                    try {
                      const created = await shopnestApi.billing.submitPayment({
                        planId: selected.id,
                        provider: review.provider,
                        transactionId: review.transaction,
                        senderAccount: review.sender,
                        amount: Number(review.amount),
                        paymentDate: review.date,
                      })
                      setPayments((prev) => [mapApiPayment(created as Record<string, unknown>), ...prev])
                    } catch (err) {
                      notify(err instanceof Error ? err.message : "Failed to submit payment")
                      return
                    }
                  } else {
                    const next: [Payment, ...Payment[]] = [
                      {
                        id: `PAY-${2050 + payments.length}`,
                        transaction: review.transaction,
                        sender: review.sender,
                        amount: Number(review.amount),
                        plan: selected.name,
                        period: selected.period,
                        date: review.date,
                        status: "Under Review",
                        seller: currentSeller,
                        store: currentStore,
                      },
                      ...payments,
                    ]
                    persist(next)
                  }
                  setReview(null)
                  go("/seller/subscription/confirmation")
                }}
              >
                Submit for verification
              </button>
            </div>
          </div>
        </BillingPage>
      )
    }
    return (
      <BillingPage title="Submit manual payment" subtitle="Send payment to merchant account and submit your transaction reference." go={go}>
        <div className="payment-layout">
          <form className="ba-card payment-form" onSubmit={submit}>
            <h3>Payment details</h3>
            <label>
              Plan
              <select value={selected.id} onChange={(e) => setSelected(plans.find((p) => p.id === e.target.value)!)}>
                {plans.map((p) => <option value={p.id} key={p.id}>{p.name} — {money(p.price)}</option>)}
              </select>
            </label>
            <label>
              Payment provider
              <select name="provider">
                <option>bKash Merchant</option>
                <option>Nagad Merchant</option>
                <option>Bank Transfer</option>
              </select>
            </label>
            <label>Transaction ID<input name="transaction" required minLength={6} placeholder="e.g. TXN123ABC" /></label>
            <label>Sender account or phone<input name="sender" required placeholder="017XXXXXXXX" /></label>
            <div>
              <label>Amount paid<input name="amount" type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
              <label>Payment date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
            </div>
            <button className="primary full-button">Review submission</button>
          </form>
          <aside className="ba-card instructions">
            <Badge>Manual verification</Badge>
            <h3>How to pay</h3>
            <ol>
              <li>Select the configured merchant payment option.</li>
              <li>Send exactly <strong>{money(selected.price)}</strong>.</li>
              <li>Use merchant number <strong>01XXX-XXX-000</strong>.</li>
              <li>Save your transaction reference.</li>
            </ol>
            <p>An administrator will review merchant records and activate your subscription.</p>
          </aside>
        </div>
      </BillingPage>
    )
  }

  return (
    <BillingPage
      title="Subscription & billing"
      subtitle={hasActiveSubscription ? "Subscription active · All storefront features unlocked" : `Trial active · ${trialDays} days remaining`}
      go={go}
    >
      <section className="trial-progress ba-card">
        <div>
          <Badge>{hasActiveSubscription ? "Subscription Active" : "Trial Active"}</Badge>
          <h3>{hasActiveSubscription ? "Your subscription is active" : "Make the most of your free trial"}</h3>
          <p>{hasActiveSubscription ? "Payment verified by Super Admin · Manual renewal enabled" : "Choose a plan to keep your store running without interruption."}</p>
        </div>
        <div><span style={{ width: hasActiveSubscription ? "100%" : "29%" }} /></div>
      </section>
      <div className="ba-plans">
        {plans.map((p) => (
          <article className={`ba-card ${p.recommended ? "recommended" : ""}`} key={p.id}>
            {p.recommended && <b>Recommended</b>}
            <h3>{p.name}</h3>
            <div className="ba-price">{money(p.price)}<span> / {p.period}</span></div>
            {p.saving > 0 ? <p>Save {money(p.saving)} versus monthly</p> : <p>Flexible monthly billing</p>}
            <ul>
              <li>Unlimited products</li>
              <li>Guest checkout</li>
              <li>Theme customization</li>
              <li>Order and inventory tools</li>
            </ul>
            <button className={p.recommended ? "primary" : "secondary"} onClick={() => { setSelected(p); go("/seller/subscription/pay") }}>
              Choose {p.name}
            </button>
          </article>
        ))}
      </div>
      <section className="ba-card subscription-summary">
        <div><span>Current status</span><Badge>{hasActiveSubscription ? "Subscription Active" : "Trial Active"}</Badge></div>
        <div><span>Latest payment</span><strong>{sellerPayments[0]?.id || "No submissions"}</strong></div>
        <div><span>Renewal</span><strong>Manual renewal</strong></div>
        <button className="secondary" onClick={() => go("/seller/subscription/history")}>Payment history</button>
      </section>
    </BillingPage>
  )
}

function BillingPage({ title, subtitle, go, children }: { title: string; subtitle: string; go: (p: string) => void; children: React.ReactNode }) {
  return (
    <div className="content billing-module">
      <div className="section-title">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        {title !== "Subscription & billing" && <button className="secondary" onClick={() => go("/seller/subscription")}>Back to billing</button>}
      </div>
      {children}
    </div>
  )
}

function PaymentTable({ payments, onOpen }: { payments: Payment[]; onOpen: (id: string) => void }) {
  return (
    <div className="ba-card ba-table">
      <div className="ba-row ba-head"><span>Reference</span><span>Plan</span><span>Amount</span><span>Submitted</span><span>Status</span></div>
      {payments.map((p) => (
        <button className="ba-row" key={p.id} onClick={() => onOpen(p.id)}>
          <strong>{p.id}<small>{p.transaction}</small></strong>
          <span>{p.plan}</span>
          <strong>{money(p.amount)}</strong>
          <span>{p.date}</span>
          <Badge>{p.status}</Badge>
        </button>
      ))}
      {payments.length === 0 && (
        <div style={{ padding: "24px", textAlign: "center", color: "#667085", fontSize: "13px" }}>
          No payment submissions found yet.
        </div>
      )}
    </div>
  )
}

function PaymentDetail({ payment }: { payment: Payment }) {
  return (
    <div className="ba-card ba-review">
      <div className="ba-detail-head">
        <div><span>Verification status</span><Badge>{payment.status}</Badge></div>
        <strong>{money(payment.amount)}</strong>
      </div>
      {payment.status === "Rejected" && (
        <div className="rejection"><strong>Why this was rejected</strong><p>{payment.reason}</p></div>
      )}
      <dl>
        <div><dt>Transaction ID</dt><dd>{payment.transaction}</dd></div>
        <div><dt>Sender account</dt><dd>{payment.sender}</dd></div>
        <div><dt>Selected plan</dt><dd>{payment.plan} · {payment.period}</dd></div>
        <div><dt>Submitted</dt><dd>{payment.date}</dd></div>
        <div><dt>Store</dt><dd>{payment.store}</dd></div>
      </dl>
    </div>
  )
}

interface AdminLiveData {
  overview: {
    totalSellers: number
    activeStores: number
    trialStores: number
    suspendedStores: number
    pendingReviews: number
    subscriptionRevenue: number
  } | null
  sellers: Array<[string, string, string]>
  stores: Array<{ id: string; name: string; slug: string; status: string; ownerEmail: string }>
  subscriptions: Array<[string, string, string]>
  plans: Array<[string, string, string]>
  themes: Array<[string, string, string]>
  domains: Array<[string, string, string]>
  auditLogs: Array<[string, string, string]>
  loaded: boolean
}

const adminNav = ["Overview", "Sellers", "Stores", "Payments", "Subscriptions", "Plans", "Themes", "Domains", "Settings", "Audit log"]

export function AdminApp({ path, go }: { path: string; go: (p: string) => void }) {
  const backendLive = canCallProtectedApi()
  const [payments, setPayments] = useState<Payment[]>(() => (backendLive ? [] : getPayments()))
  const [mobile, setMobile] = useState(false)
  const [live, setLive] = useState<AdminLiveData>({
    overview: null,
    sellers: [],
    stores: [],
    subscriptions: [],
    plans: [],
    themes: [],
    domains: [],
    auditLogs: [],
    loaded: !backendLive,
  })
  const section = path.split("/")[2] || "overview"
  const detail = path.split("/")[3]

  const refreshAdminData = () => {
    if (!canCallProtectedApi()) return
    void Promise.allSettled([
      shopnestApi.admin.overview(),
      shopnestApi.admin.listPayments(),
      shopnestApi.admin.listSellers(),
      shopnestApi.admin.listStores(),
      shopnestApi.admin.auditLogs(),
      shopnestApi.billing.listPlans(),
      shopnestApi.themes.list(),
    ]).then(([ovRes, payRes, selRes, stRes, audRes, plRes, thRes]) => {
      const mappedPayments =
        payRes.status === "fulfilled" && Array.isArray(payRes.value)
          ? payRes.value.map((p) => mapApiPayment(p as Record<string, unknown>))
          : []
      setPayments(mappedPayments)

      const sellersList: Array<[string, string, string]> =
        selRes.status === "fulfilled" && Array.isArray(selRes.value)
          ? selRes.value.map((u: Record<string, unknown>) => {
              const name = `${String(u.firstName || "").trim()} ${String(u.lastName || "").trim()}`.trim() || String(u.email || "Seller")
              const stores = (u.stores as Array<Record<string, unknown>> | undefined) || []
              const storeLabel = stores.length > 0 ? stores.map((s) => String(s.name)).join(", ") : `${String(u.email)} (No store yet)`
              const statusLabel = stores[0]?.status ? String(stores[0].status) : String(u.status || "ACTIVE")
              return [name, storeLabel, statusLabel]
            })
          : []

      const storesList =
        stRes.status === "fulfilled" && Array.isArray(stRes.value)
          ? stRes.value.map((s: Record<string, unknown>) => {
              const owner = (s.owner as Record<string, unknown> | undefined) || {}
              return {
                id: String(s.id),
                name: String(s.name),
                slug: String(s.slug),
                status: String(s.status),
                ownerEmail: String(owner.email || ""),
              }
            })
          : []

      const domainsList: Array<[string, string, string]> = storesList.map((s) => [
        `${s.slug}.shopnest.app`,
        s.name,
        s.status,
      ])

      const subscriptionsList: Array<[string, string, string]> = storesList.map((s) => [
        s.name,
        s.ownerEmail || s.slug,
        s.status,
      ])

      const plansList: Array<[string, string, string]> =
        plRes.status === "fulfilled" && Array.isArray(plRes.value)
          ? plRes.value.map((p: Record<string, unknown>) => [
              String(p.name),
              `${money(Number(p.price))} / ${p.durationDays} days`,
              p.recommended ? "Recommended" : "Active",
            ])
          : []

      const themesList: Array<[string, string, string]> =
        thRes.status === "fulfilled" && Array.isArray(thRes.value)
          ? thRes.value.map((t: Record<string, unknown>) => [
              String(t.title),
              String(t.label),
              t.isActive === false ? "Draft" : "Published",
            ])
          : []

      const auditList: Array<[string, string, string]> =
        audRes.status === "fulfilled" && Array.isArray(audRes.value)
          ? audRes.value.map((a: Record<string, unknown>) => {
              const user = (a.user as Record<string, unknown> | undefined) || {}
              const actor = `${String(user.firstName || "").trim()} ${String(user.lastName || "").trim()}`.trim() || String(user.email || "System")
              const ts = a.createdAt ? new Date(String(a.createdAt)).toLocaleString("en-BD") : "—"
              return [String(a.action), `${actor} · ${String(a.entity)}`, ts]
            })
          : []

      setLive({
        overview:
          ovRes.status === "fulfilled" && ovRes.value && typeof ovRes.value === "object"
            ? (ovRes.value as AdminLiveData["overview"])
            : null,
        sellers: sellersList,
        stores: storesList,
        subscriptions: subscriptionsList,
        plans: plansList,
        themes: themesList,
        domains: domainsList,
        auditLogs: auditList,
        loaded: true,
      })
    })
  }

  useEffect(() => {
    refreshAdminData()
  }, [])

  const persist = (next: Payment[]) => {
    setPayments(next)
    if (!canCallProtectedApi()) setStored(next)
  }

  const user = getRegisteredUser()
  const adminName = user?.name || user?.email?.split("@")[0] || "Maliha Ahmed"
  const adminInitials = adminName.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("") || "SA"

  return (
    <div className="admin-app">
      <aside className={mobile ? "open" : ""}>
        <div className="admin-brand">
          <i>SN</i>
          <span><strong>ShopNest</strong><small>Super Admin</small></span>
          <button onClick={() => setMobile(false)}>×</button>
        </div>
        <nav>
          {adminNav.map((n) => (
            <button
              className={section === n.toLowerCase().replace(" ", "-") ? "active" : ""}
              onClick={() => { go(`/admin/${n.toLowerCase().replace(" ", "-")}`); setMobile(false) }}
              key={n}
            >
              {n}<span>›</span>
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <i>{adminInitials}</i>
          <span><strong>{adminName}</strong><small>Platform owner</small></span>
        </div>
      </aside>
      <main>
        <header>
          <button className="admin-menu" onClick={() => setMobile(true)}>☰</button>
          <div>
            <h1>{adminNav.find((n) => n.toLowerCase().replace(" ", "-") === section) || "Overview"}</h1>
            <p>{backendLive ? "Platform administration · Live PostgreSQL data" : "Platform administration · Prototype environment"}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="secondary" onClick={() => go("/seller/overview")}>Seller view</button>
            <button className="secondary" onClick={() => { clearRegisteredUser(); go("/login") }}>Log out</button>
          </div>
        </header>
        {section === "overview" ? (
          <AdminOverview payments={payments} overview={live.overview} go={go} />
        ) : section === "payments" ? (
          <AdminPayments payments={payments} detail={detail} go={go} persist={persist} onReviewed={refreshAdminData} />
        ) : (
          <AdminSection section={section} live={live} onRefresh={refreshAdminData} />
        )}
      </main>
    </div>
  )
}

function AdminOverview({
  payments,
  overview,
  go,
}: {
  payments: Payment[]
  overview: AdminLiveData["overview"]
  go: (p: string) => void
}) {
  const pending = overview ? overview.pendingReviews : payments.filter((p) => p.status === "Under Review").length
  const totalSellers = overview ? overview.totalSellers : 248
  const activeStores = overview ? overview.activeStores : 193
  const trialStores = overview ? overview.trialStores : 38
  const suspendedStores = overview ? overview.suspendedStores : 17
  const revenue = overview ? money(overview.subscriptionRevenue) : "৳186,400"

  return (
    <div className="admin-content">
      <div className="admin-metrics">
        {[
          ["Registered sellers", String(totalSellers), overview ? "Live database count" : "+18 this month"],
          ["Active stores", String(activeStores), `${trialStores} in trial · ${suspendedStores} suspended`],
          ["Pending reviews", String(pending), "Needs attention"],
          ["Subscription revenue", revenue, overview ? "Approved payments total" : "Mock monthly total"],
        ].map((x) => (
          <div className="ba-card" key={x[0]}>
            <span>{x[0]}</span>
            <strong>{x[1]}</strong>
            <small>{x[2]}</small>
          </div>
        ))}
      </div>
      <div className="admin-grid">
        <section className="ba-card admin-chart">
          <div><h3>Subscription growth</h3><span>Last 6 months</span></div>
          <div className="bar-chart">{[38, 46, 51, 62, 74, 88].map((h, i) => <i style={{ height: `${h}%` }} key={i} />)}</div>
        </section>
        <section className="ba-card breakdown">
          <h3>Store status</h3>
          <div className="admin-donut" />
          <p><span>Active {activeStores}</span><span>Trial {trialStores}</span><span>Suspended {suspendedStores}</span></p>
        </section>
      </div>
      <section className="ba-card admin-recent">
        <div><h3>Recent payment submissions</h3><button onClick={() => go("/admin/payments")}>Review queue</button></div>
        <PaymentTable payments={payments.slice(0, 5)} onOpen={(id) => go(`/admin/payments/${id}`)} />
      </section>
    </div>
  )
}

function AdminPayments({
  payments,
  detail,
  go,
  persist,
  onReviewed,
}: {
  payments: Payment[]
  detail?: string
  go: (p: string) => void
  persist: (p: Payment[]) => void
  onReviewed: () => void
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [decision, setDecision] = useState<"approve" | "reject" | "more" | null>(null)
  const [reason, setReason] = useState("")
  const payment = payments.find((p) => p.id === detail)
  if (payment) {
    return (
      <div className="admin-content">
        <button className="back-link" onClick={() => go("/admin/payments")}>← Back to verification queue</button>
        <div className="admin-review-grid">
          <PaymentDetail payment={payment} />
          <aside className="ba-card decision-card">
            <h3>Verification decision</h3>
            <p>Verify the actual transaction against merchant records before approving.</p>
            <button className="approve" disabled={payment.status === "Approved"} onClick={() => setDecision("approve")}>Approve payment</button>
            <button className="reject-button" onClick={() => setDecision("reject")}>Reject payment</button>
            <button className="secondary" onClick={() => setDecision("more")}>Request more information</button>
          </aside>
        </div>
        {decision && (
          <div className="ba-modal" role="dialog" aria-modal="true" aria-labelledby="decision-title">
            <div className="ba-dialog">
              <h2 id="decision-title">
                {decision === "approve" ? "Approve this payment?" : decision === "more" ? "Request more information?" : "Reject this payment?"}
              </h2>
              <p>
                {decision === "approve"
                  ? "Approving activates the seller's store subscription and records an audit log entry."
                  : "Provide a clear message that the seller can use to respond or resubmit."}
              </p>
              {decision !== "approve" && (
                <textarea aria-label="Decision reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Required message" />
              )}
              <div>
                <button className="secondary" onClick={() => setDecision(null)}>Cancel</button>
                <button
                  className={decision === "approve" ? "approve" : "reject-button"}
                  disabled={decision !== "approve" && !reason.trim()}
                  onClick={async () => {
                    const nextStatus: PaymentStatus =
                      decision === "approve" ? "Approved" : decision === "more" ? "Requires More Information" : "Rejected"
                    const apiStatus =
                      decision === "approve" ? "APPROVED" : decision === "more" ? "REQUIRES_MORE_INFO" : "REJECTED"
                    persist(payments.map((p) => (p.id === payment.id ? { ...p, status: nextStatus, reason } : p)))
                    if (canCallProtectedApi()) {
                      await shopnestApi.admin.reviewPayment(payment.dbId || payment.id, apiStatus, reason || undefined).catch(() => undefined)
                      onReviewed()
                    }
                    setDecision(null)
                    setReason("")
                  }}
                >
                  Confirm decision
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  const shown = payments.filter(
    (p) => (status === "All" || p.status === status) && `${p.id} ${p.transaction} ${p.seller} ${p.store}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div className="admin-content">
      <div className="admin-filter">
        <input aria-label="Search payments" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transaction, seller or store" />
        <select aria-label="Filter payment status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Under Review</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Requires More Information</option>
        </select>
      </div>
      <PaymentTable payments={shown} onOpen={(id) => go(`/admin/payments/${id}`)} />
    </div>
  )
}

function AdminSection({ section, live, onRefresh }: { section: string; live: AdminLiveData; onRefresh: () => void }) {
  const [query, setQuery] = useState("")
  const backendLive = canCallProtectedApi()

  if (section === "stores" && backendLive) {
    const filteredStores = live.stores.filter((s) =>
      `${s.name} ${s.slug} ${s.ownerEmail} ${s.status}`.toLowerCase().includes(query.toLowerCase()),
    )
    return (
      <div className="admin-content">
        <div className="admin-filter">
          <input aria-label="Search stores" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stores" />
        </div>
        <div className="ba-card generic-admin-list">
          {filteredStores.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #eff1f3", gap: "12px" }}>
              <div>
                <strong style={{ display: "block", fontSize: "14px" }}>{s.name}</strong>
                <small style={{ color: "#667085" }}>{s.slug}.shopnest.app · {s.ownerEmail}</small>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Badge>{s.status}</Badge>
                <button
                  className="secondary"
                  onClick={async () => {
                    const next = s.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
                    await shopnestApi.admin.updateStoreStatus(s.id, next).catch(() => undefined)
                    onRefresh()
                  }}
                >
                  {s.status === "SUSPENDED" ? "Activate" : "Suspend"}
                </button>
              </div>
            </div>
          ))}
          {filteredStores.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "#667085", fontSize: "13px" }}>
              No stores found in database.
            </div>
          )}
        </div>
      </div>
    )
  }

  const fallbackData: Record<string, [string, string, string][]> = {
    sellers: [["Saif Rahman", "Trendora Fashion", "Trial Active"]],
    stores: [["Trendora Fashion", "trendora.shopnest.app", "Active"]],
    subscriptions: [["Trendora Fashion", "Quarterly", "Under Review"]],
    plans: [
      ["Monthly", "৳500 / 30 days", "Active"],
      ["Quarterly", "৳1,350 / 90 days", "Recommended"],
      ["Yearly", "৳4,800 / 365 days", "Active"],
    ],
    themes: [["Fashion Store", "Fashion & Clothing", "Published"]],
    domains: [["trendora.shopnest.app", "Platform subdomain", "Active"]],
    settings: [
      ["Trial duration", "7 days", "Configurable"],
      ["Default currency", "BDT (৳)", "Active"],
      ["Storefront expiry policy", "Show maintenance page", "Configurable"],
    ],
    "audit-log": [["System initialized", "ShopNest", "Ready"]],
  }

  const liveData: Record<string, [string, string, string][]> = {
    sellers: live.sellers,
    subscriptions: live.subscriptions,
    plans: live.plans,
    themes: live.themes,
    domains: live.domains,
    settings: fallbackData.settings,
    "audit-log": live.auditLogs,
  }

  const source = backendLive ? liveData[section] || [] : fallbackData[section] || []
  const rows = source.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="admin-content">
      <div className="admin-filter">
        <input aria-label={`Search ${section}`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${section.replace("-", " ")}`} />
      </div>
      <div className="ba-card generic-admin-list">
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #eff1f3" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <i style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#f2f4f7", display: "grid", placeItems: "center", fontStyle: "normal", fontWeight: 700, fontSize: "12px" }}>
                {r[0].slice(0, 2).toUpperCase()}
              </i>
              <span>
                <strong style={{ display: "block", fontSize: "13px" }}>{r[0]}</strong>
                <small style={{ color: "#667085" }}>{r[1]}</small>
              </span>
            </div>
            <Badge>{r[2]}</Badge>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", color: "#667085", fontSize: "13px" }}>
            {backendLive && !live.loaded ? "Loading live database records..." : `No ${section.replace("-", " ")} records found.`}
          </div>
        )}
      </div>
    </div>
  )
}
