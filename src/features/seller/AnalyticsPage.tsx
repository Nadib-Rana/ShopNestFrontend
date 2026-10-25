import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { Badge } from "../../components/ui/Badge"
import { money } from "../../utils/format"

export interface AnalyticsPageProps {
  notify: (message: string) => void
}

type DateRange = "7d" | "30d" | "90d" | "year"

interface RangeData {
  label: string
  totalRevenue: number
  growthRevenue: string
  totalOrders: number
  growthOrders: string
  aov: number
  growthAov: string
  repeatRate: number
  newCustomers: number
  returningCustomers: number
  chartLabels: string[]
  chartPoints: number[]
  svgPath: string
  svgArea: string
  categories: { name: string; count: number; revenue: number; percentage: number; color: string }[]
  topProducts: { name: string; sku: string; units: number; revenue: number; color: string }[]
}

const analyticsByRange: Record<DateRange, RangeData> = {
  "7d": {
    label: "Last 7 days",
    totalRevenue: 24860,
    growthRevenue: "+18.2%",
    totalOrders: 38,
    growthOrders: "+12.4%",
    aov: 654,
    growthAov: "+5.1%",
    repeatRate: 31.6,
    newCustomers: 26,
    returningCustomers: 12,
    chartLabels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    chartPoints: [2800, 3950, 2400, 4200, 3100, 4850, 3560],
    svgPath: "M0,130 C60,110 80,60 140,85 C200,110 240,40 300,55 C360,70 420,120 480,45 C540,-5 600,60 700,30",
    svgArea: "M0,130 C60,110 80,60 140,85 C200,110 240,40 300,55 C360,70 420,120 480,45 C540,-5 600,60 700,30 L700,180 L0,180 Z",
    categories: [
      { name: "Shirts & Tops", count: 18, revenue: 11800, percentage: 47, color: "#5b5ce2" },
      { name: "Trousers & Pants", count: 9, revenue: 6750, percentage: 27, color: "#24a875" },
      { name: "Accessories & Bags", count: 7, revenue: 3850, percentage: 16, color: "#e9a23b" },
      { name: "Cotton Tees", count: 4, revenue: 2460, percentage: 10, color: "#8a4774" },
    ],
    topProducts: [
      { name: "Linen Summer Shirt", sku: "LSS-401", units: 14, revenue: 23100, color: "sand" },
      { name: "Everyday Canvas Tote", sku: "ECT-118", units: 11, revenue: 10450, color: "sage" },
      { name: "Classic Pleated Trouser", sku: "CPT-209", units: 8, revenue: 18000, color: "slate" },
      { name: "Relaxed Cotton Tee", sku: "RCT-310", units: 5, revenue: 4950, color: "cream" },
    ],
  },
  "30d": {
    label: "Last 30 days",
    totalRevenue: 84250,
    growthRevenue: "+12.5%",
    totalOrders: 128,
    growthOrders: "+8.2%",
    aov: 658,
    growthAov: "+4.0%",
    repeatRate: 34.2,
    newCustomers: 82,
    returningCustomers: 46,
    chartLabels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    chartPoints: [18400, 22100, 19850, 23900],
    svgPath: "M0,140 C100,120 180,60 250,75 S400,130 500,45 S620,80 700,20",
    svgArea: "M0,140 C100,120 180,60 250,75 S400,130 500,45 S620,80 700,20 L700,180 L0,180 Z",
    categories: [
      { name: "Shirts & Tops", count: 58, revenue: 39500, percentage: 47, color: "#5b5ce2" },
      { name: "Trousers & Pants", count: 32, revenue: 23600, percentage: 28, color: "#24a875" },
      { name: "Accessories & Bags", count: 24, revenue: 13200, percentage: 16, color: "#e9a23b" },
      { name: "Cotton Tees", count: 14, revenue: 7950, percentage: 9, color: "#8a4774" },
    ],
    topProducts: [
      { name: "Linen Summer Shirt", sku: "LSS-401", units: 48, revenue: 79200, color: "sand" },
      { name: "Classic Pleated Trouser", sku: "CPT-209", units: 31, revenue: 69750, color: "slate" },
      { name: "Everyday Canvas Tote", sku: "ECT-118", units: 28, revenue: 26600, color: "sage" },
      { name: "Relaxed Cotton Tee", sku: "RCT-310", units: 21, revenue: 20790, color: "cream" },
    ],
  },
  "90d": {
    label: "Last 90 days",
    totalRevenue: 238400,
    growthRevenue: "+24.8%",
    totalOrders: 362,
    growthOrders: "+19.1%",
    aov: 659,
    growthAov: "+4.8%",
    repeatRate: 36.8,
    newCustomers: 228,
    returningCustomers: 134,
    chartLabels: ["Month 1", "Month 2", "Month 3"],
    chartPoints: [68000, 78400, 92000],
    svgPath: "M0,150 C150,135 250,90 380,80 S550,50 700,15",
    svgArea: "M0,150 C150,135 250,90 380,80 S550,50 700,15 L700,180 L0,180 Z",
    categories: [
      { name: "Shirts & Tops", count: 165, revenue: 112000, percentage: 47, color: "#5b5ce2" },
      { name: "Trousers & Pants", count: 96, revenue: 66800, percentage: 28, color: "#24a875" },
      { name: "Accessories & Bags", count: 64, revenue: 38200, percentage: 16, color: "#e9a23b" },
      { name: "Cotton Tees", count: 37, revenue: 21400, percentage: 9, color: "#8a4774" },
    ],
    topProducts: [
      { name: "Linen Summer Shirt", sku: "LSS-401", units: 134, revenue: 221100, color: "sand" },
      { name: "Classic Pleated Trouser", sku: "CPT-209", units: 92, revenue: 207000, color: "slate" },
      { name: "Everyday Canvas Tote", sku: "ECT-118", units: 76, revenue: 72200, color: "sage" },
      { name: "Relaxed Cotton Tee", sku: "RCT-310", units: 60, revenue: 59400, color: "cream" },
    ],
  },
  "year": {
    label: "Year to date (2025)",
    totalRevenue: 745200,
    growthRevenue: "+38.4%",
    totalOrders: 1140,
    growthOrders: "+32.6%",
    aov: 654,
    growthAov: "+4.4%",
    repeatRate: 38.5,
    newCustomers: 700,
    returningCustomers: 440,
    chartLabels: ["Jan", "Feb", "Mar", "Apr", "May"],
    chartPoints: [110000, 134000, 155000, 162000, 184200],
    svgPath: "M0,160 C120,140 220,110 340,95 S520,60 700,10",
    svgArea: "M0,160 C120,140 220,110 340,95 S520,60 700,10 L700,180 L0,180 Z",
    categories: [
      { name: "Shirts & Tops", count: 520, revenue: 350200, percentage: 47, color: "#5b5ce2" },
      { name: "Trousers & Pants", count: 310, revenue: 208700, percentage: 28, color: "#24a875" },
      { name: "Accessories & Bags", count: 195, revenue: 119200, percentage: 16, color: "#e9a23b" },
      { name: "Cotton Tees", count: 115, revenue: 67100, percentage: 9, color: "#8a4774" },
    ],
    topProducts: [
      { name: "Linen Summer Shirt", sku: "LSS-401", units: 420, revenue: 693000, color: "sand" },
      { name: "Classic Pleated Trouser", sku: "CPT-209", units: 290, revenue: 652500, color: "slate" },
      { name: "Everyday Canvas Tote", sku: "ECT-118", units: 245, revenue: 232750, color: "sage" },
      { name: "Relaxed Cotton Tee", sku: "RCT-310", units: 185, revenue: 183150, color: "cream" },
    ],
  },
}

