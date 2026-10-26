import { useState } from "react"
import { getStoreThemeConfig, saveStoreThemeConfig, StoreThemeConfig, themeDefaults, themeDefinitions } from "../../repositories/themeStore"
import { isUserRegistered } from "../../utils/auth"

const previewThemedProducts: Record<string, Array<{ name: string; price: number; tag: string }>> = {
  shoes: [
    { name: "Velocity Runner", price: 5200, tag: "39 · 40 · 41 · 42" },
    { name: "Court Classic", price: 4350, tag: "38 · 39 · 40 · 41" },
    { name: "Aero Sprint", price: 6800, tag: "40 · 41 · 42 · 43" },
    { name: "Street Low", price: 3900, tag: "39 · 40 · 41 · 42" },
  ],
  electronics: [
    { name: "Nova X Phone", price: 64900, tag: "6.7” OLED · 50MP" },
    { name: "Studio ANC Headphones", price: 12900, tag: "40h battery · ANC" },
    { name: "AirBook 14", price: 98900, tag: "14” display · 1.3kg" },
    { name: "Pulse Smartwatch", price: 8500, tag: "AMOLED · 5ATM" },
  ],
  beauty: [
    { name: "Dew Barrier Serum", price: 1650, tag: "Niacinamide · 30ml" },
    { name: "Petal Cream Blush", price: 1250, tag: "Rose pigment · 8g" },
    { name: "Silk Repair Mask", price: 1450, tag: "Amino acids · 250ml" },
    { name: "Cloud Cleanser", price: 980, tag: "Low-pH gel · 120ml" },
  ],
  grocery: [
    { name: "Seasonal Vegetable Box", price: 690, tag: "Fresh pick · 3kg" },
    { name: "Premium Miniket Rice", price: 760, tag: "Pantry · 5kg" },
    { name: "Farm Fresh Eggs", price: 180, tag: "Graded · 12 pack" },
    { name: "Kitchen Care Bundle", price: 520, tag: "Household · 3 pack" },
  ],
  decor: [
    { name: "Sculpted Table Lamp", price: 4850, tag: "Ceramic base · ambient" },
    { name: "Woven Cushion Pair", price: 2250, tag: "Natural fiber · 45cm" },
    { name: "Travertine Catchall", price: 1750, tag: "Natural stone tray" },
    { name: "Linen Throw", price: 3200, tag: "Washed linen · Queen" },
  ],
  furniture: [
    { name: "Form Lounge Sofa", price: 86500, tag: "Solid frame · assembly" },
    { name: "Axis Dining Table", price: 62500, tag: "Solid oak · 6-8 seats" },
    { name: "Line Storage Cabinet", price: 48900, tag: "Veneered walnut" },
    { name: "Arc Reading Chair", price: 34700, tag: "Ash frame · woven seat" },
  ],
  retail: [
    { name: "Everyday Travel Flask", price: 1450, tag: "Double-wall steel" },
    { name: "Compact Desk Speaker", price: 2950, tag: "Wireless desktop audio" },
    { name: "Soft Knit Throw", price: 2450, tag: "Comfort layer" },
    { name: "Daily Carry Backpack", price: 3650, tag: "18L · padded laptop" },
  ],
  fashion: [
    { name: "Silk Linen Shirt", price: 2450, tag: "S, M, L, XL" },
    { name: "Structured Blazer", price: 5800, tag: "38, 40, 42" },
    { name: "Pleated Trouser", price: 3200, tag: "30, 32, 34" },
    { name: "Wide-Brim Sun Hat", price: 1850, tag: "One Size" },
  ],
}

