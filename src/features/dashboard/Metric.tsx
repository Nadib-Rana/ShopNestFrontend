import React from "react"
import { Icon } from "../../components/ui/Icon"

export function Metric({
  label,
  value,
  change,
  note,
  icon,
  amber,
}: {
  label: string
  value: string
  change: string
  note: string
  icon: string
  amber?: boolean
}) {
  return (
    <div className="card metric">
      <div className={`metric-icon ${amber ? "amber-bg" : ""}`}>
        <Icon name={icon} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <div>
        <span className={amber ? "warning-text" : ""}>{change}</span> {note}
      </div>
    </div>
  )
}

export default Metric
