import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { Status } from "../../components/ui/Status"
import { Metric } from "./Metric"
import { OrderTable } from "../../components/shared/OrderTable"
import { defaultMockOrders } from "../../constants"

export function Overview({
  onAction,
  setActive,
}: {
  onAction: (m: string) => void
  setActive: (v: string) => void
}) {
  const [range, setRange] = useState("Last 7 days")

  return (
    <div className="content">
      <section className="trial-banner">
        <div className="trial-icon">
          <Icon name="clock" size={21} />
        </div>
        <div>
          <div className="trial-title">
            <Status tone="blue">Free trial active</Status>
            <strong>5 days remaining</strong>
          </div>
          <p>
            Your trial ends on May 29, 2025. Choose a plan to keep your store running without interruption.
          </p>
        </div>
        <button onClick={() => setActive("Subscription")}>
          Choose a plan <Icon name="arrow" size={15} />
        </button>
      </section>

      <div className="section-title">
        <div>
          <h2>Good morning, Saif</h2>
          <p>Here’s what’s happening with Trendora Fashion today.</p>
        </div>
        <button className="primary" onClick={() => setActive("Products")}>
          <Icon name="plus" />Add product
        </button>
      </div>

      <section className="metric-grid">
        <Metric label="Total sales" value="৳84,250" change="+12.5%" note="vs. last month" icon="chart" />
        <Metric label="Total orders" value="128" change="+8.2%" note="vs. last month" icon="orders" />
        <Metric label="Products" value="42" change="6 low stock" note="needs attention" icon="box" amber />
        <Metric label="Customers" value="96" change="+14 new" note="this month" icon="users" />
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
            <strong>৳24,860</strong>
            <span>+18.2% from previous period</span>
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
              <path
                className="area"
                d="M0,145 C55,132 68,87 122,104 S210,138 265,83 S354,114 410,68 S501,95 555,45 S648,68 700,22 L700,180 L0,180Z"
              />
              <path
                className="line"
                d="M0,145 C55,132 68,87 122,104 S210,138 265,83 S354,114 410,68 S501,95 555,45 S648,68 700,22"
              />
            </svg>
            <div className="chart-labels">
              <span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </div>
        </div>

        <div className="card status-card">
          <div className="card-head">
            <div>
              <h3>Order status</h3>
              <p>128 total orders</p>
            </div>
            <button className="dots-button" disabled title="No additional order-status actions are available">
              <Icon name="dots" />
            </button>
          </div>
          <div className="donut">
            <div>
              <strong>128</strong>
              <span>Orders</span>
            </div>
          </div>
          <div className="legend">
            <span><i className="purple" />Processing <b>38</b></span>
            <span><i className="green-dot" />Delivered <b>64</b></span>
            <span><i className="amber-dot" />Pending <b>18</b></span>
            <span><i className="gray-dot" />Cancelled <b>8</b></span>
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
        <OrderTable rows={defaultMockOrders.slice(0, 4)} onAction={onAction} />
      </section>
    </div>
  )
}

export default Overview
