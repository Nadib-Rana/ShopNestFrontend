export type CommerceOrder = {
  id:string; store:string; customer:string; phone:string; email:string; address:string;
  city:string; items:{id:number;name:string;variant:string;quantity:number;price:number}[];
  subtotal:number;shipping:number;total:number;payment:string;status:string;date:string
}
export type CommerceProduct={id:number;name:string;sku:string;category:string;price:number;sale:number;stock:number;status:string;color:string;sizes:string;image:string;description:string}
const productKey="shopnest-commerce-products"
const productImages=[
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
]
const defaultProducts:CommerceProduct[]=[
  {id:1,name:"Linen Summer Shirt",sku:"LSS-401",category:"Shirts",price:1850,sale:1650,stock:24,status:"Active",color:"Sand",sizes:"S, M, L, XL",image:productImages[0],description:"A breathable, softly structured essential designed for warm days and effortless layering."},
  {id:2,name:"Classic Pleated Trouser",sku:"CPT-209",category:"Trousers",price:2250,sale:0,stock:12,status:"Active",color:"Slate",sizes:"28, 30, 32, 34",image:productImages[1],description:"A relaxed tailored trouser with a clean drape and considered everyday fit."},
  {id:3,name:"Everyday Canvas Tote",sku:"ECT-118",category:"Accessories",price:950,sale:0,stock:6,status:"Active",color:"Sage",sizes:"One size",image:productImages[2],description:"A sturdy carry-all for work, markets, and weekends away."},
  {id:4,name:"Relaxed Cotton Tee",sku:"RCT-310",category:"T-shirts",price:1150,sale:990,stock:18,status:"Active",color:"Cream",sizes:"S, M, L",image:productImages[3],description:"Soft heavyweight cotton in a relaxed silhouette."},
]
export const getCommerceProducts=():CommerceProduct[]=>{try{return JSON.parse(localStorage.getItem(productKey)||"null")||defaultProducts}catch{return defaultProducts}}
export const saveCommerceProducts=(products:CommerceProduct[])=>localStorage.setItem(productKey,JSON.stringify(products))
const orderKey="shopnest-commerce-orders"
export const getCommerceOrders=():CommerceOrder[]=>{try{return JSON.parse(localStorage.getItem(orderKey)||"[]")}catch{return[]}}
export const saveCommerceOrder=(order:CommerceOrder)=>{
  const current=getCommerceOrders()
  if(!current.some(item=>item.id===order.id)) localStorage.setItem(orderKey,JSON.stringify([order,...current]))
}
export const updateCommerceOrder=(id:string,status:string)=>{
  localStorage.setItem(orderKey,JSON.stringify(getCommerceOrders().map(order=>order.id===id?{...order,status}:order)))
}
