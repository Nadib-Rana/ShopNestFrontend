export type ThemeDefinition={id:string;slug:string;name:string;title:string;label:string;description:string;hero:string;accent:string;categories:string[];heroImage:string;categoryImages:string[];promoTitle:string}
export type StoreThemeConfig={
  storeSlug:string;themeId:string;logo:string;logoImage?:string;primary:string;secondary:string;background:string;text:string;font:string;heroTitle:string;heroText:string;announcementText?:string;showCategories:boolean;showPromo:boolean;showTestimonials:boolean;grid:number;header:"Centered"|"Compact"|"Split"|string;footer:"Expanded"|"Minimal"|string;status:"Draft"|"Published";
  fashionLookbookTitle?:string;fashionCollectionStyle?:string;
  shoesDropTag?:string;shoesBadgeText?:string;shoesHighlightSizes?:boolean;
  techWarrantyText?:string;techDealTitle?:string;techShowSpecs?:boolean;
  beautyRitualNote?:string;beautyCampaignTitle?:string;beautyShowRoutine?:boolean;
  groceryDeliveryArea?:string;groceryOfferTag?:string;groceryShowQuantity?:boolean;
  decorQuote?:string;decorRoomFocus?:string;decorShowTextures?:boolean;
  furnitureSubtitle?:string;furnitureMaterialNote?:string;furnitureLayout?:string;
  retailCategoryTag?:string;retailReturnBadge?:string;retailDealHighlight?:string;
}
export const themeDefinitions:ThemeDefinition[]=[
  {id:"fashion",slug:"demo",name:"Trendora",title:"Fashion Store",label:"Fashion & Clothing",description:"Editorial collections, lookbooks, and refined product storytelling.",hero:"Quiet confidence, thoughtfully worn.",accent:"Editorial collections and refined essentials.",categories:["New arrivals","Essentials","Accessories"],heroImage:"https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=800&q=80"],promoTitle:"A wardrobe built around real life."},
  {id:"shoes",slug:"solecraft",name:"SoleCraft",title:"Shoes Store",label:"Shoes & Sneakers",description:"Sport-led merchandising with bold sneaker drops and size-first shopping.",hero:"Built to move. Styled to stay.",accent:"Performance, street, and everyday footwear.",categories:["Running","Lifestyle","Court"],heroImage:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80"],promoTitle:"Engineered for every stride."},
  {id:"electronics",slug:"nova",name:"NOVA",title:"Electronics Store",label:"Electronics & Gadgets",description:"Technical comparison layouts with specifications and warranty highlights.",hero:"Smarter technology. Clearer choices.",accent:"Verified specifications, warranty, and support.",categories:["Mobile","Audio","Computing"],heroImage:"https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"],promoTitle:"Technology explained, not oversold."},
  {id:"beauty",slug:"bloom",name:"Bloom",title:"Cosmetics & Beauty Store",label:"Cosmetics & Beauty",description:"Elegant editorial beauty with skincare and makeup collections.",hero:"Rituals for your natural radiance.",accent:"Thoughtful skincare, haircare, and color.",categories:["Skincare","Haircare","Makeup"],heroImage:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"],promoTitle:"Ingredients chosen with intention."},
  {id:"grocery",slug:"dailybasket",name:"DailyBasket",title:"Grocery Store",label:"Grocery & Essentials",description:"Practical category shortcuts, clear prices, and quantity-led cards.",hero:"Fresh essentials, delivered simply.",accent:"Everyday value from pantry to produce.",categories:["Fresh","Pantry","Household"],heroImage:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80"],promoTitle:"Good food for every day."},
  {id:"decor",slug:"haven",name:"Haven",title:"Home Decor Store",label:"Home Decor & Lifestyle",description:"Warm room-based collections with coordinated lifestyle displays.",hero:"Create a home that feels like you.",accent:"Curated objects for considered spaces.",categories:["Living","Bedroom","Table"],heroImage:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80"],promoTitle:"Objects that make a room feel yours."},
  {id:"furniture",slug:"form",name:"FORM",title:"Furniture Store",label:"Furniture & Interior",description:"Spacious, image-led furniture presentation with material details.",hero:"Made for how you live.",accent:"Timeless forms, honest materials, lasting comfort.",categories:["Seating","Tables","Storage"],heroImage:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"],promoTitle:"Honest materials. Enduring form."},
  {id:"retail",slug:"market",name:"Nest Market",title:"General Retail Store",label:"General Retail",description:"Balanced multi-category merchandising for broad product catalogs.",hero:"Everything good, all in one place.",accent:"Useful finds, great prices, easy shopping.",categories:["Trending","Home","Lifestyle"],heroImage:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",categoryImages:["https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"],promoTitle:"More choice, made easier."},
]
export const themeSpecificDefaults:Record<string,Partial<StoreThemeConfig>>={
  fashion:{fashionLookbookTitle:"The Lookbook Edit · Autumn / Winter",fashionCollectionStyle:"Editorial Lookbook"},
  shoes:{shoesDropTag:"FREE RETURNS · MEMBER EXCLUSIVES · NEW PERFORMANCE DROP",shoesBadgeText:"NEW RELEASE",shoesHighlightSizes:true},
  electronics:{techWarrantyText:"2-Year Official Warranty & Free Tech Support",techDealTitle:"Verified specifications, transparent warranty",techShowSpecs:true},
  beauty:{beautyRitualNote:"A considered ritual for skin, hair, and self",beautyCampaignTitle:"Clean formulas chosen with intention",beautyShowRoutine:true},
  grocery:{groceryDeliveryArea:"Dhaka City",groceryOfferTag:"Today’s offers",groceryShowQuantity:true},
  decor:{decorQuote:"Thoughtful pieces for slower, warmer spaces.",decorRoomFocus:"All Rooms",decorShowTextures:true},
  furniture:{furnitureSubtitle:"CONTEMPORARY FURNITURE / DHAKA",furnitureMaterialNote:"Solid timber · Honest materials · Lasting comfort",furnitureLayout:"Spacious Architectural"},
  retail:{retailCategoryTag:"Trending categories & daily deals",retailReturnBadge:"Easy returns",retailDealHighlight:"Daily Essentials"}
}
const key="shopnest-store-theme-configs"
const defaults=(storeSlug:string):StoreThemeConfig=>({
  storeSlug,themeId:"fashion",logo:"TRENDORA",logoImage:"",primary:"#755b46",secondary:"#eae2d7",background:"#f7f5f0",text:"#24201c",font:"Editorial",heroTitle:"Quiet confidence, thoughtfully worn.",heroText:"Editorial collections and refined essentials.",announcementText:"The summer edit · Complimentary delivery over ৳3,000",showCategories:true,showPromo:true,showTestimonials:true,grid:4,header:"Centered",footer:"Expanded",status:"Published",
  ...themeSpecificDefaults.fashion
})
export const getStoreThemeConfig=(storeSlug="demo"):StoreThemeConfig=>{
  try{
    const all=JSON.parse(localStorage.getItem(key)||"{}");
    const loaded=all[storeSlug];
    if(!loaded)return themeDefaults("fashion",storeSlug);
    const base=themeDefaults(loaded.themeId||"fashion",storeSlug);
    return {...base,...loaded}
  }catch{
    return themeDefaults("fashion",storeSlug)
  }
}
export const saveStoreThemeConfig=(config:StoreThemeConfig)=>{
  let all:Record<string,any>={};
  try{all=JSON.parse(localStorage.getItem(key)||"{}")}catch{};
  all[config.storeSlug]=config;
  all[`${config.storeSlug}__theme_${config.themeId}`]=config;
  localStorage.setItem(key,JSON.stringify(all))
}
export const themeDefaults=(themeId:string,storeSlug="demo"):StoreThemeConfig=>{
  const theme=themeDefinitions.find(item=>item.id===themeId)||themeDefinitions[0];
  const colors:Record<string,[string,string,string,string]>={fashion:["#755b46","#eae2d7","#f7f5f0","#24201c"],shoes:["#f4511e","#e4e4df","#f4f4f1","#111111"],electronics:["#1769e0","#e5edfa","#f5f7fa","#12203a"],beauty:["#a35669","#f2e2e4","#fbf5f4","#4c3035"],grocery:["#3d842f","#e5f0dc","#f8faf4","#25321f"],decor:["#8a674e","#e8dfd2","#f5f1eb","#3e372f"],furniture:["#35564a","#dce3de","#eeeae3","#1d211f"],retail:["#6657d8","#e9e7fb","#f6f7fb","#20263a"]};
  const c=colors[theme.id]||colors.fashion;
  const specific=themeSpecificDefaults[theme.id]||{};
  try{
    const all=JSON.parse(localStorage.getItem(key)||"{}");
    const cached=all[`${storeSlug}__theme_${theme.id}`];
    if(cached){
      return {...defaults(storeSlug),...specific,...cached,storeSlug,themeId:theme.id}
    }
  }catch{}
  const baseAnnouncement=theme.id==="fashion"?"The summer edit · Complimentary delivery over ৳3,000":theme.id==="shoes"?"FREE RETURNS · MEMBER EXCLUSIVES · NEW PERFORMANCE DROP":theme.id==="electronics"?"2-Year Official Warranty & Free Tech Support on All Orders":theme.id==="beauty"?"A considered ritual for skin, hair, and self":theme.id==="grocery"?"Express 2-hour fresh delivery across Dhaka":theme.id==="decor"?"Thoughtful pieces for slower, warmer spaces":theme.id==="furniture"?"Contemporary furniture with complimentary white-glove delivery":"Free shipping over ৳2,000 · Easy 7-day returns";
  return {...defaults(storeSlug),...specific,themeId:theme.id,logo:theme.name.toUpperCase(),primary:c[0],secondary:c[1],background:c[2],text:c[3],heroTitle:theme.hero,heroText:theme.accent,announcementText:baseAnnouncement,font:["fashion","beauty","decor"].includes(theme.id)?"Editorial":"Modern"}
}