export default function ThemeStudio({path,go,notify}:{path:string;go:(p:string)=>void;notify:(m:string)=>void}){
  const customizer=path.startsWith("/seller/customizer")
  const [config,setConfig]=useState<StoreThemeConfig>(()=>getStoreThemeConfig("demo"))
  const [saved,setSaved]=useState(config)
  const [device,setDevice]=useState<"desktop"|"tablet"|"mobile">("desktop")
  const [reset,setReset]=useState(false)
  const theme=themeDefinitions.find(item=>item.id===config.themeId)||themeDefinitions[0]
  const apply=(id:string)=>{
    if (!isUserRegistered()) {
      try { localStorage.setItem("shopnest_pending_theme", id) } catch {}
      go("/signup")
      return
    }
    const next=themeDefaults(id,"demo");
    setConfig(next);
    saveStoreThemeConfig(next);
    setSaved(next);
    notify(`${themeDefinitions.find(t=>t.id===id)?.title} applied to Trendora Fashion`)
  }
  if(!customizer)return <div className="content theme-gallery-page"><div className="section-title"><div><h2>Theme gallery</h2><p>Choose a storefront foundation. Products, orders, and settings stay unchanged.</p></div><button className="secondary" onClick={()=>go("/seller/customizer")}>Open customizer</button></div><div className="theme-gallery-grid">{themeDefinitions.map(item=><ThemeCard key={item.id} item={item} active={config.themeId===item.id} preview={()=>go(`/store/${item.slug}/preview`)} apply={()=>apply(item.id)}/>)}</div></div>
  const update=<K extends keyof StoreThemeConfig>(key:K,value:StoreThemeConfig[K])=>setConfig(current=>({...current,[key]:value}))
  const handleLogoUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]
    if(!file)return
    const validTypes=["image/png","image/jpeg","image/jpg","image/svg+xml","image/webp","image/gif"]
    if(!validTypes.includes(file.type)&&!file.type.startsWith("image/")){
      notify("Please select a valid image file (PNG, JPG, SVG, WebP, GIF).")
      e.target.value=""
      return
    }
    const maxSize=2*1024*1024
    if(file.size>maxSize){
      notify("Image size must be under 2MB.")
      e.target.value=""
      return
    }
    const reader=new FileReader()
    reader.onload=(loadEvt)=>{
      const result=loadEvt.target?.result as string
      if(result){
        update("logoImage",result)
        notify("Logo uploaded successfully.")
      }
    }
    reader.onerror=()=>{
      notify("Failed to read image file.")
    }
    reader.readAsDataURL(file)
  }
  const logoNode=config.logoImage?<img src={config.logoImage} alt={config.logo||theme.name}/>:<strong>{config.logo||theme.name}</strong>
  const announcementText=config.announcementText!==undefined&&config.announcementText!==""?config.announcementText:"The summer edit · Complimentary delivery over ৳3,000"
  const productList=previewThemedProducts[theme.id]||previewThemedProducts.fashion

  return <div className="customizer">
    <header className="customizer-top">
      <div>
        <button onClick={()=>go("/seller/themes")}>← Themes</button>
        <strong>{theme.title}</strong>
        <span>{JSON.stringify(config)===JSON.stringify(saved)?"Saved":"Unsaved changes"}</span>
      </div>
      <div className="device-tabs">
        {(["desktop","tablet","mobile"] as const).map(d=><button className={device===d?"active":""} onClick={()=>setDevice(d)} key={d}>{d}</button>)}
      </div>
      <div>
        <button className="secondary" onClick={()=>setReset(true)}>Reset</button>
        <button className="secondary" onClick={()=>{saveStoreThemeConfig({...config,status:"Draft"});setSaved({...config,status:"Draft"});notify("Theme draft saved locally")}}>Save draft</button>
        <button className="primary" onClick={()=>{const next={...config,status:"Published" as const};saveStoreThemeConfig(next);setSaved(next);notify("Theme published to the demo storefront")}}>Publish</button>
      </div>
    </header>
    <div className="customizer-body">
      <aside className="customizer-controls">
        <Control title="Theme">
          <select value={config.themeId} onChange={e=>setConfig(themeDefaults(e.target.value,"demo"))}>
            {themeDefinitions.map(t=><option value={t.id} key={t.id}>{t.title}</option>)}
          </select>
        </Control>

        {/* Theme-Specific Controls (renders only for the active theme) */}
        {theme.id==="fashion"&&(
          <Control title="Fashion Settings">
            <label>Lookbook title<input value={config.fashionLookbookTitle??""} onChange={e=>update("fashionLookbookTitle",e.target.value)} placeholder="e.g. Autumn / Winter Lookbook"/></label>
            <label>Collection style
              <select value={config.fashionCollectionStyle??"Editorial"} onChange={e=>update("fashionCollectionStyle",e.target.value)}>
                <option value="Editorial">Editorial</option>
                <option value="Minimal">Minimal</option>
                <option value="Lookbook">Lookbook</option>
              </select>
            </label>
          </Control>
        )}

        {theme.id==="shoes"&&(
          <Control title="Shoes & Sneakers Settings">
            <label>Sneaker drop tag<input value={config.shoesDropTag??""} onChange={e=>update("shoesDropTag",e.target.value)} placeholder="e.g. NEW PERFORMANCE DROP"/></label>
            <label>Limited badge text<input value={config.shoesBadgeText??""} onChange={e=>update("shoesBadgeText",e.target.value)} placeholder="e.g. RUN / LIVE"/></label>
            <Toggle label="Highlight size selector" value={config.shoesHighlightSizes??true} change={v=>update("shoesHighlightSizes",v)}/>
          </Control>
        )}

        {theme.id==="electronics"&&(
          <Control title="Electronics & Tech Settings">
            <label>Tech deals title<input value={config.techDealTitle??""} onChange={e=>update("techDealTitle",e.target.value)} placeholder="e.g. Featured Technology Deals"/></label>
            <label>Warranty badge text<input value={config.techWarrantyText??""} onChange={e=>update("techWarrantyText",e.target.value)} placeholder="e.g. Support & 2-year warranty"/></label>
            <Toggle label="Show product specifications" value={config.techShowSpecs??true} change={v=>update("techShowSpecs",v)}/>
          </Control>
        )}

        {theme.id==="beauty"&&(
          <Control title="Beauty & Skincare Settings">
            <label>Ritual top note<input value={config.beautyRitualNote??""} onChange={e=>update("beautyRitualNote",e.target.value)} placeholder="e.g. A considered ritual for skin, hair, and self"/></label>
            <label>Campaign title<input value={config.beautyCampaignTitle??""} onChange={e=>update("beautyCampaignTitle",e.target.value)} placeholder="e.g. Pure Botanical Rituals"/></label>
            <Toggle label="Show routine steps" value={config.beautyShowRoutine??true} change={v=>update("beautyShowRoutine",v)}/>
          </Control>
        )}

        {theme.id==="grocery"&&(
          <Control title="Grocery & Essentials Settings">
            <label>Delivery area<input value={config.groceryDeliveryArea??""} onChange={e=>update("groceryDeliveryArea",e.target.value)} placeholder="e.g. Dhaka City"/></label>
            <label>Promotional offer badge<input value={config.groceryOfferTag??""} onChange={e=>update("groceryOfferTag",e.target.value)} placeholder="e.g. Today’s offers"/></label>
            <Toggle label="Show quick pack sizes" value={config.groceryShowQuantity??true} change={v=>update("groceryShowQuantity",v)}/>
          </Control>
        )}

        {theme.id==="decor"&&(
          <Control title="Home Decor Settings">
            <label>Room inspiration focus
              <select value={config.decorRoomFocus??"Living Room"} onChange={e=>update("decorRoomFocus",e.target.value)}>
                <option value="Living Room">Living Room</option>
                <option value="Sanctuary">Sanctuary</option>
                <option value="Kitchen & dining">Kitchen & dining</option>
                <option value="Studio">Studio</option>
              </select>
            </label>
            <label>Inspiration quote<textarea value={config.decorQuote??""} onChange={e=>update("decorQuote",e.target.value)} placeholder="e.g. Thoughtful pieces for slower, warmer spaces."/></label>
            <Toggle label="Show textures guide" value={config.decorShowTextures??true} change={v=>update("decorShowTextures",v)}/>
          </Control>
        )}

        {theme.id==="furniture"&&(
          <Control title="Furniture Studio Settings">
            <label>Collection subtitle<input value={config.furnitureSubtitle??""} onChange={e=>update("furnitureSubtitle",e.target.value)} placeholder="e.g. CONTEMPORARY FURNITURE / DHAKA"/></label>
            <label>Material & craft note<textarea value={config.furnitureMaterialNote??""} onChange={e=>update("furnitureMaterialNote",e.target.value)} placeholder="e.g. Solid frame · performance weave · assembly included"/></label>
            <label>Room layout style
              <select value={config.furnitureLayout??"Spacious"} onChange={e=>update("furnitureLayout",e.target.value)}>
                <option value="Spacious">Spacious</option>
                <option value="Architectural">Architectural</option>
                <option value="Cozy">Cozy</option>
              </select>
            </label>
          </Control>
        )}

        {theme.id==="retail"&&(
          <Control title="General Retail Settings">
            <label>Deal highlight badge<input value={config.retailDealHighlight??""} onChange={e=>update("retailDealHighlight",e.target.value)} placeholder="e.g. Daily Deals & Multi-Buys"/></label>
            <label>Return guarantee text<input value={config.retailReturnBadge??""} onChange={e=>update("retailReturnBadge",e.target.value)} placeholder="e.g. Easy 7-day returns"/></label>
            <label>Category button label<input value={config.retailCategoryTag??""} onChange={e=>update("retailCategoryTag",e.target.value)} placeholder="e.g. All categories"/></label>
          </Control>
        )}

        <Control title="Branding">
          <label>Logo text<input value={config.logo} onChange={e=>update("logo",e.target.value)}/></label>
          <label>Logo upload<input type="file" accept="image/*" aria-describedby="logo-help" onChange={handleLogoUpload}/></label>
          {config.logoImage&&<div style={{display:"flex",alignItems:"center",gap:"10px",marginTop:"8px"}}><img src={config.logoImage} alt="Uploaded logo preview" style={{maxHeight:"32px",maxWidth:"120px",objectFit:"contain",border:"1px solid #dfe2e7",borderRadius:"4px",padding:"2px",background:"#fff"}}/><button type="button" className="secondary" style={{fontSize:"9px",padding:"4px 8px"}} onClick={()=>{update("logoImage","");notify("Logo image removed.")}}>Remove logo</button></div>}
          <small id="logo-help">PNG, JPG, SVG, WebP up to 2MB. Saved locally.</small>
        </Control>
        <Control title="Colors">
          <label>Primary<input type="color" value={config.primary} onChange={e=>update("primary",e.target.value)}/></label>
          <label>Secondary<input type="color" value={config.secondary} onChange={e=>update("secondary",e.target.value)}/></label>
          <label>Background<input type="color" value={config.background} onChange={e=>update("background",e.target.value)}/></label>
          <label>Text<input type="color" value={config.text} onChange={e=>update("text",e.target.value)}/></label>
        </Control>
        <Control title="Typography">
          <select value={config.font} onChange={e=>update("font",e.target.value)}>
            <option>Modern</option>
            <option>Editorial</option>
            <option>Friendly</option>
          </select>
        </Control>
        <Control title="Hero">
          <label>Heading<textarea value={config.heroTitle} onChange={e=>update("heroTitle",e.target.value)}/></label>
          <label>Description<textarea value={config.heroText} onChange={e=>update("heroText",e.target.value)}/></label>
        </Control>
        <Control title="Homepage sections">
          <Toggle label="Categories" value={config.showCategories} change={v=>update("showCategories",v)}/>
          <Toggle label="Promotional story" value={config.showPromo} change={v=>update("showPromo",v)}/>
          <Toggle label="Testimonials" value={config.showTestimonials} change={v=>update("showTestimonials",v)}/>
        </Control>
        <Control title="Product grid">
          <select value={config.grid} onChange={e=>update("grid",Number(e.target.value))}>
            <option value="2">2 columns</option>
            <option value="3">3 columns</option>
            <option value="4">4 columns</option>
          </select>
        </Control>
        <Control title="Header and footer">
          <label>Announcement text<input value={config.announcementText??""} onChange={e=>update("announcementText",e.target.value)} placeholder="e.g. Complimentary delivery over ৳3,000"/></label>
          <label>Header<select value={config.header} onChange={e=>update("header",e.target.value)}><option>Centered</option><option>Compact</option><option>Split</option></select></label>
          <label>Footer<select value={config.footer} onChange={e=>update("footer",e.target.value)}><option>Expanded</option><option>Minimal</option></select></label>
        </Control>
      </aside>

      <main className="preview-stage">
        <div
          className={`live-preview ${device} preview-theme-${theme.id} theme-${theme.id} font-${config.font.toLowerCase()}`}
          style={{"--preview-primary":config.primary,"--preview-secondary":config.secondary,"--preview-bg":config.background,"--preview-text":config.text,"--store-accent":config.primary,"--store-soft":config.secondary,"--store-bg":config.background,"--store-text":config.text,"--store-grid":config.grid} as React.CSSProperties}
        >
          {/* Top announcement bar / strip */}
          {theme.id==="shoes"?(
            <div className="sport-strip">{config.shoesDropTag||"FREE RETURNS · MEMBER EXCLUSIVES · NEW PERFORMANCE DROP"}</div>
          ):theme.id==="beauty"?(
            <div className="beauty-note">{config.beautyRitualNote||"A considered ritual for skin, hair, and self"}</div>
          ):(
            announcementText&&<div className="mini-announcement">{announcementText}</div>
          )}

          {/* Theme-Specific Mini Header */}
          {theme.id==="shoes"?(
            <div className={`mini-header mini-header-${config.header.toLowerCase()}`}>
              <div className="mini-logo-wrap">{logoNode}<i>{config.shoesBadgeText||"RUN / LIVE"}</i></div>
              <span>Running　Lifestyle　Training</span>
              <b>Bag (0)</b>
            </div>
          ):theme.id==="electronics"?(
            <div>
              <div className={`mini-header mini-header-${config.header.toLowerCase()}`}>
                <div className="mini-logo-wrap">{logoNode}</div>
                <span>Smartphones　Laptops　Audio</span>
                <b>Bag (0)</b>
              </div>
              <div style={{background:"var(--preview-primary)",color:"#fff",padding:"4px 25px",fontSize:"8px",display:"flex",justifyContent:"space-between",opacity:0.9}}>
                <span>Compare · Account · Support</span>
                <b>{config.techWarrantyText||"Support & warranty"}</b>
              </div>
            </div>
          ):theme.id==="beauty"?(
            <div>
              <div className={`mini-header mini-header-${config.header.toLowerCase()}`}>
                <span>Journal</span>
                <div className="mini-logo-wrap">{logoNode}<small style={{display:"block",fontSize:"6px",letterSpacing:".2em"}}>BEAUTY RITUALS</small></div>
                <b>Bag (0)</b>
              </div>
              <div style={{textAlign:"center",padding:"5px",fontSize:"8px",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
                Skincare　Makeup　Fragrance　Body Care
              </div>
            </div>
          ):theme.id==="grocery"?(
            <div>
              <div className={`mini-header mini-header-${config.header.toLowerCase()}`} style={{alignItems:"center"}}>
                <div className="delivery-pill" style={{padding:"3px 8px"}}>
                  <small style={{fontSize:"6px"}}>Delivering to</small>
                  <strong style={{fontSize:"8px"}}>{config.groceryDeliveryArea||"Dhaka City"}</strong>
                </div>
                <div className="mini-logo-wrap">{logoNode}</div>
                <span style={{background:"#fff0c8",color:"#8b5b00",padding:"2px 6px",borderRadius:"4px",fontSize:"8px",fontWeight:700}}>
                  {config.groceryOfferTag||"Today’s offers"}
                </span>
                <b>Bag (0)</b>
              </div>
              <div style={{textAlign:"center",padding:"5px",fontSize:"8px",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
                Fresh Produce　Pantry　Dairy　Bakery
              </div>
            </div>
          ):theme.id==="decor"?(
            <div>
              <div className={`mini-header mini-header-${config.header.toLowerCase()}`}>
                <div className="mini-logo-wrap">{logoNode}<small style={{display:"block",fontSize:"6px",letterSpacing:".15em"}}>OBJECTS FOR HOME</small></div>
                <span>Living Room　Lighting　Textiles</span>
                <b>Bag (0)</b>
              </div>
              <div className="decor-quote">{config.decorQuote||"Thoughtful pieces for slower, warmer spaces."}</div>
            </div>
          ):theme.id==="furniture"?(
            <div className={`mini-header mini-header-${config.header.toLowerCase()}`}>
              <div className="mini-logo-wrap">{logoNode}</div>
              <span style={{fontSize:"7px",letterSpacing:".15em"}}>{config.furnitureSubtitle||"CONTEMPORARY FURNITURE / DHAKA"}</span>
              <b>Bag (0)</b>
            </div>
          ):theme.id==="retail"?(
            <div>
              <div className={`mini-header mini-header-${config.header.toLowerCase()}`}>
                <div className="mini-logo-wrap">{logoNode}</div>
                <span style={{fontSize:"8px",background:"var(--preview-primary)",color:"#fff",padding:"2px 8px",borderRadius:"4px"}}>
                  {config.retailCategoryTag||"All categories"}
                </span>
                <b>Bag (0)</b>
              </div>
              <div style={{padding:"3px 25px",fontSize:"8px",display:"flex",justifyContent:"space-between",background:"rgba(0,0,0,0.03)"}}>
                <span>Trending　Electronics　Lifestyle</span>
                <small style={{color:"var(--preview-primary)",fontWeight:700}}>{config.retailReturnBadge||"Easy returns"}</small>
              </div>
            </div>
          ):(
            /* Fashion default */
            config.header==="Compact"?(
              <div className="mini-header mini-header-compact">
                <div className="mini-logo-wrap">{logoNode}</div>
                <span>New Arrivals　Women　Men　Sale</span>
                <b>Bag (0)</b>
              </div>
            ):config.header==="Split"?(
              <div className="mini-header mini-header-split">
                <span>Women　Men</span>
                <div className="mini-logo-wrap">{logoNode}</div>
                <b>Bag (0)</b>
              </div>
            ):(
              <div className="mini-header mini-header-centered">
                <div className="mini-header-top">
                  <div className="mini-logo-wrap">{logoNode}</div>
                  <b>Bag (0)</b>
                </div>
                <span>New Arrivals　Women　Men　Sale</span>
              </div>
            )
          )}

          {/* Mini Hero */}
          <div className="mini-hero">
            <span>
              {theme.id==="fashion"
                ?(config.fashionCollectionStyle?`${config.fashionCollectionStyle.toUpperCase()} EDIT`:theme.label)
                :theme.id==="shoes"
                ?(config.shoesDropTag||theme.label)
                :theme.id==="beauty"
                ?(config.beautyCampaignTitle?config.beautyCampaignTitle.toUpperCase():theme.label)
                :theme.id==="grocery"
                ?`FRESH TO ${config.groceryDeliveryArea?.toUpperCase()||"DHAKA"}`
                :theme.id==="decor"
                ?`${config.decorRoomFocus?.toUpperCase()||"LIVING ROOM"} FOCUS`
                :theme.id==="retail"
                ?(config.retailDealHighlight?.toUpperCase()||theme.label)
                :theme.label}
            </span>
            <h1>{config.heroTitle}</h1>
            <p>{config.heroText}</p>
            <button>Explore collection</button>
          </div>

          {/* Mini Categories */}
          {config.showCategories&&<div className="mini-categories">
            {theme.categories.slice(0,3).map(c=><div key={c}><i/><strong>{c}</strong></div>)}
          </div>}

          {/* Mini Products Grid with theme-specific attributes */}
          <div className={`mini-products cols-${config.grid}`}>
            {productList.slice(0,config.grid).map((item,i)=><div key={i}>
              <i/>
              <b>{item.name}</b>
              <span>৳{item.price.toLocaleString()}</span>
              <small style={{fontSize:"7px",opacity:0.75,display:"block",marginTop:"3px"}}>
                {theme.id==="shoes"&&config.shoesHighlightSizes
                  ?"Sizes: 39-43"
                  :theme.id==="electronics"&&config.techShowSpecs
                  ?item.tag
                  :theme.id==="beauty"&&config.beautyShowRoutine
                  ?"Ritual step"
                  :theme.id==="grocery"&&config.groceryShowQuantity
                  ?item.tag
                  :item.tag}
              </small>
            </div>)}
          </div>

          {/* Mini Promo Story */}
          {config.showPromo&&<div className="mini-promo">
            <div/>
            <h2>
              {theme.id==="fashion"
                ?(config.fashionLookbookTitle||"A story worth sharing.")
                :theme.id==="shoes"
                ?(config.shoesDropTag||"High-mileage performance.")
                :theme.id==="electronics"
                ?(config.techDealTitle||"Engineered for speed & clarity.")
                :theme.id==="beauty"
                ?(config.beautyCampaignTitle||"Pure botanical rituals.")
                :theme.id==="grocery"
                ?`Delivered fresh across ${config.groceryDeliveryArea||"Dhaka"}.`
                :theme.id==="decor"
                ?(config.decorQuote||"Thoughtful objects for calm spaces.")
                :theme.id==="furniture"
                ?(config.furnitureMaterialNote||"Solid oak & performance weave.")
                :(config.retailDealHighlight||"Curated daily essentials.")}
            </h2>
          </div>}

          {/* Mini Testimonials */}
          {config.showTestimonials&&<blockquote>
            {theme.id==="furniture"
              ?"“The material details made choosing the right piece simple.”"
              :theme.id==="beauty"
              ?"“A calm, considered way to discover my daily skincare routine.”"
              :theme.id==="shoes"
              ?"“Unrivaled comfort from the first run. The size guide was spot-on.”"
              :"“A beautifully simple shopping experience.”"}
          </blockquote>}

          {/* Mini Footer */}
          {config.footer==="Minimal"?(
            <footer className="minimal">{config.logoImage?<img src={config.logoImage} alt={config.logo} style={{maxHeight:"18px",maxWidth:"80px",objectFit:"contain",verticalAlign:"middle"}}/>:config.logo} · Shipping · Returns · Contact</footer>
          ):(
            <footer className="expanded">
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:"20px",marginBottom:"15px",textAlign:"left"}}>
                <div>
                  <strong>{config.logoImage?<img src={config.logoImage} alt={config.logo} style={{maxHeight:"20px",maxWidth:"90px",objectFit:"contain",verticalAlign:"middle"}}/>:config.logo}</strong>
                  <p style={{opacity:0.7,margin:"6px 0 0",fontSize:"8px"}}>{theme.accent}</p>
                </div>
                <div>
                  <b style={{display:"block",fontSize:"8px",textTransform:"uppercase",marginBottom:"4px"}}>Shop</b>
                  <div style={{opacity:0.7,display:"flex",flexDirection:"column",gap:"3px"}}><span>All products</span><span>Collections</span></div>
                </div>
                <div>
                  <b style={{display:"block",fontSize:"8px",textTransform:"uppercase",marginBottom:"4px"}}>Info</b>
                  <div style={{opacity:0.7,display:"flex",flexDirection:"column",gap:"3px"}}><span>Shipping</span><span>Contact</span></div>
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:"10px",opacity:0.6,fontSize:"8px"}}>© 2025 {config.logo}. Fictional demonstration store.</div>
            </footer>
          )}
        </div>
      </main>
    </div>

    {reset&&<div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card confirm-card">
        <div className="danger-icon">!</div>
        <h2>Reset theme settings?</h2>
        <p>Your unpublished customizations will be replaced by this theme’s defaults.</p>
        <div className="modal-actions">
          <button className="secondary" onClick={()=>setReset(false)}>Cancel</button>
          <button className="danger-button" onClick={()=>{setConfig(themeDefaults(config.themeId,"demo"));setReset(false)}}>Reset settings</button>
        </div>
      </div>
    </div>}
  </div>
}

function ThemeCard({item,active,preview,apply}:{item:typeof themeDefinitions[0];active:boolean;preview:()=>void;apply:()=>void}){return <article className={`theme-gallery-card ${active?"active":""}`}><div className={`theme-card-visual visual-${item.id}`}><div className="tc-head"><b>{item.name}</b><span>Shop　Story　Bag</span></div><div className="tc-hero"><small>{item.label}</small><strong>{item.hero}</strong><i/></div><div className="tc-products"><i/><i/><i/></div></div><div className="theme-card-info"><div><span>{item.label}</span>{active&&<em>ACTIVE</em>}</div><h3>{item.title}</h3><p>{item.description}</p><div><button className="secondary" onClick={preview}>Preview</button><button className="primary" disabled={active} onClick={apply}>{active?"Current theme":"Use theme"}</button></div></div></article>}
function Control({title,children}:{title:string;children:React.ReactNode}){return <section><h3>{title}</h3>{children}</section>}
function Toggle({label,value,change}:{label:string;value:boolean;change:(v:boolean)=>void}){return <label className="studio-toggle"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>change(e.target.checked)}/><i/></label>}
