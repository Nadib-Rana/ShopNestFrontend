import React from "react"
import { Icon } from "../ui/Icon"
import { Status } from "../ui/Status"

export interface OrderRow {
  id: string
  name: string
  initials: string
  date: string
  total: string
  payment: string
  status: string
}

export function OrderTable({
  rows,
  onAction,
}: {
  rows: OrderRow[]
  onAction: (m: string) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Fulfillment</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id}>
              <td>
                <strong>{o.id}</strong>
              </td>
              <td>
                <div className="customer">
                  <span>{o.initials}</span>
                  <strong>{o.name}</strong>
                </div>
              </td>
              <td>{o.date}</td>
              <td>
                <strong>{o.total}</strong>
              </td>
              <td>
                <Status tone={o.payment === "Paid" ? "green" : "gray"}>
                  {o.payment}
                </Status>
              </td>
              <td>
                <Status
                  tone={
                    o.status === "Pending"
                      ? "amber"
                      : o.status === "Shipped"
                      ? "blue"
                      : "purple"
                  }
                >
                  {o.status}
                </Status>
              </td>
              <td>
                <button
                  className="dots-button"
                  onClick={() => onAction(`${o.id} selected`)}
                >
                  <Icon name="dots" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable
