import { FormEvent, useEffect, useState } from "react"
import { CommerceProduct, getCommerceOrders, getCommerceProducts, saveCommerceProducts, updateCommerceOrder } from "../../repositories/commerceStore"
import { getStoreSettings } from "../../repositories/settingsStore"
import { canCallProtectedApi } from "../../services/backendSync"
import { shopnestApi } from "../../services/shopnestApi"
import { money } from "../../utils/format"
import { Badge } from "../../components/ui/Badge"

type Product = CommerceProduct & { dbId?: string }
type Category = { id: number; dbId?: string; name: string; parent: string; products: number; status: string; color: string }
type OrderLineItem = { name: string; variant: string; quantity: number; price: number }
type Order = { id: string; dbId?: string; customer: string; phone: string; address: string; subtotal: number; shipping: number; total: number; status: string; payment: string; date: string; items: OrderLineItem[] }
type CustomerRecord = { id: number; name: string; phone: string; email: string; orders: number; spent: number; city: string }
type MovementRecord = { id: string; date: string; productName: string; delta: number; reason: string }

function toTitleLabel(val: unknown, fallback = "Active"): string {
  const raw = String(val || "").trim()
  if (!raw) return fallback
  const lower = raw.replaceAll("_", " ").toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function formatDateTime(val: unknown): string {
  if (!val) return "—"
  const d = new Date(String(val))
  if (Number.isNaN(d.getTime())) return String(val)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

function unwrapList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[]
  if (res && typeof res === "object" && Array.isArray((res as { data?: unknown }).data)) {
    return (res as { data: T[] }).data
  }
  return []
}

const seedCategories: Category[] = [
  { id: 1, name: "Shirts", parent: "Clothing", products: 12, status: "Active", color: "sand" },
  { id: 2, name: "Trousers", parent: "Clothing", products: 8, status: "Active", color: "slate" },
  { id: 3, name: "Accessories", parent: "—", products: 14, status: "Active", color: "sage" },
  { id: 4, name: "T-shirts", parent: "Clothing", products: 8, status: "Hidden", color: "cream" },
]
const seedOrders: Order[] = [
  {
    id: "SN-1048",
    customer: "Nusrat Jahan",
    phone: "+880 1712-345678",
    address: "Dhanmondi, Dhaka",
    subtotal: 3720,
    shipping: 120,
    total: 3840,
    status: "Processing",
    payment: "Paid",
    date: "May 24, 10:32 AM",
    items: [
      { name: "Linen Summer Shirt", variant: "Sand / M", quantity: 1, price: 1820 },
      { name: "Everyday Canvas Tote", variant: "Sage / One size", quantity: 2, price: 950 },
    ],
  },
  {
    id: "SN-1047",
    customer: "Arif Hasan",
    phone: "+880 1812-889922",
    address: "Uttara, Dhaka",
    subtotal: 2130,
    shipping: 120,
    total: 2250,
    status: "Confirmed",
    payment: "Cash on delivery",
    date: "May 24, 9:14 AM",
    items: [{ name: "Classic Pleated Trouser", variant: "Slate / 32", quantity: 1, price: 2130 }],
  },
  {
    id: "SN-1046",
    customer: "Samira Akter",
    phone: "+880 1911-221144",
    address: "Agrabad, Chattogram",
    subtotal: 5690,
    shipping: 0,
    total: 5690,
    status: "Shipped",
    payment: "Paid",
    date: "May 23, 8:46 PM",
    items: [
      { name: "Linen Summer Shirt", variant: "Sand / L", quantity: 2, price: 1720 },
      { name: "Classic Pleated Trouser", variant: "Slate / 30", quantity: 1, price: 2250 },
    ],
  },
]
const seedCustomers: CustomerRecord[] = [
  { id: 1, name: "Nusrat Jahan", phone: "+880 1712-345678", email: "nusrat@example.com", orders: 8, spent: 24850, city: "Dhaka" },
  { id: 2, name: "Arif Hasan", phone: "+880 1812-889922", email: "arif@example.com", orders: 4, spent: 11200, city: "Dhaka" },
  { id: 3, name: "Samira Akter", phone: "+880 1911-221144", email: "samira@example.com", orders: 11, spent: 38690, city: "Chattogram" },
]
const seedMovements: MovementRecord[] = [
  { id: "m-1", date: "Today, 10:42 AM", productName: "Linen Summer Shirt", delta: 12, reason: "New stock received" },
  { id: "m-2", date: "Yesterday", productName: "Everyday Canvas Tote", delta: -2, reason: "Order SN-1048" },
]

export default function SellerManagement({ path, go, notify }: { path: string; go: (p: string) => void; notify: (m: string) => void }) {
  const backendLive = canCallProtectedApi()
  const [products, setProducts] = useState<Product[]>(() => (backendLive ? [] : getCommerceProducts()))
  useEffect(() => {
    if (!backendLive) saveCommerceProducts(products)
  }, [products, backendLive])
  const [categories, setCategories] = useState<Category[]>(() => (backendLive ? [] : seedCategories))
  const [orders, setOrders] = useState<Order[]>(() =>
    backendLive
      ? []
      : [
          ...getCommerceOrders().map((o) => ({
            id: o.id,
            customer: o.customer,
            phone: o.phone,
            address: `${o.address}, ${o.city}`,
            subtotal: o.subtotal,
            shipping: o.shipping,
            total: o.total,
            status: o.status,
            payment: o.payment,
            date: o.date,
            items: o.items.map((i) => ({ name: i.name, variant: i.variant, quantity: i.quantity, price: i.price })),
          })),
          ...seedOrders,
        ],
  )
  const [customersList, setCustomersList] = useState<CustomerRecord[]>(() => (backendLive ? [] : seedCustomers))
  const [movements, setMovements] = useState<MovementRecord[]>(() => (backendLive ? [] : seedMovements))
  const [loadingLive, setLoadingLive] = useState(backendLive)

  useEffect(() => {
    if (!backendLive) return
    let cancelled = false
    setLoadingLive(true)
    void Promise.allSettled([
      shopnestApi.products.list({ limit: 100 }),
      shopnestApi.categories.list(),
      shopnestApi.orders.list({ page: 1 }),
      shopnestApi.customers.list(),
      shopnestApi.products.inventoryMovements(),
    ]).then(([prodRes, catRes, ordRes, custRes, movRes]) => {
      if (cancelled) return
      if (prodRes.status === "fulfilled") {
        const list = unwrapList<Record<string, unknown>>(prodRes.value)
        const mapped: Product[] = list.map((p, idx) => ({
          id: idx + 1,
          dbId: String(p.id || ""),
          name: String(p.name || ""),
          sku: String(p.sku || ""),
          category: String(p.categoryName || "Uncategorized"),
          price: Number(p.price || 0),
          sale: Number(p.salePrice || 0),
          stock: Number(p.stock || 0),
          status: toTitleLabel(p.status, "Active"),
          color: String(p.color || "Sand"),
          sizes: String(p.sizes || "One size"),
          image: String(p.image || ""),
          description: String(p.description || ""),
        }))
        setProducts(mapped)
      }
      if (catRes.status === "fulfilled") {
        const list = unwrapList<Record<string, unknown>>(catRes.value)
        setCategories(
          list.map((c, idx) => ({
            id: idx + 1,
            dbId: String(c.id || ""),
            name: String(c.name || ""),
            parent: String(c.parent || "—"),
            products: Number(c.productsCount ?? 0),
            status: toTitleLabel(c.status, "Active"),
            color: String(c.color || "sand"),
          })),
        )
      }
      if (ordRes.status === "fulfilled") {
        const list = unwrapList<Record<string, unknown>>(ordRes.value)
        setOrders(
          list.map((o) => {
            const rawItems = Array.isArray(o.items) ? (o.items as Record<string, unknown>[]) : []
            return {
              id: String(o.orderNumber || o.id || ""),
              dbId: String(o.id || ""),
              customer: String(o.customerName || "Customer"),
              phone: String(o.phone || "—"),
              address: [o.address, o.city].filter(Boolean).join(", ") || "—",
              subtotal: Number(o.subtotal || 0),
              shipping: Number(o.shipping || 0),
              total: Number(o.total || 0),
              status: toTitleLabel(o.status, "Pending"),
              payment: toTitleLabel(o.payment, "Cash on delivery"),
              date: formatDateTime(o.createdAt),
              items: rawItems.map((it) => ({
                name: String(it.productName || it.name || "Item"),
                variant: String(it.variant || "Default"),
                quantity: Number(it.quantity || 1),
                price: Number(it.unitPrice ?? it.price ?? 0),
              })),
            }
          }),
        )
      }
      if (custRes.status === "fulfilled") {
        const list = unwrapList<Record<string, unknown>>(custRes.value)
        setCustomersList(
          list.map((c, idx) => ({
            id: idx + 1,
            name: String(c.name || "Customer"),
            phone: String(c.phone || "—"),
            email: String(c.email || "—"),
            orders: Number(c.orders || 0),
            spent: Number(c.totalSpent ?? c.spent ?? 0),
            city: String(c.city || "Bangladesh"),
          })),
        )
      }
      if (movRes.status === "fulfilled") {
        const list = unwrapList<Record<string, unknown>>(movRes.value)
        setMovements(
          list.map((m, idx) => {
            const prod = (m.product as Record<string, unknown> | undefined) || {}
            return {
              id: String(m.id || `m-${idx}`),
              date: formatDateTime(m.createdAt),
              productName: String(prod.name || m.productName || "Product"),
              delta: Number(m.delta || 0),
              reason: String(m.reason || "Adjustment"),
            }
          }),
        )
      }
      setLoadingLive(false)
    })
    return () => {
      cancelled = true
    }
  }, [backendLive])

  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All categories")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [sortBy, setSortBy] = useState("Newest first")
  const [dialog, setDialog] = useState<string | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const lowStockThreshold = getStoreSettings().lowStockThreshold
  const parts = path.split("/")
  const segment = parts[2]
  const detail = parts[3]
  const action = parts[4]

  if (segment === "products" && (detail === "new" || detail === "edit" || action === "edit")) {
    const editingProduct =
      action === "edit"
        ? products.find((p) => p.id === Number(detail))
        : detail === "edit"
        ? products[0]
        : undefined
    return (
      <ProductForm
        product={editingProduct}
        categories={categories}
        onCancel={() => go("/seller/products")}
        onSave={(p) => {
          const tempId = p.id || Date.now()
          const targetDbId = editingProduct?.dbId || p.dbId
          setProducts((prev) =>
            p.id ? prev.map((x) => (x.id === p.id ? { ...p, dbId: targetDbId } : x)) : [{ ...p, id: tempId }, ...prev],
          )
          if (backendLive) {
            const payload = {
              name: p.name,
              sku: p.sku,
              categoryName: p.category || "Uncategorized",
              price: p.price,
              salePrice: p.sale,
              stock: p.stock,
              status: p.status.toUpperCase(),
              color: p.color,
              sizes: p.sizes,
              image: p.image,
              description: p.description,
            }
            if (p.id && targetDbId) {
              void shopnestApi.products.update(targetDbId, payload).catch(() => undefined)
            } else {
              void shopnestApi.products
                .create(payload)
                .then((created) => {
                  const dbId = (created as Record<string, unknown> | null)?.id
                  if (dbId) {
                    setProducts((prev) => prev.map((x) => (x.id === tempId ? { ...x, dbId: String(dbId) } : x)))
                  }
                })
                .catch(() => undefined)
            }
          }
          notify(p.id ? "Product updated" : "Product added")
          go("/seller/products")
        }}
      />
    )
  }
  if (segment === "products" && detail) {
    const foundProduct = products.find((p) => p.id === Number(detail)) || products[0]
    if (!foundProduct) return <Page title="Product" subtitle={loadingLive ? "Loading..." : "Not found"} action={<button className="secondary" onClick={() => go("/seller/products")}>Back</button>}><Empty title="Product not found" text="Return to products to view your catalog." /></Page>
    return <ProductDetails product={foundProduct} go={go} />
  }
  if (segment === "orders" && detail) {
    const foundOrder = orders.find((o) => o.id === detail) || orders[0]
    if (!foundOrder) return <Page title="Order" subtitle={loadingLive ? "Loading..." : "Not found"} action={<button className="secondary" onClick={() => go("/seller/orders")}>Back</button>}><Empty title="Order not found" text="Return to orders to view store orders." /></Page>
    return (
      <OrderDetails
        order={foundOrder}
        backendLive={backendLive}
        onStatus={(status) => {
          setOrders((prev) => prev.map((o) => (o.id === detail ? { ...o, status } : o)))
          updateCommerceOrder(detail, status)
          if (backendLive) {
            void shopnestApi.orders
              .updateStatus(foundOrder.dbId || detail, status.toUpperCase().replaceAll(" ", "_"))
              .catch(() => undefined)
          }
          notify(`Order moved to ${status}`)
        }}
        go={go}
      />
    )
  }
  if (segment === "customers" && detail) {
    const foundCustomer = customersList.find((c) => c.id === Number(detail)) || customersList[0]
    if (!foundCustomer) return <Page title="Customer" subtitle={loadingLive ? "Loading..." : "Not found"} action={<button className="secondary" onClick={() => go("/seller/customers")}>Back to customers</button>}><Empty title="Customer not found" text="No customer records found yet." /></Page>
    return <CustomerDetails customer={foundCustomer} orders={orders} go={go} />
  }
  if (segment === "categories")
    return (
      <Categories
        categories={categories}
        query={query}
        setQuery={setQuery}
        onSave={(item) => {
          const tempId = item.id || Date.now()
          setCategories((prev) => (item.id ? prev.map((c) => (c.id === item.id ? item : c)) : [...prev, { ...item, id: tempId }]))
          if (backendLive) {
            const payload = {
              name: item.name,
              parent: item.parent,
              color: item.color,
              status: item.status.toUpperCase(),
            }
            if (item.id && item.dbId) {
              void shopnestApi.categories.update(item.dbId, payload).catch(() => undefined)
            } else {
              void shopnestApi.categories
                .create(payload)
                .then((created) => {
                  const dbId = (created as Record<string, unknown> | null)?.id
                  if (dbId) {
                    setCategories((prev) => prev.map((c) => (c.id === tempId ? { ...c, dbId: String(dbId) } : c)))
                  }
                })
                .catch(() => undefined)
            }
          }
        }}
        onDelete={(id) => {
          const target = categories.find((c) => c.id === id)
          setCategories((prev) => prev.filter((c) => c.id !== id))
          if (backendLive && target?.dbId) {
            void shopnestApi.categories.remove(target.dbId).catch(() => undefined)
          }
        }}
      />
    )
  if (segment === "inventory")
    return (
      <Inventory
        products={products}
        setProducts={setProducts}
        movements={movements}
        setMovements={setMovements}
        backendLive={backendLive}
        query={query}
        setQuery={setQuery}
        notify={notify}
        lowStockThreshold={lowStockThreshold}
      />
    )
  if (segment === "orders") return <Orders orders={orders} query={query} setQuery={setQuery} go={go} />
  if (segment === "customers") return <Customers customersList={customersList} backendLive={backendLive} query={query} setQuery={setQuery} go={go} />

  const filtered = products
    .filter((p) => {
      const matchesQuery = `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = categoryFilter === "All categories" || p.category === categoryFilter
      const matchesStatus = statusFilter === "All statuses" || p.status === statusFilter
      return matchesQuery && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "Price: low to high") return (a.sale || a.price) - (b.sale || b.price)
      if (sortBy === "Stock: low to high") return a.stock - b.stock
      return b.id - a.id
    })

  return (
    <Page title="Products" subtitle={`${products.length} products · ${backendLive ? (loadingLive ? "Syncing live catalog..." : "Live catalog") : "Mock catalog"}`} action={<button className="primary" onClick={() => go("/seller/products/new")}>＋ Add product</button>}>
      <Toolbar query={query} setQuery={setQuery} placeholder="Search name, SKU or category">
        <select aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option>All categories</option>
          {categories.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
        <select aria-label="Sort products" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option>Newest first</option>
          <option>Price: low to high</option>
          <option>Stock: low to high</option>
        </select>
      </Toolbar>
      {selected.length > 0 && (
        <div className="bulk-bar">
          <strong>{selected.length} selected</strong>
          <button
            onClick={() => {
              const dbIds = products.filter((p) => selected.includes(p.id) && p.dbId).map((p) => p.dbId as string)
              setProducts((prev) => prev.map((p) => (selected.includes(p.id) ? { ...p, status: "Active" } : p)))
              if (backendLive && dbIds.length > 0) {
                void shopnestApi.products.bulkStatus(dbIds, "ACTIVE").catch(() => undefined)
              }
              setSelected([])
            }}
          >
            Set active
          </button>
          <button className="danger-link" onClick={() => setDialog("bulk-delete")}>Delete</button>
        </div>
      )}
      <div className="mg-card mg-table">
        <div className="mg-row mg-head">
          <input aria-label="Select all products" type="checkbox" checked={filtered.length > 0 && filtered.every((p) => selected.includes(p.id))} onChange={(e) => setSelected(e.target.checked ? filtered.map((p) => p.id) : [])} />
          <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span><span />
        </div>
        {filtered.map((p) => (
          <div className="mg-row" key={p.id}>
            <input aria-label={`Select ${p.name}`} type="checkbox" checked={selected.includes(p.id)} onChange={() => setSelected((s) => (s.includes(p.id) ? s.filter((id) => id !== p.id) : [...s, p.id]))} />
            <button className="product-cell" onClick={() => go(`/seller/products/${p.id}`)}>
              <i className={p.color.toLowerCase()}>▧</i>
              <span><strong>{p.name}</strong><small>{p.sku}</small></span>
            </button>
            <span>{p.category}</span>
            <span><strong>{money(p.sale || p.price)}</strong>{p.sale > 0 && <small className="strike">{money(p.price)}</small>}</span>
            <span className={p.stock <= lowStockThreshold ? "low" : ""}>{p.stock} units</span>
            <Badge>{p.status}</Badge>
            <button className="row-action" onClick={() => go(`/seller/products/${p.id}/edit`)}>Edit</button>
          </div>
        ))}
        {!filtered.length && <Empty title="No products found" text={backendLive && !products.length ? "Add your first product to populate your store catalog." : "Try changing your search or filters."} />}
      </div>
      <div className="pagination"><span>Showing 1–{filtered.length} of {filtered.length}</span><div><button disabled>Previous</button><button className="active">1</button><button disabled>Next</button></div></div>
      {dialog === "bulk-delete" && (
        <Confirm
          title="Delete selected products?"
          text={backendLive ? "This permanently removes the selected products from your store." : "This removes the products from this local prototype."}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            const dbIds = products.filter((p) => selected.includes(p.id) && p.dbId).map((p) => p.dbId as string)
            setProducts((prev) => prev.filter((p) => !selected.includes(p.id)))
            if (backendLive && dbIds.length > 0) {
              void shopnestApi.products.bulkDelete(dbIds).catch(() => undefined)
            }
            setSelected([])
            setDialog(null)
            notify("Products deleted")
          }}
        />
      )}
    </Page>
  )
}

function Page({ title, subtitle, action, children }: { title: string; subtitle: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <div className="content management"><div className="section-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>{children}</div>
}
function Toolbar({ query, setQuery, placeholder, children }: { query: string; setQuery: (v: string) => void; placeholder: string; children?: React.ReactNode }) {
  return <div className="mg-toolbar"><label>⌕<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} /></label>{children}</div>
}
function Empty({ title, text }: { title: string; text: string }) { return <div className="mg-empty"><div>⌕</div><strong>{title}</strong><span>{text}</span></div> }

function ProductForm({ product, categories, onCancel, onSave }: { product?: Product; categories: Category[]; onCancel: () => void; onSave: (p: Product) => void }) {
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState("")
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    if (!d.get("name") || !d.get("sku") || Number(d.get("price")) <= 0) return setError("Product name, SKU, and a valid price are required.")
    onSave({
      id: product?.id || 0,
      name: String(d.get("name")),
      sku: String(d.get("sku")),
      category: String(d.get("category")),
      price: Number(d.get("price")),
      sale: Number(d.get("sale")),
      stock: Number(d.get("stock")),
      status: String(d.get("status")),
      color: String(d.get("color")),
      sizes: String(d.get("sizes")),
      description: String(d.get("description")),
      image: images[0] || product?.image || "",
    })
  }
  const addImages = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const result = evt.target?.result
        if (typeof result === "string") setImages((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }
  return <Page title={product ? "Edit product" : "Add product"} subtitle="Changes are stored only in this browser session." action={<button className="secondary" onClick={onCancel}>Cancel</button>}><form className="editor-grid" onSubmit={submit}><div className="editor-main"><section className="mg-card form-section"><h3>Product information</h3><Field label="Product name" name="name" value={product?.name}/><Field label="Description" name="description" area value={product?.description||"A thoughtfully made everyday essential with a comfortable, relaxed fit."}/><div className="two-col"><Field label="Category" name="category" select options={categories.map(c=>c.name)} value={product?.category}/><Field label="SKU" name="sku" value={product?.sku}/></div></section><section className="mg-card form-section"><h3>Images</h3><label className="image-upload"><input type="file" multiple accept="image/*" onChange={e=>addImages(e.target.files)}/><b>＋</b><strong>Upload product images</strong><span>PNG or JPG · saved locally</span></label>{images.length>0 && <div className="image-previews">{images.map((src,i)=><img src={src} key={i} alt={`Product preview ${i+1}`}/>)}</div>}</section><section className="mg-card form-section"><h3>Pricing and inventory</h3><div className="three-col"><Field label="Price (৳)" name="price" type="number" value={product?.price}/><Field label="Sale price (৳)" name="sale" type="number" value={product?.sale}/><Field label="Stock" name="stock" type="number" value={product?.stock}/></div></section><section className="mg-card form-section"><h3>Variants</h3><div className="two-col"><Field label="Sizes" name="sizes" value={product?.sizes} placeholder="S, M, L, XL"/><Field label="Colors" name="color" value={product?.color} placeholder="Sand, Black"/></div><p className="helper">Separate variant values with commas. Variant-level pricing is represented visually in this prototype.</p></section></div><aside><section className="mg-card form-section"><h3>Publishing</h3><Field label="Status" name="status" select options={["Active","Draft","Archived"]} value={product?.status}/>{error && <div className="form-error">{error}</div>}<button className="primary full-button" type="submit">{product ? "Save changes" : "Publish product"}</button><button className="secondary full-button" type="submit" onClick={event=>{const form=event.currentTarget.form;const status=form?.elements.namedItem("status") as HTMLSelectElement|null;if(status)status.value="Draft"}}>Save draft</button></section></aside></form></Page>
}
function Field({label,name,value,type="text",placeholder="",area,select,options=[]}:{label:string;name:string;value?:string|number;type?:string;placeholder?:string;area?:boolean;select?:boolean;options?:string[]}) {
  return <label className="mg-field"><span>{label}</span>{area?<textarea name={name} defaultValue={value}/>:select?<select name={name} defaultValue={value}>{options.map(o=><option key={o}>{o}</option>)}</select>:<input name={name} type={type} defaultValue={value} placeholder={placeholder}/>}</label>
}
function ProductDetails({product,go}:{product:Product;go:(p:string)=>void}) { return <Page title={product.name} subtitle={`${product.sku} · Last updated today`} action={<><button className="secondary" onClick={()=>go("/seller/products")}>Back</button><button className="primary" onClick={()=>go(`/seller/products/${product.id}/edit`)}>Edit product</button></>}><div className="detail-grid"><section className="mg-card product-gallery"><div className={`gallery-main ${product.color.toLowerCase()}`}>TRENDORA</div><div><i/><i/><i/></div></section><section className="mg-card detail-panel"><Badge>{product.status}</Badge><h2>{money(product.sale||product.price)}</h2>{product.sale>0&&<span className="strike">{money(product.price)}</span>}<dl><div><dt>Category</dt><dd>{product.category}</dd></div><div><dt>Available stock</dt><dd>{product.stock} units</dd></div><div><dt>Sizes</dt><dd>{product.sizes}</dd></div><div><dt>Colors</dt><dd>{product.color}</dd></div></dl><h3>Description</h3><p>{product.description || "A thoughtfully made everyday essential designed for comfort and repeat wear."}</p></section></div></Page> }

function Categories({categories,query,setQuery,onSave,onDelete}:{categories:Category[];query:string;setQuery:(v:string)=>void;onSave:(c:Category)=>void;onDelete:(id:number)=>void}) {
  const [editing,setEditing]=useState<Category|null>(null); const [confirm,setConfirm]=useState<number|null>(null); const [statusFilter,setStatusFilter]=useState("All statuses")
  return <Page title="Categories" subtitle="Organize products into storefront collections." action={<button className="primary" onClick={()=>setEditing({id:0,name:"",parent:"—",products:0,status:"Active",color:"sand"})}>＋ Add category</button>}><Toolbar query={query} setQuery={setQuery} placeholder="Search categories"><select aria-label="Filter categories by status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All statuses</option><option>Active</option><option>Hidden</option></select></Toolbar><div className="category-grid">{categories.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())&&(statusFilter==="All statuses"||c.status===statusFilter)).map(c=><article className="mg-card category-card" key={c.id}><div className={`category-image ${c.color}`}>COLLECTION</div><div><Badge>{c.status}</Badge><h3>{c.name}</h3><p>{c.products} products · Parent: {c.parent}</p><button onClick={()=>setEditing(c)}>Edit</button><button className="danger-link" onClick={()=>setConfirm(c.id)}>Delete</button></div></article>)}</div>{editing&&<CategoryDialog item={editing} categories={categories} onClose={()=>setEditing(null)} onSave={c=>{onSave(c);setEditing(null)}}/>}{confirm&&<Confirm title="Delete category?" text="Products remain available but become uncategorized." onClose={()=>setConfirm(null)} onConfirm={()=>{onDelete(confirm);setConfirm(null)}}/>}</Page>
}
function CategoryDialog({item,categories,onClose,onSave}:{item:Category;categories:Category[];onClose:()=>void;onSave:(c:Category)=>void}) { const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const d=new FormData(e.currentTarget);onSave({...item,name:String(d.get("name")),parent:String(d.get("parent")),status:String(d.get("status"))})}; return <div className="modal-backdrop"><form className="modal-card" onSubmit={submit}><div className="modal-head"><div><h2>{item.id?"Edit":"Create"} category</h2><p>Configure storefront organization.</p></div><button type="button" onClick={onClose}>×</button></div><label className="image-upload compact"><input type="file" accept="image/*"/><b>＋</b><strong>Add category image</strong></label><Field label="Category name" name="name" value={item.name}/><Field label="Parent category" name="parent" select options={["—",...categories.filter(c=>c.id!==item.id).map(c=>c.name)]} value={item.parent}/><Field label="Status" name="status" select options={["Active","Hidden"]} value={item.status}/><div className="modal-actions"><button className="secondary" type="button" onClick={onClose}>Cancel</button><button className="primary">Save category</button></div></form></div> }

function Inventory({products,setProducts,movements,setMovements,backendLive,query,setQuery,notify,lowStockThreshold}:{products:Product[];setProducts:React.Dispatch<React.SetStateAction<Product[]>>;movements:MovementRecord[];setMovements:React.Dispatch<React.SetStateAction<MovementRecord[]>>;backendLive:boolean;query:string;setQuery:(v:string)=>void;notify:(m:string)=>void;lowStockThreshold:number}) {
  const [adjust,setAdjust]=useState<Product|null>(null); const low=products.filter(p=>p.stock>0&&p.stock<=lowStockThreshold).length
  return (
    <Page title="Inventory" subtitle="Track available stock and product movements.">
      <div className="mini-metrics">
        <div className="mg-card"><span>Total units</span><strong>{products.reduce((a,p)=>a+p.stock,0)}</strong></div>
        <div className="mg-card"><span>Low stock</span><strong className="low">{low}</strong></div>
        <div className="mg-card"><span>Out of stock</span><strong>{products.filter(p=>p.stock===0).length}</strong></div>
      </div>
      <Toolbar query={query} setQuery={setQuery} placeholder="Search SKU or product"/>
      <div className="mg-card mg-table inventory-table">
        <div className="mg-row mg-head"><span>Product / SKU</span><span>Available</span><span>Reserved</span><span>Status</span><span/></div>
        {products.filter(p=>`${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase())).map(p=>(
          <div className="mg-row" key={p.id}>
            <span><strong>{p.name}</strong><small>{p.sku}</small></span>
            <strong>{p.stock}</strong>
            <span>{Math.min(3,p.stock)}</span>
            <Badge tone={p.stock===0?"draft":p.stock<=lowStockThreshold?"low-stock":"active"}>{p.stock===0?"Out of stock":p.stock<=lowStockThreshold?"Low stock":"In stock"}</Badge>
            <button className="row-action" onClick={()=>setAdjust(p)}>Adjust</button>
          </div>
        ))}
        {!products.length && <Empty title="No inventory items" text="Add products to start tracking stock levels." />}
      </div>
      <section className="mg-card history">
        <h3>Recent inventory movements</h3>
        {movements.length === 0 ? (
          <Empty title="No stock movements yet" text="Adjust stock or fulfill orders to see movement history." />
        ) : (
          movements.map((m) => (
            <div key={m.id}>
              <span>{m.date}</span>
              <strong>{m.productName}</strong>
              <b className={m.delta > 0 ? "positive" : ""}>{m.delta > 0 ? `+${m.delta}` : `−${Math.abs(m.delta)}`}</b>
              <small>{m.reason}</small>
            </div>
          ))
        )}
      </section>
      {adjust && (
        <AdjustDialog
          product={adjust}
          onClose={() => setAdjust(null)}
          onConfirm={(amount, note) => {
            setProducts((prev) => prev.map((p) => (p.id === adjust.id ? { ...p, stock: Math.max(0, p.stock + amount) } : p)))
            setMovements((prev) => [
              { id: `m-${Date.now()}`, date: "Just now", productName: adjust.name, delta: amount, reason: note },
              ...prev,
            ])
            if (backendLive && adjust.dbId) {
              void shopnestApi.products.adjustStock(adjust.dbId, amount, note).catch(() => undefined)
            }
            setAdjust(null)
            notify(`Stock adjusted: ${amount > 0 ? "+" : ""}${amount} · ${note}`)
          }}
        />
      )}
    </Page>
  )
}
function AdjustDialog({product,onClose,onConfirm}:{product:Product;onClose:()=>void;onConfirm:(n:number,note:string)=>void}) {
  const [amount,setAmount]=useState(0)
  const [note,setNote]=useState("")
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-head"><div><h2>Adjust stock</h2><p>{product.name} · Currently {product.stock}</p></div><button onClick={onClose}>×</button></div>
        <label className="mg-field">
          <span>Adjustment</span>
          <div className="stepper">
            <button type="button" onClick={()=>setAmount(a=>a-1)}>−</button>
            <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/>
            <button type="button" onClick={()=>setAmount(a=>a+1)}>＋</button>
          </div>
        </label>
        <label className="mg-field">
          <span>Reason</span>
          <input name="reason" type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Stock received, correction..." />
        </label>
        <div className="stock-result">New available stock <strong>{Math.max(0,product.stock+amount)}</strong></div>
        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={()=>onConfirm(amount,note.trim()||"Manual adjustment")}>Confirm adjustment</button>
        </div>
      </div>
    </div>
  )
}

function Orders({orders,query,setQuery,go}:{orders:Order[];query:string;setQuery:(v:string)=>void;go:(p:string)=>void}) {
  const [status,setStatus]=useState("All")
  const [dateFilter,setDateFilter]=useState("")
  const shown=orders.filter(o=>(status==="All"||o.status===status)&&`${o.id} ${o.customer}`.toLowerCase().includes(query.toLowerCase())&&(!dateFilter||o.date.includes(dateFilter)))
  const exportCsv=()=>{const csv=["Order,Customer,Phone,Total,Payment,Status",...shown.map(o=>[o.id,o.customer,o.phone,o.total,o.payment,o.status].map(v=>`"${v}"`).join(","))].join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const link=document.createElement("a");link.href=url;link.download="shopnest-orders.csv";link.click();URL.revokeObjectURL(url)}
  return <Page title="Orders" subtitle="Process and fulfill customer purchases." action={<button className="secondary" onClick={exportCsv}>Export CSV</button>}><div className="mg-tabs">{["All","Pending","Confirmed","Processing","Shipped","Delivered"].map(s=><button className={status===s?"active":""} onClick={()=>setStatus(s)} key={s}>{s}</button>)}</div><Toolbar query={query} setQuery={setQuery} placeholder="Search order or customer"><input type="date" aria-label="Order date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}/></Toolbar><div className="mg-card mg-table orders-table"><div className="mg-row mg-head"><span>Order</span><span>Customer</span><span>Date</span><span>Total</span><span>Payment</span><span>Status</span></div>{shown.map(o=><button className="mg-row order-button" onClick={()=>go(`/seller/orders/${o.id}`)} key={o.id}><strong>#{o.id}</strong><span>{o.customer}<small>{o.phone}</small></span><span>{o.date}</span><strong>{money(o.total)}</strong><Badge>{o.payment}</Badge><Badge>{o.status}</Badge></button>)}</div></Page>
}
function OrderDetails({order,backendLive,onStatus,go}:{order:Order;backendLive:boolean;onStatus:(s:string)=>void;go:(p:string)=>void}) {
  const [dialog,setDialog]=useState("")
  return <Page title={`Order #${order.id}`} subtitle={`Placed ${order.date} · ${backendLive ? "Live order" : "Mock order"}`} action={<><button className="secondary" onClick={()=>go("/seller/orders")}>Back</button><button className="primary" onClick={()=>setDialog("status")}>Update status</button></>}><div className="order-detail-grid"><div><section className="mg-card order-summary"><div className="summary-head"><h3>Order items</h3><Badge>{order.status}</Badge></div>{order.items.map((item,i)=><div className="order-item" key={`${item.name}-${item.variant}-${i}`}><i>{i+1}</i><span><strong>{item.name} × {item.quantity}</strong><small>Variant: {item.variant}</small></span><b>{money(item.price * item.quantity)}</b></div>)}<dl><div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div><div><dt>Delivery</dt><dd>{order.shipping ? money(order.shipping) : "Free"}</dd></div><div className="total"><dt>Total</dt><dd>{money(order.total)}</dd></div></dl></section><section className="mg-card timeline"><h3>Order timeline</h3>{["Order placed","Payment confirmed",order.status].map((s,i)=><div className={i<2?"done":""} key={`${s}-${i}`}><i>{i<2?"✓":i+1}</i><span><strong>{s}</strong><small>{i===0?order.date:backendLive?"Synced with store database":"Status recorded in prototype"}</small></span></div>)}</section></div><aside><section className="mg-card side-info"><h3>Customer</h3><strong>{order.customer}</strong><span>{order.phone}</span><hr/><h3>Delivery address</h3><p>{order.address}<br/>Bangladesh</p><hr/><h3>Payment</h3><Badge>{order.payment}</Badge></section><button className="secondary full-button" onClick={()=>window.print()}>Print invoice</button><button className="secondary full-button" onClick={()=>window.print()}>Packing slip</button><button className="danger-button full-button" onClick={()=>setDialog("cancel")}>Cancel order</button></aside></div>{dialog==="status"&&<StatusDialog current={order.status} onClose={()=>setDialog("")} onConfirm={s=>{onStatus(s);setDialog("")}}/>}{dialog==="cancel"&&<Confirm title="Cancel this order?" text={backendLive ? "The order will be marked cancelled and stock will be restored." : "The order will be marked cancelled. Inventory restoration is simulated."} onClose={()=>setDialog("")} onConfirm={()=>{onStatus("Cancelled");setDialog("")}}/>}</Page>
}
function StatusDialog({current,onClose,onConfirm}:{current:string;onClose:()=>void;onConfirm:(s:string)=>void}) { const [value,setValue]=useState(current);return <div className="modal-backdrop"><div className="modal-card"><div className="modal-head"><div><h2>Update order status</h2><p>Select the new fulfillment status for this order.</p></div><button onClick={onClose}>×</button></div><label className="mg-field"><span>New status</span><select value={value} onChange={e=>setValue(e.target.value)}>{["Pending","Confirmed","Processing","Shipped","Delivered","Returned"].map(s=><option key={s}>{s}</option>)}</select></label><div className="modal-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" onClick={()=>onConfirm(value)}>Update status</button></div></div></div> }

