export interface ShippingRule {
  id: string
  name: string
  zone: string
  rate: number
  estimatedDays: string
  conditionType: "all" | "min_price" | "weight"
  minOrderValue?: number
  enabled: boolean
}

export interface CourierPartner {
  id: string
  name: string
  code: string
  coverage: string
  codAvailable: boolean
  enabled: boolean
  isDefault: boolean
}

export interface ShippingSettings {
  insideDhakaRate: number
  outsideDhakaRate: number
  subDhakaRate: number
  freeShippingEnabled: boolean
  freeShippingThreshold: number
  expressDeliveryEnabled: boolean
  expressDeliveryRate: number
  pickupEnabled: boolean
  pickupAddress: string
  defaultCourier: string
  couriers: CourierPartner[]
  rules: ShippingRule[]
  specialNotes: string
}

const STORAGE_KEY = "shopnest-shipping-settings"

export const defaultShippingSettings: ShippingSettings = {
  insideDhakaRate: 70,
  outsideDhakaRate: 130,
  subDhakaRate: 100,
  freeShippingEnabled: true,
  freeShippingThreshold: 2500,
  expressDeliveryEnabled: true,
  expressDeliveryRate: 160,
  pickupEnabled: true,
  pickupAddress: "House 42, Road 11, Block D, Banani, Dhaka-1213",
  defaultCourier: "steadfast",
  couriers: [
    {
      id: "steadfast",
      name: "Steadfast Courier",
      code: "STF",
      coverage: "Nationwide (64 Districts)",
      codAvailable: true,
      enabled: true,
      isDefault: true,
    },
    {
      id: "pathao",
      name: "Pathao Courier",
      code: "PTH",
      coverage: "Dhaka & Major Metros",
      codAvailable: true,
      enabled: true,
      isDefault: false,
    },
    {
      id: "redx",
      name: "RedX Delivery",
      code: "RDX",
      coverage: "Nationwide Doorstep",
      codAvailable: true,
      enabled: true,
      isDefault: false,
    },
    {
      id: "paperfly",
      name: "Paperfly",
      code: "PFL",
      coverage: "Union-level Nationwide",
      codAvailable: true,
      enabled: true,
      isDefault: false,
    },
    {
      id: "ecourier",
      name: "eCourier",
      code: "ECO",
      coverage: "Urban & Rural Hubs",
      codAvailable: true,
      enabled: false,
      isDefault: false,
    },
    {
      id: "sundarban",
      name: "Sundarban Courier Service",
      code: "SCS",
      coverage: "Branch & Parcel Network",
      codAvailable: false,
      enabled: false,
      isDefault: false,
    },
  ],
  rules: [
    {
      id: "rule-1",
      name: "Inside Dhaka Standard Delivery",
      zone: "Inside Dhaka",
      rate: 70,
      estimatedDays: "24-48 Hours",
      conditionType: "all",
      enabled: true,
    },
    {
      id: "rule-2",
      name: "Sub-Dhaka / Greater Area (Gazipur, Savar, Narayanganj)",
      zone: "Sub-Dhaka",
      rate: 100,
      estimatedDays: "2-3 Days",
      conditionType: "all",
      enabled: true,
    },
    {
      id: "rule-3",
      name: "Outside Dhaka Nationwide Standard",
      zone: "Outside Dhaka",
      rate: 130,
      estimatedDays: "3-5 Days",
      conditionType: "all",
      enabled: true,
    },
    {
      id: "rule-4",
      name: "Express Same-Day Rush (Inside Dhaka)",
      zone: "Inside Dhaka",
      rate: 160,
      estimatedDays: "Same Day (Order before 12 PM)",
      conditionType: "all",
      enabled: true,
    },
    {
      id: "rule-5",
      name: "Free Shipping on Qualifying Orders",
      zone: "All Bangladesh",
      rate: 0,
      estimatedDays: "2-4 Days",
      conditionType: "min_price",
      minOrderValue: 2500,
      enabled: true,
    },
  ],
  specialNotes: "Cash on delivery (COD) available for all enabled couriers across 64 districts in Bangladesh.",
}

export function getShippingSettings(): ShippingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultShippingSettings
    const parsed = JSON.parse(raw)
    return {
      ...defaultShippingSettings,
      ...parsed,
      couriers: parsed.couriers || defaultShippingSettings.couriers,
      rules: parsed.rules || defaultShippingSettings.rules,
    }
  } catch {
    return defaultShippingSettings
  }
}

export function saveShippingSettings(settings: ShippingSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error("Failed to save shipping settings to localStorage", e)
  }
}