export default function AnalyticsPage({ notify }: AnalyticsPageProps) {
  const [range, setRange] = useState<DateRange>("30d")
  const current = analyticsByRange[range]

  const handleExport = () => {
    notify(`Analytics summary for ${current.label} exported (CSV)`)
  }

  return (
    <div className="content management">
      {/* Header & Date Range Filter */}
      <div className="section-title">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2>Analytics & Reports</h2>
            <Badge tone="active">Mock Demo Data</Badge>
          </div>
          <p>Track store revenue, order volume, category performance, and customer retention metrics.</p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            className="select-button"
            aria-label="Filter analytics date range"
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            style={{ minWidth: "160px" }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="year">Year to date (2025)</option>
          </select>

          <button className="secondary" onClick={handleExport}>
            <Icon name="arrow" size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div
        className="mini-metrics"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div className="mg-card" style={{ padding: "18px 20px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Total Revenue
          </span>
          <strong style={{ fontSize: "24px", fontFamily: "var(--font-display)", color: "#1d2939", margin: "6px 0 2px" }}>
            {money(current.totalRevenue)}
          </strong>
          <span style={{ fontSize: "11px", color: "#16845a", fontWeight: 600 }}>
            {current.growthRevenue} <span style={{ color: "#98a2b3", fontWeight: 400 }}>vs previous period</span>
          </span>
        </div>

        <div className="mg-card" style={{ padding: "18px 20px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Total Orders
          </span>
          <strong style={{ fontSize: "24px", fontFamily: "var(--font-display)", color: "#1d2939", margin: "6px 0 2px" }}>
            {current.totalOrders.toLocaleString()}
          </strong>
          <span style={{ fontSize: "11px", color: "#16845a", fontWeight: 600 }}>
            {current.growthOrders} <span style={{ color: "#98a2b3", fontWeight: 400 }}>vs previous period</span>
          </span>
        </div>

        <div className="mg-card" style={{ padding: "18px 20px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Average Order Value (AOV)
          </span>
          <strong style={{ fontSize: "24px", fontFamily: "var(--font-display)", color: "#1d2939", margin: "6px 0 2px" }}>
            {money(current.aov)}
          </strong>
          <span style={{ fontSize: "11px", color: "#16845a", fontWeight: 600 }}>
            {current.growthAov} <span style={{ color: "#98a2b3", fontWeight: 400 }}>vs previous period</span>
          </span>
        </div>

        <div className="mg-card" style={{ padding: "18px 20px" }}>
          <span style={{ color: "#8490a2", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".04em" }}>
            Repeat Customer Rate
          </span>
          <strong style={{ fontSize: "24px", fontFamily: "var(--font-display)", color: "#1d2939", margin: "6px 0 2px" }}>
            {current.repeatRate}%
          </strong>
          <span style={{ fontSize: "11px", color: "#5b5ce2", fontWeight: 600 }}>
            {current.returningCustomers} returning <span style={{ color: "#98a2b3", fontWeight: 400 }}>of {current.newCustomers + current.returningCustomers} total</span>
          </span>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="card sales-card" style={{ marginBottom: "22px" }}>
        <div className="card-head" style={{ marginBottom: "12px" }}>
          <div>
            <h3 style={{ fontSize: "16px" }}>Revenue Trends</h3>
            <p>Performance progression over {current.label.toLowerCase()}</p>
          </div>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#667085" }}>
              Total: <strong>{money(current.totalRevenue)}</strong>
            </span>
          </div>
        </div>

        <div className="chart" style={{ height: "200px" }}>
          <div className="chart-lines">
            <i /><i /><i /><i />
          </div>
          <svg viewBox="0 0 700 180" preserveAspectRatio="none" style={{ height: "100%", width: "100%" }}>
            <defs>
              <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5b5ce2" stopOpacity=".28" />
                <stop offset="1" stopColor="#5b5ce2" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="area" d={current.svgArea} fill="url(#analyticsFill)" />
            <path className="line" d={current.svgPath} fill="none" stroke="#5b5ce2" strokeWidth="2.5" />
          </svg>
          <div className="chart-labels">
            {current.chartLabels.map((lbl) => (
              <span key={lbl}>{lbl}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Sales by Category & Customer Retention */}
      <div className="dashboard-grid" style={{ marginBottom: "22px" }}>
        {/* Sales by Category */}
        <div className="mg-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "15px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Sales by Category
              </h3>
              <p style={{ margin: "3px 0 0", color: "#667085", fontSize: "11px" }}>
                Revenue contribution and units sold per category.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {current.categories.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: "#344054" }}>{cat.name}</span>
                  <span style={{ color: "#667085" }}>
                    {money(cat.revenue)} <small style={{ color: "#98a2b3" }}>({cat.percentage}%)</small>
                  </span>
                </div>
                <div style={{ height: "8px", background: "#f0f2f5", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${cat.percentage}%`,
                      background: cat.color,
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#98a2b3", marginTop: "3px" }}>
                  <span>{cat.count} units shipped</span>
                  <span>Avg price {money(Math.round(cat.revenue / cat.count))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Retention & Loyalty */}
        <div className="mg-card" style={{ padding: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Customer Retention & Loyalty
          </h3>
          <p style={{ margin: "3px 0 16px", color: "#667085", fontSize: "11px" }}>
            Repeat buyers vs first-time shoppers in {current.label.toLowerCase()}.
          </p>

          <div style={{ background: "#f8f9fc", border: "1px solid #eff1f3", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <strong style={{ fontSize: "12px", color: "#1d2939" }}>New vs. Returning</strong>
                <span style={{ display: "block", fontSize: "10px", color: "#667085" }}>
                  {current.newCustomers} New · {current.returningCustomers} Returning
                </span>
              </div>
              <strong style={{ color: "#5b5ce2", fontSize: "14px" }}>{current.repeatRate}%</strong>
            </div>

            <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${100 - current.repeatRate}%`,
                  background: "#16845a",
                }}
                title={`New: ${100 - current.repeatRate}%`}
              />
              <div
                style={{
                  width: `${current.repeatRate}%`,
                  background: "#5b5ce2",
                }}
                title={`Returning: ${current.repeatRate}%`}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8490a2", marginTop: "6px" }}>
              <span>● First-time ({100 - current.repeatRate}%)</span>
              <span>● Returning ({current.repeatRate}%)</span>
            </div>
          </div>

          <h4 style={{ margin: "0 0 10px", fontSize: "12px", color: "#344054" }}>Top Repeat Customers</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f2f4f7", fontSize: "11px" }}>
              <div>
                <strong style={{ color: "#344054" }}>Nusrat Jahan</strong>
                <span style={{ display: "block", color: "#98a2b3", fontSize: "9px" }}>Dhanmondi, Dhaka</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{money(24850)}</strong>
                <span style={{ display: "block", color: "#16845a", fontSize: "9px" }}>8 orders</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f2f4f7", fontSize: "11px" }}>
              <div>
                <strong style={{ color: "#344054" }}>Samira Akter</strong>
                <span style={{ display: "block", color: "#98a2b3", fontSize: "9px" }}>Agrabad, Chattogram</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{money(38690)}</strong>
                <span style={{ display: "block", color: "#16845a", fontSize: "9px" }}>11 orders</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: "11px" }}>
              <div>
                <strong style={{ color: "#344054" }}>Arif Hasan</strong>
                <span style={{ display: "block", color: "#98a2b3", fontSize: "9px" }}>Uttara, Dhaka</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{money(11200)}</strong>
                <span style={{ display: "block", color: "#16845a", fontSize: "9px" }}>4 orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="mg-card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Top Selling Products
            </h3>
            <p style={{ margin: "3px 0 0", color: "#667085", fontSize: "11px" }}>
              Best performing catalog pieces by units sold during {current.label.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="mg-table" style={{ border: "1px solid #eff1f3", borderRadius: "9px" }}>
          <div
            className="mg-row mg-head"
            style={{
              gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
              display: "grid",
              padding: "10px 16px",
            }}
          >
            <span>Product</span>
            <span>SKU</span>
            <span>Units Sold</span>
            <span style={{ textAlign: "right" }}>Total Revenue</span>
          </div>

          {current.topProducts.map((prod) => (
            <div
              className="mg-row"
              key={prod.sku}
              style={{
                gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
                display: "grid",
                padding: "12px 16px",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "var(--color-brand-50)",
                    color: "var(--color-brand-600)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: "10px",
                  }}
                >
                  {prod.name.slice(0, 2).toUpperCase()}
                </span>
                <strong style={{ color: "#344054", fontSize: "12px" }}>{prod.name}</strong>
              </div>
              <span style={{ color: "#8490a2", fontSize: "11px" }}>{prod.sku}</span>
              <span style={{ fontWeight: 600, color: "#344054" }}>{prod.units} units</span>
              <strong style={{ textAlign: "right", color: "#16845a", fontSize: "13px" }}>
                {money(prod.revenue)}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
