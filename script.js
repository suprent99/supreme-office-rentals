const products = [
  {id:1,name:"Mara Lounge Chair",category:"living",type:"Accent chair",price:109,tag:"Popular",image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Linden 3-Seater",category:"living",type:"Fabric sofa",price:239,tag:"New",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Arco Work Desk",category:"office",type:"Oak work desk",price:129,tag:"",image:"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Sora Task Chair",category:"office",type:"Ergonomic chair",price:89,tag:"Best value",image:"https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Milo Dining Set",category:"dining",type:"Table + 4 chairs",price:189,tag:"Set",image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Noma Coffee Table",category:"living",type:"Solid wood table",price:79,tag:"",image:"https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Kanso Queen Bed",category:"bedroom",type:"Bed frame",price:169,tag:"New",image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Elio Storage Unit",category:"office",type:"Modular storage",price:99,tag:"",image:"https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=80"}
];

const discounts={1:1,3:.94,6:.88,12:.78};
let activeFilter="all";
let term=6;
let cart=[];
const grid=document.querySelector("#productGrid");
const termSelect=document.querySelector("#termSelect");

function monthlyPrice(product){return Math.round(product.price*discounts[term]);}
function money(value){return `RM${value.toLocaleString("en-MY")}`;}

function renderProducts(){
  const visible=products.filter(p=>activeFilter==="all"||p.category===activeFilter);
  grid.innerHTML=visible.map(p=>`<article class="product-card">
    <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="add-button" type="button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
    <div class="product-info"><div><h3>${p.name}</h3><p>${p.type}</p></div><div class="product-price"><strong>${money(monthlyPrice(p))}</strong><span> / mo</span></div></div>
  </article>`).join("");
}

function renderCart(){
  const items=document.querySelector(".cart-items");
  const empty=document.querySelector(".cart-empty");
  items.innerHTML=cart.map(id=>{const p=products.find(x=>x.id===id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(monthlyPrice(p))} / month · ${term} month plan</p></div><button class="remove-item" type="button" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`}).join("");
  empty.hidden=cart.length>0;
  document.querySelector(".cart-footer").hidden=cart.length===0;
  document.querySelector(".cart-count").textContent=cart.length;
  document.querySelector(".cart-total").textContent=money(cart.reduce((sum,id)=>sum+monthlyPrice(products.find(p=>p.id===id)),0));
}

function toggleCart(open){
  document.querySelector(".cart-drawer").classList.toggle("open",open);
  document.querySelector(".cart-overlay").classList.toggle("open",open);
  document.querySelector(".cart-drawer").setAttribute("aria-hidden",String(!open));
  document.body.classList.toggle("no-scroll",open);
}

document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelector(".filter.active").classList.remove("active");button.classList.add("active");activeFilter=button.dataset.filter;renderProducts();
}));
termSelect.addEventListener("change",()=>{term=Number(termSelect.value);renderProducts();renderCart();});
grid.addEventListener("click",event=>{
  const button=event.target.closest("[data-add]");if(!button)return;
  const id=Number(button.dataset.add);if(!cart.includes(id))cart.push(id);
  renderCart();const toast=document.querySelector(".toast");toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);
});
document.querySelector(".cart-items").addEventListener("click",event=>{const button=event.target.closest("[data-remove]");if(!button)return;cart=cart.filter(id=>id!==Number(button.dataset.remove));renderCart();});
document.querySelector(".cart-button").addEventListener("click",()=>toggleCart(true));
document.querySelector(".close-cart").addEventListener("click",()=>toggleCart(false));
document.querySelector(".cart-overlay").addEventListener("click",()=>toggleCart(false));
document.querySelector(".menu-button").addEventListener("click",event=>{const nav=document.querySelector(".main-nav");nav.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
document.querySelectorAll(".main-nav a").forEach(link=>link.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
document.querySelector(".checkout-button").addEventListener("click",()=>{
  const list=cart.map(id=>{const p=products.find(x=>x.id===id);return `- ${p.name} (${money(monthlyPrice(p))}/month)`}).join("\n");
  const total=cart.reduce((sum,id)=>sum+monthlyPrice(products.find(p=>p.id===id)),0);
  const message=`Hi Supreme Office Rentals, I'd like to check availability for a ${term}-month rental:\n\n${list}\n\nMonthly total: ${money(total)}`;
  window.open(`https://wa.me/601154209676?text=${encodeURIComponent(message)}`,"_blank","noopener");
});

renderProducts();renderCart();
