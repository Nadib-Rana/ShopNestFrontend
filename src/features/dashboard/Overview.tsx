import React, { useEffect, useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { Status } from "../../components/ui/Status"
import { Metric } from "./Metric"
import { OrderTable, type OrderRow } from "../../components/shared/OrderTable"
import { defaultMockOrders } from "../../constants"
import { getCommerceOrders, getCommerceProducts } from "../../repositories/commerceStore"
import { getStoreSettings } from "../../repositories/settingsStore"
import { getRegisteredUser } from "../../utils/auth"
import { money } from "../../utils/format"
import { canCallProtectedApi } from "../../services/backendSync"
import { shopnestApi } from "../../services/shopnestApi"

const salesSeries: Record<string, { total: number; change: string; line: string; area: string; labels: string[] }> = {
  "Last 7 days": {
    total: 24860,
    change: "+18.2% from previous period",
    line: "M0,145 C55,132 68,87 122,104 S210,138 265,83 S354,114 410,68 S501,95 555,45 S648,68 700,22",
    area: "M0,145 C55,132 68,87 122,104 S210,138 265,83 S354,114 410,68 S501,95 555,45 S648,68 700,22 L700,180 L0,180Z",
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  "Last 30 days": {
    total: 84250,
    change: "+12.5% from previous period",
    line: "M0,140 C100,120 180,60 250,75 S400,130 500,45 S620,80 700,20",
    area: "M0,140 C100,120 180,60 250,75 S400,130 500,45 S620,80 700,20 L700,180 L0,180Z",
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  },
  "Last 90 days": {
    total: 238400,
    change: "+24.8% from previous period",
    line: "M0,150 C150,135 250,90 380,80 S550,50 700,15",
    area: "M0,150 C150,135 250,90 380,80 S550,50 700,15 L700,180 L0,180Z",
    labels: ["Month 1", "Month 2", "Month 3"],
  },
}

function hasApprovedSubscription(): boolean {
  try {
    const raw = localStorage.getItem("shopnest-prototype-payments")
    if (!raw) return false
    const parsed = JSON.parse(raw) as Array<{ status?: string }>
    return Array.isArray(parsed) && parsed.some((p) => p.status === "Approved")
  } catch {
    return false
  }
}

export function Overview({
  onAction,
  setActive,
}: {
  onAction: (m: string) => void
  setActive: (v: string) => void
}) {
  const [range, setRange] = useState("Last 7 days")
  const backendLive = canCallProtectedApi()
  const [liveStats, setLiveStats] = useState<{
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    lowStockCount: number
    totalCustomers: number
    trialDaysRemaining: number
    storeStatus: string
    recentOrders: OrderRow[]
    statusCounts: { pending: number; processing: number; delivered: number; cancelled: number }
  } | null>(null)

  useEffect(() => {
    if (!canCallProtectedApi()) return
    const apiRange = range === "Last 7 days" ? "7d" : range === "Last 90 days" ? "90d" : "30d"
    void Promise.allSettled([
      shopnestApi.analytics.reports(apiRange),
      shopnestApi.orders.list({ page: 1 }),
      shopnestApi.stores.getMyStore(),
    ]).then(([repRes, ordRes, stRes]) => {
      const rep = (repRes.status === "fulfilled" ? repRes.value : {}) as Record<string, unknown>
      const ordData = (ordRes.status === "fulfilled" ? ordRes.value : {}) as { items?: Array<Record<string, unknown>> }
      const store = (stRes.status === "fulfilled" ? stRes.value : {}) as Record<string, unknown>
      const items = Array.isArray(ordData?.items) ? ordData.items : []

      const rows: OrderRow[] = items.slice(0, 5).map((o) => {
        const name = String(o.customerName || "Customer")
        return {
          id: `#${String(o.orderNumber || o.id)}`,
          name,
          initials: name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("") || "CU",
          date: o.createdAt ? new Date(String(o.createdAt)).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
          total: money(Number(o.total || 0)),
          payment: String(o.paymentMethod || "COD") === "Cash on delivery" ? "COD" : String(o.paymentMethod || "COD"),
          status: String(o.status || "PENDING"),
        }
      })

      setLiveStats({
        totalRevenue: Number(rep?.totalRevenue || 0),
        totalOrders: Number(rep?.totalOrders || 0),
        totalProducts: Number(rep?.totalProducts || 0),
        lowStockCount: Number(rep?.lowStockCount || 0),
        totalCustomers: Number(rep?.newCustomers || 0) + Number(rep?.returningCustomers || 0),
        trialDaysRemaining: Number(store?.trialDaysRemaining ?? 7),
        storeStatus: String(store?.status || "TRIAL"),
        recentOrders: rows,
        statusCounts: {
          pending: items.filter((o) => String(o.status).toUpperCase() === "PENDING").length,
          processing: items.filter((o) => ["CONFIRMED", "PROCESSING"].includes(String(o.status).toUpperCase())).length,
          delivered: items.filter((o) => String(o.status).toUpperCase() === "DELIVERED").length,
          cancelled: items.filter((o) => String(o.status).toUpperCase() === "CANCELLED").length,
        },
      })
    })
  }, [range])

  const settings = getStoreSettings()
  const user = getRegisteredUser()
  const products = getCommerceProducts()
  const liveOrders = getCommerceOrders()
  const subscriptionActive = backendLive
    ? liveStats?.storeStatus === "ACTIVE"
    : hasApprovedSubscription()

  const liveSalesTotal = liveOrders.reduce((sum, o) => sum + o.total, 0)
  const totalSales = backendLive ? (liveStats?.totalRevenue ?? 0) : 84250 + liveSalesTotal
  const totalOrdersCount = backendLive ? (liveStats?.totalOrders ?? 0) : 128 + liveOrders.length
  const totalProductsCount = backendLive ? (liveStats?.totalProducts ?? 0) : products.length
  const lowStockCount = backendLive
    ? (liveStats?.lowStockCount ?? 0)
    : products.filter((p) => p.stock <= settings.lowStockThreshold).length
  const uniqueCustomers = backendLive
    ? (liveStats?.totalCustomers ?? 0)
    : 96 + new Set(liveOrders.map((o) => o.phone || o.customer)).size
  const activeSeries = salesSeries[range] || salesSeries["Last 7 days"]
  const displayName = (user?.name || user?.email?.split("@")[0] || "Saif").split(" ")[0]

  const recentRows: OrderRow[] = backendLive
    ? (liveStats?.recentOrders ?? [])
    : [
        ...liveOrders.map((o) => ({
          id: `#${o.id}`,
          name: o.customer,
          initials: o.customer
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase() || "")
            .join("") || "CU",
          date: o.date,
          total: money(o.total),
          payment: o.payment === "Cash on delivery" ? "COD" : o.payment,
          status: o.status,
        })),
        ...defaultMockOrders,
      ].slice(0, 4)

  const pendingCount = backendLive
    ? (liveStats?.statusCounts.pending ?? 0)
    : 18 + liveOrders.filter((o) => o.status === "Pending").length
  const processingCount = backendLive
    ? (liveStats?.statusCounts.processing ?? 0)
    : 38 + liveOrders.filter((o) => o.status === "Processing" || o.status === "Confirmed").length
  const deliveredCount = backendLive
    ? (liveStats?.statusCounts.delivered ?? 0)
    : 64 + liveOrders.filter((o) => o.status === "Delivered").length
  const cancelledCount = backendLive
    ? (liveStats?.statusCounts.cancelled ?? 0)
    : 8 + liveOrders.filter((o) => o.status === "Cancelled").length

  return (
    <div className="content">
      <section className="trial-banner">
        <div className="trial-icon">
          <Icon name={subscriptionActive ? "check" : "clock"} size={21} />
        </div>
        <div>
          <div className="trial-title">
            <Status tone={subscriptionActive ? "green" : "blue"}>
              {subscriptionActive ? "Subscription active" : "Free trial active"}
            </Status>
            <strong>{subscriptionActive ? "Plan verified" : "5 days remaining"}</strong>
          </div>
          <p>
            {subscriptionActive
              ? "Your store subscription is active and all storefront features are unlocked."
              : "Your trial ends on May 29, 2025. Choose a plan to keep your store running without interruption."}
          </p>
        </div>
        <button onClick={() => setActive("Subscription")}>
          {subscriptionActive ? "Manage billing" : "Choose a plan"} <Icon name="arrow" size={15} />
        </button>
      </section>

      <div className="section-title">
        <div>
          <h2>Good morning, {displayName}</h2>
          <p>Here’s what’s happening with {settings.storeName} today.</p>
        </div>
        <button className="primary" onClick={() => setActive("Products")}>
          <Icon name="plus" />Add product
        </button>
      </div>

      <section className="metric-grid">
        <Metric label="Total sales" value={money(totalSales)} change="+12.5%" note="vs. last month" icon="chart" />
        <Metric label="Total orders" value={String(totalOrdersCount)} change="+8.2%" note="vs. last month" icon="orders" />
        <Metric label="Products" value={String(totalProductsCount)} change={`${lowStockCount} low stock`} note={`≤ ${settings.lowStockThreshold} units`} icon="box" amber={lowStockCount > 0} />
        <Metric label="Customers" value={String(uniqueCustomers)} change="+14 new" note="this month" icon="users" />
      </section>

      <section className="dashboard-grid">
        <div className="card sales-card">
          <div className="card-head">
            <div>
              <h3>Sales overview</h3>
              <p>Revenue performance for {range.toLowerCase()}</p>
            </div>
            <select
              className="select-button"
              aria-label="Sales date range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="chart-meta">
            <strong>{money(backendLive ? totalSales : activeSeries.total + liveSalesTotal)}</strong>
            <span>{backendLive ? "Live store revenue" : activeSeries.change}</span>
          </div>
          <div className="chart">
            <div className="chart-lines">
              <i /><i /><i /><i />
            </div>
            <svg viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#5b5ce2" stopOpacity=".22" />
                  <stop offset="1" stopColor="#5b5ce2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="area" d={activeSeries.area} />
              <path className="line" d={activeSeries.line} />
            </svg>
            <div className="chart-labels">
              {activeSeries.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card status-card">
          <div className="card-head">
            <div>
              <h3>Order status</h3>
              <p>{totalOrdersCount} total orders</p>
            </div>
            <button className="dots-button" disabled title="No additional order-status actions are available">
              <Icon name="dots" />
            </button>
          </div>
          <div className="donut">
            <div>
              <strong>{totalOrdersCount}</strong>
              <span>Orders</span>
            </div>
          </div>
          <div className="legend">
            <span><i className="purple" />Processing <b>{processingCount}</b></span>
            <span><i className="green-dot" />Delivered <b>{deliveredCount}</b></span>
            <span><i className="amber-dot" />Pending <b>{pendingCount}</b></span>
            <span><i className="gray-dot" />Cancelled <b>{cancelledCount}</b></span>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="card-head">
          <div>
            <h3>Recent orders</h3>
            <p>Latest orders placed in your store</p>
          </div>
          <button className="text-button" onClick={() => setActive("Orders")}>
            View all orders <Icon name="arrow" size={15} />
          </button>
        </div>
        <OrderTable rows={recentRows} onAction={onAction} />
      </section>
    </div>
  )
}

export default Overview
