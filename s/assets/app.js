const products=[
{id:1,name:"AeroStrike Pro Boots",cat:"Football",price:129.99,emoji:"⚽",tag:"BESTSELLER",desc:"Lightweight match boots with a responsive synthetic upper and aggressive traction."},
{id:2,name:"Match Pro Ball",cat:"Football",price:34.99,emoji:"⚽",tag:"NEW",desc:"FIFA-inspired match ball with a textured finish for reliable control."},
{id:3,name:"Velocity Carbon 98",cat:"Tennis",price:189.99,emoji:"🎾",tag:"PRO PICK",desc:"Carbon frame racket designed for fast swings and confident power."},
{id:4,name:"CourtFlex Trainers",cat:"Tennis",price:84.99,emoji:"🎾",tag:"",desc:"Stable court shoes with responsive cushioning for long sessions."},
{id:5,name:"Elite English Willow",cat:"Cricket",price:249.99,emoji:"🏏",tag:"PREMIUM",desc:"Hand-finished cricket bat built for powerful drives and balanced pickup."},
{id:6,name:"Pro Shield Gloves",cat:"Cricket",price:59.99,emoji:"🧤",tag:"",desc:"Match-ready batting gloves with flexible protection and a premium grip."},
{id:7,name:"Flyer 3 Basketball",cat:"Basketball",price:29.99,emoji:"🏀",tag:"NEW",desc:"Durable composite basketball with deep channels for consistent handling."},
{id:8,name:"React Court Shoes",cat:"Basketball",price:109.99,emoji:"🏀",tag:"BESTSELLER",desc:"High-traction basketball shoes engineered for quick changes of direction."},
{id:9,name:"Carbon X Racket",cat:"Badminton",price:119.99,emoji:"🏸",tag:"PRO PICK",desc:"Ultra-light carbon racket for speed, control and explosive smashes."},
{id:10,name:"Tournament Shuttles",cat:"Badminton",price:24.99,emoji:"🏸",tag:"",desc:"Consistent-flight feather shuttlecocks for serious club sessions."}
];
function money(n){return "£"+n.toFixed(2)}
function renderProducts(target, list){
 const el=document.getElementById(target); if(!el)return;
 el.innerHTML=list.map(p=>`<article class="product-card"><a href="product.html?id=${p.id}"><div class="product-image">${p.emoji}</div></a>${p.tag?`<span class="badge">${p.tag}</span>`:""}<div class="product-info"><small>${p.cat}</small><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div><button onclick="addToCart(${p.id});event.preventDefault()">+</button></article>`).join("");
}
function getCart(){return JSON.parse(localStorage.getItem("sporthub-cart")||"[]")}
function saveCart(c){localStorage.setItem("sporthub-cart",JSON.stringify(c));updateCount()}
function updateCount(){document.querySelectorAll(".cart-count").forEach(e=>e.textContent=getCart().reduce((s,i)=>s+i.qty,0))}
function addToCart(id){let c=getCart(),i=c.find(x=>x.id===id);i?i.qty++:c.push({id,qty:1});saveCart(c);alert("Added to your bag.")}
function initShop(){
 let active="All", list=products;
 const draw=()=>renderProducts("shop-products",list.filter(p=>(active==="All"||p.cat===active)&&p.name.toLowerCase().includes((document.getElementById("search").value||"").toLowerCase())));
 document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");active=b.dataset.cat;draw()});
 document.getElementById("search").oninput=draw; draw();
}
function initCategory(){const cat=new URLSearchParams(location.search).get("cat")||"Football";document.getElementById("cat-title").textContent=cat+".";document.getElementById("cat-description").textContent=`Premium ${cat.toLowerCase()} equipment for training, competition and everything between.`;renderProducts("category-products",products.filter(p=>p.cat===cat))}
function initProduct(){const p=products.find(x=>x.id==new URLSearchParams(location.search).get("id"))||products[0];document.getElementById("product-detail").innerHTML=`<div class="detail-grid"><div class="detail-image">${p.emoji}</div><div class="detail-copy"><p class="eyebrow">${p.cat.toUpperCase()}</p><h1>${p.name}</h1><div class="big-price">${money(p.price)}</div><p>${p.desc}</p><select class="select"><option>Select size / variant</option><option>Small</option><option>Medium</option><option>Large</option><option>XL</option></select><button class="add-btn" onclick="addToCart(${p.id})">ADD TO BAG — ${money(p.price)}</button></div></div>`}
function renderCart(){const el=document.getElementById("cart-content"),c=getCart();if(!c.length){el.innerHTML='<div class="empty"><h2>Your bag is empty.</h2><p>Find something for your next session.</p><a class="btn btn-dark" href="shop.html">Shop gear</a></div>';return}let subtotal=0;const rows=c.map(i=>{let p=products.find(x=>x.id===i.id);subtotal+=p.price*i.qty;return `<div class="cart-row"><div class="cart-thumb">${p.emoji}</div><div><b>${p.name}</b><p>${p.cat} · ${money(p.price)}</p><button onclick="changeQty(${p.id},-1)">−</button> ${i.qty} <button onclick="changeQty(${p.id},1)">+</button></div><strong>${money(p.price*i.qty)}</strong></div>`}).join("");el.innerHTML=`<div class="cart-layout"><div>${rows}</div><aside class="cart-summary"><h2>Summary</h2><div class="summary-line"><span>Subtotal</span><b>${money(subtotal)}</b></div><div class="summary-line"><span>Delivery</span><span>${subtotal>=75?"Free":"£5.99"}</span></div><hr><div class="summary-line"><strong>Total</strong><strong>${money(subtotal+(subtotal>=75?0:5.99))}</strong></div><button class="add-btn" onclick="alert('Demo checkout — connect your payment provider here.')">CHECKOUT</button></aside></div>`}
function changeQty(id,d){let c=getCart(),i=c.find(x=>x.id===id);i.qty+=d;if(i.qty<=0)c=c.filter(x=>x.id!==id);saveCart(c);renderCart()}
updateCount();