function Customers({customersList,backendLive,query,setQuery,go}:{customersList:CustomerRecord[];backendLive:boolean;query:string;setQuery:(v:string)=>void;go:(p:string)=>void}) {
  const [cityFilter,setCityFilter]=useState("All cities")
  const cities = Array.from(new Set(customersList.map((c) => c.city).filter(Boolean)))
  const shown=customersList.filter(c=>`${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(query.toLowerCase())&&(cityFilter==="All cities"||c.city===cityFilter))
  return (
    <Page title="Customers" subtitle={backendLive ? `${customersList.length} customers from store orders.` : "Customer records created from fictional orders."}>
      <Toolbar query={query} setQuery={setQuery} placeholder="Search customer, email or phone">
        <select aria-label="Filter customers by city" value={cityFilter} onChange={e=>setCityFilter(e.target.value)}>
          <option>All cities</option>
          {cities.map((city) => <option key={city}>{city}</option>)}
        </select>
      </Toolbar>
      <div className="customer-grid">
        {shown.map(c=>(
          <button className="mg-card customer-card" key={c.id} onClick={()=>go(`/seller/customers/${c.id}`)}>
            <i>{c.name.split(" ").map(n=>n[0]).join("").slice(0, 2).toUpperCase()}</i>
            <div><strong>{c.name}</strong><span>{c.email}</span><small>{c.phone}</small></div>
            <dl><div><dt>Orders</dt><dd>{c.orders}</dd></div><div><dt>Total spent</dt><dd>{money(c.spent)}</dd></div></dl>
            <b>›</b>
          </button>
        ))}
        {!shown.length && <Empty title="No customers found" text={backendLive ? "Customers will appear here automatically once orders are placed on your storefront." : "Try a different search query."} />}
      </div>
    </Page>
  )
}
function CustomerDetails({customer,orders,go}:{customer:CustomerRecord;orders:Order[];go:(p:string)=>void}) { return <Page title={customer.name} subtitle={`Customer · ${customer.city}`} action={<button className="secondary" onClick={()=>go("/seller/customers")}>Back to customers</button>}><div className="customer-detail"><aside className="mg-card profile-card"><i>{customer.name.split(" ").map(n=>n[0]).join("").slice(0, 2).toUpperCase()}</i><h3>{customer.name}</h3><Badge>Active</Badge><dl><div><dt>Email</dt><dd>{customer.email}</dd></div><div><dt>Phone</dt><dd>{customer.phone}</dd></div><div><dt>Location</dt><dd>{customer.city}, Bangladesh</dd></div></dl></aside><section><div className="mini-metrics"><div className="mg-card"><span>Total orders</span><strong>{customer.orders}</strong></div><div className="mg-card"><span>Total spending</span><strong>{money(customer.spent)}</strong></div><div className="mg-card"><span>Average order</span><strong>{money(customer.orders > 0 ? Math.round(customer.spent/customer.orders) : 0)}</strong></div></div><div className="mg-card history"><h3>Recent orders</h3>{orders.filter(o=>o.customer===customer.name || o.phone===customer.phone).map(o=><div key={o.id}><span>{o.date}</span><strong>#{o.id}</strong><b>{money(o.total)}</b><Badge>{o.status}</Badge></div>)}{!orders.some(o=>o.customer===customer.name || o.phone===customer.phone)&&<Empty title="No recent orders" text="No orders matched for this customer yet."/>}</div></section></div></Page> }

function Confirm({title,text,onClose,onConfirm}:{title:string;text:string;onClose:()=>void;onConfirm:()=>void}) { return <div className="modal-backdrop"><div className="modal-card confirm-card"><div className="danger-icon">!</div><h2>{title}</h2><p>{text}</p><div className="modal-actions"><button className="secondary" onClick={onClose}>Keep it</button><button className="danger-button" onClick={onConfirm}>Confirm</button></div></div></div> }
